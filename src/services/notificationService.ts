import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  getDocs,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { 
  NotificationMessage, 
  NOTIFICATION_DATA, 
  getNotificationByDayAndTime,
  getNotificationsForDay,
  replacePlaceholders,
  getBuddyNameForNotification,
  replaceGenderSpecificText 
} from '../data/notificationData';
import oneSignalService from './oneSignalService';
import oneSignalScheduler from './oneSignalScheduler';
import { OneSignal } from 'react-native-onesignal';

export interface UserNotificationSettings {
  userId: string;
  language: 'ua' | 'en' | 'es';
  buddyName: string;
  selectedBuddyId: string; // Added to support getting actual buddy name
  gender: 'man' | 'lady' | 'any';
  startDate: Date;
  isEnabled: boolean;
  morningTime: string; // Format: "08:00"
  eveningTime: string; // Format: "20:00"
  timezone: string;
  lastNotificationSent?: Date;
  lastNotificationDay?: number;
}

export interface ScheduledNotification {
  id: string;
  userId: string;
  notificationId: string;
  day: number;
  timeOfDay: 'morning' | 'evening' | 'day';
  scheduledTime: Date;
  message: string;
  category: 'start' | 'support' | 'celebration' | 'final';
  isSent: boolean;
  sentAt?: Date;
  createdAt: Date;
}

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('NotificationService: Initializing...');

      // Initialize OneSignal service
      await oneSignalService.initialize();

      // Initialize OneSignal scheduler for background processing
      await oneSignalScheduler.initialize();

      // Start background notification processing
      this.startBackgroundProcessing();

      this.isInitialized = true;
      console.log('NotificationService: Initialized successfully with OneSignal and scheduler');
    } catch (error) {
      console.error('NotificationService: Error initializing:', error);
      throw error;
    }
  }

  /**
   * Start background notification processing
   */
  private startBackgroundProcessing(): void {
    console.log('NotificationService: Starting background notification processing');

    // Process any notifications that might have been missed when app was closed
    this.processDueNotifications().catch(error => {
      console.error('NotificationService: Error in initial background processing:', error);
    });

    // Set up periodic processing as backup (in case OneSignal scheduler fails)
    setInterval(() => {
      this.processDueNotifications().catch(error => {
        console.error('NotificationService: Error in periodic background processing:', error);
      });
    }, 5 * 60 * 1000); // Every 5 minutes as backup

    console.log('NotificationService: Background processing started');
  }

  /**
   * Force process all pending notifications (useful for testing and recovery)
   */
  // public async forceProcessPendingNotifications(): Promise<{
  //   processed: number;
  //   errors: number;
  // }> {
  //   try {
  //     console.log('NotificationService: Force processing all pending notifications');

  //     const currentTime = new Date();
  //     // Remove orderBy to avoid composite index requirement
  //     const q = query(
  //       collection(db, 'scheduledNotifications'),
  //       where('isSent', '==', false),
  //       limit(100) // Process up to 100 at a time
  //     );

  //     const querySnapshot = await getDocs(q);
  //     console.log(`NotificationService: Found ${querySnapshot.docs.length} pending notifications to force process`);

  //     let processed = 0;
  //     let errors = 0;

  //     for (const docSnap of querySnapshot.docs) {
  //       try {
  //         const data = docSnap.data();
  //         // Convert Firestore Timestamp to Date
  //         const scheduledTime = data.scheduledTime.toDate();

  //         // Only process notifications that are past due or very close to due time
  //         const timeDiff = currentTime.getTime() - scheduledTime.getTime();
  //         const isPastDue = timeDiff > 0;
  //         const isVeryClose = timeDiff > -5 * 60 * 1000; // Within 5 minutes

  //         if (isPastDue || isVeryClose) {
  //           console.log(`NotificationService: Force processing notification: ${data.id}`);
            
  //           // Create notification object with converted date
  //           const notification: ScheduledNotification = {
  //             id: data.id,
  //             userId: data.userId,
  //             notificationId: data.notificationId,
  //             day: data.day,
  //             timeOfDay: data.timeOfDay,
  //             scheduledTime: scheduledTime,
  //             message: data.message,
  //             category: data.category,
  //             isSent: data.isSent,
  //             sentAt: data.sentAt?.toDate(),
  //             createdAt: data.createdAt.toDate()
  //           };
            
  //           await this.sendNotification(notification);

  //           // Mark as sent
  //           await updateDoc(docSnap.ref, {
  //             isSent: true,
  //             sentAt: Timestamp.now()
  //           });

  //           processed++;
  //         }
  //       } catch (error) {
  //         console.error('NotificationService: Error force processing notification:', error);
  //         errors++;
  //       }
  //     }

  //     console.log(`NotificationService: Force processing completed. Processed: ${processed}, Errors: ${errors}`);
  //     return { processed, errors };
  //   } catch (error) {
  //     console.error('NotificationService: Error in force processing:', error);
  //     return { processed: 0, errors: 1 };
  //   }
  // }

  /**
   * Send installation notification immediately after app installation
   */
  public async sendInstallationNotification(userSettings: UserNotificationSettings): Promise<void> {
    try {
      if (!oneSignalService.isOneSignalAvailable()) {
        console.log('NotificationService: OneSignal not available for installation notification');
        return;
      }

      // Find the installation notification (day: -1)
      const installationNotification = NOTIFICATION_DATA.find(n => n.id === 'app_installed');
      if (!installationNotification) {
        console.log('NotificationService: Installation notification not found');
        return;
      }

      // Prepare the message with user-specific data
      const message = this.prepareMessage(installationNotification, userSettings);

      console.log('NotificationService: Sending installation notification');

      // Send the notification immediately
      await oneSignalService.sendNotification(message, {
        day: '-1',
        category: installationNotification.category,
        timeOfDay: installationNotification.timeOfDay,
        notificationId: installationNotification.id,
        userId: userSettings.userId,
        isInstallation: 'true'
      });

      console.log('NotificationService: Installation notification sent successfully');
    } catch (error) {
      console.error('NotificationService: Error sending installation notification:', error);
      // Don't throw error for installation notification - it's not critical
    }
  }

  /**
   * Save user notification settings to Firebase
   */
  public async saveUserSettings(settings: UserNotificationSettings): Promise<void> {
    try {
      const userRef = doc(db, 'userNotificationSettings', settings.userId);
      await setDoc(userRef, {
        ...settings,
        startDate: Timestamp.fromDate(settings.startDate),
        lastNotificationSent: settings.lastNotificationSent ? Timestamp.fromDate(settings.lastNotificationSent) : null,
        updatedAt: Timestamp.now()
      });
      console.log('NotificationService: User settings saved for', settings.userId);
    } catch (error) {
      console.error('NotificationService: Error saving user settings:', error);
      throw error;
    }
  }

  /**
   * Safely get user notification settings from Firebase with error handling
   */
  public async safeGetUserSettings(userId: string): Promise<{
    settings: UserNotificationSettings | null;
    success: boolean;
    error?: string;
  }> {
    try {
      console.log(`NotificationService: Safely loading user notification settings for ${userId}`);

      const userRef = doc(db, 'userNotificationSettings', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        console.log('NotificationService: Found existing user notification settings');

        try {
          const settings: UserNotificationSettings = {
            ...data,
            startDate: data.startDate.toDate(),
            lastNotificationSent: data.lastNotificationSent?.toDate(),
          } as UserNotificationSettings;

          return {
            settings,
            success: true
          };
        } catch (parseError) {
          console.error('NotificationService: Error parsing user settings data:', parseError);
          return {
            settings: null,
            success: false,
            error: 'Failed to parse notification settings data'
          };
        }
      } else {
        console.log('NotificationService: No user notification settings found');
        return {
          settings: null,
          success: true // This is not an error, just no data exists yet
        };
      }
    } catch (error) {
      console.error('NotificationService: Error safely getting user settings:', error);
      return {
        settings: null,
        success: false,
        error: `Failed to load user notification settings: ${(error as Error).message}`
      };
    }
  }

  /**
   * Get user notification settings from Firebase (legacy method)
   */
  public async getUserSettings(userId: string): Promise<UserNotificationSettings | null> {
    try {
      const userRef = doc(db, 'userNotificationSettings', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          ...data,
          startDate: data.startDate.toDate(),
          lastNotificationSent: data.lastNotificationSent?.toDate(),
        } as UserNotificationSettings;
      }
      
      return null;
    } catch (error) {
      console.error('NotificationService: Error getting user settings:', error);
      throw error;
    }
  }


  /**
   * Schedule all notifications for a user based on their start date and preferences
   */
  public async scheduleUserNotifications(userSettings: UserNotificationSettings): Promise<void> {
    try {
      const startDate = userSettings.startDate;
      const currentDate = new Date();
      const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      console.log(`NotificationService: Scheduling notifications for user ${userSettings.userId}, day ${daysSinceStart}, start date: ${startDate.toISOString()}`);

      // Clear existing scheduled notifications for this user
      await this.safeClearScheduledNotifications(userSettings.userId);


      // Schedule notifications for the next 365 days or until we reach the end of our data
      const maxDays = Math.min(365, Math.max(...NOTIFICATION_DATA.map(n => n.day)));
      const minDays = Math.min(...NOTIFICATION_DATA.map(n => n.day));

      // Start from the minimum day (could be -1 for installation notifications) or current day, whichever is greater
      for (let day = Math.max(minDays, daysSinceStart); day <= maxDays; day++) {
        const notificationsForDay = getNotificationsForDay(day);
        
        for (const notification of notificationsForDay) {
          let scheduledTime: Date;
          
          scheduledTime = this.calculateScheduledTime(startDate, day, notification.timeOfDay, userSettings);
          
      // Only schedule future notifications
      if (scheduledTime > currentDate) {
        const message = this.prepareMessage(notification, userSettings);
        
        const scheduledNotification: ScheduledNotification = {
          id: `${userSettings.userId}_${notification.id}`,
          userId: userSettings.userId,
          notificationId: notification.id,
          day: day,
          timeOfDay: notification.timeOfDay,
          scheduledTime: scheduledTime,
          message: message,
          category: notification.category,
          isSent: false,
          createdAt: new Date()
        };

        await this.saveScheduledNotification(scheduledNotification);
        
        // Also schedule with OneSignal for immediate delivery when the time comes
        await this.scheduleWithOneSignal(scheduledNotification, userSettings);
      }
        }
      }

      console.log(`NotificationService: Scheduled notifications for user ${userSettings.userId}`);
    } catch (error) {
      console.error('NotificationService: Error scheduling notifications:', error);
      throw error;
    }
  }

  /**
   * Calculate the exact time when a notification should be sent
   */
  private calculateScheduledTime(
    startDate: Date,
    day: number,
    timeOfDay: 'morning' | 'evening' | 'day',
    userSettings: UserNotificationSettings
  ): Date {
    const targetDate = new Date(startDate);

    if (day === -1) {
      // For day -1 (installation) notifications, schedule immediately (or 5 minutes after start)
      targetDate.setMinutes(targetDate.getMinutes() + 5);
      targetDate.setMinutes(targetDate.getMinutes() + 15);
      targetDate.setHours(targetDate.getHours() + 1);
    } else if (day === 0) {
      // For day 0 (welcome) notifications, schedule 1 hour after start
      targetDate.setMinutes(targetDate.getMinutes() + 5);
      targetDate.setHours(targetDate.getHours() + 1);
    } else {
      // For other days, use the normal logic
      targetDate.setDate(targetDate.getDate() + day);
      const [hours, minutes] = this.getTimeForDay(timeOfDay, userSettings);
      targetDate.setHours(hours, minutes, 0, 0);
    }

    return targetDate;
  }

  /**
   * Get the time (hours, minutes) for a specific time of day
   */
  private getTimeForDay(
    timeOfDay: 'morning' | 'evening' | 'day',
    userSettings: UserNotificationSettings
  ): [number, number] {
    switch (timeOfDay) {
      case 'morning':
        const [morningHours, morningMinutes] = userSettings.morningTime.split(':').map(Number);
        return [morningHours, morningMinutes];
      case 'evening':
        const [eveningHours, eveningMinutes] = userSettings.eveningTime.split(':').map(Number);
        return [eveningHours, eveningMinutes];
      case 'day':
        // For 'day' notifications, use morning time as default
        const [dayHours, dayMinutes] = userSettings.morningTime.split(':').map(Number);
        return [dayHours, dayMinutes];
      default:
        return [9, 0]; // Default to 9:00 AM
    }
  }

  /**
   * Prepare the message with placeholders replaced
   */
  private prepareMessage(notification: NotificationMessage, userSettings: UserNotificationSettings): string {
    const baseMessage = notification.messages[userSettings.language];
    
    // Get the actual buddy name from the buddy data
    const actualBuddyName = getBuddyNameForNotification(userSettings.selectedBuddyId, userSettings.buddyName);
    
    // Replace buddy name placeholder
    let processedMessage = replacePlaceholders(baseMessage, actualBuddyName);
    
    // Replace gender-specific text
    processedMessage = replaceGenderSpecificText(processedMessage, userSettings.gender, userSettings.language);
    
    return processedMessage;
  }

  /**
   * Save a scheduled notification to Firebase
   */
  private async saveScheduledNotification(notification: ScheduledNotification): Promise<void> {
    try {
      const notificationRef = doc(db, 'scheduledNotifications', notification.id);
      await setDoc(notificationRef, {
        ...notification,
        scheduledTime: Timestamp.fromDate(notification.scheduledTime),
        sentAt: notification.sentAt ? Timestamp.fromDate(notification.sentAt) : null,
        createdAt: Timestamp.fromDate(notification.createdAt)
      });
    } catch (error) {
      console.error('NotificationService: Error saving scheduled notification:', error);
      throw error;
    }
  }

  /**
   * Clear all scheduled notifications for a user
   */
  private async clearScheduledNotifications(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const batch = querySnapshot.docs.map(doc => doc.ref);
      
      // Note: In a real implementation, you'd want to use batch writes
      // For now, we'll just delete them one by one
      for (const docRef of batch) {
        await deleteDoc(docRef);
      }
      
      // Clear from OneSignal scheduler
      oneSignalScheduler.clearUserNotifications(userId);
      
      console.log(`NotificationService: Cleared ${batch.length} scheduled notifications for user ${userId}`);
    } catch (error) {
      console.error('NotificationService: Error clearing scheduled notifications:', error);
      throw error;
    }
  }

  /**
   * Process and send due notifications
   */
  public async processDueNotifications(): Promise<void> {
    try {
      const currentTime = new Date();
      // Query only by isSent to avoid composite index requirement
      // We'll filter by scheduledTime in the application code
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('isSent', '==', false),
        limit(100) // Process max 100 at a time
      );

      const querySnapshot = await getDocs(q);
      console.log(`NotificationService: Found ${querySnapshot.docs.length} unsent notifications`);

      if (querySnapshot.docs.length === 0) {
        console.log('NotificationService: No unsent notifications found - system is idle');
        return;
      }

      // Filter by scheduledTime in application code to avoid composite index
      const dueNotifications = [];
        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          const scheduledTime = data.scheduledTime?.toDate ? data.scheduledTime.toDate() : new Date(data.scheduledTime);

          // Check if notification is due (scheduledTime <= currentTime)
          if (scheduledTime <= currentTime) {
          dueNotifications.push({ docSnap, data, scheduledTime });
        }
      }

      console.log(`NotificationService: Found ${dueNotifications.length} due notifications out of ${querySnapshot.docs.length} unsent`);

      if (dueNotifications.length === 0) {
        console.log('NotificationService: No due notifications found - system is idle');
        return;
      }

      console.log('NotificationService: Processing due notifications...');

      for (const { docSnap, data, scheduledTime } of dueNotifications) {
        console.log(`NotificationService: Processing notification ${data.id} for day ${data.day}`);

        try {
          // Create notification object with converted date
          const notification: ScheduledNotification = {
            id: data.id,
            userId: data.userId,
            notificationId: data.notificationId,
            day: data.day,
            timeOfDay: data.timeOfDay,
            scheduledTime: scheduledTime,
            message: data.message,
            category: data.category,
            isSent: data.isSent,
            sentAt: data.sentAt?.toDate(),
            createdAt: data.createdAt.toDate()
          };
          
          await this.sendNotification(notification);

          // Mark as sent
          await updateDoc(docSnap.ref, {
            isSent: true,
            sentAt: Timestamp.now()
          });

          console.log(`NotificationService: ✅ Successfully processed notification ${data.id}`);
        } catch (error) {
          console.error(`NotificationService: ❌ Failed to process notification ${data.id}:`, error);

          // Mark as failed but don't remove - allow retry
          await updateDoc(docSnap.ref, {
            lastError: (error as Error).message,
            lastAttemptAt: Timestamp.now()
          });
        }
      }

      console.log(`NotificationService: ✅ Completed processing ${querySnapshot.docs.length} notifications`);
    } catch (error) {
      console.error('NotificationService: Error processing due notifications:', error);
      throw error;
    }
  }

  /**
   * Schedule notification with OneSignal and set user properties
   */
  private async scheduleWithOneSignal(
    notification: ScheduledNotification, 
    userSettings: UserNotificationSettings
  ): Promise<void> {
    try {
      if (!oneSignalService.isOneSignalAvailable()) {
        console.log('NotificationService: OneSignal not available for scheduling');
        return;
      }

      // Set user properties for targeting and segmentation
      await oneSignalService.setUserProperties({
        userId: userSettings.userId,
        language: userSettings.language,
        gender: userSettings.gender,
        buddyName: userSettings.buddyName,
        selectedBuddyId: userSettings.selectedBuddyId || '',
        startDate: userSettings.startDate.toISOString(),
        timezone: userSettings.timezone,
        morningTime: userSettings.morningTime,
        eveningTime: userSettings.eveningTime
      });

      // Schedule notification directly with OneSignal REST API
      await oneSignalService.scheduleNotification(
        notification.message,
        notification.scheduledTime,
        {
          day: notification.day.toString(),
          category: notification.category,
          timeOfDay: notification.timeOfDay,
          notificationId: notification.notificationId,
          userId: notification.userId
        }
      );

      console.log(`NotificationService: ✅ OneSignal notification scheduled for day ${notification.day} at ${notification.scheduledTime.toISOString()}`);
      
    } catch (error) {
      console.error('NotificationService: Error scheduling with OneSignal:', error);
      // Don't throw error - continue with Firebase storage even if OneSignal fails
    }
  }

  /**
   * Send a notification via OneSignal
   */
  private async sendNotification(notification: ScheduledNotification): Promise<void> {
    try {
      if (!oneSignalService.isOneSignalAvailable()) {
        console.log('NotificationService: OneSignal not available, skipping notification');
        return;
      }

      // Prepare additional data for OneSignal
      const additionalData = {
        day: notification.day.toString(),
        category: notification.category,
        timeOfDay: notification.timeOfDay,
        notificationId: notification.notificationId,
        userId: notification.userId
      };

      console.log(`NotificationService: Sending notification for day ${notification.day}, ${notification.timeOfDay}:`, notification.message);
      
      // Send notification via OneSignal
      await oneSignalService.sendNotification(notification.message, additionalData);
      
      console.log(`NotificationService: Notification sent successfully for day ${notification.day}`);
      
    } catch (error) {
      console.error('NotificationService: Error sending notification:', error);
      throw error;
    }
  }


  /**
   * Get notification statistics for a user (legacy method)
   */
  public async getUserNotificationStats(userId: string): Promise<{
    totalScheduled: number;
    sent: number;
    pending: number;
    nextNotification?: Date;
  }> {
    try {
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const notifications: ScheduledNotification[] = [];
      
      // Convert Firestore data to proper ScheduledNotification objects
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const notification: ScheduledNotification = {
          ...data,
          scheduledTime: data.scheduledTime?.toDate ? data.scheduledTime.toDate() : new Date(data.scheduledTime),
          sentAt: data.sentAt?.toDate ? data.sentAt.toDate() : (data.sentAt ? new Date(data.sentAt) : undefined),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        } as ScheduledNotification;
        notifications.push(notification);
      }
      console.log('NotificationService: Converted notifications:', notifications.length);
      const sent = notifications.filter(n => n.isSent).length;
      const pending = notifications.filter(n => !n.isSent).length;
      console.log('NotificationService: Sent:', sent);
      console.log('NotificationService: Pending:', pending);
      
      const nextNotification = pending > 0 
        ? notifications.filter(n => !n.isSent).sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())[0].scheduledTime
        : undefined;

      return {
        totalScheduled: notifications.length,
        sent,
        pending,
        nextNotification
      };
    } catch (error) {
      console.error('NotificationService: Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Safely get user scheduled notifications from Firebase with error handling
   */
  public async safeGetScheduledNotifications(userId: string): Promise<{
    notifications: ScheduledNotification[];
    success: boolean;
    error?: string;
  }> {
    try {
      console.log(`NotificationService: Safely loading scheduled notifications for ${userId}`);

      const q = query(
        collection(db, 'scheduledNotifications'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      console.log(`NotificationService: Found ${querySnapshot.docs.length} scheduled notifications`);

      const notifications: ScheduledNotification[] = [];

      for (const docSnap of querySnapshot.docs) {
        try {
          const data = docSnap.data();
          
          // Safely convert Timestamps to Dates
          const scheduledTime = data.scheduledTime?.toDate ? data.scheduledTime.toDate() : new Date(data.scheduledTime);
          const sentAt = data.sentAt?.toDate ? data.sentAt.toDate() : (data.sentAt ? new Date(data.sentAt) : undefined);
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          
          const notification: ScheduledNotification = {
            ...data,
            scheduledTime,
            sentAt,
            createdAt,
          } as ScheduledNotification;
          notifications.push(notification);
        } catch (parseError) {
          console.error('NotificationService: Error parsing scheduled notification:', parseError);
          console.error('NotificationService: Document ID:', docSnap.id);
          // Continue processing other notifications
        }
      }

      return {
        notifications,
        success: true
      };
    } catch (error) {
      console.error('NotificationService: Error safely getting scheduled notifications:', error);
      return {
        notifications: [],
        success: false,
        error: `Failed to load scheduled notifications: ${(error as Error).message}`
      };
    }
  }

  /**
   * Safely save scheduled notification to Firebase with error handling
   */
  public async safeSaveScheduledNotification(notification: ScheduledNotification): Promise<{
    success: boolean;
    error?: string;
    notificationId?: string;
  }> {
    try {
      console.log(`NotificationService: Safely saving scheduled notification ${notification.id}`);

      const notificationRef = doc(db, 'scheduledNotifications', notification.id);
      await setDoc(notificationRef, {
        ...notification,
        scheduledTime: Timestamp.fromDate(notification.scheduledTime),
        sentAt: notification.sentAt ? Timestamp.fromDate(notification.sentAt) : null,
        createdAt: Timestamp.fromDate(notification.createdAt)
      });

      console.log('NotificationService: Scheduled notification saved successfully');
      return {
        success: true,
        notificationId: notification.id
      };
    } catch (error) {
      console.error('NotificationService: Error safely saving scheduled notification:', error);
      return {
        success: false,
        error: `Failed to save scheduled notification: ${(error as Error).message}`
      };
    }
  }

  /**
   * Safely clear scheduled notifications for a user with error handling
   */
  public async safeClearScheduledNotifications(userId: string): Promise<{
    success: boolean;
    error?: string;
    deletedCount?: number;
  }> {
    try {
      console.log(`NotificationService: Safely clearing scheduled notifications for ${userId}`);

      const q = query(
        collection(db, 'scheduledNotifications'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const batch = querySnapshot.docs.map(doc => doc.ref);

      // Delete notifications one by one with error handling
      let deletedCount = 0;
      for (const docRef of batch) {
        try {
          await deleteDoc(docRef);
          deletedCount++;
        } catch (deleteError) {
          console.error('NotificationService: Error deleting notification:', deleteError);
          // Continue deleting other notifications
        }
      }

      // Clear from OneSignal scheduler
      try {
        oneSignalScheduler.clearUserNotifications(userId);
      } catch (schedulerError) {
        console.error('NotificationService: Error clearing OneSignal scheduler:', schedulerError);
        // Don't fail the whole operation for scheduler errors
      }

      console.log(`NotificationService: Safely cleared ${deletedCount} scheduled notifications for user ${userId}`);
      return {
        success: true,
        deletedCount
      };
    } catch (error) {
      console.error('NotificationService: Error safely clearing scheduled notifications:', error);
      return {
        success: false,
        error: `Failed to clear scheduled notifications: ${(error as Error).message}`
      };
    }
  }

  /**
   * Safely get notification statistics with error handling
   */
  public async safeGetUserNotificationStats(userId: string): Promise<{
    stats: {
      totalScheduled: number;
      sent: number;
      pending: number;
      nextNotification?: Date;
    };
    success: boolean;
    error?: string;
  }> {
    try {
      console.log(`NotificationService: Safely getting notification stats for ${userId}`);

      const result = await this.safeGetScheduledNotifications(userId);
      if (!result.success) {
        return {
          stats: {
            totalScheduled: 0,
            sent: 0,
            pending: 0
          },
          success: false,
          error: result.error
        };
      }

      const notifications = result.notifications;
      const sent = notifications.filter(n => n.isSent).length;
      const pending = notifications.filter(n => !n.isSent).length;
      
      // Safely get next notification time
      let nextNotification: Date | undefined;
      if (pending > 0) {
        try {
          const pendingNotifications = notifications.filter(n => !n.isSent);
          const sortedNotifications = pendingNotifications.sort((a, b) => {
            // Ensure scheduledTime is a Date object
            const aTime = a.scheduledTime instanceof Date ? a.scheduledTime : new Date(a.scheduledTime);
            const bTime = b.scheduledTime instanceof Date ? b.scheduledTime : new Date(b.scheduledTime);
            return aTime.getTime() - bTime.getTime();
          });
          nextNotification = sortedNotifications[0]?.scheduledTime;
        } catch (sortError) {
          console.error('NotificationService: Error sorting notifications:', sortError);
          nextNotification = undefined;
        }
      }

      return {
        stats: {
          totalScheduled: notifications.length,
          sent,
          pending,
          nextNotification
        },
        success: true
      };
    } catch (error) {
      console.error('NotificationService: Error safely getting user stats:', error);
      return {
        stats: {
          totalScheduled: 0,
          sent: 0,
          pending: 0
        },
        success: false,
        error: `Failed to get notification stats: ${(error as Error).message}`
      };
    }
  }

  /**
   * Update user settings and reschedule notifications
   */
  public async updateUserSettings(userSettings: UserNotificationSettings): Promise<void> {
    try {
      await this.saveUserSettings(userSettings);
      await this.scheduleUserNotifications(userSettings);
      console.log('NotificationService: User settings updated and notifications rescheduled');
    } catch (error) {
      console.error('NotificationService: Error updating user settings:', error);
      throw error;
    }
  }




  /**
   * Add a scheduled notification to Firebase for a specific user and time
   */
  public async addScheduledNotificationToFirebase(
    userId: string,
    scheduledTime: Date,
    message: string,
    day: number = 0,
    timeOfDay: 'morning' | 'evening' | 'day' = 'day',
    category: 'start' | 'support' | 'celebration' | 'final' = 'support'
  ): Promise<void> {
    try {
      console.log('NotificationService: 📅 Adding scheduled notification to Firebase...');
      
      await oneSignalService.addScheduledNotificationToFirebase(
        userId,
        scheduledTime,
        message,
        day,
        timeOfDay,
        category
      );

      console.log('NotificationService: ✅ Scheduled notification added to Firebase');
      console.log('NotificationService: 📱 Notification will be sent at:', scheduledTime.toLocaleString());
    } catch (error) {
      console.error('NotificationService: Error adding scheduled notification to Firebase:', error);
      throw error;
    }
  }

  /**
   * Send a simple push notification directly
   */
  public async sendSimplePushNotification(message: string): Promise<void> {
    try {
      console.log('NotificationService: Sending simple push notification:', message);
      
      await oneSignalService.sendSimplePushNotification(message);

      console.log('NotificationService: ✅ Simple push notification sent');
      console.log('NotificationService: 📱 You should see this notification RIGHT NOW!');
    } catch (error) {
      console.error('NotificationService: Error sending simple push notification:', error);
      throw error;
    }
  }

  /**
   * Send an immediate test notification for debugging
   */
  public async sendImmediateTestNotification(): Promise<void> {
    try {
      console.log('NotificationService: Sending IMMEDIATE test notification for debugging...');
      
      // Use the simple push notification method
      await oneSignalService.sendSimplePushNotification("🚨 IMMEDIATE TEST - This should appear right now!");

      console.log('NotificationService: ✅ Immediate test notification sent');
      console.log('NotificationService: 📱 You should see this notification RIGHT NOW!');
    } catch (error) {
      console.error('NotificationService: Error sending immediate test notification:', error);
      throw error;
    }
  }

  /**
   * Check notification system status
   */
  public async checkNotificationStatus(): Promise<void> {
    try {
      console.log('NotificationService: 🔍 Checking notification system status...');
      
      // Check OneSignal status
      await oneSignalService.checkOneSignalStatus();
      
      // Check if notifications are enabled
      const enabled = await this.areNotificationsEnabled();
      console.log('NotificationService: Notifications enabled:', enabled);
      
      console.log('NotificationService: ✅ Status check complete');
    } catch (error) {
      console.error('NotificationService: ❌ Status check failed:', error);
      throw error;
    }
  }

  /**
   * Test OneSignal configuration
   */
  public async testOneSignalConfiguration(): Promise<void> {
    try {
      console.log('NotificationService: 🧪 Testing OneSignal configuration...');
      
      await oneSignalService.testOneSignalConfiguration();
      
      console.log('NotificationService: ✅ OneSignal configuration test complete');
    } catch (error) {
      console.error('NotificationService: ❌ OneSignal configuration test failed:', error);
      throw error;
    }
  }

  /**
   * Test basic OneSignal connectivity
   */
  public async testBasicOneSignalConnectivity(): Promise<void> {
    try {
      console.log('NotificationService: 🌐 Testing basic OneSignal connectivity...');
      
      await oneSignalService.testBasicOneSignalConnectivity();
      
      console.log('NotificationService: ✅ Basic OneSignal connectivity test complete');
    } catch (error) {
      console.error('NotificationService: ❌ Basic OneSignal connectivity test failed:', error);
      throw error;
    }
  }

  /**
   * Test user registration with OneSignal
   */
  public async testUserRegistration(): Promise<void> {
    try {
      console.log('NotificationService: 👤 Testing user registration with OneSignal...');
      
      await oneSignalService.testUserRegistration();
      
      console.log('NotificationService: ✅ User registration test complete');
    } catch (error) {
      console.error('NotificationService: ❌ User registration test failed:', error);
      throw error;
    }
  }

  /**
   * Check if notifications are enabled for the user
   */
  async areNotificationsEnabled(): Promise<boolean> {
    try {
      // Check OneSignal permission status
      const permission = await OneSignal.Notifications.getPermissionAsync();
      return permission;
    } catch (error) {
      console.error('NotificationService: Error checking notification permissions:', error);
      return false;
    }
  }

  /**
   * Test Firebase connectivity
   */
  public async testFirebaseConnectivity(): Promise<void> {
    try {
      console.log('NotificationService: 🌐 Testing Firebase connectivity...');
      console.log('NotificationService: 🔗 Firebase project ID: quitqly-e5383');
      
      // Try a simple read operation to test connectivity
      const testRef = doc(db, 'test', 'connectivity');
      
      try {
        await getDoc(testRef);
        console.log('NotificationService: ✅ Firebase connectivity test successful!');
      } catch (readError) {
        console.log('NotificationService: ⚠️ Firebase read test failed, but this might be normal if the document doesn\'t exist');
        console.log('NotificationService: 🔍 Read error details:', (readError as any).code);
      }
      
      // Try a simple write operation to test connectivity
      try {
        await setDoc(testRef, {
          test: true,
          timestamp: Timestamp.now()
        });
        console.log('NotificationService: ✅ Firebase write test successful!');
        
        // Clean up the test document
        await deleteDoc(testRef);
        console.log('NotificationService: 🧹 Test document cleaned up');
        
      } catch (writeError) {
        console.error('NotificationService: ❌ Firebase write test failed:', writeError);
        throw writeError;
      }
      
      console.log('NotificationService: ✅ Firebase connectivity test completed successfully!');
      
    } catch (error) {
      console.error('NotificationService: ❌ Firebase connectivity test failed:', error);
      console.error('NotificationService: 🔍 Error details:', {
        code: (error as any).code,
        message: (error as any).message,
        stack: (error as any).stack
      });
      
      if ((error as any).code === 'auth/network-request-failed') {
        console.error('NotificationService: 🌐 Network error detected!');
        console.error('NotificationService: 💡 Solutions:');
        console.error('NotificationService:   1. Check your internet connection');
        console.error('NotificationService:   2. Restart the app');
        console.error('NotificationService:   3. Check Firebase console for project status');
        console.error('NotificationService:   4. Try switching networks (WiFi/Mobile)');
      }
      
      throw error;
    }
  }

  /**
   * Force process all pending notifications immediately (for testing)
   */
  public async forceProcessAllPendingNotifications(): Promise<void> {
    try {
      console.log('NotificationService: 🔥 Force processing ALL pending notifications...');
      
      // Process all pending notifications
      const currentTime = new Date();
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('isSent', '==', false),
        limit(100)
      );

      const querySnapshot = await getDocs(q);
      console.log(`NotificationService: Found ${querySnapshot.docs.length} pending notifications to process`);

      let processed = 0;
      let errors = 0;

      for (const docSnap of querySnapshot.docs) {
        try {
          const data = docSnap.data();
          const scheduledTime = data.scheduledTime?.toDate ? data.scheduledTime.toDate() : new Date(data.scheduledTime);
          
          // Process notifications that are past due or very close to due time
          const timeDiff = currentTime.getTime() - scheduledTime.getTime();
          const isPastDue = timeDiff > 0;
          const isVeryClose = timeDiff > -5 * 60 * 1000; // Within 5 minutes

          if (isPastDue || isVeryClose) {
            console.log(`NotificationService: Force processing notification: ${data.id}`);
            
            // Create notification object
            const notification: ScheduledNotification = {
              id: data.id,
              userId: data.userId,
              notificationId: data.notificationId,
              day: data.day,
              timeOfDay: data.timeOfDay,
              scheduledTime: scheduledTime,
              message: data.message,
              category: data.category,
              isSent: data.isSent,
              sentAt: data.sentAt?.toDate ? data.sentAt.toDate() : (data.sentAt ? new Date(data.sentAt) : undefined),
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
            };
            
            await this.sendNotification(notification);

            // Mark as sent
            await updateDoc(docSnap.ref, {
              isSent: true,
              sentAt: Timestamp.now()
            });

            processed++;
          }
        } catch (error) {
          console.error('NotificationService: Error force processing notification:', error);
          errors++;
        }
      }

      const result = { processed, errors };
      
      console.log(`NotificationService: ✅ Force processing complete!`);
      console.log(`NotificationService: 📊 Processed: ${result.processed}, Errors: ${result.errors}`);
      
      if (result.processed > 0) {
        console.log('NotificationService: 📱 You should see notifications now!');
      } else {
        console.log('NotificationService: ℹ️ No notifications were processed');
      }
    } catch (error) {
      console.error('NotificationService: ❌ Error force processing notifications:', error);
      throw error;
    }
  }

  /**
   * Check what pending notifications exist in Firebase
   */
  public async checkPendingNotifications(): Promise<void> {
    try {
      console.log('NotificationService: 🔍 Checking pending notifications in Firebase...');
      console.log('NotificationService: 🔗 Firebase project ID: quitqly-e5383');
      console.log('NotificationService: 🌐 Testing Firebase connectivity...');
      
      const currentTime = new Date();
      console.log('NotificationService: ⏰ Current time:', currentTime.toISOString());
      
      // Remove orderBy to avoid composite index requirement
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('isSent', '==', false)
      );

      console.log('NotificationService: 📡 Executing Firebase query...');
      const querySnapshot = await getDocs(q);
      console.log(`NotificationService: ✅ Firebase query successful! Found ${querySnapshot.docs.length} pending notifications`);

      if (querySnapshot.docs.length === 0) {
        console.log('NotificationService: ℹ️ No pending notifications found');
        return;
      }

      console.log('NotificationService: 📋 Pending notifications:');
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        // Convert Firestore Timestamp to Date
        const scheduledTime = data.scheduledTime.toDate();
        const timeDiff = currentTime.getTime() - scheduledTime.getTime();
        const isPastDue = timeDiff > 0;
        const status = isPastDue ? '🔴 PAST DUE' : '🟡 FUTURE';
        
        console.log(`NotificationService: ${status} - ${data.id}`);
        console.log(`NotificationService:   - Scheduled: ${scheduledTime.toLocaleString()}`);
        console.log(`NotificationService:   - Message: ${data.message}`);
        console.log(`NotificationService:   - User: ${data.userId}`);
        console.log(`NotificationService:   - Time diff: ${Math.round(timeDiff / 1000 / 60)} minutes`);
      }
      
    } catch (error) {
      console.error('NotificationService: ❌ Error checking pending notifications:', error);
      console.error('NotificationService: 🔍 Error details:', {
        code: (error as any).code,
        message: (error as any).message,
        stack: (error as any).stack
      });
      
      // Check if it's a network error
      if ((error as any).code === 'auth/network-request-failed') {
        console.error('NotificationService: 🌐 Network error detected! Check your internet connection and Firebase project status.');
        console.error('NotificationService: 💡 Try: 1) Check internet connection 2) Restart the app 3) Check Firebase console');
      }
      
      throw error;
    }
  }

}

export default NotificationService.getInstance();

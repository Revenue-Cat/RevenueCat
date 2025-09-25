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

      // Initialize OneSignal service
      await oneSignalService.initialize();

      // Initialize OneSignal scheduler for background processing
      await oneSignalScheduler.initialize();

      // Start background notification processing
      this.startBackgroundProcessing();

      this.isInitialized = true;

    } catch (error) {
      console.error('NotificationService: Error initializing:', error);
      throw error;
    }
  }

  /**
   * Start background notification processing
   */
  private startBackgroundProcessing(): void {

    // Process any notifications that might have been missed when app was closed
    this.processDueNotifications().catch(error => {
      // console.error('NotificationService: Error in initial background processing:', error);
    });

    // Set up periodic processing as backup (in case OneSignal scheduler fails)
    setInterval(() => {
      this.processDueNotifications().catch(error => {
        // console.error('NotificationService: Error in periodic background processing:', error);
      });
    }, 5 * 60 * 1000); // Every 5 minutes as backup

  }

 
  /**
   * Send installation notification immediately after app installation
   */
  public async sendInstallationNotification(userSettings: UserNotificationSettings): Promise<void> {
    try {
      if (!oneSignalService.isOneSignalAvailable()) {
        // console.log('NotificationService: OneSignal not available for installation notification');
        return;
      }

      // Find the installation notification (day: -1)
      const installationNotification = NOTIFICATION_DATA.find(n => n.id === 'app_installed');
      if (!installationNotification) {
        // console.log('NotificationService: Installation notification not found');
        return;
      }

      // Prepare the message with user-specific data
      const message = this.prepareMessage(installationNotification, userSettings);


      // Send the notification immediately
      await oneSignalService.sendNotification(message, {
        day: '-1',
        category: installationNotification.category,
        timeOfDay: installationNotification.timeOfDay,
        notificationId: installationNotification.id,
        userId: userSettings.userId,
        isInstallation: 'true'
      });

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

      const userRef = doc(db, 'userNotificationSettings', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

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


      // Clear existing scheduled notifications for this user
      await this.safeClearScheduledNotifications(userSettings.userId);
      
      // Also clear any old notifications that are no longer relevant
      await this.clearOldNotifications(userSettings.userId, daysSinceStart);


      // Schedule notifications for the next 365 days or until we reach the end of our data
      const maxDays = Math.min(365, Math.max(...NOTIFICATION_DATA.map(n => n.day)));
      const minDays = Math.min(...NOTIFICATION_DATA.map(n => n.day));

      // Start from the minimum day (could be -1 for installation notifications) or current day, whichever is greater
      for (let day = Math.max(minDays, daysSinceStart); day <= maxDays; day++) {
        const notificationsForDay = getNotificationsForDay(day);
        
        // Only schedule ONE notification per day - prioritize morning, then evening, then day
        let selectedNotification = null;
        
        // First try to find morning notification
        selectedNotification = notificationsForDay.find(n => n.timeOfDay === 'morning');
        
        // If no morning, try evening
        if (!selectedNotification) {
          selectedNotification = notificationsForDay.find(n => n.timeOfDay === 'evening');
        }
        
        // If no morning or evening, try day
        if (!selectedNotification) {
          selectedNotification = notificationsForDay.find(n => n.timeOfDay === 'day');
        }
        
        // If we found a notification for this day, schedule it
        if (selectedNotification) {
          let scheduledTime: Date;
          
          scheduledTime = this.calculateScheduledTime(startDate, day, selectedNotification.timeOfDay, userSettings);
          
          // Only schedule future notifications AND ensure it's for the correct day
          if (scheduledTime > currentDate && day >= daysSinceStart) {
            const message = this.prepareMessage(selectedNotification, userSettings);
            
            const scheduledNotification: ScheduledNotification = {
              id: `${userSettings.userId}_${selectedNotification.id}`,
              userId: userSettings.userId,
              notificationId: selectedNotification.id,
              day: day,
              timeOfDay: selectedNotification.timeOfDay,
              scheduledTime: scheduledTime,
              message: message,
              category: selectedNotification.category,
              isSent: false,
              createdAt: new Date()
            };

            await this.saveScheduledNotification(scheduledNotification);
            
            // Also schedule with OneSignal for immediate delivery when the time comes
            await this.scheduleWithOneSignal(scheduledNotification, userSettings);
            
          }
        }
      }

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

    // Convert to user's timezone
    return this.convertToUserTimezone(targetDate, userSettings.timezone);
  }

  /**
   * Convert a date to the user's timezone
   * This ensures notifications are sent at the correct local time for each user
   */
  private convertToUserTimezone(date: Date, userTimezone: string): Date {
    try {
      // Get the current time in the user's timezone
      const now = new Date();
      const userTime = new Date(now.toLocaleString("en-US", { timeZone: userTimezone }));
      const serverTime = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
      
      // Calculate the timezone offset
      const timezoneOffset = userTime.getTime() - serverTime.getTime();
      
      // Apply the offset to the target date
      const adjustedDate = new Date(date.getTime() + timezoneOffset);
      
  
      return adjustedDate;
    } catch (error) {
      console.error('NotificationService: Error converting to user timezone:', error);
      return date;
    }
  }

  /**
   * Get the time (hours, minutes) for a specific time of day
   * Always use 8 AM for morning and 8 PM for evening to ensure consistency
   */
  private getTimeForDay(
    timeOfDay: 'morning' | 'evening' | 'day',
    userSettings: UserNotificationSettings
  ): [number, number] {
    switch (timeOfDay) {
      case 'morning':
        // Always use 8:00 AM for morning notifications
        return [8, 0];
      case 'evening':
        // Always use 8:00 PM (20:00) for evening notifications
        return [20, 0];
      case 'day':
        // For 'day' notifications, use 8:00 AM as default
        return [8, 0];
      default:
        return [8, 0]; // Default to 8:00 AM
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

      if (querySnapshot.docs.length === 0) {
        // console.log('NotificationService: No unsent notifications found - system is idle');
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


      if (dueNotifications.length === 0) {
        // console.log('NotificationService: No due notifications found - system is idle');
        return;
      }

      // Group notifications by user to process them correctly
      const notificationsByUser = new Map<string, Array<{ docSnap: any, data: any, scheduledTime: Date }>>();
      
      for (const notification of dueNotifications) {
        const userId = notification.data.userId;
        if (!notificationsByUser.has(userId)) {
          notificationsByUser.set(userId, []);
        }
        notificationsByUser.get(userId)!.push(notification);
      }

      // Process notifications for each user individually
      for (const [userId, userNotifications] of notificationsByUser) {
        try {
          // Get user settings once per user
          const userSettings = await this.getUserSettings(userId);
          if (!userSettings) {
            // console.log(`NotificationService: User settings not found for ${userId}, skipping all notifications for this user`);
            continue;
          }

          // Calculate the user's current day based on their start date
          const userStartDate = userSettings.startDate;
          const currentDate = new Date();
          const daysSinceStart = Math.floor((currentDate.getTime() - userStartDate.getTime()) / (1000 * 60 * 60 * 24));
          

          // Process each notification for this user
          for (const { docSnap, data, scheduledTime } of userNotifications) {
            try {
              // Only send notification if it matches the user's current day
              if (data.day !== daysSinceStart) {
                // console.log(`NotificationService: Skipping notification for day ${data.day} - user is on day ${daysSinceStart}`);
                continue;
              }

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

              // Remove the notification from Firebase after sending to prevent duplicates
              await deleteDoc(docSnap.ref);

            } catch (error) {
              console.error(`NotificationService: ❌ Failed to process notification ${data.id} for user ${userId}:`, error);

              // Mark as failed but don't remove - allow retry
              await updateDoc(docSnap.ref, {
                lastError: (error as Error).message,
                lastAttemptAt: Timestamp.now()
              });
            }
          }

        } catch (error) {
          console.error(`NotificationService: ❌ Failed to process notifications for user ${userId}:`, error);
        }
      }

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
        // console.log('NotificationService: OneSignal not available for scheduling');
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
        // console.log('NotificationService: OneSignal not available, skipping notification');
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

      
      // Send notification via OneSignal
      await oneSignalService.sendNotification(notification.message, additionalData);
      
      
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
      const sent = notifications.filter(n => n.isSent).length;
      const pending = notifications.filter(n => !n.isSent).length;

      
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

      const q = query(
        collection(db, 'scheduledNotifications'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);

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

      const notificationRef = doc(db, 'scheduledNotifications', notification.id);
      await setDoc(notificationRef, {
        ...notification,
        scheduledTime: Timestamp.fromDate(notification.scheduledTime),
        sentAt: notification.sentAt ? Timestamp.fromDate(notification.sentAt) : null,
        createdAt: Timestamp.fromDate(notification.createdAt)
      });

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
   * Clear old notifications that are no longer relevant for the user's current day
   */
  private async clearOldNotifications(userId: string, currentDay: number): Promise<void> {
    try {
      
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('userId', '==', userId),
        where('isSent', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const notificationsToDelete = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        // Delete notifications for days that have already passed
        if (data.day < currentDay) {
          notificationsToDelete.push(docSnap.ref);
        }
      }

      // Delete old notifications
      for (const docRef of notificationsToDelete) {
        await deleteDoc(docRef);
      }

      if (notificationsToDelete.length > 0) {
      }
    } catch (error) {
      console.error('NotificationService: Error clearing old notifications:', error);
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
      
      await oneSignalService.addScheduledNotificationToFirebase(
        userId,
        scheduledTime,
        message,
        day,
        timeOfDay,
        category
      );

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
      
      await oneSignalService.sendSimplePushNotification(message);

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
      
      // Use the simple push notification method
      await oneSignalService.sendSimplePushNotification("🚨 IMMEDIATE TEST - This should appear right now!");


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
      
      // Check OneSignal status
      await oneSignalService.checkOneSignalStatus();
      
      // Check if notifications are enabled
      const enabled = await this.areNotificationsEnabled();
      
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
      
      await oneSignalService.testOneSignalConfiguration();
      
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
      
      await oneSignalService.testBasicOneSignalConnectivity();
      
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
      
      await oneSignalService.testUserRegistration();
      
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
  
      // Try a simple read operation to test connectivity
      const testRef = doc(db, 'test', 'connectivity');
      
      try {
        await getDoc(testRef);
      } catch (readError) {
        console.log('NotificationService: ⚠️ Firebase read test failed, but this might be normal if the document doesn\'t exist');
      }
      
      // Try a simple write operation to test connectivity
      try {
        await setDoc(testRef, {
          test: true,
          timestamp: Timestamp.now()
        });
        
        // Clean up the test document
        await deleteDoc(testRef);
        
      } catch (writeError) {
        console.error('NotificationService: ❌ Firebase write test failed:', writeError);
        throw writeError;
      }
            
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
      
      // Process all pending notifications
      const currentTime = new Date();
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('isSent', '==', false),
        limit(100)
      );

      const querySnapshot = await getDocs(q);

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
      
      
      if (result.processed > 0) {
        // console.log('NotificationService: 📱 You should see notifications now!');
      } else {
        // console.log('NotificationService: ℹ️ No notifications were processed');
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

      
      const currentTime = new Date();
      
      // Remove orderBy to avoid composite index requirement
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('isSent', '==', false)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        // console.log('NotificationService: ℹ️ No pending notifications found');
        return;
      }

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        // Convert Firestore Timestamp to Date
        const scheduledTime = data.scheduledTime.toDate();
        const timeDiff = currentTime.getTime() - scheduledTime.getTime();
        const isPastDue = timeDiff > 0;
        const status = isPastDue ? '🔴 PAST DUE' : '🟡 FUTURE';
        
        // console.log(`NotificationService: ${status} - ${data.id}`);
        // console.log(`NotificationService:   - Scheduled: ${scheduledTime.toLocaleString()}`);
        // console.log(`NotificationService:   - Message: ${data.message}`);
        // console.log(`NotificationService:   - User: ${data.userId}`);
        // console.log(`NotificationService:   - Time diff: ${Math.round(timeDiff / 1000 / 60)} minutes`);
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

  /**
   * Clear ALL notifications from Firebase (for debugging and cleanup)
   */
  public async clearAllNotifications(): Promise<void> {
    try {
      
      // Get all notifications (both sent and unsent)
      const q = query(collection(db, 'scheduledNotifications'));
      const querySnapshot = await getDocs(q);
      
      
      if (querySnapshot.docs.length === 0) {
        // console.log('NotificationService: ℹ️ No notifications found to clear');
        return;
      }

      // Delete all notifications
      let deletedCount = 0;
      for (const docSnap of querySnapshot.docs) {
        try {
          await deleteDoc(docSnap.ref);
          deletedCount++;
        } catch (deleteError) {
          console.error('NotificationService: Error deleting notification:', deleteError);
        }
      }
      
      // Clear from OneSignal scheduler
      oneSignalScheduler.clearUserNotifications('all');
      
   
      
    } catch (error) {
      console.error('NotificationService: ❌ Error clearing all notifications:', error);
      throw error;
    }
  }

  /**
   * Clear only SENT notifications from Firebase (to prevent duplicates)
   */
  public async clearSentNotifications(): Promise<void> {
    try {
      
      // Get only sent notifications
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('isSent', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      
      if (querySnapshot.docs.length === 0) {
        // console.log('NotificationService: ℹ️ No sent notifications found to clear');
        return;
      }

      // Delete only sent notifications
      let deletedCount = 0;
      for (const docSnap of querySnapshot.docs) {
        try {
          await deleteDoc(docSnap.ref);
          deletedCount++;
        } catch (deleteError) {
          console.error('NotificationService: Error deleting sent notification:', deleteError);
        }
      }
      
      
    } catch (error) {
      console.error('NotificationService: ❌ Error clearing sent notifications:', error);
      throw error;
    }
  }

  /**
   * Clear all notifications for a specific user (for rescheduling)
   */
  public async clearUserNotifications(userId: string): Promise<void> {
    try {
      
      // Get all notifications for this user
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      
      if (querySnapshot.docs.length === 0) {
        // console.log('NotificationService: ℹ️ No notifications found for user');
        return;
      }

      // Delete all notifications for this user
      let deletedCount = 0;
      for (const docSnap of querySnapshot.docs) {
        try {
          await deleteDoc(docSnap.ref);
          deletedCount++;
        } catch (deleteError) {
          console.error('NotificationService: Error deleting notification:', deleteError);
        }
      }
      
      
    } catch (error) {
      console.error('NotificationService: ❌ Error clearing user notifications:', error);
      throw error;
    }
  }

  /**
   * Test timezone conversion for debugging
   */
  public testTimezoneConversion(userTimezone: string): void {
    
    // Test with today at 8 AM
    const today = new Date();
    today.setHours(8, 0, 0, 0);
    
    
    // const convertedDate = this.convertToUserTimezone(today, userTimezone);

    
    // Test with today at 8 PM
    const evening = new Date();
    evening.setHours(20, 0, 0, 0);
    
    const convertedEvening = this.convertToUserTimezone(evening, userTimezone);
  }

}

export default NotificationService.getInstance();

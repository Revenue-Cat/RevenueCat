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
  orderBy,
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
      
      // Initialize OneSignal scheduler
      await oneSignalScheduler.initialize();
      
      this.isInitialized = true;
      console.log('NotificationService: Initialized successfully with OneSignal and scheduler');
    } catch (error) {
      console.error('NotificationService: Error initializing:', error);
      throw error;
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
   * Get user notification settings from Firebase
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
   * Schedule the welcome notification for first-time users (public method)
   */
  public async scheduleWelcomeNotification(userSettings: UserNotificationSettings): Promise<void> {
    try {
      const welcomeNotification = NOTIFICATION_DATA.find(n => n.id === 'welcome_home');
      if (!welcomeNotification) {
        console.log('NotificationService: Welcome notification not found');
        return;
      }

      // Schedule welcome notification for 1 hour from now (when user opens home screen)
      const scheduledTime = new Date();
      scheduledTime.setHours(scheduledTime.getHours() + 1);

      const message = this.prepareMessage(welcomeNotification, userSettings);

      const scheduledNotification: ScheduledNotification = {
        id: `${userSettings.userId}_welcome_home`,
        userId: userSettings.userId,
        notificationId: welcomeNotification.id,
        day: 0,
        timeOfDay: welcomeNotification.timeOfDay,
        scheduledTime: scheduledTime,
        message: message,
        category: welcomeNotification.category,
        isSent: false,
        createdAt: new Date()
      };

      await this.saveScheduledNotification(scheduledNotification);
      await this.scheduleWithOneSignal(scheduledNotification, userSettings);

      console.log(`NotificationService: Welcome notification scheduled for ${scheduledTime.toISOString()}`);
    } catch (error) {
      console.error('NotificationService: Error scheduling welcome notification:', error);
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
      
      console.log(`NotificationService: Scheduling notifications for user ${userSettings.userId}, day ${daysSinceStart}`);

      // Clear existing scheduled notifications for this user
      await this.clearScheduledNotifications(userSettings.userId);

      // Schedule the welcome notification (day 0) if it's the user's first time
      if (daysSinceStart === 0) {
        await this.scheduleWelcomeNotification(userSettings);
      }

      // Schedule notifications for the next 365 days or until we reach the end of our data
      const maxDays = Math.min(365, Math.max(...NOTIFICATION_DATA.map(n => n.day)));

      for (let day = Math.max(1, daysSinceStart + 1); day <= maxDays; day++) {
        const notificationsForDay = getNotificationsForDay(day);
        
        for (const notification of notificationsForDay) {
          const scheduledTime = this.calculateScheduledTime(startDate, day, notification.timeOfDay, userSettings);
          
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
    targetDate.setDate(targetDate.getDate() + day - 1);

    const [hours, minutes] = this.getTimeForDay(timeOfDay, userSettings);
    
    targetDate.setHours(hours, minutes, 0, 0);
    
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
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('isSent', '==', false),
        where('scheduledTime', '<=', Timestamp.fromDate(currentTime)),
        orderBy('scheduledTime'),
        limit(50) // Process max 50 notifications at a time
      );

      const querySnapshot = await getDocs(q);
      console.log(`NotificationService: Found ${querySnapshot.docs.length} due notifications`);

      for (const docSnap of querySnapshot.docs) {
        const notification = docSnap.data() as ScheduledNotification;
        await this.sendNotification(notification);
        
        // Mark as sent
        await updateDoc(docSnap.ref, {
          isSent: true,
          sentAt: Timestamp.now()
        });
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

      // Schedule notification with OneSignal scheduler
      await oneSignalScheduler.scheduleNotification({
        id: notification.id,
        userId: notification.userId,
        message: notification.message,
        scheduledTime: notification.scheduledTime,
        additionalData: {
          day: notification.day.toString(),
          category: notification.category,
          timeOfDay: notification.timeOfDay,
          notificationId: notification.notificationId,
          userId: notification.userId
        },
        isSent: false,
        createdAt: new Date()
      });

      console.log(`NotificationService: OneSignal notification scheduled for day ${notification.day}`);
      
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
   * Get notification statistics for a user
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
      const notifications = querySnapshot.docs.map(doc => doc.data() as ScheduledNotification);

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
   * Send a test notification immediately
   */
  public async sendTestNotification(userSettings: UserNotificationSettings): Promise<void> {
    try {
      const testMessage = this.prepareMessage(NOTIFICATION_DATA[0], userSettings);
      
      // Send test notification immediately via OneSignal scheduler
      await oneSignalScheduler.sendTestNotification(userSettings, testMessage);

      console.log('NotificationService: Test notification sent via OneSignal');
    } catch (error) {
      console.error('NotificationService: Error sending test notification:', error);
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
}

export default NotificationService.getInstance();

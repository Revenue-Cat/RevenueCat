import { Platform } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import oneSignalService from './oneSignalService';
import { UserNotificationSettings } from './notificationService';

interface OneSignalScheduledNotification {
  id: string;
  userId: string;
  message: string;
  scheduledTime: Date;
  additionalData: Record<string, any>;
  isSent: boolean;
  createdAt: Date;
}

class OneSignalScheduler {
  private static instance: OneSignalScheduler;
  private scheduledNotifications: Map<string, OneSignalScheduledNotification> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  private constructor() {}

  public static getInstance(): OneSignalScheduler {
    if (!OneSignalScheduler.instance) {
      OneSignalScheduler.instance = new OneSignalScheduler();
    }
    return OneSignalScheduler.instance;
  }

  /**
   * Initialize the OneSignal scheduler
   */
  public async initialize(): Promise<void> {
    if (this.isRunning) {
      console.log('OneSignalScheduler: Already running, skipping initialization');
      return;
    }

    try {
      console.log('OneSignalScheduler: 🚀 Starting initialization...');

      // Start checking for due notifications every minute
      this.checkInterval = setInterval(() => {
        this.checkAndSendDueNotifications();
      }, 60000); // Check every minute

      this.isRunning = true;
      console.log('OneSignalScheduler: ✅ Initialized successfully');
      console.log('OneSignalScheduler: ⏰ Will check for due notifications every 60 seconds');
    } catch (error) {
      console.error('OneSignalScheduler: ❌ Error initializing:', error);
    }
  }

  /**
   * Schedule a notification for delivery at a specific time
   */
  public async scheduleNotification(
    notification: OneSignalScheduledNotification
  ): Promise<void> {
    try {
      this.scheduledNotifications.set(notification.id, notification);
      console.log(`OneSignalScheduler: Notification scheduled for ${notification.scheduledTime.toISOString()}`);
    } catch (error) {
      console.error('OneSignalScheduler: Error scheduling notification:', error);
    }
  }

  /**
   * Schedule multiple notifications for a user
   */
  public async scheduleUserNotifications(userSettings: UserNotificationSettings): Promise<void> {
    try {
      if (!oneSignalService.isOneSignalAvailable()) {
        console.log('OneSignalScheduler: OneSignal not available');
        return;
      }

      // Set user properties for targeting
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

      console.log('OneSignalScheduler: User notifications scheduled');
    } catch (error) {
      console.error('OneSignalScheduler: Error scheduling user notifications:', error);
    }
  }

  /**
   * Check and send notifications that are due
   */
  private async checkAndSendDueNotifications(): Promise<void> {
    try {
      console.log('OneSignalScheduler: Checking for due notifications...');

      // Call the NotificationService to process due notifications from Firebase
      // This is the main fix - we need to actually call the Firebase-based processing
      const notificationService = (await import('./notificationService')).default;
      await notificationService.processDueNotifications();

      console.log('OneSignalScheduler: Notification check completed');
    } catch (error) {
      console.error('OneSignalScheduler: Error checking due notifications:', error);
    }
  }

  /**
   * Send a notification immediately via OneSignal
   */
  private async sendNotification(notification: OneSignalScheduledNotification): Promise<void> {
    try {
      if (!oneSignalService.isOneSignalAvailable()) {
        console.log('OneSignalScheduler: OneSignal not available for sending');
        return;
      }

      // Send notification via OneSignal
      await oneSignalService.sendNotification(notification.message, notification.additionalData);

      // Mark as sent
      notification.isSent = true;
      this.scheduledNotifications.set(notification.id, notification);

      console.log(`OneSignalScheduler: Notification sent: ${notification.id}`);
    } catch (error) {
      console.error('OneSignalScheduler: Error sending notification:', error);
    }
  }

  /**
   * Send a test notification immediately
   */
  public async sendTestNotification(userSettings: UserNotificationSettings, message: string): Promise<void> {
    try {
      if (!oneSignalService.isOneSignalAvailable()) {
        console.log('OneSignalScheduler: OneSignal not available for test notification');
        return;
      }

      await oneSignalService.sendNotification(message, {
        day: '1',
        category: 'test',
        timeOfDay: 'day',
        notificationId: 'test',
        userId: userSettings.userId,
        testNotification: 'true'
      });

      console.log('OneSignalScheduler: Test notification sent');
    } catch (error) {
      console.error('OneSignalScheduler: Error sending test notification:', error);
      throw error;
    }
  }

  /**
   * Clear all scheduled notifications for a user
   */
  public clearUserNotifications(userId: string): void {
    try {
      const userNotifications = Array.from(this.scheduledNotifications.entries())
        .filter(([id, notification]) => notification.userId === userId);

      for (const [id] of userNotifications) {
        this.scheduledNotifications.delete(id);
      }

      console.log(`OneSignalScheduler: Cleared ${userNotifications.length} notifications for user ${userId}`);
    } catch (error) {
      console.error('OneSignalScheduler: Error clearing user notifications:', error);
    }
  }

  /**
   * Get statistics about scheduled notifications
   */
  public getNotificationStats(): {
    totalScheduled: number;
    totalSent: number;
    totalPending: number;
  } {
    const notifications = Array.from(this.scheduledNotifications.values());
    
    return {
      totalScheduled: notifications.length,
      totalSent: notifications.filter(n => n.isSent).length,
      totalPending: notifications.filter(n => !n.isSent).length
    };
  }

  /**
   * Check if notifications are enabled
   */
  public async areNotificationsEnabled(): Promise<boolean> {
    try {
      return await oneSignalService.getNotificationPermissionStatus();
    } catch (error) {
      console.error('OneSignalScheduler: Error checking notification permissions:', error);
      return false;
    }
  }

  /**
   * Stop the scheduler
   */
  public stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
    console.log('OneSignalScheduler: Stopped');
  }

  /**
   * Clean up old sent notifications
   */
  public cleanup(): void {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const notificationsToDelete: string[] = [];

      for (const [id, notification] of Array.from(this.scheduledNotifications.entries())) {
        if (notification.isSent && notification.scheduledTime < oneDayAgo) {
          notificationsToDelete.push(id);
        }
      }

      for (const id of notificationsToDelete) {
        this.scheduledNotifications.delete(id);
      }

      if (notificationsToDelete.length > 0) {
        console.log(`OneSignalScheduler: Cleaned up ${notificationsToDelete.length} old notifications`);
      }
    } catch (error) {
      console.error('OneSignalScheduler: Error cleaning up notifications:', error);
    }
  }
}

export default OneSignalScheduler.getInstance();

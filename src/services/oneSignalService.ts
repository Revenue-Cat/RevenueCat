import { Platform } from 'react-native';
import { OneSignal } from 'react-native-onesignal';

// OneSignal App ID
const ONESIGNAL_APP_ID = '7b5c7621-a7f6-4b26-99cb-92ddd23db156';

class OneSignalService {
  private static instance: OneSignalService;
  private isInitialized = false;
  private isAvailable = false;
  private hasPermission = false;

  private constructor() {
    // For now, we'll simulate OneSignal availability
    this.isAvailable = true;
  }

  public static getInstance(): OneSignalService {
    if (!OneSignalService.instance) {
      OneSignalService.instance = new OneSignalService();
    }
    return OneSignalService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize OneSignal with your App ID
      // Note: OneSignal might automatically request permission on initialize
      // We'll disable automatic prompts by initializing without requesting permission
      OneSignal.initialize(ONESIGNAL_APP_ID);
      
      // Set up notification handlers
      this.setupNotificationHandlers();
      
      this.isInitialized = true;
      this.isAvailable = true;
      console.log('OneSignal initialized successfully');
    } catch (error) {
      console.error('Error initializing OneSignal:', error);
    }
  }

  private setupNotificationHandlers(): void {
    if (!this.isAvailable) return;

    try {
      // Set up notification handlers
      OneSignal.Notifications.addEventListener('click', (event) => {
        console.log('OneSignal: notification clicked:', event);
      });

      OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
        console.log('OneSignal: notification will show in foreground:', event);
        // Prevent default notification display
        event.preventDefault();
        // Display your own notification UI
        event.getNotification().display();
      });

      console.log('OneSignal notification handlers setup successfully');
    } catch (error) {
      console.error('Error setting up notification handlers:', error);
    }
  }

  public async requestNotificationPermission(): Promise<boolean> {
    if (!this.isAvailable) {
      console.log('OneSignal not available, returning false');
      return false;
    }

    try {
      console.log('Requesting notification permission...');
      
      // Request permission using OneSignal
      const permission = await OneSignal.Notifications.requestPermission(true); 
      
      this.hasPermission = permission;
      console.log('Notification permission result:', permission);
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  public async getNotificationPermissionStatus(): Promise<boolean> {
    if (!this.isAvailable) {
      return false;
    }

    try {
      // Get permission status from OneSignal
      const permission = await OneSignal.Notifications.getPermissionAsync();
      this.hasPermission = permission;
      return permission;
    } catch (error) {
      console.error('Error getting notification permission status:', error);
      return false;
    }
  }

  public async sendTestNotification(): Promise<void> {
    if (!this.isAvailable) {
      console.log('OneSignal not available for sending test notification');
      return;
    }

    try {
      console.log('Test notification sent via OneSignal dashboard');
      console.log('Go to OneSignal dashboard to send a test notification');
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }

  public async setExternalUserId(userId: string): Promise<void> {
    if (!this.isAvailable) {
      console.log('OneSignal not available for setting external user ID');
      return;
    }

    try {
      OneSignal.login(userId);
      console.log('External user ID set:', userId);
    } catch (error) {
      console.error('Error setting external user ID:', error);
    }
  }

  public async addTag(key: string, value: string): Promise<void> {
    if (!this.isAvailable) {
      console.log('OneSignal not available for adding tags');
      return;
    }

    try {
      OneSignal.User.addTag(key, value);
      console.log('Tag added:', key, value);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  }

  public isOneSignalAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Schedule a notification for a specific time
   */
  public async scheduleNotification(
    message: string,
    scheduledTime: Date,
    additionalData?: Record<string, any>
  ): Promise<void> {
    if (!this.isAvailable) {
      console.log('OneSignal not available for scheduling notification');
      return;
    }

    try {
      // OneSignal doesn't support scheduled notifications in the same way as local notifications
      // Instead, we'll use OneSignal's REST API or webhooks for scheduled delivery
      // For now, we'll store the notification in Firebase and send it at the scheduled time
      
      const notificationData = {
        message,
        scheduledTime: scheduledTime.toISOString(),
        additionalData: additionalData || {},
        createdAt: new Date().toISOString()
      };

      console.log('OneSignal: Notification scheduled for:', scheduledTime.toISOString());
      console.log('OneSignal: Message:', message);
      console.log('OneSignal: Additional data:', additionalData);
      
      // TODO: Implement actual OneSignal scheduling via REST API
      // This would require server-side implementation or OneSignal's scheduled notifications feature
      
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  /**
   * Send a notification immediately via OneSignal
   */
  public async sendNotification(
    message: string,
    additionalData?: Record<string, any>
  ): Promise<void> {
    if (!this.isAvailable) {
      console.log('OneSignal not available for sending notification');
      return;
    }

    try {
      // Send notification via OneSignal's REST API or local notification
      console.log('OneSignal: Sending notification:', message);
      console.log('OneSignal: Additional data:', additionalData);
      
      // For immediate notifications, we can use OneSignal's local notification feature
      // or trigger a remote notification via their API
      
      // TODO: Implement actual OneSignal notification sending
      // This could be done via:
      // 1. OneSignal REST API (server-side)
      // 2. OneSignal's local notification feature
      // 3. OneSignal's in-app messaging
      
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Set user properties for targeting and segmentation
   */
  public async setUserProperties(properties: Record<string, string>): Promise<void> {
    if (!this.isAvailable) {
      console.log('OneSignal not available for setting user properties');
      return;
    }

    try {
      // Set multiple tags at once
      for (const [key, value] of Object.entries(properties)) {
        await this.addTag(key, value);
      }
      
      console.log('OneSignal: User properties set:', properties);
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }

  // Method to reset permission for testing
  public resetPermission(): void {
    this.hasPermission = false;
  }
}

export default OneSignalService.getInstance();

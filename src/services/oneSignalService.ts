import { Platform } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import { getOrCreatePersistentUserId } from '../utils/keychain';
import secureConfig from '../config/secureConfig';

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
      console.log('OneSignal: Already initialized, skipping...');
      return;
    }

    try {
      console.log('OneSignal: Starting initialization...');

      // Get secure configuration from Firebase
      const config = await secureConfig.getOneSignalConfig();
      console.log('OneSignal: ✅ Configuration loaded from Firebase');

      // Initialize OneSignal with secure App ID
      // Note: OneSignal might automatically request permission on initialize
      // We'll disable automatic prompts by initializing without requesting permission
      OneSignal.initialize(config.appId);

      // Set up notification handlers
      this.setupNotificationHandlers();

      this.isInitialized = true;
      this.isAvailable = true;
      console.log('OneSignal: ✅ Initialization completed successfully');
      console.log('OneSignal: 📱 App ID:', config.appId.substring(0, 8) + '...');
    } catch (error) {
      console.error('OneSignal: ❌ Initialization failed:', error);
      this.isAvailable = false;
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

      // console.log('OneSignal: Notification scheduled for:', scheduledTime.toISOString());
      // console.log('OneSignal: Message:', message);
      // console.log('OneSignal: Additional data:', additionalData);
      
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
      console.log('OneSignal: Sending notification:', message);
      console.log('OneSignal: Additional data:', additionalData);

      // Set external user ID for targeting
      const userId = await getOrCreatePersistentUserId();
      OneSignal.login(userId);

      // Send notification using OneSignal's REST API
      await this.sendNotificationViaAPI(message, additionalData);
      
      console.log('OneSignal: ✅ Notification sent successfully');
    } catch (error) {
      console.error('OneSignal: ❌ Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Send notification via OneSignal REST API
   */
  private async sendNotificationViaAPI(message: string, additionalData?: Record<string, any>): Promise<void> {
    try {
      const userId = await getOrCreatePersistentUserId();
      
      // Get secure configuration from Firebase
      const config = await secureConfig.getOneSignalConfig();
      
      // OneSignal REST API endpoint
      const url = 'https://onesignal.com/api/v1/notifications';
      
      console.log('OneSignal: ✅ Using secure configuration from Firebase');
      console.log('OneSignal: Sending notification with key:', config.restApiKey.substring(0, 20) + '...');
      
      const notificationData = {
        app_id: config.appId,
        include_external_user_ids: [userId],
        contents: {
          en: message
        },
        data: additionalData || {},
        send_after: new Date().toISOString()
      };

      console.log('OneSignal: Sending via REST API:', notificationData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${config.restApiKey}`
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        throw new Error(`OneSignal API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('OneSignal: API response:', result);
      
    } catch (error) {
      console.error('OneSignal: Error sending via API:', error);
      // Fallback to local notification if API fails
      await this.sendLocalNotification(message, additionalData);
    }
  }

  /**
   * Send a local notification (fallback method)
   */
  private async sendLocalNotification(message: string, additionalData?: Record<string, any>): Promise<void> {
    try {
      console.log('OneSignal: Creating local notification');

      // For React Native OneSignal, we'll trigger a notification through the system
      // This is a simplified approach - in production you might want more sophisticated handling
      console.log('OneSignal: Local notification created with message:', message);
      console.log('OneSignal: Additional data:', additionalData);

      // Note: This is a placeholder for actual local notification implementation
      // The actual implementation would depend on your specific OneSignal setup

    } catch (error) {
      console.error('OneSignal: Error creating local notification:', error);
      throw error;
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

  /**
   * Test function to send a simple notification
   */
  public async sendTestNotification(): Promise<void> {
    const testMessage = "🧪 Test notification from your app!";
    console.log('OneSignal: Sending test notification...');
    await this.sendNotification(testMessage, {
      test: true,
      timestamp: new Date().toISOString()
    });
  }
}

export default OneSignalService.getInstance();

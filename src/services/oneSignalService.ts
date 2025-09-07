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
      OneSignal.initialize(ONESIGNAL_APP_ID);
      OneSignal.Notifications.requestPermission(true);
      
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

  // Method to reset permission for testing
  public resetPermission(): void {
    this.hasPermission = false;
  }
}

export default OneSignalService.getInstance();

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
      console.log('OneSignal: App ID length:', config.appId.length);
      console.log('OneSignal: API Key length:', config.restApiKey.length);

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
   * Schedule a notification for a specific time using OneSignal REST API
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
      console.log('OneSignal: Scheduling notification for:', scheduledTime.toISOString());
      console.log('OneSignal: Message:', message);
      console.log('OneSignal: Additional data:', additionalData);

      // Use OneSignal REST API for scheduled notifications
      await this.scheduleNotificationViaAPI(message, scheduledTime, additionalData);

      console.log('OneSignal: ✅ Notification scheduled successfully for', scheduledTime.toISOString());
      
    } catch (error) {
      console.error('OneSignal: ❌ Error scheduling notification:', error);
      throw error;
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
      console.log('OneSignal: User ID for targeting:', userId);
      
      // Get secure configuration from Firebase
      const config = await secureConfig.getOneSignalConfig();
      console.log('OneSignal: App ID:', config.appId);
      console.log('OneSignal: API Key length:', config.restApiKey.length);
      
      // OneSignal REST API endpoint
      const url = 'https://onesignal.com/api/v1/notifications';
      
      console.log('OneSignal: ✅ Using secure configuration from Firebase');
  
      // Target specific user instead of all users
      const notificationData = {
        app_id: config.appId,
        // Target specific user by external user ID
        include_external_user_ids: [userId],
        contents: {
          en: message
        },
        data: additionalData || {},
        send_after: new Date().toISOString()
      };

      console.log('OneSignal: Sending via REST API:', JSON.stringify(notificationData, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${config.restApiKey}`
        },
        body: JSON.stringify(notificationData)
      });

      console.log('OneSignal: Response status:', response.status);
      console.log('OneSignal: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OneSignal: API error response:', errorText);
        throw new Error(`OneSignal API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('OneSignal: ✅ API response:', JSON.stringify(result, null, 2));
      
      if (result.id) {
        console.log('OneSignal: ✅ Notification sent successfully with ID:', result.id);
        console.log('OneSignal: 📱 Check your device for the notification!');
      } else {
        console.warn('OneSignal: ⚠️ No notification ID returned from API');
      }
      
    } catch (error) {
      console.error('OneSignal: ❌ Error sending via API:', error);
      console.error('OneSignal: Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
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
   * Schedule notification via OneSignal REST API
   */
  private async scheduleNotificationViaAPI(message: string, scheduledTime: Date, additionalData?: Record<string, any>): Promise<void> {
    try {
      const userId = await getOrCreatePersistentUserId();
      console.log('OneSignal: User ID:', userId);
      
      // Get secure configuration from Firebase
      const config = await secureConfig.getOneSignalConfig();
      console.log('OneSignal: App ID:', config.appId);
      console.log('OneSignal: API Key length:', config.restApiKey.length);
      
      // OneSignal REST API endpoint
      const url = 'https://onesignal.com/api/v1/notifications';
      
      console.log('OneSignal: ✅ Using secure configuration from Firebase');
      console.log('OneSignal: Scheduling notification with key:', config.restApiKey.substring(0, 20) + '...');
      
      const notificationData = {
        app_id: config.appId,
        // Send to all users by targeting all subscribed players
        included_segments: ['All'],
        contents: {
          en: message
        },
        data: additionalData || {},
        send_after: scheduledTime.toISOString() // Schedule for specific time
      };

      console.log('OneSignal: Scheduling via REST API:', JSON.stringify(notificationData, null, 2));
      console.log('OneSignal: Scheduled time:', scheduledTime.toISOString());
      console.log('OneSignal: Current time:', new Date().toISOString());

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${config.restApiKey}`
        },
        body: JSON.stringify(notificationData)
      });

      console.log('OneSignal: Response status:', response.status);
      console.log('OneSignal: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OneSignal: API error response:', errorText);
        throw new Error(`OneSignal API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('OneSignal: ✅ API response:', JSON.stringify(result, null, 2));
      
      if (result.id) {
        console.log('OneSignal: ✅ Notification scheduled successfully with ID:', result.id);
      } else {
        console.warn('OneSignal: ⚠️ No notification ID returned from API');
      }
      
    } catch (error) {
      console.error('OneSignal: ❌ Error scheduling via API:', error);
      console.error('OneSignal: Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      throw error;
    }
  }


  /**
   * Send a simple push notification directly via OneSignal REST API
   */
  public async sendSimplePushNotification(message: string): Promise<void> {
    try {
    
      const userId = await getOrCreatePersistentUserId();
      // Get secure configuration from Firebase
      const config = await secureConfig.getOneSignalConfig();
      
      // OneSignal REST API endpoint
      const url = 'https://onesignal.com/api/v1/notifications';
      
      const notificationData = {
        app_id: config.appId,
        // Send to all users by targeting all subscribed players
        included_segments: ['All'],
        contents: {
          en: message
        },
        data: {
          timestamp: new Date().toISOString(),
          source: 'app'
        }
      };

      const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${config.restApiKey}`
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OneSignal: 🔍 DEBUGGING - API error response:', errorText);
        console.error('OneSignal: 🔍 DEBUGGING - Full error details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        throw new Error(`OneSignal API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('OneSignal: 🔍 DEBUGGING - Full API response:', JSON.stringify(result, null, 2));
      
      if (result.id) {
        console.log('OneSignal: ✅ Notification sent successfully with ID:', result.id);
        console.log('OneSignal: 📱 Check your device for the notification!');
        console.log('OneSignal: 🔍 DEBUGGING - Notification details:', {
          id: result.id,
          recipients: result.recipients,
          external_id: result.external_id
        });
      } else {
        console.warn('OneSignal: ⚠️ No notification ID returned from API');
        console.warn('OneSignal: 🔍 DEBUGGING - Response structure:', Object.keys(result));
      }
      
    } catch (error) {
      console.error('OneSignal: ❌ Error sending simple push notification:', error);
      console.error('OneSignal: 🔍 DEBUGGING - Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack,
        name: (error as Error).name
      });
      throw error;
    }
  }

  /**
   * Test function to send an immediate notification for debugging
   */
  public async sendImmediateTestNotification(): Promise<void> {
    const testMessage = "🚨 IMMEDIATE TEST - This should appear right now!";
    console.log('OneSignal: Sending IMMEDIATE test notification for debugging...');
    
    try {
      // First check if OneSignal is properly initialized
      console.log('OneSignal: 🔍 Checking initialization status...');
      console.log('OneSignal: Available:', this.isAvailable);
      console.log('OneSignal: Initialized:', this.isInitialized);
      
      if (!this.isAvailable) {
        throw new Error('OneSignal is not available');
      }
      
      if (!this.isInitialized) {
        console.log('OneSignal: 🔄 OneSignal not initialized, initializing now...');
        await this.initialize();
      }
      
      // Check permissions
      console.log('OneSignal: 🔍 Checking notification permissions...');
      const hasPermission = await this.getNotificationPermissionStatus();
      console.log('OneSignal: Permission status:', hasPermission);
      
      if (!hasPermission) {
        console.log('OneSignal: 🔄 Requesting notification permission...');
        const permissionGranted = await this.requestNotificationPermission();
        console.log('OneSignal: Permission granted:', permissionGranted);
        
        if (!permissionGranted) {
          throw new Error('Notification permission not granted');
        }
      }
      
      // Set external user ID
      console.log('OneSignal: 🔍 Setting external user ID...');
      const userId = await getOrCreatePersistentUserId();
      await this.setExternalUserId(userId);
      console.log('OneSignal: External user ID set:', userId);
      
      // Use the simple push notification method
      await this.sendSimplePushNotification(testMessage);
      console.log('OneSignal: ✅ Immediate test notification sent');
    } catch (error) {
      console.error('OneSignal: ❌ Failed to send immediate test notification:', error);
      throw error;
    }
  }

  /**
   * Check OneSignal status and configuration
   */
  public async checkOneSignalStatus(): Promise<void> {
    try {
      console.log('OneSignal: 🔍 Checking OneSignal status...');
      
      // Check if OneSignal is available
      console.log('OneSignal: Available:', this.isAvailable);
      console.log('OneSignal: Initialized:', this.isInitialized);
      
      // Check permissions
      const permission = await this.getNotificationPermissionStatus();
      console.log('OneSignal: Permission status:', permission);
      
      // Check user ID
      const userId = await getOrCreatePersistentUserId();
      console.log('OneSignal: User ID:', userId);
      
      // Check configuration
      try {
        const config = await secureConfig.getOneSignalConfig();
        console.log('OneSignal: App ID:', config.appId);
        console.log('OneSignal: API Key length:', config.restApiKey.length);
        console.log('OneSignal: ✅ Configuration loaded successfully');
      } catch (error) {
        console.error('OneSignal: ❌ Configuration error:', error);
        throw new Error('OneSignal configuration failed: ' + (error as Error).message);
      }
      
      if (!permission) {
        console.warn('OneSignal: ⚠️ Notification permission not granted');
        console.log('OneSignal: Requesting permission...');
        const newPermission = await this.requestNotificationPermission();
        console.log('OneSignal: Permission after request:', newPermission);
      }
      
      console.log('OneSignal: ✅ Status check complete');
    } catch (error) {
      console.error('OneSignal: ❌ Status check failed:', error);
      throw error;
    }
  }

  /**
   * Test OneSignal configuration by making a simple API call
   */
  public async testOneSignalConfiguration(): Promise<void> {
    try {
      console.log('OneSignal: 🧪 Testing OneSignal configuration...');
      
      const userId = await getOrCreatePersistentUserId();
      const config = await secureConfig.getOneSignalConfig();
      
      // Test with a simple API call to get user info
      const url = `https://onesignal.com/api/v1/players?app_id=${config.appId}&external_user_id=${userId}`;
      
      console.log('OneSignal: 🧪 Testing with URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${config.restApiKey}`
        }
      });
      
      console.log('OneSignal: 🧪 Test response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('OneSignal: 🧪 Test response:', JSON.stringify(result, null, 2));
        console.log('OneSignal: ✅ Configuration test successful');
      } else {
        const errorText = await response.text();
        console.error('OneSignal: 🧪 Test failed:', errorText);
        throw new Error(`Configuration test failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
    } catch (error) {
      console.error('OneSignal: ❌ Configuration test failed:', error);
      throw error;
    }
  }

  /**
   * Test basic OneSignal connectivity without user targeting
   */
  public async testBasicOneSignalConnectivity(): Promise<void> {
    try {
      console.log('OneSignal: 🌐 Testing basic OneSignal connectivity...');
      
      const config = await secureConfig.getOneSignalConfig();
      
      // Test with a simple API call to get app info
      const url = `https://onesignal.com/api/v1/apps/${config.appId}`;
      
      console.log('OneSignal: 🌐 Testing with URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${config.restApiKey}`
        }
      });
      
      console.log('OneSignal: 🌐 Test response status:', response.status);
      console.log('OneSignal: 🌐 Test response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const result = await response.json();
        console.log('OneSignal: 🌐 Test response:', JSON.stringify(result, null, 2));
        console.log('OneSignal: ✅ Basic connectivity test successful');
      } else {
        const errorText = await response.text();
        console.error('OneSignal: 🌐 Test failed:', errorText);
        console.error('OneSignal: 🌐 Full error details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        throw new Error(`Basic connectivity test failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
    } catch (error) {
      console.error('OneSignal: ❌ Basic connectivity test failed:', error);
      throw error;
    }
  }

  /**
   * Test if the current user/device is registered with OneSignal
   */
  public async testUserRegistration(): Promise<void> {
    try {
      console.log('OneSignal: 👤 Testing user registration with OneSignal...');
      
      const userId = await getOrCreatePersistentUserId();
      const config = await secureConfig.getOneSignalConfig();
      
      // Test with a simple API call to get user info
      const url = `https://onesignal.com/api/v1/players?app_id=${config.appId}&external_user_id=${userId}`;
      
      console.log('OneSignal: 👤 Testing user registration with URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${config.restApiKey}`
        }
      });
      
      console.log('OneSignal: 👤 User registration test response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('OneSignal: 👤 User registration test response:', JSON.stringify(result, null, 2));
        
        if (result.players && result.players.length > 0) {
          console.log('OneSignal: ✅ User is registered with OneSignal');
          console.log('OneSignal: 👤 User details:', result.players[0]);
        } else {
          console.warn('OneSignal: ⚠️ User not found in OneSignal - this might be why notifications are not working');
          console.log('OneSignal: 👤 This could mean:');
          console.log('OneSignal: 👤 1. Device not registered with OneSignal');
          console.log('OneSignal: 👤 2. External user ID not set correctly');
          console.log('OneSignal: 👤 3. App not properly configured');
        }
      } else {
        const errorText = await response.text();
        console.error('OneSignal: 👤 User registration test failed:', errorText);
        throw new Error(`User registration test failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
    } catch (error) {
      console.error('OneSignal: ❌ User registration test failed:', error);
      throw error;
    }
  }

  /**
   * Test function to schedule a notification in 5 minutes
   */
  public async sendTestScheduledNotification(): Promise<void> {
    const testMessage = "🚭 QuitQly Test - Scheduled notification in 5 minutes! Your buddy is here to support you! 💪";
    const scheduledTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    
    console.log('OneSignal: Scheduling 5-minute test notification for:', scheduledTime.toISOString());
    console.log('OneSignal: Current time:', new Date().toISOString());
    console.log('OneSignal: Notification will appear in 5 minutes at:', scheduledTime.toLocaleString());
    
    await this.scheduleNotification(testMessage, scheduledTime, {
      test: true,
      scheduled: true,
      timestamp: scheduledTime.toISOString(),
      testType: '5min'
    });
    
    console.log('OneSignal: ✅ 5-minute test scheduled notification created');
    console.log('OneSignal: 📱 You should see this notification in 5 minutes, even if the app is closed!');
  }

  /**
   * Test function to schedule a notification in 3 minutes
   */
  public async sendTestScheduledNotification3Min(): Promise<void> {
    const testMessage = "⏰ QuitQly Test - Scheduled notification in 3 minutes! Your buddy is here to support you! 💪";
    const scheduledTime = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes from now
    
    console.log('OneSignal: Scheduling 3-minute test notification for:', scheduledTime.toISOString());
    console.log('OneSignal: Current time:', new Date().toISOString());
    console.log('OneSignal: Notification will appear in 3 minutes at:', scheduledTime.toLocaleString());
    
    await this.scheduleNotification(testMessage, scheduledTime, {
      test: true,
      scheduled: true,
      timestamp: scheduledTime.toISOString(),
      testType: '3min'
    });
    
    console.log('OneSignal: ✅ 3-minute test scheduled notification created');
    console.log('OneSignal: 📱 You should see this notification in 3 minutes, even if the app is closed!');
  }

  /**
   * Test function to send a notification from NOTIFICATION_DATA
   */
  public async sendTestNotificationFromData(selectedBuddyId?: string): Promise<void> {
    // Import the notification data and helper functions
    const { NOTIFICATION_DATA, replacePlaceholders, getBuddyNameForNotification } = require('../data/notificationData');
    
    // Find the test notification from the data
    const testNotification = NOTIFICATION_DATA.find((n: any) => n.id === 'test_notification_from_data');
    
    if (!testNotification) {
      throw new Error('Test notification not found in NOTIFICATION_DATA');
    }
    
    // Get the message in English (you can change this to user's language)
    const baseMessage = testNotification.messages.en;
    
    // Get the actual buddy name (use the selected buddy ID if provided)
    const buddyName = getBuddyNameForNotification(selectedBuddyId || 'default-buddy', 'Your Buddy');
    
    // Replace the {{buddy_name}} placeholder with the actual buddy name
    const processedMessage = replacePlaceholders(baseMessage, buddyName);
    
    console.log('OneSignal: Sending test notification from NOTIFICATION_DATA...');
    console.log('OneSignal: Base message:', baseMessage);
    console.log('OneSignal: Selected buddy ID:', selectedBuddyId);
    console.log('OneSignal: Buddy name:', buddyName);
    console.log('OneSignal: Processed message:', processedMessage);
    
    await this.sendSimplePushNotification(processedMessage);
    
    console.log('OneSignal: ✅ Test notification from NOTIFICATION_DATA sent');
    console.log('OneSignal: 📱 You should see this notification RIGHT NOW!');
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
      console.log('OneSignal: Adding scheduled notification to Firebase...');
      console.log('OneSignal: User ID:', userId);
      console.log('OneSignal: Scheduled time:', scheduledTime.toISOString());
      console.log('OneSignal: Message:', message);
      
      // Import Firebase functions
      const { doc, setDoc, Timestamp } = require('firebase/firestore');
      const { db } = require('../../firebaseConfig');
      
      // Create the scheduled notification document
      const notificationId = `${userId}_scheduled_${Date.now()}`;
      const scheduledNotification = {
        id: notificationId,
        userId: userId,
        notificationId: 'manual_scheduled',
        day: day,
        timeOfDay: timeOfDay,
        scheduledTime: scheduledTime,
        message: message,
        category: category,
        isSent: false,
        createdAt: new Date()
      };
      
      console.log('OneSignal: Scheduled notification data:', JSON.stringify(scheduledNotification, null, 2));
      
      // Save to Firebase
      const notificationRef = doc(db, 'scheduledNotifications', notificationId);
      await setDoc(notificationRef, {
        ...scheduledNotification,
        scheduledTime: Timestamp.fromDate(scheduledNotification.scheduledTime),
        createdAt: Timestamp.fromDate(scheduledNotification.createdAt)
      });
      
      console.log('OneSignal: ✅ Scheduled notification added to Firebase');
      console.log('OneSignal: 📱 Notification will be sent at:', scheduledTime.toLocaleString());
      
    } catch (error) {
      console.error('OneSignal: ❌ Error adding scheduled notification to Firebase:', error);
      throw error;
    }
  }
}

export default OneSignalService.getInstance();

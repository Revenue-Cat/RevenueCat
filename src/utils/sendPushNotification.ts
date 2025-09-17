import oneSignalService from '../services/oneSignalService';

/**
 * Send a push notification directly to OneSignal
 * @param message - The notification message to send
 * @param additionalData - Optional additional data to include
 */
export const sendPushNotification = async (
  message: string, 
  additionalData?: Record<string, any>
): Promise<void> => {
  try {
    console.log('📱 Sending push notification:', message);
    
    // Send notification via OneSignal
    await oneSignalService.sendNotification(message, {
      type: 'direct',
      timestamp: new Date().toISOString(),
      source: 'utility',
      ...additionalData
    });
    
    console.log('✅ Push notification sent successfully');
  } catch (error) {
    console.error('❌ Failed to send push notification:', error);
    throw error;
  }
};

/**
 * Send a test push notification
 */
export const sendTestPushNotification = async (): Promise<void> => {
  const testMessage = "🧪 Test notification from your app!";
  await sendPushNotification(testMessage, { test: true });
};

/**
 * Send a custom push notification with user data
 */
export const sendCustomPushNotification = async (
  message: string,
  userId?: string,
  customData?: Record<string, any>
): Promise<void> => {
  await sendPushNotification(message, {
    userId,
    custom: true,
    ...customData
  });
};

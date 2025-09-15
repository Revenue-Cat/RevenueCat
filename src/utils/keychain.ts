// Import polyfill first
import 'react-native-get-random-values';
import DeviceInfo from 'react-native-device-info';

export async function getOrCreatePersistentUserId() {
  try {
    const id = await DeviceInfo.getUniqueId();

    return id; // Return generated ID
  } catch (error) {
    console.error('Error managing persistent user ID:', error);
    // Fallback: Return temporary ID (won't persist)
    return `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }
}
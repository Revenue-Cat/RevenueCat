// Import polyfill first
import 'react-native-get-random-values';
import Keychain from 'react-native-keychain';
import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'persistent_user_id';

export async function getOrCreatePersistentUserId() {
  try {
    // Check for existing ID in Keychain
    const credentials = await Keychain.getGenericPassword({
      service: 'quitqly.com.user', // Unique service name for your app
    });

    if (credentials && credentials.password) {
      console.log('Retrieved existing ID:', credentials.password);
      return credentials.password; // Return stored ID
    }

    // No ID found: Generate new UUID
    const newUserId = uuidv4();
    console.log('Generated new ID:', newUserId);

    // Store new ID in Keychain
    await Keychain.setGenericPassword('user_id', newUserId, {
      service: 'quitqly.com.user',
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY, // Optional: Add biometrics
    });

    return newUserId; // Return generated ID
  } catch (error) {
    console.error('Error managing persistent user ID:', error);
    // Fallback: Return temporary ID (won't persist)
    return `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }
}
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export interface AppConfig {
  oneSignalAppId: string;
  oneSignalRestApiKey: string;
  lastUpdated: Date;
}

class SecureConfigService {
  private static instance: SecureConfigService;
  private config: AppConfig | null = null;
  private lastFetch: Date | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  private constructor() {}

  public static getInstance(): SecureConfigService {
    if (!SecureConfigService.instance) {
      SecureConfigService.instance = new SecureConfigService();
    }
    return SecureConfigService.instance;
  }

  /**
   * Get OneSignal configuration from Firebase
   * Uses caching to avoid frequent Firebase calls
   */
  public async getOneSignalConfig(): Promise<{
    appId: string;
    restApiKey: string;
  }> {
    try {
      // Check if we have cached config that's still valid
      if (this.config && this.lastFetch && 
          (Date.now() - this.lastFetch.getTime()) < this.CACHE_DURATION) {
        console.log('SecureConfig: Using cached OneSignal configuration');
        return {
          appId: this.config.oneSignalAppId,
          restApiKey: this.config.oneSignalRestApiKey
        };
      }

      console.log('SecureConfig: Fetching OneSignal configuration from Firebase...');
      
      // Fetch from Firebase
      const configRef = doc(db, 'appConfig', 'oneSignal');
      const configSnap = await getDoc(configRef);

      if (!configSnap.exists()) {
        throw new Error('OneSignal configuration not found in Firebase');
      }

      const data = configSnap.data();
      this.config = {
        oneSignalAppId: data.oneSignalAppId,
        oneSignalRestApiKey: data.oneSignalRestApiKey,
        lastUpdated: data.lastUpdated?.toDate() || new Date()
      };

      this.lastFetch = new Date();
      
      console.log('SecureConfig: ✅ OneSignal configuration loaded successfully');
      console.log('SecureConfig: App ID:', this.config.oneSignalAppId.substring(0, 8) + '...');
      console.log('SecureConfig: API Key:', this.config.oneSignalRestApiKey.substring(0, 20) + '...');

      return {
        appId: this.config.oneSignalAppId,
        restApiKey: this.config.oneSignalRestApiKey
      };

    } catch (error) {
      console.error('SecureConfig: ❌ Failed to load OneSignal configuration:', error);
      
      // Fallback to environment variables or throw error
      const fallbackAppId = process.env.ONESIGNAL_APP_ID;
      const fallbackApiKey = process.env.ONESIGNAL_REST_API_KEY;
      
      if (fallbackAppId && fallbackApiKey) {
        console.log('SecureConfig: Using fallback environment variables');
        return {
          appId: fallbackAppId,
          restApiKey: fallbackApiKey
        };
      }
      
      throw new Error(`Failed to load OneSignal configuration: ${(error as Error).message}`);
    }
  }

  /**
   * Clear cached configuration (useful for testing or when config changes)
   */
  public clearCache(): void {
    this.config = null;
    this.lastFetch = null;
    console.log('SecureConfig: Cache cleared');
  }

  /**
   * Check if configuration is available
   */
  public isConfigAvailable(): boolean {
    return this.config !== null;
  }
}

export default SecureConfigService.getInstance();

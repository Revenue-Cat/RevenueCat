import { getLocales } from 'expo-localization';

export type SupportedLanguage = 'en' | 'es' | 'uk' | 'fr';

/**
 * Get the system language and map it to a supported language
 * @returns The supported language code or 'en' as fallback
 */
export async function getSystemLanguage(): Promise<SupportedLanguage> {
  try {
    // Get the system locale using expo-localization
    const locales = getLocales();
    const systemLocale = locales[0]?.languageTag || 'en';
    
    // Extract language code (first 2 characters)
    const languageCode = systemLocale.split('_')[0].split('-')[0].toLowerCase();
    
    // Map system language to supported languages
    switch (languageCode) {
      case 'es':
        return 'es';
      case 'uk':
      case 'ua': // Ukrainian can be 'ua' in some systems
        return 'uk';
      case 'fr':
        return 'fr';
      case 'en':
      default:
        return 'en';
    }
  } catch (error) {
    console.log('Error getting system language:', error);
    return 'en'; // Fallback to English
  }
}

/**
 * Get the system language synchronously (for cases where async is not possible)
 * @returns The supported language code or 'en' as fallback
 */
export function getSystemLanguageSync(): SupportedLanguage {
  try {
    // Get the system locale using expo-localization
    const locales = getLocales();
    const systemLocale = locales[0]?.languageTag || 'en';
    
    // Extract language code (first 2 characters)
    const languageCode = systemLocale.split('_')[0].split('-')[0].toLowerCase();
    
    // Map system language to supported languages
    switch (languageCode) {
      case 'es':
        return 'es';
      case 'uk':
      case 'ua': // Ukrainian can be 'ua' in some systems
        return 'uk';
      case 'fr':
        return 'fr';
      case 'en':
      default:
        return 'en';
    }
  } catch (error) {
    console.log('Error getting system language sync:', error);
    return 'en'; // Fallback to English
  }
}

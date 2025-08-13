import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface WelcomeProps {
  onNext: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const languages = [
    { code: 'en', name: t('languages.english'), flag: '🇺🇸' },
    { code: 'es', name: t('languages.spanish'), flag: '🇪🇸' },
    { code: 'uk', name: t('languages.ukrainian'), flag: '🇺🇦' },
  ];

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as 'en' | 'es' | 'uk');
    setShowLanguageModal(false);
  };

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
      <View className="flex-1 items-center justify-center px-6 py-16">
        {/* Theme Toggle Button */}
        <Pressable
          className={`absolute top-16 right-6 p-3 rounded-full ${isDark ? 'bg-dark-surface' : 'bg-light-surface'}`}
          onPress={toggleTheme}
        >
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={24} 
            color={isDark ? '#f1f5f9' : '#1f2937'} 
          />
        </Pressable>

        {/* Header */}
        <View className="items-center mb-16">
          <Text className={`text-3xl font-bold text-black mb-3 text-center ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            {t('welcome.title')}
          </Text>
          <Text className={`text-base text-gray-600 text-center leading-6 px-5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            {t('welcome.subtitle')}
          </Text>
          
          {/* Language Dropdown */}
          <Pressable
            className="mt-6 px-4 py-2 rounded-full bg-indigo-50 flex-row items-center"
            onPress={() => setShowLanguageModal(true)}
          >
            <View className="w-6 h-6 rounded-full items-center justify-center overflow-hidden">
              <Text className="text-base" style={{ transform: [{ scale: 1.2 }] }}>{currentLanguage?.flag}</Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#6b7280" />
          </Pressable>
        </View>

        {/* Placeholder for illustration */}
        <View
          className={`rounded-3xl mb-16 items-center justify-center ${isDark ? 'bg-dark-surface' : 'bg-light-surface'}`}
          style={{ width: width * 0.8, height: 400 }}
        >
          <Text className="text-xl">Image here</Text>
        </View>

        {/* CTA Button */}
        <Pressable
          className="rounded-2xl px-6 py-4 items-center justify-center flex-row bg-indigo-600"
          onPress={onNext}
        >
          <Text className="font-semibold text-xl mr-2 text-white">
            {t('setup.next')}
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color="#ffffff" 
          />
        </Pressable>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className={`${isDark ? 'bg-dark-background' : 'bg-light-background'} rounded-t-3xl max-h-96`}>
            <View className="px-5 pt-6 pb-10">
              <Text className={`text-lg font-bold text-center mb-6 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                {t('welcome.selectLanguage')}
              </Text>
              
              <View className="gap-3">
                {languages.map((lang) => (
                  <Pressable
                    key={lang.code}
                    className={`w-11/12 h-14 rounded-xl flex-row justify-between items-center px-5 self-center ${
                      lang.code === language 
                        ? (isDark ? 'bg-dark-surface' : 'bg-gray-200') 
                        : (isDark ? 'bg-dark-surface' : 'bg-gray-100')
                    }`}
                    onPress={() => handleLanguageSelect(lang.code)}
                  >
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-full items-center justify-center overflow-hidden mr-3">
                        <Text className="text-xl" style={{ transform: [{ scale: 1.3 }] }}>{lang.flag}</Text>
                      </View>
                      <Text className={`text-base font-medium ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                        {lang.name}
                      </Text>
                    </View>
                    {lang.code === language && (
                      <Ionicons 
                        name="checkmark-circle" 
                        size={24} 
                        color={isDark ? '#0f172a' : '#000000'} 
                      />
                    )}
                  </Pressable>
                ))}
              </View>
              
              <Pressable 
                className={`w-15 h-15 rounded-full justify-center items-center self-center mt-6 ${
                  isDark ? 'bg-dark-surface' : 'bg-gray-100'
                }`} 
                onPress={() => setShowLanguageModal(false)}
              >
                <Text className={`text-2xl font-bold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>✕</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Welcome; 
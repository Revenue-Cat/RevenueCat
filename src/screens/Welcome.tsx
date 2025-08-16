import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import FlagEn from '../assets/icons/flag-en.svg';
import FlagEs from '../assets/icons/flag-es.svg';
import FlagUk from '../assets/icons/flag-uk.svg';
import SlideModal from '../components/SlideModal';

interface WelcomeProps {
  onNext: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
  const { theme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const languages = [
    { code: 'en', name: t('languages.english'), flag: FlagEn },
    { code: 'es', name: t('languages.spanish'), flag: FlagEs },
    { code: 'uk', name: t('languages.ukrainian'), flag: FlagUk },
  ];

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as 'en' | 'es' | 'uk');
    setShowLanguageModal(false);
  };

  const currentLanguage = languages.find(lang => lang.code === language);

    return (
    <View className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>

      <ScrollView className="flex-1 px-6 pt-16">

        {/* Header */}
        <View className="items-center mb-9">
          <Text className={`text-2xl font-bold mb-3 text-center ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
            {t('welcome.title')}
          </Text>
          <Text className={`text-center font-medium leading-6 px-5 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            {t('welcome.subtitle')}
          </Text>
          
          {/* Language Dropdown */}
          <Pressable
            className={`mt-6 p-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-indigo-50'} flex-row items-center justify-between`}
            onPress={() => setShowLanguageModal(true)}
          >
            <View className="w-6 h-6 mr-2 rounded-full items-center justify-center overflow-hidden">
              {currentLanguage?.flag && <currentLanguage.flag width={24} height={24} />}
            </View>
            <Ionicons name="chevron-down" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Placeholder for illustration */}
        <View className="items-center justify-center mb-8">
          <Image source={require('../assets/icons/welcome.png')} />
        </View>
        
        {/* Will you quit text */}
        <Text className={`text-3xl font-bold text-center mb-16 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
          {t('welcome.willYouQuit')}
        </Text>
      </ScrollView>

      {/* CTA Button - Fixed at bottom */}
      <View className="px-6 pb-8">
        <Pressable
          className="rounded-2xl px-6 py-4 items-center justify-center flex-row bg-indigo-600"
          onPress={onNext}
        >
          <Text className="font-semibold text-xl mr-2 text-white">
            {t('welcome.ctaButton')}
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color="#ffffff" 
          />
        </Pressable>
      </View>

      {/* Language Selection Modal */}
      <SlideModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title={t('welcome.selectLanguage')}
        showCloseButton={false}
      >
        <View className="gap-4">
          {languages.map((lang) => (
            <Pressable
              key={lang.code}
              className={`w-11/12 h-16 rounded-3xl flex-row justify-between items-center px-5 self-center 
                ${lang.code === language ? 'font-bold' : 'font-medium'} 
                ${lang.code === language 
                  ? (isDark ? 'bg-slate-600' : 'bg-indigo-100') 
                  : (isDark ? 'bg-slate-700' : 'bg-indigo-50')
              }`}
              onPress={() => handleLanguageSelect(lang.code)}
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full items-center justify-center overflow-hidden mr-3">
                  <lang.flag width={32} height={21} />
                </View>
                <Text className={`text-base font-medium ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
                  {lang.name}
                </Text>
              </View>
              {lang.code === language && (
                <Ionicons 
                  name="checkmark" 
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
          <Text className={`text-2xl rounded-2xl px-4 py-2 font-bold ${isDark ? 'text-slate-50 bg-slate-700' : 'text-indigo-900 bg-indigo-50'}`}>✕</Text>
        </Pressable>
      </SlideModal>
    </View>
  );
};

export default Welcome; 
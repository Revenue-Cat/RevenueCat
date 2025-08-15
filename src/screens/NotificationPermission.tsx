import React from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface NotificationPermissionProps {
  onNext: () => void;
}

const NotificationPermission: React.FC<NotificationPermissionProps> = ({ onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
      <View className="flex-1 items-center justify-center px-6 py-16">
        {/* Header */}
        <View className="items-center mb-12">
          <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
            {t('notificationPermission.title')}
          </Text>
          <Text className={`text-base text-center leading-6 px-5 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            {t('notificationPermission.subtitle')}
          </Text>
        </View>

        {/* Notification Icon */}
        <View className={`w-38 h-38 rounded-full mb-12 items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-indigo-50'}`}>
          <Ionicons 
            name="notifications-outline" 
            size={120} 
            color={isDark ? '#f1f5f9' : '#1e1b4b'} 
          />
        </View>

        {/* Benefits */}
        <View className="mb-12 gap-4">
          <View className="flex-row items-center gap-3">
            <Ionicons 
              name="checkmark" 
              size={24} 
              color="#4f46e5" 
            />
            <Text className={`text-base ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
              {t('notificationPermission.benefits.motivation')}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Ionicons 
              name="checkmark" 
              size={24} 
              color="#4f46e5" 
            />
            <Text className={`text-base ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
              {t('notificationPermission.benefits.milestones')}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Ionicons 
              name="checkmark" 
              size={24} 
              color="#4f46e5" 
            />
            <Text className={`text-base ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
              {t('notificationPermission.benefits.goals')}
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable 
          className="flex-row items-center justify-between px-6 py-4 rounded-2xl w-4/5 h-14 mb-4 bg-indigo-600"
          onPress={onNext}
        >
          <Text className="text-xl font-semibold text-white">
            {t('notificationPermission.enable')}
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color="#ffffff" 
          />
        </Pressable>

        {/* Skip Option */}
        <Pressable className="py-3" onPress={onNext}>
          <Text className={`text-base underline ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            {t('notificationPermission.skip')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NotificationPermission; 
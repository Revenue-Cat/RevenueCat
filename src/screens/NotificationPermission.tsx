import React from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface NotificationPermissionProps {
  onNext: () => void;
}

const NotificationPermission: React.FC<NotificationPermissionProps> = ({ onNext }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
      <View className="flex-1 items-center justify-center px-6 py-16">
        {/* Header */}
        <View className="items-center mb-12">
          <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            Enable Notifications
          </Text>
          <Text className={`text-base text-center leading-6 px-5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            We'll send you reminders to stay on track and celebrate your progress.
          </Text>
        </View>

        {/* Notification Icon */}
        <View className={`w-38 h-38 rounded-full mb-12 items-center justify-center ${isDark ? 'bg-dark-surface' : 'bg-gray-100'}`}>
          <Ionicons 
            name="notifications-outline" 
            size={120} 
            color={isDark ? '#f1f5f9' : '#000000'} 
          />
        </View>

        {/* Benefits */}
        <View className="mb-12 gap-4">
          <View className="flex-row items-center gap-3">
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={isDark ? '#f1f5f9' : '#000000'} 
            />
            <Text className={`text-base ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
              Daily motivation reminders
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={isDark ? '#f1f5f9' : '#000000'} 
            />
            <Text className={`text-base ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
              Celebrate your milestones
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={isDark ? '#f1f5f9' : '#000000'} 
            />
            <Text className={`text-base ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
              Stay on track with your goals
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable 
          className={`flex-row items-center justify-between px-6 py-4 rounded-2xl w-4/5 h-14 mb-4 ${isDark ? 'bg-dark-accent' : 'bg-light-primary'}`}
          onPress={onNext}
        >
          <Text className={`text-xl font-semibold ${isDark ? 'text-dark-background' : 'text-light-background'}`}>
            Enable Notifications
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color={isDark ? '#0f172a' : '#ffffff'} 
          />
        </Pressable>

        {/* Skip Option */}
        <Pressable className="py-3" onPress={onNext}>
          <Text className={`text-base underline ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            Skip for now
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NotificationPermission; 
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

interface WelcomeProps {
  onNext: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
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
          <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            Welcome to QuitQly!
          </Text>
          <Text className={`text-base text-center leading-6 px-5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            Your friendly guide to quitting smoking — one small step at a time.
          </Text>
        </View>

        {/* Placeholder for illustration */}
        <View
          className={`rounded-3xl mb-16 items-center justify-center ${isDark ? 'bg-dark-surface' : 'bg-light-surface'}`}
          style={{ width: width * 0.8, height: 400 }}
        >
          <Text className="text-6xl">🚭</Text>
        </View>

        {/* CTA Button */}
        <Pressable
          className={`rounded-2xl px-6 py-4 items-center justify-center flex-row ${isDark ? 'bg-dark-accent' : 'bg-light-primary'}`}
          style={{ width: width * 0.8, height: 56 }}
          onPress={onNext}
        >
          <Text className={`font-semibold text-xl mr-2 ${isDark ? 'text-dark-background' : 'text-light-background'}`}>
            Let's start
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color={isDark ? '#0f172a' : '#ffffff'} 
          />
        </Pressable>
      </View>
    </View>
  );
};

export default Welcome; 
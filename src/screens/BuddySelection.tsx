import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface BuddySelectionProps {
  onNext: () => void;
}

const BuddySelection: React.FC<BuddySelectionProps> = ({ onNext }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [selectedBuddy, setSelectedBuddy] = useState<string>('capybara');

  const buddies = [
    { id: 'capybara', emoji: '🦫', name: 'Chill Capybara', description: 'Relaxed and supportive' },
    { id: 'koala', emoji: '🐨', name: 'Zen Koala', description: 'Calm and peaceful' },
    { id: 'sloth', emoji: '🦥', name: 'Slow Sloth', description: 'Patient and steady' },
    { id: 'penguin', emoji: '🐧', name: 'Cool Penguin', description: 'Cool and collected' },
    { id: 'panda', emoji: '🐼', name: 'Panda Bear', description: 'Gentle and caring' },
    { id: 'owl', emoji: '🦉', name: 'Wise Owl', description: 'Smart and insightful' },
  ];

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40 }}>
        {/* Header */}
        <View className="items-center mb-8">
          <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            Choose your buddy
          </Text>
          <Text className={`text-base text-center leading-6 px-5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            Pick a character to accompany you on your quitting journey.
          </Text>
        </View>

        {/* Buddy Selection */}
        <View className="gap-4 mb-8">
          {buddies.map((buddy) => (
            <Pressable
              key={buddy.id}
              className={`w-11/12 rounded-2xl p-5 items-center self-center relative ${
                selectedBuddy === buddy.id 
                  ? (isDark ? 'bg-dark-accent border-2 border-dark-accent' : 'bg-gray-200 border-2 border-light-primary') 
                  : (isDark ? 'bg-dark-surface' : 'bg-gray-100')
              }`}
              onPress={() => setSelectedBuddy(buddy.id)}
            >
              <Text className="text-5xl mb-3">{buddy.emoji}</Text>
              <Text className={`text-lg font-bold mb-1 text-center ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                {buddy.name}
              </Text>
              <Text className={`text-sm text-center ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                {buddy.description}
              </Text>
              {selectedBuddy === buddy.id && (
                <View className="absolute top-3 right-3">
                  <Ionicons 
                    name="checkmark-circle" 
                    size={24} 
                    color={isDark ? '#0f172a' : '#000000'} 
                  />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Next Button */}
        <View className="items-center">
          <Pressable 
            className={`flex-row items-center justify-between px-6 py-4 rounded-2xl w-4/5 h-14 ${isDark ? 'bg-dark-accent' : 'bg-light-primary'}`}
            onPress={onNext}
          >
            <Text className={`text-lg font-semibold ${isDark ? 'text-dark-background' : 'text-light-background'}`}>
              Next
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={isDark ? '#0f172a' : '#ffffff'} 
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default BuddySelection; 
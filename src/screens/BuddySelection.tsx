import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface BuddySelectionProps {
  onNext: () => void;
}

const BuddySelection: React.FC<BuddySelectionProps> = ({ onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  
  const [selectedBuddy, setSelectedBuddy] = useState<string>('capybara');

  const buddies = [
    { id: 'capybara', emoji: '🦫', name: t('buddySelection.buddies.capybara.name'), description: t('buddySelection.buddies.capybara.description') },
    { id: 'koala', emoji: '🐨', name: t('buddySelection.buddies.koala.name'), description: t('buddySelection.buddies.koala.description') },
    { id: 'sloth', emoji: '🦥', name: t('buddySelection.buddies.sloth.name'), description: t('buddySelection.buddies.sloth.description') },
    { id: 'penguin', emoji: '🐧', name: t('buddySelection.buddies.penguin.name'), description: t('buddySelection.buddies.penguin.description') },
    { id: 'panda', emoji: '🐼', name: t('buddySelection.buddies.panda.name'), description: t('buddySelection.buddies.panda.description') },
    { id: 'owl', emoji: '🦉', name: t('buddySelection.buddies.owl.name'), description: t('buddySelection.buddies.owl.description') },
  ];

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40 }}>
        {/* Header */}
        <View className="items-center mb-8">
          <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
            {t('buddySelection.title')}
          </Text>
          <Text className={`text-base text-center leading-6 px-5 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            {t('buddySelection.subtitle')}
          </Text>
        </View>

        {/* Buddy Selection */}
        <View className="gap-4 mb-8">
          {buddies.map((buddy) => (
            <Pressable
              key={buddy.id}
              className={`w-11/12 rounded-2xl p-5 items-center self-center relative ${
                selectedBuddy === buddy.id 
                  ? (isDark ? 'bg-slate-600 border-2 border-indigo-600' : 'bg-indigo-100 border-2 border-indigo-600') 
                  : (isDark ? 'bg-slate-700' : 'bg-indigo-50')
              }`}
              onPress={() => setSelectedBuddy(buddy.id)}
            >
              <Text className="text-5xl mb-3">{buddy.emoji}</Text>
              <Text className={`text-lg font-bold mb-1 text-center ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
                {buddy.name}
              </Text>
              <Text className={`text-sm text-center ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                {buddy.description}
              </Text>
              {selectedBuddy === buddy.id && (
                <View className="absolute top-3 right-3">
                  <Ionicons 
                    name="checkmark" 
                    size={24} 
                    color="#4f46e5" 
                  />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Next Button */}
        <View className="items-center">
          <Pressable 
            className="flex-row items-center justify-between px-6 py-4 rounded-2xl w-4/5 h-14 bg-indigo-600"
            onPress={onNext}
          >
            <Text className="text-lg font-semibold text-white">
              {t('buddySelection.next')}
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color="#ffffff" 
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default BuddySelection; 
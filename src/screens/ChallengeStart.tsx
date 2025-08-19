import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import ChallengeIcon from '../assets/challenges/challenge.svg';

interface ChallengeStartProps {
  onNext: () => void;
}

const ChallengeStart: React.FC<ChallengeStartProps> = ({ onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  console.log("test", t('challengeStart.mainSubtitle'))
  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
      <ScrollView className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="items-center mb-9">
          <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
            {t('challengeStart.mainTitle')}
          </Text>
          <Text className={`text-md font-medium text-center leading-6 px-5 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            {t('challengeStart.mainSubtitle')}
          </Text>
        </View>

        {/* Content Area - You can add more content here if needed */}
        <View className="flex-1 justify-center items-center">
          <ChallengeIcon />
        </View>
      </ScrollView>

      {/* Action Button - Fixed at bottom */}
      <View className="px-6 pb-8">
        <Pressable
          className="bg-indigo-600 rounded-2xl py-4 px-6 items-center"
          onPress={onNext}
        >
          <Text className="font-semibold text-xl text-white">
            {t('challengeStart.actionButton')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ChallengeStart;

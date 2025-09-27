import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import ChallengeIcon from '../assets/challenges/challenge.svg';
import CTAButton from '../components/CTAButton';

interface ChallengeStartProps {
  onNext: () => void;
}

const ChallengeStart: React.FC<ChallengeStartProps> = ({ onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { completeOnboarding } = useApp();
  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
       <View className="items-center mb-9 mt-2">
          <Text className={`text-2xl font-bold mb-1 text-center ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
            {t('challengeStart.mainTitle')}
          </Text>
          <Text className={`text-md font-medium text-center px-14 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            {t('challengeStart.mainSubtitle')}
          </Text>
        </View>

        <View className="flex-1 h-100 justify-center items-center">
            <Image 
              source={require("../assets/icons/startFight.png")} 
              className="h-500 w-[90%]"
              resizeMode="contain" 
            />
        </View>

      {/* Action Button - Fixed at bottom */}
        <CTAButton
          label={t('challengeStart.actionButton')}
          onPress={async () => {
            await completeOnboarding();
            onNext();
          }}
          containerClassName="pb-0" 
        />
    </View>
  );
};

export default ChallengeStart;

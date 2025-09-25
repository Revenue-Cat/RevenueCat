import React from 'react';
import { View, Text, Pressable, Share } from 'react-native';
import { ChallengeData } from '../data/challengesData';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import UpgradeIcon from '../assets/icons/upgrade.svg';
import { useApp } from '../contexts/AppContext';
interface ExclusiveAchievementsModalActionsProps {
  challenge: ChallengeData;
  progress?: any;
  onClose: () => void;
  handleStartChallenge: () => void;
  handleShare: () => void;
}

const ExclusiveAchievementsModalActions: React.FC<ExclusiveAchievementsModalActionsProps> = ({
  challenge,
  progress,
  onClose,
  handleStartChallenge,
  handleShare
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();
  const { getChallengeStatus } = useApp();

  const status = getChallengeStatus(challenge.id);
  const isCompleted = status === 'completed';
  const isInProgress = status === 'inprogress';
  const isLocked = status === 'locked';

  return (
    <View
      className={`${
        isDark ? "bg-dark-background" : "bg-light-background"
      }`}
      style={{
        marginHorizontal: -40,
        marginBottom: -40,
        paddingBottom: 40,
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
    >
      <View className="flex-row justify-center gap-4">
        <Pressable 
          className={`w-15 h-15 rounded-2xl justify-center items-center ${isDark ? 'bg-slate-700' : 'bg-indigo-50'}`}
          onPress={onClose}
        >
          <Text className={`text-2xl rounded-2xl px-5 py-3 font-bold ${isDark ? 'text-slate-100 bg-slate-700' : 'text-indigo-900 bg-indigo-50'}`}>✕</Text>
        </Pressable>

        {(isInProgress || isLocked || !isCompleted) ? null : (
          <Pressable 
            className="flex-1 rounded-2xl justify-center items-center bg-indigo-600"
            onPress={() => {
              if (isCompleted) {
                handleShare();
              }
            }}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
                backgroundColor: pressed ? '#4F46E5' : '#4F46E5'
              }
            ]}
          >
            <View className="flex-row items-center">
              {isLocked ? <UpgradeIcon width={24} height={24} color="white" /> : ""}
              <Text className="text-2xl font-bold text-white px-4 py-2 font-bold">
                {t('achievements.share') }
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ExclusiveAchievementsModalActions;

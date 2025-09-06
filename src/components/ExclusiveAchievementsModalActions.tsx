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
}

const ExclusiveAchievementsModalActions: React.FC<ExclusiveAchievementsModalActionsProps> = ({
  challenge,
  progress,
  onClose
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();
  const { getChallengeStatus } = useApp();

  const status = getChallengeStatus(challenge.id);
  const isCompleted = progress?.percentage === 100;
  const isInProgress = status === 'inprogress';
  const isLocked = status === 'locked';
  
  const handleShare = async () => {
    try {
      const message = `🎉 I just completed the "${challenge.title}" challenge! ${challenge.shortDescription}\n💰 Reward: 100 coins`;
            
      const result = await Share.share({
        message: message,
        title: 'Challenge Completed!'
      });
      
    } catch (error) {
      console.error('Error sharing challenge:', error);
      alert('Share failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUpdate = () => {
    console.log('Update challenge:', challenge.title);
  };

  return (
    <View className="my-6 flex-row justify-center gap-4">
      <Pressable 
        className={`w-15 h-15 rounded-2xl justify-center items-center ${isDark ? 'bg-slate-700' : 'bg-indigo-50'}`}
        onPress={onClose}
      >
        <Text className={`text-2xl rounded-2xl px-4 py-2 font-bold ${isDark ? 'text-slate-100 bg-slate-700' : 'text-indigo-900 bg-indigo-50'}`}>✕</Text>
      </Pressable>

      {isInProgress ? null : (
        <Pressable 
          className="flex-1 rounded-2xl justify-center items-center bg-indigo-600"
          onPress={() => {
            if (isCompleted) {
              handleShare();
            } else if (isLocked) {
              handleUpdate();
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
              {isCompleted ? t('achievements.share') : (isLocked ? t('achievements.update') : t('achievements.close'))}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default ExclusiveAchievementsModalActions;

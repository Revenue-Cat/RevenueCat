import React from 'react';
import { View, Text, Pressable, Share } from 'react-native';
import { Achievement } from '../services/achievementService';
import { isRegularAchievement } from '../utils/achievementHelpers';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface AchievementModalActionsProps {
  achievement: Achievement;
  progress?: any;
  onClose: () => void;
}

const AchievementModalActions: React.FC<AchievementModalActionsProps> = ({
  achievement,
  progress,
  onClose
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();
  
  const handleShare = async () => {
    
    try {
      const message = `🎉 I just unlocked the "${achievement.name}" achievement! ${achievement.description}${achievement.coins ? `\n💰 Reward: ${achievement.coins} coins` : ''}`;
            
      const result = await Share.share({
        message: message,
        title: 'Achievement Unlocked!'
      });
      
    } catch (error) {
      console.error('Error sharing achievement:', error);
      alert('Share failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUpdate = () => {
    console.log('Update achievement:', achievement.name);
  };

  return (
    <View className="my-6 flex-row justify-center gap-4">
      <Pressable 
        className={`w-15 h-15 rounded-2xl justify-center items-center ${isDark ? 'bg-slate-700' : 'bg-indigo-50'}`}
        onPress={onClose}
      >
        <Text className={`text-2xl rounded-2xl px-4 py-2 font-bold ${isDark ? 'text-slate-100 bg-slate-700' : 'text-indigo-900 bg-indigo-50'}`}>✕</Text>
      </Pressable>

      {(isRegularAchievement(achievement.id) && (progress?.percentage || 0) !== 100) ? null : (
        <Pressable 
          className="flex-1 rounded-2xl justify-center items-center bg-indigo-600"
          onPress={() => {
            if (achievement.unlocked && (progress?.percentage || 0) === 100) {
              handleShare();
            } else if (isRegularAchievement(achievement.id)) {
              // Regular achievements don't have Update button when locked
              console.log('Regular achievement locked - no action');
            } else {
              // Exclusive achievements have Update button when locked
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
          <Text className="text-2xl font-bold text-white px-4 py-2 font-bold">
            {achievement.unlocked && (progress?.percentage || 0) === 100 ? t('achievements.share') : (isRegularAchievement(achievement.id) ? t('achievements.close') : t('achievements.update'))}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default AchievementModalActions;

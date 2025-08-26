import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CoinIcon from "../assets/icons/coins.svg";
import ProgressRing from './ProgressRing';
import CountdownTimer from './CountdownTimer';
import { Achievement } from '../services/achievementService';
import { isRegularAchievement, isFirstThreeAchievement, calculateAchievementTargetDate } from '../utils/achievementHelpers';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const LockIcon = require('../assets/achievements/lock.png');
const TimeIcon = require('../assets/achievements/time.png');
const AchievementLockedIcon = require('../assets/achievements/achievement-locked.png');

interface AchievementModalContentProps {
  achievement: Achievement;
  progress?: any;
  getProgressForAchievement?: (achievementId: string) => { current: number; max: number; percentage: number };
  startDate?: Date | null;
}

const AchievementModalContent: React.FC<AchievementModalContentProps> = ({
  achievement,
  progress,
  getProgressForAchievement,
  startDate
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();
  
  if (!achievement || !getProgressForAchievement) return null;
  const borderColor = isDark ? '#475569' : '#d7d9df';
  // Helper function to render achievement icon and badges
  const renderAchievementIcon = () => {
    return (
      <View className="w-32 h-32 relative">
        {/* Progress Ring - Only for regular achievements */}
        {isRegularAchievement(achievement.id) &&  (
          <ProgressRing
            progress={progress?.percentage || 0}
            size={110}
            strokeWidth={4}
            color={isFirstThreeAchievement(achievement.id, getProgressForAchievement) || (progress?.percentage || 0) === 100 ? '#22C55E' : 'transparent'}
            borderColor={(progress?.percentage || 0) === 100 ? '#22C55E' : borderColor}
          />
        )}
        
        {/* Achievement Icon Background */}
        <View className="absolute inset-0 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full justify-center items-center">
          {isRegularAchievement(achievement.id) ? (
            // Regular achievements logic
            <>
              {(isFirstThreeAchievement(achievement.id, getProgressForAchievement) || (progress?.percentage || 0) === 100) ? (
                // First 3 achievements OR 100% progress: show achievement icon
                <>
                  {achievement.icon ? (
                    <Image 
                      source={achievement.icon}
                      className='w-36 h-36'
                      resizeMode="stretch"
                    />
                  ) : (
                    <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                  )}
                </>
              ) : (
                // Other regular achievements: show lock icon
                <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              )}
            </>
          ) : (
            // Exclusive achievements logic
            <>
              {achievement.icon ? (
                <Image 
                  source={achievement.icon} 
                  className='w-36 h-36'
                  resizeMode="stretch" 
                />
              ) : (
                <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              )}
            </>
          )}

          {/* Notification Badges - Single location for all badges */}
          {isRegularAchievement(achievement.id) ? (
            // Regular achievement badges
            <>
              {/* Check icon for 100% progress */}
              {(progress?.percentage || 0) === 100 && (
                <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-8 h-8 justify-center items-center">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              )}
              {/* Time icon for progress > 0 but < 100% */}
              {(progress?.percentage || 0) > 0 && (progress?.percentage || 0) < 100 && (
                <View className="absolute -top-1 -right-1 bg-black/20 rounded-full w-8 h-8 justify-center items-center">
                  <Image source={TimeIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
              )}
            </>
          ) : (
            // Exclusive achievement badge
            <View className="absolute -top-1 -right-1 bg-white/20 rounded-full w-8 h-8 justify-center items-center">
              <Image source={LockIcon} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Reward Banner */}
      <View className="items-center my-6">
        <View className="flex-row items-center px-4 py-2 rounded-3xl border-2 border-amber-500">
          <Text className="text-amber-500 font-bold text-base mr-2 text-xl">
            {t('shop.reward', { coins: achievement.coins || 0 })}
          </Text>
          <CoinIcon width={18} height={18} />
        </View>
      </View>

      {/* Card Content */}
      <View className={`gap-4 rounded-3xl p-8 justify-center items-center ${isDark ? 'bg-slate-700/50' : 'bg-indigo-50/50'}`}>
        {/* Achievement Title */}
        <Text className={`text-2xl font-bold text-center pt-7 ${isDark ? 'text-slate-50' : 'text-indigo-950'}`}>
          {achievement.name}
        </Text>

        {/* Achievement Description */}
        <Text className={`text-sm text-center ${isDark ? 'text-slate-100' : 'text-slate-500'}`}>
          {achievement.description}
        </Text>

        {/* Achievement Icon */}
        <View className="items-center pb-4">
          {renderAchievementIcon()}
        </View>

        {/* Time Left Section - Only for Regular Achievements */}
        {progress && isRegularAchievement(achievement.id) && (progress?.percentage || 0) > 0 && (progress?.percentage || 0) < 100 && (
          <View>
            <View className="flex-row items-center justify-center mb-3">
              <Text className={`font-semibold text-center ml-2 ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
                {t('achievements.timeLeft')}
              </Text>
            </View>
            
            {/* Countdown Timer */}
            <View className="items-center">
               <CountdownTimer
                  targetDate={calculateAchievementTargetDate(startDate || null, progress.max)}
                  textColor={isDark ? "text-slate-100" : "text-indigo-950"}
                  textSize="md"
                  showSeconds={false}
                  countUp={false}
                />
            </View>
          </View>
        )}
      </View>

      {/* Locked message - Only for locked achievements */}
      {!achievement.unlocked && (
        <View className='flex-row justify-center items-center mt-4'>
           <Ionicons name="information-circle" size={16} color={isDark ? "#485569" : "#64748B"} />
           <Text className={`text-xs text-center ml-2 ${isDark ? 'text-slate-100' : 'text-slate-500'}`}>
             {t('achievements.locked')}
           </Text>
         </View>
      )}
    </>
  );
};

export default AchievementModalContent;

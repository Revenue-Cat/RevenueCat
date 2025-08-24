import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CoinIcon from "../assets/icons/coins.svg";
import ProgressRing from './ProgressRing';
import CountdownTimer from './CountdownTimer';
import { Achievement } from '../services/achievementService';
import { isRegularAchievement, isFirstThreeAchievement, calculateAchievementTargetDate } from '../utils/achievementHelpers';

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
  if (!achievement || !getProgressForAchievement) return null;

  return (
    <>
      {/* Achievement Celebration Content */}
      {achievement.unlocked ? (
        <>
          {/* Reward Banner */}
          <View className="items-center my-6">
            <View className="flex-row items-center px-4 py-2 rounded-3xl border-2 border-amber-500">
              <Text className="text-amber-500 font-bold text-base mr-2 text-xl">
                Reward {achievement.coins || 0}
              </Text>
              <CoinIcon width={18} height={18} />
            </View>
          </View>

          {/* Card Content */}
          <View className="gap-4 rounded-3xl p-8 bg-indigo-50/50 justify-center items-center">
            {/* Achievement Title */}
            <Text className="text-2xl font-bold text-indigo-950 text-center pt-7">
              {achievement.name}
            </Text>

            {/* Achievement Description */}
            <Text className="text-sm text-slate-500 text-center">
              {achievement.description}
            </Text>

            {/* Achievement Icon */}
            <View className="items-center mb-2 pb-7">
              <View className="w-32 h-32 relative">
                {/* Progress Ring */}
                {isRegularAchievement(achievement.id) && (
                  <ProgressRing
                    progress={progress?.percentage || 0}
                    size={110}
                    strokeWidth={4}
                    color={isFirstThreeAchievement(achievement.id, getProgressForAchievement) || (progress?.percentage || 0) === 100 ? '#22C55E' : '#9ba3b3'}
                    borderColor='#d0d7e4'
                  />
                )}
                
                {/* Achievement Icon Background */}
                <View className="absolute inset-0 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full justify-center items-center">
                  {achievement.icon ? (
                    <Image 
                      source={achievement.icon}
                      className='w-36 h-36'
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-6xl">{achievement.emoji}</Text>
                  )}
                  {/* Notification Badge */}
                  <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-8 h-8 justify-center items-center border-2 border-white">
                    {isRegularAchievement(achievement.id) ? (
                      <Ionicons name="checkmark" size={16} color="white" />
                    ) : (
                      <Text className="text-sm font-bold text-white">{achievement.notificationCount || 1}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Time Left Section - Only for Regular Achievements */}
            {progress && isRegularAchievement(achievement.id) && (progress?.percentage || 0) > 0 && (progress?.percentage || 0) < 100 && (
              <View>
                <View className="flex-row items-center justify-center mb-3">
                  <Text className="text-indigo-950 font-semibold text-center ml-2">
                    Time left
                  </Text>
                </View>
                
                {/* Countdown Timer */}
                <View className="items-center">
                   <CountdownTimer
                      targetDate={calculateAchievementTargetDate(startDate || null, progress.max)}
                      textColor="text-indigo-950"
                      textSize="md"
                      showSeconds={false}
                      countUp={false}
                    />
                </View>
              </View>
            )}
          </View>
        </>
      ) : (
        <>
          {/* Reward Banner */}
          <View className="items-center my-6">
            <View className="flex-row items-center px-4 py-2 rounded-3xl border-2 border-amber-500">
              <Text className="text-amber-500 font-bold text-base mr-2 text-xl">
                Reward {achievement.coins || 0}
              </Text>
              <CoinIcon width={18} height={18} />
            </View>
          </View>

          {/* Card Content */}
          <View className="gap-4 rounded-3xl p-8 bg-indigo-50/50 justify-center items-center">
            {/* Achievement Title */}
            <Text className="text-2xl font-bold text-indigo-950 text-center pt-7">
              {achievement.name}
            </Text>

            {/* Achievement Description */}
            <Text className="text-sm text-slate-500 text-center">
              {achievement.description}
            </Text>

            {/* Achievement Icon */}
            <View className="items-center pb-4">
              <View className="w-32 h-32 relative">
                {/* Progress Ring */}
                {isRegularAchievement(achievement.id) && (
                  <ProgressRing
                    progress={progress?.percentage || 0}
                    size={110}
                    strokeWidth={4}
                    color={isFirstThreeAchievement(achievement.id, getProgressForAchievement) || (progress?.percentage || 0) === 100 ? '#22C55E' : '#9ba3b3'}
                  />
                )}
                
                {/* Achievement Icon Background */}
                <View className="absolute inset-0 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full justify-center items-center">
                  {isRegularAchievement(achievement.id) ? (
                    // Regular achievements logic
                    <>
                      {(isFirstThreeAchievement(achievement.id, getProgressForAchievement) || (progress?.percentage || 0) === 100) ? (
                        // First 3 achievements OR 100% progress: show achievement icon and green progress
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
                          {/* Check icon for 100% progress */}
                          {(progress?.percentage || 0) === 100 && (
                            <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-8 h-8 justify-center items-center border-2 border-white">
                              <Ionicons name="checkmark" size={16} color="white" />
                            </View>
                          )}
                          {/* Time icon for progress > 0 but < 100% */}
                          {(progress?.percentage || 0) > 0 && (progress?.percentage || 0) < 100 && (
                            <View className="absolute -top-1 -right-1 bg-white/20 rounded-full w-8 h-8 justify-center items-center border-2 border-white">
                              <Image source={TimeIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                            </View>
                          )}
                        </>
                      ) : (
                        // Other regular achievements: show lock icon
                        <>
                          <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                          {/* Time icon for progress > 0 but < 100% */}
                          {(progress?.percentage || 0) > 0 && (progress?.percentage || 0) < 100 && (
                            <View className="absolute -top-1 -right-1 bg-white/20 rounded-full w-8 h-8 justify-center items-center border-2 border-white">
                              <Image source={TimeIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                            </View>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    // Exclusive achievements logic (unchanged)
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
                      {/* Notification Badge */}
                      <View className="absolute -top-1 -right-1 bg-white/20 rounded-full w-8 h-8 justify-center items-center border-2 border-white">
                        <Image source={LockIcon} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* Time Left Section - Only for Regular Achievements */}
            {progress && isRegularAchievement(achievement.id) && (progress?.percentage || 0) > 0 && (progress?.percentage || 0) < 100 && (
              <View>
                <View className="flex-row items-center justify-center mb-3">
                  <Text className="text-indigo-950 font-semibold text-center ml-2">
                    Time left
                  </Text>
                </View>
                
                {/* Countdown Timer */}
                <View className="items-center">
                   <CountdownTimer
                      targetDate={calculateAchievementTargetDate(startDate || null, progress.max)}
                      textColor="text-indigo-950"
                      textSize="md"
                      showSeconds={true}
                      countUp={false}
                    />
                </View>
              </View>
            )}
          </View>

          <View className='flex-row justify-center items-center mt-4'>
             <Ionicons name="information-circle" size={16} color="#64748B" />
             <Text className='text-xs text-slate-500 text-center ml-2'>
               Locked. Update your plan to unlock this achivemet.
             </Text>
           </View>
        </>
      )}
    </>
  );
};

export default AchievementModalContent;

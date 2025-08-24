import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const AchievementLockedIcon = require('../assets/achievements/achievement-locked.png');
const LockIcon = require('../assets/achievements/lock.png');
const TimeIcon = require('../assets/achievements/time.png');

interface AchievementCardProps {
  title: string;
  description: string;
  reward: number;
  timeLeft: string;
  emoji: string;
  containerClassName?: string;
  icon?: any;
  progressPercentage?: number;
  isFirstThree?: boolean;
  isRegularAchievement?: boolean;
}

// Simple Progress Ring Component
const ProgressRing: React.FC<{ progress: number; size: number; strokeWidth: number; color: string }> = ({
  progress,
  size,
  strokeWidth,
  color
}) => {
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      {/* Background circle */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: '#374151',
          position: 'absolute',
        }}
      />

      {/* Progress indicator - simple border approach */}
      {progress > 0 && (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: progress > 0 ? color : 'transparent',
            borderRightColor: progress > 25 ? color : 'transparent',
            borderBottomColor: progress > 50 ? color : 'transparent',
            borderLeftColor: progress > 75 ? color : 'transparent',
            position: 'absolute',
            transform: [{ rotate: '-90deg' }],
          }}
        />
      )}
    </View>
  );
};

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  reward,
  timeLeft,
  emoji,
  containerClassName = '',
  icon,
  progressPercentage = 0,
  isFirstThree = false,
  isRegularAchievement = false,
}) => {
  return (
    <View className={`bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-lg ${containerClassName}`}>
      <View className="flex-1 mr-4">
        <View className="flex-row items-center bg-orange-100 px-3 py-1.5 rounded-full self-start mb-1 gap-1">
          <Ionicons name="star" size={12} color="#FF6B35" />
          <Text className="text-xs font-bold text-orange-500">+{reward}</Text>
        </View>
        <Text className="text-xs text-gray-500 mb-2">{timeLeft}</Text>
        <Text className="text-base font-bold text-black mb-1">{title}</Text>
        <Text className="text-sm text-gray-500 leading-5">{description}</Text>
      </View>
      <View className="w-15 h-15 rounded-full relative">
        {/* Progress Ring */}
        {isRegularAchievement && (
          <ProgressRing
            progress={progressPercentage}
            size={60}
            strokeWidth={3}
            color={isFirstThree || progressPercentage === 100 ? '#22C55E' : '#6B7280'}
          />
        )}
        
        {/* Achievement Icon */}
        <View className="absolute inset-0 rounded-full justify-center items-center">
          {isRegularAchievement ? (
            // Regular achievements logic
            <>
              {isFirstThree || progressPercentage === 100 ? (
                // First 3 achievements OR 100% progress: show achievement icon and green progress
                <>
                  {icon ? (
                    <Image source={icon} className='w-[64px] h-[64px]' resizeMode="stretch" />
                  ) : (
                    <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                  )}
                  {/* Check icon for 100% progress */}
                  {progressPercentage === 100 && (
                    <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-5 h-5 justify-center items-center">
                      <Ionicons name="checkmark" size={10} color="white" />
                    </View>
                  )}
                  {/* Time icon for progress > 0 but < 100% */}
                  {progressPercentage > 0 && progressPercentage < 100 && (
                    <View className="absolute -top-1 -right-1 rounded-full w-6 h-6 justify-center items-center border-2 border-white" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                      <Image source={TimeIcon} style={{ width: '80%', height: '80%' }} resizeMode="contain" />
                    </View>
                  )}
                </>
              ) : (
                  // Other regular achievements: show lock icon and gray progress
                  <>
                    <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                                          {/* Time icon for progress > 0 but < 100% */}
                      {progressPercentage > 0 && progressPercentage < 100 && (
                        <View className="absolute -top-1 -right-1 rounded-full w-6 h-6 justify-center items-center border-2 border-white" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                          <Image source={TimeIcon} style={{ width: '80%', height: '80%' }} resizeMode="contain" />
                        </View>
                      )}
                  </>
              )}
            </>
          ) : (
            // Non-regular achievements: show original gradient with icon
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              className="w-full h-full justify-center items-center relative"
            >
              {icon ? <Image source={icon} className='w-[64px] h-[64px]' resizeMode="stretch" /> : <Text className="text-2xl z-10">{emoji}</Text>}
              <View className="absolute inset-0 justify-center items-center">
                <Text className="text-xs absolute text-white">✨</Text>
                <Text className="text-xs absolute text-white">✨</Text>
                <Text className="text-xs absolute text-white">✨</Text>
              </View>
            </LinearGradient>
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(AchievementCard);

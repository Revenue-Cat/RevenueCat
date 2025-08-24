import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import AchievementModal from '../components/AchievementModal';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';
import { Achievement } from '../services/achievementService';
const AchievementLockedIcon = require('../assets/achievements/achievement-locked.png');
const AchievementBreatheIcon = require('../assets/achievements/achievement-breathe.png');
const LockIcon = require('../assets/achievements/lock.png');

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

interface AchievementsProps {
  onBack: () => void;
  isExclusiveSelected: boolean;
}

// Exclusive Achievements Data
const EXCLUSIVE_ACHIEVEMENTS_DATA = [
  {
    id: "breathe",
    name: "Breathe",
    description: "Complete your first breathing exercise session",
    emoji: "🦙",
    icon: AchievementBreatheIcon,
    unlocked: true,
    notificationCount: 13,
    coins: 100,
    requiredDays: 1
  },
  {
    id: "hydro-win",
    name: "HydroWin",
    description: "Drink 8 glasses of water for 7 days straight",
    emoji: "💧",
    icon: AchievementBreatheIcon,
    unlocked: true,
    notificationCount: 5,
    coins: 150,
    requiredDays: 7
  },
  {
    id: "strider",
    name: "Strider",
    description: "Take 10,000 steps for 5 consecutive days",
    emoji: "🚶",
    icon: AchievementBreatheIcon,
    unlocked: true,
    notificationCount: 2,
    coins: 200,
    requiredDays: 5
  },
  {
    id: "snackcess",
    name: "Snackcess",
    description: "Choose healthy snacks over junk food for a week",
    emoji: "🥗",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 100,
    requiredDays: 7
  },
  {
    id: "zen",
    name: "Zen",
    description: "Complete 10 meditation sessions",
    emoji: "🧘",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 150,
    requiredDays: 10
  },
  {
    id: "gripped",
    name: "Gripped",
    description: "Hold a plank for 2 minutes",
    emoji: "💪",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 200,
    requiredDays: 1
  },
  {
    id: "splash",
    name: "Splash",
    description: "Swim 20 laps in one session",
    emoji: "🏊",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 250,
    requiredDays: 1
  },
  {
    id: "released",
    name: "Released",
    description: "Practice stress relief techniques for 30 days",
    emoji: "🕊️",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 300,
    requiredDays: 30
  },
  {
    id: "stretched",
    name: "Stretched",
    description: "Complete daily stretching routine for 2 weeks",
    emoji: "🤸",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 150,
    requiredDays: 14
  },
  {
    id: "title-1",
    name: "Title",
    description: "Earn your first wellness champion title",
    emoji: "👑",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 400,
    requiredDays: 30
  },
  {
    id: "title-2",
    name: "Title",
    description: "Earn your second wellness champion title",
    emoji: "👑",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 400,
    requiredDays: 60
  },
  {
    id: "title-3",
    name: "Title",
    description: "Earn your third wellness champion title",
    emoji: "👑",
    icon: AchievementLockedIcon,
    unlocked: false,
    coins: 400,
    requiredDays: 90
  }
];

const Achievements: React.FC<AchievementsProps> = ({ onBack, isExclusiveSelected }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {achievements, getProgressForAchievement, startDate } = useApp();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [parallaxAnim] = useState(new Animated.Value(0));
  
  // Gesture handler for parallax effect
  const onGestureEvent = useRef(
    Animated.event(
      [{ nativeEvent: { translationY: parallaxAnim } }],
      { useNativeDriver: true }
    )
  ).current;

  const onHandlerStateChange = useCallback((event: any) => {
    if (event.nativeEvent.state === State.END) {
      // Reset animation when gesture ends
      Animated.spring(parallaxAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [parallaxAnim]);

  // Use the appropriate achievements array based on toggle selection
  const filteredAchievements = useMemo(() => {
    // Parallax animation
    Animated.timing(parallaxAnim, {
      toValue: isExclusiveSelected ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Return exclusive or regular achievements based on selection
    if (isExclusiveSelected) {
      return EXCLUSIVE_ACHIEVEMENTS_DATA;
    } else {
      return achievements;
    }
  }, [isExclusiveSelected, parallaxAnim, achievements]);

  // Memoize the achievement selection callback
  const handleAchievementPress = useCallback((achievement: Achievement) => {
    setSelectedAchievement(achievement);
  }, []);

  // Memoize the modal close callback
  const handleCloseModal = useCallback(() => {
    setSelectedAchievement(null);
  }, []);

  console.log('startDate', startDate)
  
  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <View className="flex-1 bg-[#1F1943]">
        

        {/* Background Parallax Layers */}
      <Animated.View 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ 
            translateY: parallaxAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -100],
            })
          }],
          opacity: parallaxAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.3, 0.1, 0.3],
          })
        }}
        className="bg-gradient-to-b from-purple-900/20 to-blue-900/20"
      />
      
      <Animated.View 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ 
            translateY: parallaxAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -50],
            })
          }],
          opacity: parallaxAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.6, 0.3, 0.6],
          })
        }}
        className="bg-gradient-to-b from-indigo-800/30 to-purple-800/30"
      />

      {/* Achievements Grid - Fixed Position */}
      <View className="flex-1 justify-center items-center pt-20">
        <View className="flex-row flex-wrap justify-center gap-0">
          {filteredAchievements.map((achievement, index) => {
            const progress = getProgressForAchievement(achievement.id);
            const progressPercentage = progress.percentage;
            
            return (
              <View key={`${achievement.id}-${index}`} className="items-center w-1/4 p-3">
                <Pressable
                  className="w-[75px] h-[75px] rounded-full relative justify-center items-center"
                  onPress={() => handleAchievementPress(achievement)}
                >
                  {/* Progress Ring */}
                  <ProgressRing
                    progress={progressPercentage}
                    size={75}
                    strokeWidth={3}
                    color={achievement.unlocked ? '#10B981' : '#6B7280'}
                  />
                  
                  {/* Achievement Icon */}
                  <View className="absolute w-[75px] h-[75px] rounded-full justify-center items-center">
                    {achievement.unlocked ? (
                      <>
                        {achievement.icon ? (
                          <Image source={achievement.icon} className='w-[80px] h-[80px]' resizeMode="stretch" />
                        ) : (
                          <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                        )}
                        {/* Notification badge for unlocked achievements */}
                        <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-6 h-6 justify-center items-center">
                          <Text className="text-xs font-bold text-white">{achievement.notificationCount || 1}</Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                        {/* Progress indicator for locked achievements */}
                        {progressPercentage > 0 && (
                          <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-6 h-6 justify-center items-center">
                            <Text className="text-xs font-bold text-white">{Math.round(progressPercentage)}%</Text>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                </Pressable>
                <Text className={`text-xs mt-2 text-center ${achievement.unlocked ? 'text-white' : 'text-white/50'}`}>
                  {achievement.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {selectedAchievement && (
        <AchievementModal 
          visible={true} 
          onClose={handleCloseModal} 
          achievement={selectedAchievement} 
          progress={getProgressForAchievement(selectedAchievement.id)}
        />
      )}
      </View>
    </PanGestureHandler>
  );
};

export default Achievements; 
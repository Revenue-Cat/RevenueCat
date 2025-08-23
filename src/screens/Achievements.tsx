import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import AchievementModal from '../components/AchievementModal';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';
import { Achievement } from '../services/achievementService';

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
const AchievementLockedIcon = require('../assets/achievements/achievement-locked.png');
const AchievementBreatheIcon = require('../assets/achievements/achievement-breathe.png');
const LockIcon = require('../assets/achievements/lock.png');




interface AchievementsProps {
  onBack: () => void;
  isExclusiveSelected: boolean;
}
const achievements = [
  {
      id: "7",
      name: "Splash",
      description: "Swim 20 laps in one session",
      emoji: "🏊",
      unlocked: false,
      coins: 250
    },
    {
      id: "8",
      name: "Released",
      description: "Practice stress relief techniques for 30 days",
      emoji: "🕊️",
      unlocked: false,
      coins: 300
    },
    {
      id: "9",
      name: "Stretched",
      description: "Complete daily stretching routine for 2 weeks",
      emoji: "🤸",
      unlocked: false,
      coins: 150
    },
    {
      id: "10",
      name: "Title",
      description: "Earn your first wellness champion title",
      emoji: "👑",
      unlocked: false,
      coins: 400
    },
    {
      id: "11",
      name: "Focus",
      description: "Complete 5 deep work sessions",
      emoji: "🎯",
      unlocked: false,
      coins: 200
    },
    {
      id: "12",
      name: "Balance",
      description: "Maintain work-life balance for a month",
      emoji: "⚖️",
      unlocked: false,
      coins: 300
    },
    {
      id: "13",
      name: "Mindful",
      description: "Practice mindfulness for 21 days straight",
      emoji: "🧘‍♀️",
      unlocked: false,
      coins: 150
    },
    {
      id: "14",
      name: "Hydration Hero",
      description: "Drink 2L of water daily for 30 days",
      emoji: "💧",
      unlocked: false,
      coins: 350
    },
    {
      id: "15",
      name: "Early Bird",
      description: "Wake up at 6 AM for 2 weeks",
      emoji: "🌅",
      unlocked: false,
      coins: 150
    },
    {
      id: "16",
      name: "Night Owl",
      description: "Get 8 hours of sleep for 30 days",
      emoji: "🌙",
      unlocked: false,
      coins: 200
    },
    {
      id: "17",
      name: "Fitness Fanatic",
      description: "Exercise 5 days a week for a month",
      emoji: "🏃‍♂️",
      unlocked: false,
      coins: 300
    },
    {
      id: "18",
      name: "Meditation Master",
      description: "Complete 50 meditation sessions",
      emoji: "🧘‍♂️",
      unlocked: false,
      coins: 400
    },
    {
      id: "19",
      name: "Nutritionist",
      description: "Eat healthy meals for 60 days",
      emoji: "🥗",
      unlocked: false,
      coins: 150
    },
    {
      id: "20",
      name: "Stress Buster",
      description: "Practice stress relief for 45 days",
      emoji: "😌",
      unlocked: false,
      coins: 200
    },
    {
      id: "21",
      name: "Productivity Pro",
      description: "Complete 100 focused work sessions",
      emoji: "📈",
      unlocked: false,
      coins: 500
    },
    {
      id: "22",
      name: "Social Butterfly",
      description: "Connect with 10 new people",
      emoji: "🦋",
      unlocked: false,
      coins: 150
    },
    {
      id: "23",
      name: "Learning Legend",
      description: "Learn something new for 90 days",
      emoji: "📚",
      unlocked: false,
      coins: 300
    },
    {
      id: "24",
      name: "Gratitude Guru",
      description: "Practice gratitude for 100 days",
      emoji: "🙏",
      unlocked: false,
      coins: 400
    }
];

// Achievement data is now managed by the achievement service

const Achievements: React.FC<AchievementsProps> = ({ onBack, isExclusiveSelected }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { selectedBuddyId, gender, userCoins, achievements, getProgressForAchievement, startDate } = useApp();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [parallaxAnim] = useState(new Animated.Value(0));

  // Use the appropriate achievements array based on toggle selection
  const filteredAchievements = useMemo(() => {
    // Parallax animation
    Animated.timing(parallaxAnim, {
      toValue: isExclusiveSelected ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // For now, return regular achievements from service
    // TODO: Add exclusive achievements later
    return achievements;
  }, [isExclusiveSelected, parallaxAnim, achievements]);

  // Memoize the achievement selection callback
  const handleAchievementPress = useCallback((achievement: Achievement) => {
    setSelectedAchievement(achievement);
  }, []);

  // Memoize the modal close callback
  const handleCloseModal = useCallback(() => {
    setSelectedAchievement(null);
  }, []);

  // Handle sharing achievement
  const handleShareAchievement = useCallback((achievement: Achievement) => {
    // TODO: Implement actual sharing functionality
    // For now, just log the achievement
    console.log('Sharing achievement:', achievement.name);
    
    // You can implement actual sharing here using expo-sharing or other methods
    // Example:
    // import * as Sharing from 'expo-sharing';
    // const message = `🎉 I just unlocked the "${achievement.name}" achievement! ${achievement.description}`;
    // if (await Sharing.isAvailableAsync()) {
    //   await Sharing.shareAsync(message);
    // }
  }, []);

  // Memoize the achievements grid
  // const achievementsGrid = useMemo(() => (
  //   <View className="flex-row flex-wrap gap-0">
  //     {filteredAchievements.map((achievement, index) => (
  //       <View key={`${achievement.id}-${index}`} className="items-center w-1/4 p-3">
  //         <Pressable
  //           className={`w-[75px] h-[75px] rounded-full relative ${
  //             achievement.unlocked 
  //               ? 'bg-gradient-to-br from-green-400 to-yellow-400 border-2 border-green-300 shadow-lg' 
  //               : 'bg-white/10 border border-white/20'
  //           }`}
  //           onPress={() => handleAchievementPress(achievement)}
  //         >
  //           {achievement.unlocked ? (
  //             <>
  //               {achievement.icon ? (
  //                   <Image source={achievement.icon} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
  //               ) : (
  //                   <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
                  
  //               )}
  //               <View className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 justify-center items-center">
  //                 <Text className="text-xs font-bold text-white">{achievement.notificationCount}</Text>
  //               </View>
  //             </>
  //           ) : (
  //             <>
  //               <View className="items-center w-full h-full">
  //                   <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
  //               </View>
  //               <View className="absolute -top-2 -right-2 bg-white/20 rounded-full w-6 h-6 justify-center items-center">
  //                 <Image source={LockIcon} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
  //               </View>
  //             </>
  //           )}
  //         </Pressable>
  //         <Text className={`text-xs mt-2 text-center ${achievement.unlocked ? 'text-white' : 'text-white/50'}`}>
  //           {achievement.name}
  //         </Text>
  //       </View>
  //     ))}
  //   </View>
  // ), [filteredAchievements, handleAchievementPress]);

  console.log('startDate', startDate)
  
  return (
    <View className="flex-1 bg-[#1F1943]">
      

      {/* Achievements Grid */}
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Background Layer - moves slowest */}
        <Animated.View 
          style={{ 
            transform: [{ 
              translateY: parallaxAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -30],
              })
            }],
            opacity: parallaxAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 0.1, 0.3],
            })
          }}
          className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-blue-900/20"
        />
        
        {/* Middle Layer - moves at medium speed */}
        <Animated.View 
          style={{ 
            transform: [{ 
              translateY: parallaxAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15],
              })
            }],
            opacity: parallaxAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.6, 0.3, 0.6],
            })
          }}
          className="absolute inset-0 bg-gradient-to-b from-indigo-800/30 to-purple-800/30"
        />
        
        {/* Foreground Layer - moves fastest */}
        <Animated.View 
          style={{ 
            transform: [{ 
              translateY: parallaxAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20],
              })
            }],
            opacity: parallaxAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0.8, 1],
            })
          }}
          className="flex-row flex-wrap justify-center gap-0"
        >
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
        </Animated.View>
      </ScrollView>

      {selectedAchievement && (
        <AchievementModal 
          visible={true} 
          onClose={handleCloseModal} 
          achievement={selectedAchievement} 
          onShare={handleShareAchievement}
          progress={getProgressForAchievement(selectedAchievement.id)}
        />
      )}
    </View>
  );
};

export default Achievements; 
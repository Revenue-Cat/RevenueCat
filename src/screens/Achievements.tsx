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
  ScrollView,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import AchievementModal from '../components/AchievementModal';
import ProgressRing from '../components/ProgressRing';
import ComingSoon from '../components/ComingSoon';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';
import { Achievement } from '../services/achievementService';
const AchievementLockedIcon = require('../assets/achievements/achievement-locked.png');
const AchievementBreatheIcon = require('../assets/achievements/achievement-breathe.png');
const LockIcon = require('../assets/achievements/lock.png');
const TimeIcon = require('../assets/achievements/time.png');
// Helper function to identify regular achievements
const isRegularAchievement = (achievementId: string): boolean => {
  const regularAchievementIds = [
    'first-spark',
    'hold-on', 
    'steel-week',
    'bright-moon',
    'fresh-path',
    'freedom',
    'hero',
    'legend'
  ];
  return regularAchievementIds.includes(achievementId);
};

// Helper function to check if achievement is in first 3 (excluding 100% progress achievements)
const isFirstThreeAchievement = (achievementId: string, allAchievements: any[], getProgressForAchievement: any): boolean => {
  const regularAchievementIds = [
    'first-spark',
    'hold-on', 
    'steel-week',
    'bright-moon',
    'fresh-path',
    'freedom',
    'hero',
    'legend'
  ];
  
  // Filter regular achievements that don't have 100% progress
  const nonCompletedRegularAchievements = regularAchievementIds.filter(id => {
    const progress = getProgressForAchievement(id);
    return progress.percentage < 100;
  });
  
  // Take the first 3 non-completed regular achievements
  const firstThreeNonCompleted = nonCompletedRegularAchievements.slice(0, 3);
  
  return firstThreeNonCompleted.includes(achievementId);
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
  const {achievements, getProgressForAchievement, startDate, selectedBackground } = useApp();
  
  // Helper function to parse gradient string and return colors
  const parseGradient = (gradientString: string): [string, string] => {
    // Extract colors from linear-gradient string - handle both formats
    const colorMatch = gradientString.match(/#[A-Fa-f0-9]{6}/g);
    if (colorMatch && colorMatch.length >= 2) {
      return [colorMatch[0], colorMatch[1]]; // Return first two colors
    }
    // Fallback: try to extract any hex colors
    const fallbackMatch = gradientString.match(/#[A-Fa-f0-9]{3,6}/g);
    if (fallbackMatch && fallbackMatch.length >= 2) {
      return [fallbackMatch[0], fallbackMatch[1]];
    }
    return ['#1F1943', '#4E3EA9']; // Default fallback
  };
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(null);
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
  const handleAchievementPress = useCallback((achievement: Achievement, progress: any) => {
    setSelectedAchievement({...achievement, progress: progress});
  }, []);

  // Memoize the modal close callback
  const handleCloseModal = useCallback(() => {
    setSelectedAchievement(null);
  }, []);

  console.log('filteredAchievements', filteredAchievements)
  
  const gradientColors = parseGradient(selectedBackground.backgroundColor);
  
  // Show Coming Soon for exclusive achievements
  if (isExclusiveSelected) {
    return (
      <View className="flex-1" style={{ backgroundColor: gradientColors[0] }}>
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

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 150,
            minHeight: Dimensions.get('window').height * 0.7,
          }}
          bounces={false}
          overScrollMode="never"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: parallaxAnim } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <ComingSoon />
        </ScrollView>
      </View>
    );
  }
  
  return (
    <View className="flex-1" style={{ backgroundColor: gradientColors[0] }}>
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

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 50,
          minHeight: Dimensions.get('window').height * 0.8,
        }}
        bounces={false}
        overScrollMode="never"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: parallaxAnim } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View className="flex-row flex-wrap justify-center gap-0">
          {filteredAchievements.map((achievement, index) => {
            const progress = getProgressForAchievement(achievement.id);
            const progressPercentage = progress.percentage;
            
            return (
              <View key={`${achievement.id}-${index}`} className="items-center w-1/4 p-3">
                <Pressable
                  className="w-[75px] h-[75px] rounded-full relative justify-center items-center"
                  onPress={() => handleAchievementPress(achievement, progress)}
                >
                  {/* Progress Ring */}
                  <ProgressRing
                    progress={isRegularAchievement(achievement.id) ? progressPercentage : 0}
                    size={75}
                    strokeWidth={3}
                    color={isFirstThreeAchievement(achievement.id, filteredAchievements, getProgressForAchievement) || progressPercentage === 100 ? '#22C55E' : 'transparent'}
                    // borderColor={!(isRegularAchievement(achievement.id) && (isFirstThreeAchievement(achievement.id, filteredAchievements, getProgressForAchievement) || progressPercentage === 100)) ? '#374151' : 'transparent'}
                  />
                  
                  {/* Achievement Icon */}
                  <View className="absolute w-[75px] h-[75px] rounded-full justify-center items-center">
                    {isRegularAchievement(achievement.id) ? (
                      // Regular achievements logic
                      <>
                        {isFirstThreeAchievement(achievement.id, filteredAchievements, getProgressForAchievement) || progressPercentage === 100 ? (
                          // First 3 achievements OR 100% progress: show achievement icon and green progress
                          <>
                            {achievement.icon ? (
                              <Image source={achievement.icon} className='w-[80px] h-[80px]' resizeMode="stretch" />
                            ) : (
                              <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                            )}
                            {/* Check icon for 100% progress */}
                            {progressPercentage === 100 && (
                              <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-6 h-6 justify-center items-center">
                                <Ionicons name="checkmark" size={12} color="white" />
                              </View>
                            )}
                            {/* Time icon for progress > 0 but < 100% */}
                            {progressPercentage > 0 && progressPercentage < 100 && (
                              <View className="absolute -top-1 -right-1 bg-white/20 rounded-full w-6 h-6 justify-center items-center">
                                <Image className='color-white p-0.5' source={TimeIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                              </View>
                            )}
                          </>
                        ) : (
                          // Other regular achievements: show lock icon and gray progress
                          <>
                            <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                            {/* Time icon for progress > 0 but < 100% */}
                            {progressPercentage > 0 && progressPercentage < 100 && (
                              <View className="absolute -top-1 -right-1 bg-white/20 rounded-full w-6 h-6 justify-center items-center">
                                <Image className='color-white p-0.5' source={TimeIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                              </View>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      // Exclusive achievements logic (unchanged)
                      <>
                        {achievement.unlocked ? (
                          <>
                            {achievement.icon ? (
                              <Image source={achievement.icon} className='w-[80px] h-[80px]' resizeMode="stretch" />
                            ) : (
                              <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                            )}
                            {/* Notification badge for unlocked exclusive achievements */}
                            <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-6 h-6 justify-center items-center">
                              <Text className="text-xs font-bold text-white">{achievement.notificationCount || 1}</Text>
                            </View>
                          </>
                        ) : (
                          <>
                            <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                          </>
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
      </ScrollView>

      {selectedAchievement && (
        <AchievementModal 
          visible={true} 
          onClose={handleCloseModal} 
          achievement={selectedAchievement} 
          progress={selectedAchievement?.progress}
          getProgressForAchievement={getProgressForAchievement}
        />
      )}
    </View>
  );
};

export default Achievements; 
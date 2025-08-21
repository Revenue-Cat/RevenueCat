import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import SlideModal from '../components/SlideModal';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';
const AchievementLockedIcon = require('../assets/achievements/achievement-locked.png');
const AchievementBreatheIcon = require('../assets/achievements/achievement-breathe.png');
const LockIcon = require('../assets/achievements/lock.png');

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  icon?: any;
  unlocked: boolean;
  notificationCount?: number;
}

interface AchievementsProps {
  onBack: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { selectedBuddyId, gender, userCoins, setShowCoinPurchase } = useApp();
  const sexKey: SexKey = gender === "lady" ? "w" : "m";
  
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  // Memoize the achievements array to prevent recreation on every render
  const achievements: Achievement[] = useMemo(() => [
    {
      id: "1",
      name: "Breathe",
      description: "Complete your first breathing exercise session",
      emoji: "🦙",
      icon: AchievementBreatheIcon,
      unlocked: true,
      notificationCount: 13
    },
    {
      id: "2",
      name: "HydroWin",
      description: "Drink 8 glasses of water for 7 days straight",
      emoji: "💧",
      unlocked: false
    },
    {
      id: "3",
      name: "Strider",
      description: "Take 10,000 steps for 5 consecutive days",
      emoji: "🚶",
      unlocked: false
    },
    {
      id: "4",
      name: "Snackcess",
      description: "Choose healthy snacks over junk food for a week",
      emoji: "🥗",
      unlocked: false
    },
    {
      id: "5",
      name: "Zen",
      description: "Complete 10 meditation sessions",
      emoji: "🧘",
      unlocked: false
    },
    {
      id: "6",
      name: "Gripped",
      description: "Hold a plank for 2 minutes",
      emoji: "💪",
      unlocked: false
    },
    {
      id: "7",
      name: "Splash",
      description: "Swim 20 laps in one session",
      emoji: "🏊",
      unlocked: false
    },
    {
      id: "8",
      name: "Released",
      description: "Practice stress relief techniques for 30 days",
      emoji: "🕊️",
      unlocked: false
    },
    {
      id: "9",
      name: "Stretched",
      description: "Complete daily stretching routine for 2 weeks",
      emoji: "🤸",
      unlocked: false
    },
    {
      id: "10",
      name: "Title",
      description: "Earn your first wellness champion title",
      emoji: "👑",
      unlocked: false
    },
    {
      id: "11",
      name: "Focus",
      description: "Complete 5 deep work sessions",
      emoji: "🎯",
      unlocked: false
    },
    {
      id: "12",
      name: "Balance",
      description: "Maintain work-life balance for a month",
      emoji: "⚖️",
      unlocked: false
    },
    {
      id: "13",
      name: "Mindful",
      description: "Practice mindfulness for 21 days straight",
      emoji: "🧘‍♀️",
      unlocked: false
    },
    {
      id: "14",
      name: "Hydration Hero",
      description: "Drink 2L of water daily for 30 days",
      emoji: "💧",
      unlocked: false
    },
    {
      id: "15",
      name: "Early Bird",
      description: "Wake up at 6 AM for 2 weeks",
      emoji: "🌅",
      unlocked: false
    },
    {
      id: "16",
      name: "Night Owl",
      description: "Get 8 hours of sleep for 30 days",
      emoji: "🌙",
      unlocked: false
    },
    {
      id: "17",
      name: "Fitness Fanatic",
      description: "Exercise 5 days a week for a month",
      emoji: "🏃‍♂️",
      unlocked: false
    },
    {
      id: "18",
      name: "Meditation Master",
      description: "Complete 50 meditation sessions",
      emoji: "🧘‍♂️",
      unlocked: false
    },
    {
      id: "19",
      name: "Nutritionist",
      description: "Eat healthy meals for 60 days",
      emoji: "🥗",
      unlocked: false
    },
    {
      id: "20",
      name: "Stress Buster",
      description: "Practice stress relief for 45 days",
      emoji: "😌",
      unlocked: false
    },
    {
      id: "21",
      name: "Productivity Pro",
      description: "Complete 100 focused work sessions",
      emoji: "📈",
      unlocked: false
    },
    {
      id: "22",
      name: "Social Butterfly",
      description: "Connect with 10 new people",
      emoji: "🦋",
      unlocked: false
    },
    {
      id: "23",
      name: "Learning Legend",
      description: "Learn something new for 90 days",
      emoji: "📚",
      unlocked: false
    },
    {
      id: "24",
      name: "Gratitude Guru",
      description: "Practice gratitude for 100 days",
      emoji: "🙏",
      unlocked: false
    }
  ], []);

  // Memoize the achievement selection callback
  const handleAchievementPress = useCallback((achievement: Achievement) => {
    setSelectedAchievement(achievement);
  }, []);

  // Memoize the modal close callback
  const handleCloseModal = useCallback(() => {
    setSelectedAchievement(null);
  }, []);
  console.log("TESTSS")

  // Memoize the achievements grid
  const achievementsGrid = useMemo(() => (
    <View className="flex-row flex-wrap gap-0">
      {achievements.map((achievement, index) => (
        <View key={`${achievement.id}-${index}`} className="items-center w-1/4 p-2">
          <Pressable
            className={`w-[75px] h-[75px] rounded-full relative ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-green-400 to-yellow-400 border-2 border-green-300 shadow-lg' 
                : 'bg-white/10 border border-white/20'
            }`}
            onPress={() => handleAchievementPress(achievement)}
          >
            {achievement.unlocked ? (
              <>
                {achievement.icon ? (
                    <Image source={AchievementBreatheIcon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                ) : (
                    <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
                  
                )}
                <View className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 justify-center items-center">
                  <Text className="text-xs font-bold text-white">{achievement.notificationCount}</Text>
                </View>
              </>
            ) : (
              <>
                <View className="items-center w-full h-full">
                    <Image source={AchievementLockedIcon} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
                </View>
                <View className="absolute -top-2 -right-2 bg-white/20 rounded-full w-6 h-6 justify-center items-center">
                  <Image source={LockIcon} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
                </View>
              </>
            )}
          </Pressable>
          <Text className={`text-xs mt-2 text-center ${achievement.unlocked ? 'text-white' : 'text-white/50'}`}>
            {achievement.name}
          </Text>
        </View>
      ))}
    </View>
  ), [achievements, handleAchievementPress]);

  return (
    <View className="flex-1 h-full py-2">
      <ScrollView className="flex-1" >
        {/* Achievements Grid */}
        {achievementsGrid}
      </ScrollView>

      {selectedAchievement && (
        <SlideModal visible={true} onClose={handleCloseModal} title="Achievement details">
          <View className="items-center">
            <View className="w-24 h-24 bg-white/10 rounded-full justify-center items-center mb-4">
              {selectedAchievement.unlocked ? (
                <Text className="text-5xl">{selectedAchievement.emoji}</Text>
              ) : (
                <View className="w-12 h-12 bg-white/30 rounded-full" />
              )}
            </View>
            
            <View className="items-center mb-6">
              <Text className="text-lg font-bold text-white mb-2 text-center">
                {selectedAchievement.name}
              </Text>
              <Text className="text-sm text-white/70 text-center leading-5">
                {selectedAchievement.description}
              </Text>
            </View>
          </View>
        </SlideModal>
      )}
    </View>
  );
};

export default React.memo(Achievements); 
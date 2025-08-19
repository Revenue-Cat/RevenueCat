import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import SlideModal from '../components/SlideModal';
import ParallaxBackground from '../components/ParallaxBackground';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
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
  const scrollY = new Animated.Value(0);
  
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "First Step",
      description: "Complete your first day smoke-free",
      emoji: "👣",
      unlocked: true
    },
    {
      id: "2",
      name: "Week Warrior",
      description: "Stay smoke-free for 7 days straight",
      emoji: "⚡",
      unlocked: false
    },
    {
      id: "3",
      name: "Chill Capybar",
      description: "Stays calm when cravings creep in — too chill to care, too lazy to light up. 😎🦫",
      emoji: "🦫",
      unlocked: true
    },
    {
      id: "4",
      name: "Money Saver",
      description: "Save your first $50 by not smoking",
      emoji: "💰",
      unlocked: true
    },
    {
      id: "5",
      name: "Health Hero",
      description: "Notice improved breathing after 2 weeks",
      emoji: "❤️",
      unlocked: false
    },
    {
      id: "6",
      name: "Social Supporter",
      description: "Help someone else quit smoking",
      emoji: "🤝",
      unlocked: false
    },
    {
      id: "7",
      name: "Month Master",
      description: "Complete 30 days smoke-free",
      emoji: "🏆",
      unlocked: false
    },
    {
      id: "8",
      name: "Craving Crusher",
      description: "Successfully resist 10 strong cravings",
      emoji: "💪",
      unlocked: true
    },
    // Add more achievements for a full grid
    ...Array.from({ length: 24 }, (_, i) => ({
      id: `${i + 9}`,
      name: `Achievement ${i + 9}`,
      description: `Description for achievement ${i + 9}`,
      emoji: "🏆",
      unlocked: false
    }))
  ];

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Achievements Grid */}
        <View className="flex-row flex-wrap gap-2 justify-center">
          {achievements.map((achievement) => (
            <Pressable
              key={achievement.id}
              className={`w-[70px] aspect-square rounded-xl justify-center items-center ${
                achievement.unlocked ? 'bg-white/10' : 'bg-white/5'
              }`}
              onPress={() => setSelectedAchievement(achievement)}
            >
              {achievement.unlocked ? (
                <Text className="text-2xl">{achievement.emoji}</Text>
              ) : (
                <View className="w-8 h-8 bg-white/30 rounded-full" />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {selectedAchievement && (
        <SlideModal visible={true} onClose={() => setSelectedAchievement(null)} title="Achievement details">
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



export default Achievements; 
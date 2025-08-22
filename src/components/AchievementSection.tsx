import React, { useState, useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AchievementCard from './AchievementCard';

// Achievement Cards Data - moved outside component to prevent recreation
const achievementCards = [
  {
    id: 1,
    title: "First spark",
    description: "First 24 hours without smoke...",
    reward: 150,
    timeLeft: "4h left",
    emoji: "🐻"
  },
  {
    id: 2,
    title: "Hold on",
    description: "Three days smoke-free — pro...",
    reward: 300,
    timeLeft: "2d 23h left",
    emoji: "🐨"
  },
  {
    id: 3,
    title: "Steel week",
    description: "One week without nicotine —...",
    reward: 500,
    timeLeft: "5d 12h left",
    emoji: "🦓"
  }
];

interface AchievementSectionProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AchievementSection: React.FC<AchievementSectionProps> = ({
  isCollapsed,
  onToggle
}) => {
  // Memoize the achievement cards rendering
  const achievementCardsContent = useMemo(() => (
    <View className="mb-1">            
      {achievementCards.map((card) => (
        <AchievementCard
          key={card.id}
          title={card.title}
          description={card.description}
          reward={card.reward}
          timeLeft={card.timeLeft}
          emoji={card.emoji}
        />
      ))}
    </View>
  ), []);

  // Memoize the collapsed achievement view
  const collapsedAchievementView = useMemo(() => (
    <View className="mb-1 relative" style={{ minHeight: 160 }}>
      {/* Card Stack Background - Cascade Effect */}
      <View className="absolute top-0 left-0 right-0 h-56" style={{ zIndex: 1 }}>
        {/* Card 2 - Middle (medium) - positioned in middle */}
        <View className="absolute top-28 left-4 right-4 h-10 bg-white/55 rounded-xl" />
        {/* Card 3 - Back (smallest) - positioned behind everything */}
        <View className="absolute top-24 left-2 right-2 h-12 bg-white/75 rounded-xl" />
      </View>

      {/* Main Card - Front layer */}
      <View style={{ zIndex: 2, marginTop: 0 }}>
        <AchievementCard
          title={achievementCards[0].title}
          description={achievementCards[0].description}
          reward={achievementCards[0].reward}
          timeLeft={achievementCards[0].timeLeft}
          emoji={achievementCards[0].emoji}
        />
      </View>
    </View>
  ), []);

  return (
    <View className="relative px-5">
      {/* Toggle Arrow Button */}
      <Pressable 
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 bg-black/20 rounded-full justify-center items-center border-2 border-green-500"
        onPress={onToggle}
      >
        <Ionicons 
          name={isCollapsed ? "chevron-down" : "chevron-up"} 
          size={20} 
          color="#ffffff" 
        />
      </Pressable>

      {!isCollapsed ? achievementCardsContent : collapsedAchievementView}
    </View>
  );
};

export default AchievementSection;

import React, { useState, useMemo } from 'react';
import { View, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AchievementCard from './AchievementCard';
import { useApp } from '../contexts/AppContext';

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

interface AchievementSectionProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AchievementSection: React.FC<AchievementSectionProps> = ({
  isCollapsed,
  onToggle
}) => {
  const { achievements, getProgressForAchievement } = useApp();

  // Get the first 3 non-completed regular achievements
  const firstThreeAchievements = useMemo(() => {
    const regularAchievements = achievements.filter(achievement => 
      isRegularAchievement(achievement.id)
    );

    const nonCompletedRegularAchievements = regularAchievements.filter(achievement => {
      const progress = getProgressForAchievement(achievement.id);
      return progress.percentage < 100;
    });

    return nonCompletedRegularAchievements.slice(0, 3);
  }, [achievements, getProgressForAchievement]);

  // Memoize the achievement cards rendering
  const achievementCardsContent = useMemo(() => (
    <View className="mb-1">            
      {firstThreeAchievements.map((achievement) => {
        const progress = getProgressForAchievement(achievement.id);
        const timeLeft = progress.percentage === 100 ? "Completed!" : `${Math.max(0, progress.max - progress.current)}d left`;
        
        return (
          <AchievementCard
            key={achievement.id}
            title={achievement.name}
            description={achievement.description}
            reward={achievement.coins || 0}
            timeLeft={timeLeft}
            emoji={achievement.emoji}
            icon={achievement.icon}
            progressPercentage={progress.percentage}
            isFirstThree={true}
            isRegularAchievement={true}
          />
        );
      })}
    </View>
  ), [firstThreeAchievements, getProgressForAchievement]);

  // Memoize the collapsed achievement view
  const collapsedAchievementView = useMemo(() => {
    if (firstThreeAchievements.length === 0) return null;
    
    const firstAchievement = firstThreeAchievements[0];
    const progress = getProgressForAchievement(firstAchievement.id);
    const timeLeft = progress.percentage === 100 ? "Completed!" : `${Math.max(0, progress.max - progress.current)}d left`;

    return (
      <View className="mb-1 relative" style={{ minHeight: 160 }}>
        {/* Card Stack Background - Cascade Effect */}
        <View className="absolute top-0 left-0 right-0 h-56" style={{ zIndex: 1 }}>
          {/* Card 2 - Middle (medium) - positioned in middle */}
          {firstThreeAchievements.length > 1 && (
            <View className="absolute top-28 left-4 right-4 h-10 bg-white/55 rounded-xl" />
          )}
          {/* Card 3 - Back (smallest) - positioned behind everything */}
          {firstThreeAchievements.length > 2 && (
            <View className="absolute top-24 left-2 right-2 h-12 bg-white/75 rounded-xl" />
          )}
        </View>

        {/* Main Card - Front layer */}
        <View style={{ zIndex: 2, marginTop: 0 }}>
          <AchievementCard
            title={firstAchievement.name}
            description={firstAchievement.description}
            reward={firstAchievement.coins || 0}
            timeLeft={timeLeft}
            emoji={firstAchievement.emoji}
            icon={firstAchievement.icon}
            progressPercentage={progress.percentage}
            isFirstThree={true}
            isRegularAchievement={true}
          />
        </View>
      </View>
    );
  }, [firstThreeAchievements, getProgressForAchievement]);

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

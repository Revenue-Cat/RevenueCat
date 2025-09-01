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
    <View className="mb-1 pb-8 relative">            
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
    
    return (
      <View className="mb-4 relative overflow-visible" style={{ height: 160 }}>
        {/* Card Stack - Show actual achievement cards */}
        <View className="absolute top-0 left-0 right-0 bottom-0" style={{ zIndex: 1 }}>
          {/* Card 2 - Second achievement (showing a little) */}
          {firstThreeAchievements.length > 1 && (
            <View className="absolute bg-white bottom-1 rounded-xl left-4 right-4 h-20 opacity-70 border"/>
          )}
          {/* Card 3 - Third achievement (showing a little less) */}
          {firstThreeAchievements.length > 2 && (
            <View className="absolute bg-white  -bottom-1 rounded-xl left-8 right-8 h-14 opacity-50"  />
          )}
        </View>

        {/* Main Card - First achievement (front layer) */}
        <View style={{ zIndex: 2, marginTop: 0 }}>
          <AchievementCard
            title={firstThreeAchievements[0].name}
            description={firstThreeAchievements[0].description}
            reward={firstThreeAchievements[0].coins || 0}
            timeLeft={(() => {
              const progress = getProgressForAchievement(firstThreeAchievements[0].id);
              return progress.percentage === 100 ? "Completed!" : `${Math.max(0, progress.max - progress.current)}d left`;
            })()}
            emoji={firstThreeAchievements[0].emoji}
            icon={firstThreeAchievements[0].icon}
            progressPercentage={getProgressForAchievement(firstThreeAchievements[0].id).percentage}
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
        className="absolute bottom-2 right-1/2 left-1/2 z-10 bg-black/50 rounded-full justify-center items-center px-1 py-2 z-5"
        onPress={onToggle}
      >
        <Ionicons 
          name={isCollapsed ? "arrow-down" : "arrow-up"} 
          size={20} 
          color="#ffffff"
        />
      </Pressable>

      {!isCollapsed ? achievementCardsContent : collapsedAchievementView}
    </View>
  );
};

export default AchievementSection;

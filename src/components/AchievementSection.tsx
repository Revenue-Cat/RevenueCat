import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Pressable, Image, Animated } from 'react-native';
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
// const isFirstThreeAchievement = (achievementId: string, allAchievements: any[], getProgressForAchievement: any): boolean => {
//   const regularAchievementIds = [
//     'first-spark',
//     'hold-on', 
//     'steel-week',
//     'bright-moon',
//     'fresh-path',
//     'freedom',
//     'hero',
//     'legend'
//   ];
  
//   // Filter regular achievements that don't have 100% progress
//   const nonCompletedRegularAchievements = regularAchievementIds.filter(id => {
//     const progress = getProgressForAchievement(id);
//     return progress.percentage < 100;
//   });
  
//   // Take the first 3 non-completed regular achievements
//   const firstThreeNonCompleted = nonCompletedRegularAchievements.slice(0, 3);
  
//   return firstThreeNonCompleted.includes(achievementId);
// };

interface AchievementSectionProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AchievementSection: React.FC<AchievementSectionProps> = ({
  isCollapsed,
  onToggle
}) => {
  const { achievements, getProgressForAchievement } = useApp();
  
  // Unified animation values for smooth cascading effect
  const cardAnimations = useRef([
    new Animated.Value(1), // Card 1 - always visible
    new Animated.Value(0), // Card 2 - starts hidden
    new Animated.Value(0)  // Card 3 - starts hidden
  ]).current;

  // Separate animations for collapsed state preview cards
  const collapsedPreviewAnims = useRef([
    new Animated.Value(0), // Card 2 preview - starts hidden
    new Animated.Value(0)  // Card 3 preview - starts hidden
  ]).current;

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

  // Initialize animations properly on mount
  useEffect(() => {
    if (isCollapsed && firstThreeAchievements.length > 0) {
      // Set collapsed preview to visible on initial render if collapsed
      collapsedPreviewAnims[0].setValue(1);
      collapsedPreviewAnims[1].setValue(1);
    }
  }, [isCollapsed, firstThreeAchievements.length]);

  // Cascade animation effect - separate logic for expanded and collapsed states
  useEffect(() => {
    // Stop any ongoing animations first
    cardAnimations.forEach(anim => anim.stopAnimation());
    collapsedPreviewAnims.forEach(anim => anim.stopAnimation());

    if (isCollapsed) {
      // When collapsing, animate cards out with the same logic as expanding
      // First hide collapsed preview instantly
      collapsedPreviewAnims[0].setValue(0);
      collapsedPreviewAnims[1].setValue(0);

      // Then animate expanded cards out with reverse stagger
      setTimeout(() => {
        Animated.stagger(1, [
          Animated.timing(cardAnimations[2], {
            toValue: 0,
            duration: 10,
            useNativeDriver: true,
          }),
          Animated.timing(cardAnimations[1], {
            toValue: 0,
            duration: 10,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // After expanded cards are hidden, show collapsed preview
          setTimeout(() => {
            Animated.stagger(1, [
              Animated.timing(collapsedPreviewAnims[0], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(collapsedPreviewAnims[1], {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start();
          }, 20);
        });
      }, 16);
    } else {
      // When expanding, hide collapsed preview and animate expanded cards in
      collapsedPreviewAnims[0].setValue(0);
      collapsedPreviewAnims[1].setValue(0);

      // Animate expanded cards in with smooth stagger
      cardAnimations[1].setValue(0);
      cardAnimations[2].setValue(0);

      setTimeout(() => {
        Animated.stagger(150, [
          Animated.timing(cardAnimations[1], {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(cardAnimations[2], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, 16);
    }
  }, [isCollapsed]);

  // Memoize the achievement cards rendering with animations
  const achievementCardsContent = useMemo(() => (
    <Animated.View 
      className="mb-1 pb-8 relative"
    >            
      {firstThreeAchievements.map((achievement, index) => {
        const progress = getProgressForAchievement(achievement.id);
        const timeLeft = progress.percentage === 100 ? "Completed!" : `${Math.max(0, progress.max - progress.current)}d left`;
        
        if (index === 0) {
          // First card - no animation, appears immediately
          return (
            <View key={achievement.id}>
              <AchievementCard
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
            </View>
          );
        }
        
        // Other cards - with smooth cascade animation
        return (
          <Animated.View
            key={achievement.id}
            style={{
              opacity: cardAnimations[index],
              transform: [{
                translateY: cardAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0]
                })
              }]
            }}
          >
            <AchievementCard
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
          </Animated.View>
        );
      })}
    </Animated.View>
  ), [firstThreeAchievements, getProgressForAchievement, cardAnimations]);

  // Memoize the collapsed achievement view with animations
  const collapsedAchievementView = useMemo(() => {
    if (firstThreeAchievements.length === 0) return null;
    
    return (
      <View className="mb-4 relative overflow-visible" style={{ height: 160 }}>
        {/* Card Stack - Show actual achievement cards with animations */}
        <View className="absolute top-0 left-0 right-0 bottom-0" style={{ zIndex: 1 }}>
          {/* Card 2 - Second achievement (showing a little) */}
          {firstThreeAchievements.length > 1 && (
            <Animated.View
              className="absolute bg-white bottom-1 rounded-xl left-4 right-4 h-20 border"
              style={{
                opacity: collapsedPreviewAnims[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.7] // Fade in to 70% opacity
                }),
                transform: [{
                  translateY: collapsedPreviewAnims[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0] // Changed to top to bottom direction
                  })
                }]
              }}
            />
          )}
          {/* Card 3 - Third achievement (showing a little less) */}
          {firstThreeAchievements.length > 2 && (
            <Animated.View
              className="absolute bg-white -bottom-1 rounded-xl left-8 right-8 h-14"
              style={{
                opacity: collapsedPreviewAnims[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5] // Fade in to 50% opacity
                }),
                transform: [{
                  translateY: collapsedPreviewAnims[1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0] // Changed to top to bottom direction
                  })
                }]
              }}
            />
          )}
        </View>

        {/* Main Card - First achievement (front layer) */}
        <View 
          style={{ 
            zIndex: 2, 
            marginTop: 0
          }}
        >
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
  }, [firstThreeAchievements, getProgressForAchievement, collapsedPreviewAnims]);

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

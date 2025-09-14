import React, { useState, useMemo, useEffect } from 'react';
import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import AchievementCard from './AchievementCard';
import { useApp } from '../contexts/AppContext';
import { achievementService } from '../services/achievementService';
import { useTheme } from '../contexts/ThemeContext';

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


interface AchievementSectionProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNavigateToProgressChallenges?: () => void;
}

const AchievementSection: React.FC<AchievementSectionProps> = ({
  isCollapsed,
  onToggle,
  onNavigateToProgressChallenges
}) => {
  const { t } = useTranslation();
  const { achievements, getProgressForAchievement } = useApp();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Reanimated shared values for second and third card animations
  const secondCardOpacity = useSharedValue(0);
  const secondCardTranslateY = useSharedValue(-30); // Start above (top to bottom animation)
  const thirdCardOpacity = useSharedValue(0);
  const thirdCardTranslateY = useSharedValue(-30); // Start above (top to bottom animation)

  // Get translated achievements
  const translatedAchievements = useMemo(
    () => achievementService.getTranslatedAchievements(t),
    [t]
  );

  // Animation: first card instant, second and third cards slide from top to bottom
  useEffect(() => {
    if (!isCollapsed) {
      // Reset second and third cards for animation (start from above)
      secondCardOpacity.value = 0;
      secondCardTranslateY.value = -30;
      thirdCardOpacity.value = 0;
      thirdCardTranslateY.value = -30;

      // Animate second card first (slide down from top to bottom)
      secondCardOpacity.value = withDelay(100, withTiming(1, { duration: 350 }));
      secondCardTranslateY.value = withDelay(100, withTiming(0, { duration: 350 }));

      // Animate third card with longer delay (slide down from top to bottom)
      thirdCardOpacity.value = withDelay(250, withTiming(1, { duration: 400 }));
      thirdCardTranslateY.value = withDelay(250, withTiming(0, { duration: 400 }));
    } else {
      // Instant reset when collapsing
      secondCardOpacity.value = 0;
      secondCardTranslateY.value = -30;
      thirdCardOpacity.value = 0;
      thirdCardTranslateY.value = -30;
    }
  }, [isCollapsed, secondCardOpacity, secondCardTranslateY, thirdCardOpacity, thirdCardTranslateY]);

  // Get the first 3 non-completed regular achievements (using translated achievements)
  const firstThreeAchievements = useMemo(() => {
    const regularAchievements = translatedAchievements.filter(achievement => 
      isRegularAchievement(achievement.id)
    );

    const nonCompletedRegularAchievements = regularAchievements.filter(achievement => {
      const progress = getProgressForAchievement(achievement.id);
      return progress.percentage < 100;
    });

    return nonCompletedRegularAchievements.slice(0, 3);
  }, [translatedAchievements, getProgressForAchievement]);

  // Create animated styles for second and third cards
  const secondCardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: secondCardOpacity.value,
    transform: [{ translateY: secondCardTranslateY.value }],
  }));

  const thirdCardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: thirdCardOpacity.value,
    transform: [{ translateY: thirdCardTranslateY.value }],
  }));

  // Memoize the achievement cards rendering with Reanimated animations
  const achievementCardsContent = useMemo(() => (
    <View className="mb-1 pb-8 relative">
      {firstThreeAchievements.map((achievement, index) => {
        const progress = getProgressForAchievement(achievement.id);
        const timeLeft = progress.percentage === 100
          ? String(t('achievements.completed', 'Completed!'))
          : t('achievements.daysLeft', '{{days}}d left', { days: Math.max(0, progress.max - progress.current) });

        if (index === 0) {
          // First card - always visible, no animation
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
        } else if (index === 1) {
          // Second card - smooth Reanimated animation (slide from top to bottom)
          return (
            <Animated.View key={achievement.id} style={secondCardAnimatedStyle}>
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
        } else if (index === 2) {
          // Third card - smooth Reanimated animation with delay (slide from top to bottom)
          return (
            <Animated.View key={achievement.id} style={thirdCardAnimatedStyle}>
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
        }

        return null;
      })}
    </View>
  ), [firstThreeAchievements, getProgressForAchievement, secondCardAnimatedStyle, thirdCardAnimatedStyle]);

  // Memoize the collapsed achievement view
  const collapsedAchievementView = useMemo(() => {
    if (firstThreeAchievements.length === 0) return null;

    return (
      <View className="mb-4 relative overflow-visible" style={{ height: 160 }}>
        {/* Card Stack - Show preview cards */}
        <View className="absolute top-0 left-0 right-0 bottom-0" style={{ zIndex: 1 }}>
          {/* Card 2 - Second achievement (showing a little) */}
          {firstThreeAchievements.length > 1 && (
            <View
              className={`absolute ${isDark ? 'bg-slate-700' : 'bg-white'} bottom-7 rounded-xl left-4 right-4 h-20 border`}
              style={{
                opacity: 0.7, // Fixed opacity
                transform: [{ translateY: 0 }] // Fixed position
              }}
            />
          )}
          {/* Card 3 - Third achievement (showing a little less) */}
          {firstThreeAchievements.length > 2 && (
            <View
              className={`absolute ${isDark ? 'bg-slate-700' : 'bg-white'} bottom-5 rounded-xl left-8 right-8 h-14`}
              style={{
                opacity: 0.5, // Fixed opacity
                transform: [{ translateY: 0 }] // Fixed position
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
              return progress.percentage === 100
                ? String(t('achievements.completed', 'Completed!'))
                : t('achievements.daysLeft', '{{days}}d left', { days: Math.max(0, progress.max - progress.current) });
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
  }, [firstThreeAchievements, getProgressForAchievement, isDark, t]);

  return (
    <View className="relative px-5">
      {/* Toggle Arrow Button */}
      <Pressable 
        className="absolute bottom-2 right-1/2 left-1/2 z-10 bg-black/50 rounded-full justify-center items-center px-1 py-2"
        onPress={onToggle}
      >
        <Ionicons 
          name={isCollapsed ? "arrow-down" : "arrow-up"} 
          size={20} 
          color="#ffffff"
        />
      </Pressable>

      {/* More Button - Only show when cards are open, positioned in bottom right corner */}
        {!isCollapsed && onNavigateToProgressChallenges && (
          <Pressable 
            className="absolute bottom-2 right-5 z-10 bg-black/50 rounded-full justify-center items-center px-3 py-2 flex-row gap-1"
            onPress={onNavigateToProgressChallenges}
          >
            <Text className="text-white text-md">{t('achievements.more', 'More')}</Text>
            <Ionicons 
              name="arrow-forward" 
              size={16} 
              color="#ffffff"
            />
          </Pressable>
        )}

      {!isCollapsed ? achievementCardsContent : collapsedAchievementView}
    </View>
  );
};

export default AchievementSection;

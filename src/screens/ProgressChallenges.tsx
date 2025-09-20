import React, { useMemo, useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useApp } from "../contexts/AppContext";
import AchievementCard from "../components/AchievementCard";
import AchievementModal from "../components/AchievementModal";
import { Achievement } from "../services/achievementService";
import { achievementService } from "../services/achievementService";

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
const isFirstThreeAchievement = (
  achievementId: string,
  allAchievements: any[],
  getProgressForAchievement: any
): boolean => {
  const originalRegularAchievementIds = [
    "first-spark",
    "hold-on",
    "steel-week",
    "bright-moon",
    "fresh-path",
    "freedom",
    "hero",
    "legend",
  ];

  // Filter original regular achievements that don't have 100% progress
  const nonCompletedOriginalAchievements = originalRegularAchievementIds.filter(
    (id) => {
      const progress = getProgressForAchievement(id);
      return progress.percentage < 100;
    }
  );

  // Take the first 3 non-completed original regular achievements
  const firstThreeNonCompleted = nonCompletedOriginalAchievements.slice(0, 3);

  return firstThreeNonCompleted.includes(achievementId);
};

interface ProgressChallengesProps {
  onBack: () => void;
}

const ProgressChallenges: React.FC<ProgressChallengesProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { selectedBackground, achievements, getProgressForAchievement } = useApp();
  
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(null);

  // Get translated achievements
  const translatedAchievements = useMemo(
    () => achievementService.getTranslatedAchievements(t),
    [t]
  );

  // Memoize the achievement selection callback
  const handleAchievementPress = useCallback(
    (achievement: Achievement, progress: any) => {
      setSelectedAchievement({ ...achievement, progress: progress });
    },
    []
  );

  // Memoize the modal close callback
  const handleCloseModal = useCallback(() => {
    setSelectedAchievement(null);
  }, []);

  // Get all regular achievements (using translated achievements)
  const allRegularAchievements = useMemo(() => {
    return translatedAchievements.filter(achievement => 
      isRegularAchievement(achievement.id)
    );
  }, [translatedAchievements]);

  // Helper function to parse gradient string and return colors
  const parseGradient = (gradientString: string): [string, string] => {
    const colorMatch = gradientString.match(/#[A-Fa-f0-9]{6}/g);
    if (colorMatch && colorMatch.length >= 2) {
      return [colorMatch[0], colorMatch[1]];
    }
    const fallbackMatch = gradientString.match(/#[A-Fa-f0-9]{3,6}/g);
    if (fallbackMatch && fallbackMatch.length >= 2) {
      return [fallbackMatch[0], fallbackMatch[1]];
    }
    return ["#1F1943", "#4E3EA9"]; // Default fallback
  };


  return (
    <View
      className={`flex-1 absolute inset-0 ${isDark ? "bg-dark-background" : "bg-indigo-50"}`}>
      {/* Header */}
      <View className="relative mt-16 pl-3">
        <Pressable
          className="w-10 h-10 rounded-full justify-center items-center z-10"
          onPress={onBack}
        >
          <Ionicons 
            name="arrow-back" 
            size={20} 
            color={isDark ? "#f1f5f9" : "#1e1b4b"}
          />
        </Pressable>
        
        <Text
          className={`absolute top-1 left-0 right-0 text-xl font-semibold text-center ${
            isDark ? "text-slate-100" : "text-indigo-950"
          }`}
          style={{ zIndex: 1 }}
        >
          {t('progressChallenges.title', 'Progress challenges')}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1">
          {allRegularAchievements.map((achievement) => {
            const progress = getProgressForAchievement(achievement.id);
            const timeLeft = progress.percentage === 100 
              ? String(t('achievements.completed', 'Completed!')) 
              : t('achievements.daysLeft', '{{days}}d left', { days: Math.max(0, progress.max - progress.current) });
            
            // Determine progress ring color using the same logic as Achievements screen
            const progressRingColor = 
              isFirstThreeAchievement(achievement.id, allRegularAchievements, getProgressForAchievement) || 
              progress.percentage === 100
                ? "#22C55E"  // Green for first 3 non-completed or 100% completed
                : "transparent";  // Transparent for others
            
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
                isFirstThree={isFirstThreeAchievement(achievement.id, allRegularAchievements, getProgressForAchievement)}
                isRegularAchievement={true}
                onPress={() => handleAchievementPress(achievement, progress)}
                progressRingColor={progressRingColor}
              />
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

export default ProgressChallenges;

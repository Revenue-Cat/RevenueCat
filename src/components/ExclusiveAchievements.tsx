import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useApp } from "../contexts/AppContext";
import { CHALLENGES_DATA, ChallengeData } from "../data/challengesData";
import ProgressRing from "./ProgressRing";
import LockLight from "../assets/icons/lock.svg";
import ExclusiveAchievementsModal from "./ExclusiveAchievementsModal";

const AchievementLockedIcon = require("../assets/achievements/achievement-locked.png");
const LockIcon = require("../assets/achievements/lock.png");

interface ExclusiveAchievementsProps {
  onAchievementPress?: (achievement: ChallengeData) => void;
}

const ExclusiveAchievements: React.FC<ExclusiveAchievementsProps> = ({
  onAchievementPress,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { 
    selectedBackground, 
    getChallengeStatus, 
    getChallengeProgress, 
    getChallengeCompletions,
    calculateProgressBasedOnTime,
    getProgressForAchievement
  } = useApp();

  // State for selected challenge modal
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);

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
    return ["#1F1943", "#4E3EA9"];
  };

  const gradientColors = parseGradient(selectedBackground.backgroundColor);

  // Helper function to map challenge IDs to translation keys
  const getChallengeTranslationKey = (challengeId: string): string => {
    const mapping: Record<string, string> = {
      'master-of-air-breathing': 'masterOfAir',
      'master-of-air-water': 'hydrationBoost',
      'master-of-air-walk': 'stepSlayer',
      'snack-break': 'snackBreak',
      'calm-power': 'calmPower',
      'fist-flow': 'fistFlow',
      'refresh': 'refresh',
      'crave-crusher': 'craveCrusher',
      'flow-minute': 'flowMinute'
    };
    return mapping[challengeId] || challengeId;
  };

  // Get translated challenges with progress data
  const challengesWithProgress = useMemo(() => {
    const challenges = CHALLENGES_DATA.map(challenge => {
      const status = getChallengeStatus(challenge.id);
      const progressData = getChallengeProgress(challenge.id);
      const previousCompletions = getChallengeCompletions(challenge.id);
      
      // Calculate time-based progress
      const timeBasedProgress = progressData.startDate 
        ? calculateProgressBasedOnTime(
            challenge.id, 
            challenge.duration, 
            progressData.startDate
          ) 
        : 0;

      // Get translated title and description
      const challengeKey = getChallengeTranslationKey(challenge.id);
      const translatedTitle = t(`challenges.data.${challengeKey}.title`);
      const translatedDescription = t(`challenges.data.${challengeKey}.shortDescription`);

      return {
        ...challenge,
        title: translatedTitle,
        shortDescription: translatedDescription,
        status,
        progressData,
        previousCompletions,
        timeBasedProgress
      };
    });

    // Sort challenges: completed first, then in-progress, then locked
    return challenges.sort((a, b) => {
      const aCompleted = a.timeBasedProgress >= a.totalDurations;
      const bCompleted = b.timeBasedProgress >= b.totalDurations;
      const aInProgress = a.status === 'inprogress';
      const bInProgress = b.status === 'inprogress';

      // Completed challenges first
      if (aCompleted && !bCompleted) return -1;
      if (!aCompleted && bCompleted) return 1;

      // In-progress challenges second
      if (aInProgress && !bInProgress && !bCompleted) return -1;
      if (!aInProgress && bInProgress && !aCompleted) return 1;

      // Keep original order for same status
      return 0;
    });
  }, [getChallengeStatus, getChallengeProgress, getChallengeCompletions, calculateProgressBasedOnTime, t]);


  const handleAchievementPress = useCallback(
    (challenge: ChallengeData) => {
      setSelectedChallenge(challenge);
      if (onAchievementPress) {
        onAchievementPress(challenge);
      }
    },
    [onAchievementPress]
  );

  // Modal close handler
  const handleCloseModal = useCallback(() => {
    setSelectedChallenge(null);
  }, []);

  return (
    <View
      className={`flex-1 ${isDark ? "bg-dark-background" : ""}`}
      style={{ backgroundColor: isDark ? undefined : gradientColors[0] }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 20,
        }}
        bounces={false}
        overScrollMode="never"
      >
    
        {/* Achievements Grid */}
        <View className="flex-row flex-wrap gap-0 justify-between">
          {challengesWithProgress.map((challenge, index) => {
            const isCompleted = challenge.status === 'completed';
            const isInProgress = challenge.status === 'inprogress';
            const isLocked = challenge.status === 'locked';
            const completionCount = challenge.previousCompletions.length;
            const isActive = challenge.status === 'active';
              
            return (
              <View
                key={`${challenge.id}-${index}`}
                className="items-center w-[25%] mb-8"
              >
                <Pressable
                  className="w-[70px] h-[70px] rounded-full relative justify-center items-center"
                  onPress={() => handleAchievementPress(challenge)}
                >
                  {/* Progress Ring */}
                  <ProgressRing
                    progress={isCompleted ? 100 : challenge.timeBasedProgress+1}
                    size={80}
                    strokeWidth={3}
                    color={
                        (isCompleted ||  isInProgress || completionCount > 0) 
                        ? "#22C55E" 
                        : "transparent"
                    }
                    borderColor={isDark ? "#475569" : "#626366"}
                    />
                  {/* Achievement Icon */}
                  <View className="absolute w-[70px] h-[70px] rounded-full justify-center items-center">
                    {challenge.achievementIcon && !isLocked && !isActive ? (
                      <Image
                        source={challenge.achievementIcon}
                        style={{ width: 80, height: 80 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={AchievementLockedIcon}
                        style={{ width: 80, height: 80 }}
                        resizeMode="contain"
                      />
                    )}
                    
                    
                    {/* Lock icon for locked challenges */}
                    {isLocked && (
                      <View className="absolute -top-2 -right-1 bg-slate-500/50 rounded-full w-6 h-6 justify-center items-center">
                        <LockLight width={12} height={12} color="white" opacity={0.5} />
                      </View>
                    )}

                    {/* Completion count badge */}
                    {completionCount > 0 && (
                      <View className="absolute -top-2 -right-1 bg-green-500 rounded-full w-5 h-5 justify-center items-center">
                        <Text className="text-white text-xs font-bold">
                          {completionCount == 1 ?  <Ionicons name="checkmark" size={16} color="white" /> : completionCount}
                        </Text>
                      </View>
                    )}
                             
                            
                </View>
               
                  </Pressable>

                  {/* Challenge Title */}
                  <Text
                    className={`text-xs mt-2 text-center font-medium ${
                      isCompleted || isInProgress
                        ? isDark
                          ? "text-slate-100"
                          : "text-white"
                        : isDark
                        ? "text-slate-400"
                        : "text-white/50"
                    }`}
                  >
                    {challenge.title}
                  </Text>
                </View>
            );
          })}
        </View>

      </ScrollView>

      {/* Exclusive Achievements Modal */}
      {selectedChallenge && (
        <ExclusiveAchievementsModal
          visible={true}
          onClose={handleCloseModal}
          challenge={selectedChallenge}
          progress={getProgressForAchievement(selectedChallenge.id)}
          getProgressForAchievement={getProgressForAchievement}
        />
      )}
    </View>
  );
};

export default ExclusiveAchievements;

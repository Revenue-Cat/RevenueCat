import React, { useMemo } from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import CoinIcon from "../assets/icons/coins.svg";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import LockLight from "../assets/icons/lock.svg";

export type ChallengeStatus = "active" | "locked" | "inprogress" | "completed";

export interface ChallengeCardProps {
  title: string;
  description?: string;
  points: number;
  duration: string; // e.g., "10 Days"
  imageUrl?: string;
  status: ChallengeStatus;
  progress?: number; // 0-100
  streak?: number; // e.g., 4
  checkIns?: number; // e.g., 5
  onCheckIn?: () => void;
  onPress?: () => void;
  onNavigateToBreathing?: (skipInitialScreen?: boolean) => void;
  cardIcon?: any;
  icon?: any;
  achievementIcon?: any;
  achievementDescription?: string;
  motivation: string[];
  buddyAdvice: string[];
  id?: string;
  unitWord?: string;
  totalDurations?: any; // Total duration in days for progress calculation
  isExclusive?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  description,
  points,
  duration,
  imageUrl,
  icon,
  status,
  progress = 0,
  streak,
  checkIns,
  onCheckIn,
  onPress,
  onNavigateToBreathing,
  id: challengeId,
  totalDurations,
  isExclusive
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { calculateProgressBasedOnTime, getChallengeProgress, getChallengeCompletions } = useApp();
  const isLocked = status === "locked";
  const isInProgress = status === "inprogress";
  const isActive = status === "active";
  const isCompletedStatus = status === "completed";
  
  // Get progress data for the challenge
  const progressData = challengeId ? getChallengeProgress(challengeId) : null;
  
  // Check if challenge is completed (days since start equals total duration)
  const isCompleted = useMemo(() => {
    if (!challengeId || !progressData?.startDate || !totalDurations) return false;
    const startDate = new Date(progressData.startDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceStart >= totalDurations;
  }, [challengeId, progressData?.startDate, totalDurations]);

  // Get completion count (number of times this challenge was completed)
  const completionCount = useMemo(() => {
    if (!challengeId) return 0;
    const completions = getChallengeCompletions(challengeId);
    return completions.length;
  }, [challengeId, getChallengeCompletions]);
  
  // Calculate time-based progress for in-progress challenges (same as ChallengeModal)
  const timeBasedProgress = challengeId && isInProgress && totalDurations && progressData?.startDate ? 
    calculateProgressBasedOnTime(challengeId, totalDurations.toString(), new Date(progressData.startDate)) : 
    progress;
  
  const showProgress = !isLocked && !isActive && typeof timeBasedProgress === "number";

  const CardContent = (
    <View className={`${isDark ? 'bg-slate-700' : 'bg-white'} rounded-2xl p-4 mb-4`}>
      {/* Main Content */}
      <View className="flex-row justify-between items-start mb-3">
        {/* Left: points badge + duration + title + description */}
        <View className="flex-1 mr-3">
          <View className="flex-row items-center border border-orange-500 px-1 py-0.5 rounded-full self-start mb-1 gap-1">
          <Text className="text-base font-bold text-orange-500">+{points}</Text>
          <CoinIcon width={16} height={16} color="#FF6B35" />
        </View>
          <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-sm font-semibold my-1`}>
            {duration} {t("challenges.challenge")}
          </Text>

          {/* Title and Description */}
          <Text className={`text-xl font-bold mb-1 ${isDark ? 'text-slate-50' : 'text-black'}`}>{title}</Text>
          {!!description && (
            <Text className={`text-md ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{description}</Text>
          )}
        </View>

        {/* Right: Thumbnail with overlays */}
        <View className="w-25 h-25 rounded-xl overflow-hidden relative">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : icon ? (
            icon
          ) : (
            <View className="w-full h-full bg-gray-200" />
          )}
          {/* Overlay: completion, streak, lock, or pause */}
          {isLocked ? (
            <View className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 items-center justify-center">
              <LockLight width={14} height={14} color="#ffffff" />
            </View>
             ) : (isCompletedStatus) ? (
            <View className="absolute top-1 right-1 min-w-6 h-6 px-1 rounded-full bg-green-500 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {completionCount == 1 ?  <Ionicons name="checkmark" size={16} color="white" /> : completionCount}

              </Text>
            </View>
          ) : null}
        
        </View>
      </View>

      {/* Actions */}
      {isInProgress && !isCompletedStatus && (
        <View>
          {/* Progress and Check In for active in-progress challenges */}
          <>
            {/* Progress */}
            {showProgress && (
              <View className="mb-3">
                <View className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-600' : 'bg-gray-200'}`}>
                  <View
                    style={{ width: `${timeBasedProgress}%` }}
                    className="h-full bg-green-500"
                  />
                </View>
              </View>
            )}

            {/* Check In Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={isExclusive ? () => onNavigateToBreathing?.(true) : onCheckIn}
              className="bg-indigo-600 rounded-2xl p-3 flex-row items-center justify-center"
            >
              <Ionicons name="checkmark" size={20} color="#ffffff"  />
              <Text className="text-white font-semibold text-base ml-2">
                {isExclusive ? "Take 5 breathe" : t("challenges.checkIn")}
              </Text>
              {typeof checkIns === "number" && (
                <View className="ml-2 px-2 py-0.5 rounded-full bg-white/20">
                  <Text className="text-white text-s font-semibold">{checkIns}</Text>
                </View>
              )}
            </TouchableOpacity>
          </>
        </View>
      )}

    </View>
  );

  return onPress ? (
    <Pressable onPress={onPress}>
      {CardContent}
    </Pressable>
  ) : (
    CardContent
  );
};

export default React.memo(ChallengeCard);

import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SlideModal from './SlideModal';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { ChallengeCardProps } from './ChallengeCard';
import { useApp } from '../contexts/AppContext';
import CoinIcon from "../assets/icons/coins.svg";
import LockLight from "../assets/icons/lock.svg";
import GlassIcon from "../assets/challenges/glass.svg";
import TimeIcon from "../assets/challenges/time.svg";
import CoinsIcon from "../assets/challenges/coins.svg";
interface ChallengeModalProps {
  visible: boolean;
  challenge: ChallengeCardProps | null;
  challengeId?: string;
  onClose: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  visible,
  challenge,
  challengeId,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();
  const { startChallenge, getChallengeStatus, getChallengeProgress, updateChallengeProgress, calculateProgressBasedOnTime, cancelChallenge, getDailyCheckIns } = useApp();

  const handleStartChallenge = () => {
    if (challengeId) {
      startChallenge(challengeId);
      onClose();
    }
  };

  const handleCheckIn = () => {
    if (challengeId) {
      const currentProgress = getChallengeProgress(challengeId);
      const newCheckIns = currentProgress.checkIns + 1;
      const newStreak = currentProgress.streak + 1;
      
      // Progress is calculated based on time elapsed, so we don't need to set it manually
      updateChallengeProgress(challengeId, 0, newStreak, newCheckIns);
      onClose();
    }
  };

  // Get challenge status and progress data - always use fresh state, not props
  const challengeStatus = challengeId ? getChallengeStatus(challengeId) : 'locked';
  const progressData = challengeId ? getChallengeProgress(challengeId) : { progress: 0, streak: 0, checkIns: 0, startDate: null, isCancelled: false };
  const isActive = challengeStatus === 'active';
  const isInProgress = challengeStatus === 'inprogress';
  const isLocked = challengeStatus === 'locked';
  
  // // Force re-render when challenge status changes
  // useEffect(() => {
  //   console.log('ChallengeModal useEffect - status changed:', {
  //     challengeId,
  //     challengeStatus,
  //     visible
  //   });
  // }, [challengeStatus, challengeId, visible]);
  
  // Calculate progress based on time elapsed since start date (only for inprogress challenges)
  const timeBasedProgress = challenge && challengeId && isInProgress && challenge.totalDurations && progressData.startDate ? 
    calculateProgressBasedOnTime(challengeId, challenge.totalDurations.toString(), new Date(progressData.startDate)) : 
    0;

  console.log("TEST timeBasedProgress", {
    totalDurations: challenge?.totalDurations,
    challengeId,
    startDate: progressData.startDate,
    startDateType: typeof progressData.startDate,
    convertedStartDate: progressData.startDate ? new Date(progressData.startDate) : null,
    timeBasedProgress,
    isInProgress
  })
  // Calculate previous days data
  const previousDaysData = useMemo(() => {
    if (!challengeId || !progressData.startDate) return [];
    console.log("TEST previousDaysData", challengeId, progressData.startDate)
    const dailyCheckInsData = getDailyCheckIns(challengeId);
    const startDate = new Date(progressData.startDate);
    const today = new Date();
    const previousDays = [];
    
    // Calculate days since start date
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Show up to 4 previous days, but not more than days since start
    const daysToShow = Math.min(4, daysSinceStart);
    
    for (let i = 1; i <= daysToShow; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0]; // Format: "2024-09-04"
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      const checkIns = dailyCheckInsData[dateKey] || 0;
      previousDays.push({ date: dateStr, count: checkIns });
    }
    
    return previousDays;
  }, [challengeId, progressData.startDate, getDailyCheckIns]);


  if (!challenge) return null;

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
    >
      <View className="px-2">
        {/* Header: Coins on left, Duration on right */}
        <View className="flex-row justify-between items-center mb-2">
          {/* Coins */}
          <View className="flex-row items-center border border-orange-500 px-3 py-0.5 rounded-full self-start mb-1 gap-1">
            <Text className="text-base font-bold text-orange-500">+{challenge.points}</Text>
            <CoinIcon width={12} height={12} color="#FF6B35" />
          </View>

          {/* Duration */}
          <View className="flex-row items-center pr-2">
            <Text className={`font-semibold text-base ml-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {challenge.duration} Challenge
            </Text>
          </View>
        </View>
        {/* ScrollView for the content */}
         <ScrollView 
           showsVerticalScrollIndicator={false}
           bounces={false}
           style={{ maxHeight: 600 }}
         >
        {/* Full-width Icon */}
        <View className="items-center mb-6">
          <View 
            className="rounded-2xl overflow-hidden relative"
            style={{ height: 350 }}
          >
            {challenge.cardIcon ? (
                <View className="w-full h-full rounded-2xl items-center justify-center mt-2 overflow-hidden">
                  <View style={{ 
                    width: '100%', 
                    height: '100%',
                    aspectRatio: 1,
                  }} className="rounded-2xl overflow-hidden">
                    {React.cloneElement(challenge.cardIcon, {
                      width: '100%',
                      height: '100%',
                      preserveAspectRatio: 'xMidYMid meet',
                    })}
                  </View>
                  {/* Lock overlay for locked challenges */}
                  {isLocked && (
                    <View className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 p-3 items-center justify-center">
                      <LockLight width={16} height={16} color="#ffffff" />
                    </View>
                  )}
                </View>
            ) : (
              <View className="w-full h-full rounded-2xl items-center justify-center bg-gray-100 overflow-hidden">
                <Ionicons name="trophy-outline" size={80} color={isDark ? "#64748b" : "#94a3b8"} />
                {/* Lock overlay for locked challenges */}
                {isLocked && (
                  <View className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 p-3 items-center justify-center">
                    <LockLight width={16} height={16} color="#ffffff" />
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
     
        {/* Challenge Title */}
        <Text className={`text-2xl font-bold text-center ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          {challenge.title}
        </Text>

        {/* Challenge Description */}
        {challenge.description && (
          <Text className={`text-base text-center leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            {challenge.description}
          </Text>
        )}

        {/* History Section - Only show for inprogress challenges */}
        {isInProgress && (
          <View className="my-4">
            <View className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden my-3">
                  <View
                    style={{ width: `${Math.min(Math.max(timeBasedProgress, 0), 100)}%` }}
                    className="h-full bg-green-500"
                  />
                </View>
            <Text className={`text-lg font-bold mb-3`}>
              History
            </Text>
              <View>
                {/* Today */}
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <GlassIcon width={24} height={24} color={isDark ? "#64748b" : "#94a3b8"} />
                    <View className="ml-2">
                      <Text className={`text-md font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                        Today
                      </Text>
                      <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {progressData.checkIns} {challenge.unitWord || 'Check-ins'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                      <TimeIcon width={24} height={24} color={isDark ? "#64748b" : "#94a3b8"} />
                  </View>
                </View>

                {/* Previous Days with same UI as Today */}
                {previousDaysData.map((dayData, index) => (
                  <View key={index} className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center">
                      <GlassIcon width={24} height={24} color={isDark ? "#64748b" : "#94a3b8"} />
                      <View className="ml-2">
                        <Text className={`text-md font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                          {dayData.date}
                        </Text>
                        <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          {dayData.count} {challenge.unitWord || 'Check-ins'}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="checkmark" size={24} color={isDark ? "#64748b" : "#46c120"} />
                    </View>
                  </View>
                ))}
              </View>
          </View>
        )}

        {/* Benefits Section */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Benefits
          </Text>
          {challenge.motivation && Array.isArray(challenge.motivation) && challenge.motivation.length > 0 && (
            <View className="space-y-2">
              {challenge.motivation.map((benefit: string, index: number) => (
                <View key={index} className="flex-row items-start">
                  <Text className={`text-green-500 mr-2 mt-1 ${isDark ? "text-green-400" : "text-green-600"}`}>
                    •
                  </Text>
                  <Text className={`flex-1 text-sm leading-5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tips from a friend Section */}
        <View className="mb-4">
          <Text className={`text-lg font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Tips from a friend
          </Text>
          {challenge.buddyAdvice && challenge.buddyAdvice.length > 0 && (
            <View className="space-y-2">
              {challenge.buddyAdvice.map((tip, index) => (
                <View key={index} className="flex-row items-start">
                  <Text className={`text-blue-500 mr-2 mt-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                    •
                  </Text>
                  <Text className={`flex-1 text-sm leading-5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Cancel Challenge Section */}
        {isInProgress && (
          <View className="mb-4">
            <Pressable 
              className={`rounded-2xl p-4 flex-row items-center justify-center ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}
              onPress={() => {
                if (challengeId) {
                  cancelChallenge(challengeId);
                  onClose();
                }
              }}
              >
              <Ionicons name="close" size={24} color={isDark ? "#64748b" : "#94a3b8"} />
              <Text className={`text-center font-semibold mx-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                Cancel challenge
              </Text>
              <CoinsIcon width={24} height={24} color={isDark ? "#64748b" : "#94a3b8"} />

            </Pressable>
          </View>
        )}
        </ScrollView>

        <View className="flex-row items-center gap-5 justify-center mt-4 w-full">
        {/* Close Button */}
        <Pressable 
          className={`w-15 h-15 rounded-2xl justify-center items-center іelf-center ${
            isDark ? 'bg-slate-700' : 'bg-indigo-50'
          }`} 
          onPress={onClose}
        >
          <Text className={`text-2xl rounded-2xl px-4 py-2 font-bold ${isDark ? 'text-slate-50 bg-slate-700' : 'text-indigo-900 bg-indigo-50'}`}>✕</Text>
        </Pressable>

      {/* Action Button - Start now or Check In */}
        <Pressable 
          className="bg-indigo-600 rounded-2xl justify-center items-center px-6 py-2.5 w-[70%] flex-row"
          onPress={isInProgress ? handleCheckIn : handleStartChallenge}
          >      
          {isInProgress ? (
              <Ionicons name="checkmark" size={18} color="#ffffff" />
            ) : (
              ""
            )}     
            <Text className="text-white font-bold text-lg ml-2 mr-2">
              {isInProgress ? 'Check In' : 'Start now'}
            </Text>
            {(isInProgress || isActive) ? (
             ""
            ) : (
              <LockLight width={16} height={14} color="#ffffff" opacity={0.5} />
            )}
       </Pressable>
    
      </View>     
      </View>
    </SlideModal>
  );
};

export default ChallengeModal;

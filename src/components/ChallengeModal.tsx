import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Image, Share, Alert } from 'react-native';
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
import ProgressRing from './ProgressRing';
import ClapIcon from "../assets/icons/clap.svg";
import BreatheIcon from "../assets/icons/breathe.svg";

interface ChallengeModalProps {
  visible: boolean;
  challenge: ChallengeCardProps | null;
  challengeId?: string;
  onClose: () => void;
  onNavigateToBreathing?: (skipInitialScreen?: boolean) => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  visible,
  challenge,
  challengeId,
  onClose,
  onNavigateToBreathing,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslation();

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
  const { startChallenge, getChallengeStatus, getChallengeProgress, updateChallengeProgress, calculateProgressBasedOnTime, cancelChallenge, getDailyCheckIns, getChallengeCompletions, setChallengeCompletionsForId, addDailyCheckIn, userCoins, setShowCoinPurchase } = useApp();

  const handleStartChallenge = () => {
    if (!challengeId) return;

    const challengeStatus = getChallengeStatus(challengeId);
    const isLocked = challengeStatus === 'locked';

    // If challenge is locked and user doesn't have enough coins, show purchase modal
    if (isLocked && challenge && challenge.points > userCoins) {
      setShowCoinPurchase(true);
      onClose();
      return;
    }

    // Otherwise, start the challenge normally
    startChallenge(challengeId);
    onClose();
  };

  const handleCheckIn = () => {
    if (challengeId) {
      const currentProgress = getChallengeProgress(challengeId);

      const newCheckIns = currentProgress.checkIns + 1;
      const newStreak = currentProgress.streak + 1;
      
      // Progress is calculated based on time elapsed, so we don't need to set it manually
      updateChallengeProgress(challengeId, 0, newStreak, newCheckIns);
      
      // Also record the daily check-in for the History section
      const today = new Date();
      const dateKey = today.toISOString().split('T')[0]; // Format: "2024-09-04"
      const dailyCheckInsData = getDailyCheckIns(challengeId);
      const todayCheckIns = dailyCheckInsData[dateKey] || 0;
      addDailyCheckIn(challengeId, dateKey, todayCheckIns + 1);
      
    }
  };

  const handleRestartChallenge = () => {
    if (challengeId && challenge) {
      // Note: Completion is already automatically added when challenge is completed
      // via the useEffect hook above, so we don't need to add it again here
      
      // Reset the challenge progress and start fresh
      updateChallengeProgress(challengeId, 0, 0, 0);
      // Start the challenge again with a new start date
      startChallenge(challengeId);
    }
  };

  // Get challenge status and progress data - always use fresh state, not props
  const challengeStatus = challengeId ? getChallengeStatus(challengeId) : 'locked';
  const progressData = challengeId ? getChallengeProgress(challengeId) : { progress: 0, streak: 0, checkIns: 0, startDate: null, isCancelled: false };
  const isActive = challengeStatus === 'active';
  const isInProgress = challengeStatus === 'inprogress';
  const isLocked = challengeStatus === 'locked';

  // Calculate progress based on time elapsed since start date (only for inprogress challenges)
  const timeBasedProgress = challenge && challengeId && isInProgress && challenge.totalDurations && progressData.startDate ? 
    calculateProgressBasedOnTime(challengeId, challenge.totalDurations.toString(), new Date(progressData.startDate)) : 
    0;
  // Check if challenge is completed (days since start equals total duration)
  const isCompleted = useMemo(() => {
    if (!challengeId || !progressData.startDate || !challenge) return false;
    const startDate = new Date(progressData.startDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceStart >= challenge.totalDurations;
  }, [challengeId, progressData.startDate, challenge]);

  // Auto-add completion to challengeCompletions when challenge is completed
  useEffect(() => {
    if (isCompleted && challengeId && challenge && progressData.startDate) {
      const existingCompletions = getChallengeCompletions(challengeId);
      const startDate = new Date(progressData.startDate);
      const endDate = new Date(startDate.getTime() + challenge.totalDurations * 24 * 60 * 60 * 1000);
      
      // Check if this completion already exists to avoid duplicates
      const completionExists = existingCompletions.some(completion => {
        const existingStartDate = completion.startDate instanceof Date ? completion.startDate : new Date(completion.startDate);
        return existingStartDate.getTime() === startDate.getTime();
      });
      
      if (!completionExists) {
        setChallengeCompletionsForId(challengeId, [
          ...existingCompletions,
          {
            startDate,
            endDate,
            checkIns: progressData.checkIns,
            duration: challenge.totalDurations
          }
        ]);
      }
    }
  }, [isCompleted, challengeId, challenge, progressData.startDate, progressData.checkIns, getChallengeCompletions, setChallengeCompletionsForId]);

  // Get previous completions
  const previousCompletions = useMemo(() => {
    if (!challengeId) return [];
    return getChallengeCompletions(challengeId);
  }, [challengeId, getChallengeCompletions]);
  
  // Calculate previous days data
  const previousDaysData = useMemo(() => {
    if (!challengeId || !progressData.startDate) return [];

    const dailyCheckInsData = getDailyCheckIns(challengeId);
    const startDate = new Date(progressData.startDate);
    const today = new Date();
    const previousDays = [];
    
    // Calculate days since start date
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysToShow = daysSinceStart
    
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


  const handleShare = async () => {
    
    try {
      const message = `🎉 I just unlocked the "${challenge?.title}" achievement! ${challenge?.description}`;
            
      const result = await Share.share({
        message: message,
        title: 'Achievement Unlocked!'
      });
      
    } catch (error) {
      console.error('Error sharing achievement:', error);
      alert('Share failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };


  if (!challenge) return null;

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
    >
      <View className="px-2">
        {/* Header: Coins on left, Duration on right */}
        <View className={`flex-row ${!isLocked ? 'justify-center' : 'justify-between' } items-center mb-2`}>
          {/* Coins */}
          {isLocked && (
            <View className="flex-row items-center border border-orange-500 pl-2 pr-1.5 py-0 rounded-full self-start mb-1 gap-0.5 text-center">
              <Text className="text-lg font-semibold text-orange-500">{challenge.points}</Text>
              <CoinIcon width={16} height={16} color="#FF6B35" />
            </View>
          )}

          {/* Duration */}
          <View className="flex-row items-center pr-2">
            <Text className={`text-lg ml-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {challenge.duration} {t("challenges.challenge")}
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
        <Text className={`text-3xl font-bold text-center ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          {challengeId ? t(`challenges.data.${getChallengeTranslationKey(challengeId)}.title`) : challenge.title}
        </Text>

        {/* Challenge Description */}
        {challengeId ? (() => {
          const description = t(`challenges.data.${getChallengeTranslationKey(challengeId)}.shortDescription`);
          return description && (
            <Text className={`text-lg text-center leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {description}
            </Text>
          );
        })() : challenge.description && (
          <Text className={`text-base text-center leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            {challenge.description}
          </Text>
        )}

        {/* Achievement Section - Show for completed challenges or challenges with previous completions, but not when in progress */}
        {(isCompleted || (previousCompletions.length > 0 && !isInProgress)) && challenge.achievementIcon && (
          <View className="items-center">
                <View className="relative items-center justify-center">
                  <ProgressRing
                    progress={100}
                    size={100}
                    strokeWidth={4}
                    color={"#22C55E"}
                    borderColor={"#22C55E"}
                  />
                  <View className="absolute items-center justify-center">
                    <Image
                      source={challenge.achievementIcon}
                      style={{ width: 105, height: 105 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View className="absolute -top-1 right-1 min-w-6 h-6 px-1 rounded-full bg-green-500 items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {previousCompletions.length}
                    </Text>
                  </View>
                </View>
                
                {/* Share Button */}
                <Pressable 
                  className="bg-indigo-100 rounded-2xl p-3 flex-row items-center justify-center mt-4 w-full"
                  onPress={handleShare}
                >
                  <ClapIcon width={18} height={18} color={isDark ? "#353131" : "#353131"} />
                  <Text className={`${isDark ? "text-indigo-950" : "text-indigo-950"} font-semibold text-base ml-2`}>
                    {t('challenges.modal.share')}
                  </Text>
                </Pressable>
              
          </View>
        )}

        {/* Progress Bar - Only show for inprogress challenges */}
        {isInProgress && !isCompleted && (
          <View className="my-4">
            <View className={`h-2 ${isDark ? 'bg-slate-600' : 'bg-gray-200'} rounded-full overflow-hidden my-3`}>
                  <View
                    style={{ width: `${Math.min(Math.max(timeBasedProgress, 0), 100)}%` }}
                    className="h-full bg-green-500"
                  />
                </View>
          </View>
        )}

       

        {/* History Section - Show for inprogress challenges that are not completed */}
        {isInProgress && !isCompleted && (
          <View className="my-4">
            <Text className={`text-xl font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              {t('challenges.modal.history')}
            </Text>
              <View>
                {/* Today */}
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <GlassIcon width={24} height={24} color={isDark ? "#64748b" : "#94a3b8"} />
                    <View className="ml-2">
                      <Text className={`text-md font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                        {t('challenges.modal.today')}
                      </Text>
                      <Text className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {progressData.checkIns} {challenge.unitWord || t('challenges.checkIn')}
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
                          {dayData.count} {challenge.unitWord || t('challenges.checkIn')}
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

        {/* Completed Section - Show all previous completions */}
        {previousCompletions.length > 0 && (
          <View className="my-4">
            <Text className={`text-lg font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              {t('challenges.modal.completed')}
            </Text>
            {previousCompletions.map((completion, index) => {
              const formatDate = (date: Date | string) => {
                // Ensure we have a Date object
                const dateObj = date instanceof Date ? date : new Date(date);
                return dateObj.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              };
              
              return (
                <View key={index} className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                     <Image
                      source={challenge.achievementIcon}
                      style={{ width: 48, height: 48 }}
                      resizeMode="contain"
                    />
                    <View className="ml-2">
                      <Text className={`text-md font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                        {formatDate(completion.startDate)} - {formatDate(completion.endDate)}
                      </Text>
                      <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {completion.checkIns} {challenge?.unitWord || t('challenges.checkIn')}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="checkmark" size={24} color={isDark ? "#46c120" : "#46c120"} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Benefits Section */}
        <View className="mb-6">
          <Text className={`text-xl font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            {t('challenges.modal.benefits')}
          </Text>
          {challengeId && (() => {
            const challengeKey = getChallengeTranslationKey(challengeId);
            const motivationKey = `challenges.data.${challengeKey}.motivation`;
            const motivation = t(motivationKey, { returnObjects: true }) as string[];
            return motivation && Array.isArray(motivation) && motivation.length > 0 && (
              <View className="space-y-2">
                {motivation.map((benefit: string, index: number) => (
                  <View key={index} className="flex-row items-start">
                    <Text className={`text-green-500 mr-2 mt-1 ${isDark ? "text-green-400" : "text-green-600"}`}>
                      •
                    </Text>
                    <Text className={`flex-1 text-md leading-5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })()}
        </View>

        {/* Tips from a friend Section */}
        <View className="mb-4">
          <Text className={`text-xl font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            {t('challenges.modal.buddyAdvice')}
          </Text>
          {challengeId && (() => {
            const challengeKey = getChallengeTranslationKey(challengeId);
            const buddyAdviceKey = `challenges.data.${challengeKey}.buddyAdvice`;
            const buddyAdvice = t(buddyAdviceKey, { returnObjects: true }) as string[];
            return buddyAdvice && Array.isArray(buddyAdvice) && buddyAdvice.length > 0 && (
              <View className="space-y-2">
                {buddyAdvice.map((tip, index) => (
                  <View key={index} className="flex-row items-start">
                    <Text className={`text-blue-500 mr-2 mt-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                      •
                    </Text>
                    <Text className={`flex-1 text-md leading-5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {tip}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })()}
        </View>

        {/* Cancel Challenge Section */}
        {isInProgress && !isCompleted && (
          <View className="mb-4">
            <Pressable 
              className={`rounded-2xl p-4 flex-row items-center justify-center ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}
              onPress={() => {
                Alert.alert(
                  t('challenges.modal.cancelAlert.title'),
                  t('challenges.modal.cancelAlert.message'),
                  [
                    {
                      text: t('challenges.modal.cancelAlert.continue'),
                      style: "cancel"
                    },
                    {
                      text: t('challenges.modal.cancelAlert.giveUp'),
                      style: "destructive",
                      onPress: () => {
                        if (challengeId) {
                          cancelChallenge(challengeId);
                          onClose();
                        }
                      }
                    }
                  ],
                  { cancelable: true }
                );
              }}
              >
              <Ionicons name="close" size={24} color={isDark ? "#f87171" : "#dc2626"} />
              <Text className={`text-center text-md font-semibold mx-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                {t('challenges.modal.cancelChallenge')}
              </Text>
              <CoinsIcon width={24} height={24} color={isDark ? "#e55b0b" : "#94a3b8"} />

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

      {/* Action Button - Start now, Check In, or Restart challenge */}
        <Pressable 
          className="bg-indigo-600 rounded-2xl justify-center items-center px-6 py-2.5 w-[70%] flex-row"
          onPress={isCompleted ? handleRestartChallenge : (isInProgress ? (challenge?.isExclusive ? () => onNavigateToBreathing?.(true) : handleCheckIn) : (previousCompletions.length > 0 ? handleRestartChallenge : handleStartChallenge))}
          >      
          {isInProgress ? (
              challenge?.isExclusive ? <BreatheIcon width={16} height={16} color="#ffffff" /> : <Ionicons name="checkmark" size={18} color="#ffffff" />
            ) : (isCompleted || previousCompletions.length > 0) ? (
              <Ionicons name="refresh" size={18} color="#ffffff" />
            ) : (
              ""
            )}     
            <Text className="text-white font-bold text-lg ml-2 mr-2">
              {isCompleted ? t('challenges.modal.restartChallenge') : (isInProgress ? (challenge?.isExclusive ? "Take 5 breathe" : t('challenges.checkIn')) : (previousCompletions.length > 0 ? t('challenges.modal.restartChallenge') : t('challenges.modal.startNow')))}
            </Text>
            {isInProgress && !isCompleted && previousCompletions.length === 0 && (
                <View className="ml-2 px-2 py-0.5 rounded-full bg-white/20">
                  <Text className="text-white text-s font-bold">{progressData.checkIns}</Text>
                </View>
              )}
            {(isInProgress || isActive || isCompleted) ? (
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

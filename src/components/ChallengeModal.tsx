import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Image, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  const { startChallenge, setDailyCheckIns,getChallengeStatus, getChallengeProgress, updateChallengeProgress, calculateProgressBasedOnTime, cancelChallenge, getDailyCheckIns, getChallengeCompletions, setChallengeCompletionsForId, addDailyCheckIn, userCoins, setShowCoinPurchase, purchaseItem } = useApp();

  const handleStartChallenge = async () => {
    if (!challengeId) return;

    const challengeStatus = getChallengeStatus(challengeId);
    const isLocked = challengeStatus === 'locked';

    // If challenge is locked
    if (isLocked && challenge) {
      // If user doesn't have enough coins, show purchase modal
      if (challenge.points > userCoins) {
        // Close ChallengeModal first to prevent blink
        onClose();
        // Then show coin purchase modal
        setTimeout(() => setShowCoinPurchase(true), 100);
        return;
      }

      // If user has enough coins, purchase the challenge
      try {
        const shopItem = {
          id: challengeId,
          emoji: '🏆',
          name: challenge.title,
          price: challenge.points,
          owned: false,
          coin: challenge.points
        };

        const success = await purchaseItem(shopItem, 'challenges');
        if (success) {
          console.log(`Successfully purchased challenge ${challenge.title}`);
          // Now start the challenge
          startChallenge(challengeId);
          // Don't close modal when starting challenge - let user see progress
        } else {
          console.log('Challenge purchase failed');
          // Close ChallengeModal first to prevent blink
          onClose();
          // Then show coin purchase modal
          setTimeout(() => setShowCoinPurchase(true), 100);
        }
      } catch (error) {
        console.error('Error purchasing challenge:', error);
        // Close ChallengeModal first to prevent blink
        onClose();
        // Then show coin purchase modal
        setTimeout(() => setShowCoinPurchase(true), 100);
      }
      return;
    }

    // If challenge is not locked, start it normally
    startChallenge(challengeId);
    // Don't close modal when starting challenge - let user see progress
  };

  const handleCheckIn = () => {
    if (challengeId) {
      // For exclusive challenges, navigate to breathing exercise
      if (challenge?.isExclusive) {
        onNavigateToBreathing?.(true);
        return;
      }
      
      // For regular challenges, do normal check-in
      const currentProgress = getChallengeProgress(challengeId);
      const newStreak = currentProgress.streak + 1;
      
      // Update streak in challengeProgress (but not checkIns since we use dailyCheckIns now)
      updateChallengeProgress(challengeId, 0, newStreak, 0);
      
      // Record the daily check-in (this is the single source of truth for check-ins)
      const today = new Date();
      const dateKey = today.toISOString().split('T')[0]; // Format: "2024-09-04"
      addDailyCheckIn(challengeId, dateKey, 1);
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
      alert(t('alerts.shareFailed', { error: error instanceof Error ? error.message : 'Unknown error' }));
    }
  };


  if (!challenge) return null;

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <SlideModal
        visible={visible}
        onClose={onClose}
        showCloseButton={false}
      >
      <View className="px-2 -mb-10">
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
           contentContainerStyle={{ paddingBottom: 100 }}
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
                  }} className="rounded-2xl overflow-hidden bg-cover">
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
                    {challenge.iconPreview ? (
                      <challenge.iconPreview width={20} height={20} color={isDark ? "#64748b" : "#3B82F6"} />
                    ) : (
                      <GlassIcon width={24} height={24} color={isDark ? "#64748b" : "#3B82F6"} />
                    )}
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
                      {challenge.iconPreview ? (
                        <challenge.iconPreview width={20} height={20} color={isDark ? "#64748b" : "#3B82F6"} />
                      ) : (
                        <GlassIcon width={24} height={24} color={isDark ? "#64748b" : "#3B82F6"} />
                      )}
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
                          setDailyCheckIns((prev) => {
                            const newCheckIns = { ...prev };
                            delete newCheckIns[challengeId];
                            return newCheckIns;
                          });
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

            </Pressable>
          </View>
        )}
        </ScrollView>
        
        {/* Full-width LinearGradient Action Buttons - absolute overlay at bottom */}
        <LinearGradient
          // colors as per current design
          colors={['transparent', 'rgba(255, 255, 255, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            // extend to screen edges and overdraw to the very bottom
            marginHorizontal: -40,
            marginBottom: -40,
            paddingBottom: 75,
            paddingHorizontal: 40,
          }}
        >
          <View className="flex-row justify-center gap-2">
            {/* Close Button */}
            <Pressable
              className={`w-15 h-15 rounded-2xl justify-center items-center ${
                isDark ? "bg-slate-700" : "bg-indigo-50"
              }`}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t("common.close", "Close")}
            >
              <Text
                className={`text-2xl rounded-2xl px-5 py-3 font-bold ${
                  isDark ? "text-slate-100 bg-slate-700" : "text-indigo-900 bg-indigo-50"
                }`}
              >
                ✕
              </Text>
            </Pressable>

            {/* Action Button - Start now, Check In, or Restart challenge */}
            <Pressable
              className="flex-1 rounded-2xl px-6 py-4 items-center justify-center flex-row bg-indigo-600"
              onPress={() => {
                if (isCompleted) {
                  handleRestartChallenge();
                } else if (isInProgress) {
                  // Use handleCheckIn which handles both exclusive and regular challenges
                  handleCheckIn();
                } else if (previousCompletions.length > 0) {
                  handleRestartChallenge();
                } else {
                  handleStartChallenge();
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={
                isCompleted 
                  ? t('challenges.modal.restartChallenge', "Restart Challenge")
                  : isInProgress 
                    ? (challenge?.isExclusive ? "Take 5 breathe" : t('challenges.checkIn', "Check In"))
                    : (previousCompletions.length > 0 
                        ? t('challenges.modal.restartChallenge', "Restart Challenge")
                        : (isLocked 
                            ? t('challenges.modal.startNowWithPoints', { points: challenge?.points || 0 })
                            : t('challenges.modal.startNow', "Start Now")))
              }
            >      
              {isInProgress ? (
              challenge?.isExclusive && !previousCompletions.length ? <BreatheIcon width={16} height={16} color="#ffffff" /> : <Ionicons name="checkmark" size={18} color="#ffffff" />
                ) : (isCompleted || previousCompletions.length > 0) ? (
              <Ionicons name="refresh" size={18} color="#ffffff" />
                ) : (
                  ""
                )}     
            <Text className="font-semibold text-xl text-white ml-2 mr-2">
              {isCompleted ? t('challenges.modal.restartChallenge') : (isInProgress ? (challenge?.isExclusive ? "Take 5 breathe" : t('challenges.checkIn')) : (previousCompletions.length > 0 ? t('challenges.modal.restartChallenge') : (isLocked ? t('challenges.modal.startNowWithPoints', { points: challenge?.points || 0 }) : t('challenges.modal.startNow'))))}
            </Text>
            {progressData.checkIns > 0 && isInProgress && !isCompleted ? (
                <View className="ml-2 px-2 py-0.5 rounded-full bg-white/20">
                  <Text className="text-white text-s font-bold">{progressData.checkIns}</Text>
                    </View>
                  ) : null}
                {(isInProgress || isActive || isCompleted || previousCompletions.length > 0) ? (
                 null
                ) : (
                     <CoinIcon width={20} height={20} className="ml-1" />
                )}
           </Pressable>
          </View>
        </LinearGradient>
      </View>
      </SlideModal>
    </View>
  );
};

export default ChallengeModal;

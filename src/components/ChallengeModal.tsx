import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SlideModal from './SlideModal';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { ChallengeCardProps } from './ChallengeCard';
import { useApp } from '../contexts/AppContext';
import CoinIcon from "../assets/icons/coins.svg";
import LockLight from "../assets/icons/lock.svg";
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
  const { startChallenge, activeChallenges, inProgressChallenges,getChallengeStatus, getChallengeProgress, updateChallengeProgress, calculateProgressBasedOnTime, cancelChallenge } = useApp();
  console.log("!!!!! challenge", challengeId)

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
  
  // Force re-render when challenge status changes
  useEffect(() => {
    console.log('ChallengeModal useEffect - status changed:', {
      challengeId,
      challengeStatus,
      visible
    });
  }, [challengeStatus, challengeId, visible]);
  
  // Calculate progress based on time elapsed since start date (only for inprogress challenges)
  const timeBasedProgress = challenge && challengeId && isInProgress ? 
    calculateProgressBasedOnTime(challengeId, challenge.duration, progressData.startDate) : 
    0;


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
                 {/* ScrollView for the content */}
         <ScrollView 
           showsVerticalScrollIndicator={false}
           bounces={false}
           style={{ maxHeight: 300 }}
         >
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

        {/* History Section - Only show for active challenges */}
        {isInProgress && (
          <View className="mb-4">
            <Text className={`text-lg font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              History
            </Text>
            <View className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    Progress
                  </Text>
                  <Text className={`text-sm font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>
                    {timeBasedProgress}%
                  </Text>
                </View>
                <View className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                  <View
                    style={{ width: `${Math.min(Math.max(timeBasedProgress, 0), 100)}%` }}
                    className="h-full bg-green-500"
                  />
                </View>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                    {progressData.streak}
                  </Text>
                  <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Day Streak
                  </Text>
                </View>
                <View className="items-center">
                  <Text className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                    {progressData.checkIns}
                  </Text>
                  <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Check-ins
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Divider Line */}
        <View className={`w-full h-px my-3 ${isDark ? "bg-slate-600" : "bg-slate-300"}`} />

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
            <Text className={`text-lg font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              Cancel challenge
            </Text>
            <Pressable 
              className={`rounded-xl p-4 border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}
              onPress={() => {
                if (challengeId) {
                  cancelChallenge(challengeId);
                  onClose();
                }
              }}
            >
              <Text className={`text-center font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                Cancel this challenge
              </Text>
              <Text className={`text-center text-sm mt-1 ${isDark ? 'text-red-300' : 'text-red-500'}`}>
                You can restart it later
              </Text>
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

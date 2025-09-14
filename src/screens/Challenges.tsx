import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ChallengeCard, { ChallengeCardProps } from '../components/ChallengeCard';
import ChallengeModal from '../components/ChallengeModal';
import { CHALLENGES_DATA, convertToChallengeCardProps } from '../data/challengesData';
import { useApp } from '../contexts/AppContext';

interface ChallengesProps {
  onNavigateToBreathing?: (skipInitialScreen?: boolean) => void;
}

const Challenges: React.FC<ChallengesProps> = ({ onNavigateToBreathing }) => {
  const { t } = useTranslation();
  const { getChallengeStatus, getChallengeProgress, updateChallengeProgress, calculateProgressBasedOnTime, challengeProgress, addDailyCheckIn, getDailyCheckIns, startChallenge } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeCardProps | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

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

  // Convert challenges data to ChallengeCardProps format
  const sampleChallenges: ChallengeCardProps[] = useMemo(() => {
    return CHALLENGES_DATA.map((challenge) => {
      const status = getChallengeStatus(challenge.id);
      const progressData = getChallengeProgress(challenge.id);

      // Calculate progress based on time elapsed since start date (only for inprogress challenges)
      const timeBasedProgress = status === 'inprogress' ? calculateProgressBasedOnTime(
        challenge.id, 
        challenge.duration, 
        progressData.startDate
      ) : 0;
      
      // Get translated title, description, and duration
      const challengeKey = getChallengeTranslationKey(challenge.id);
      const translatedTitle = t(`challenges.data.${challengeKey}.title`);
      const translatedDescription = t(`challenges.data.${challengeKey}.shortDescription`);
      const translatedDuration = t(`challenges.data.${challengeKey}.duration`);
      
      const cardProps = convertToChallengeCardProps(
        challenge, 
        status, 
        timeBasedProgress, 
        progressData.streak, 
        progressData.checkIns
      );
      
      // Override with translated text
      return {
        ...cardProps,
        title: translatedTitle,
        description: translatedDescription,
        duration: translatedDuration
      };
    });
  }, [getChallengeStatus, getChallengeProgress, calculateProgressBasedOnTime, challengeProgress, t]);
  
  // Sort challenges to show unlocked first, then locked
  const sortedChallenges = useMemo(() => {
    return [...sampleChallenges].sort((a, b) => {
      // Priority: active > inprogress > completed > locked
      const statusOrder = { 'inprogress': 0, 'active': 1, 'completed': 2, 'locked': 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [sampleChallenges]);
  
  // Memoize the visible challenges to prevent recalculation
  const visibleChallenges = useMemo(() => 
    isCollapsed ? sortedChallenges.slice(0, 3) : sortedChallenges,
    [isCollapsed, sortedChallenges]
  );

  // Memoize the toggle callback
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Memoize the check-in callback
  const handleCheckIn = useCallback((challengeId: string) => {
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
  }, [getChallengeProgress, updateChallengeProgress, addDailyCheckIn, getDailyCheckIns]);

  const handleRestartChallenge = useCallback((challengeId: string) => {
    // Reset the challenge progress and start fresh
    updateChallengeProgress(challengeId, 0, 0, 0);
    // Start the challenge again with a new start date
    startChallenge(challengeId);
  }, [updateChallengeProgress, startChallenge]);

  // Memoize the challenge press callback
  const handleChallengePress = useCallback((challenge: ChallengeCardProps, challengeId: string) => {
    setSelectedChallenge(challenge);
    setSelectedChallengeId(challengeId);
    setModalVisible(true);
  }, []);

  // Memoize the modal close callback
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedChallenge(null);
    setSelectedChallengeId(null);
  }, []);

  const handleNavigateToBreathingFromModal = useCallback(() => {
    handleCloseModal(); // Close modal first
    if (onNavigateToBreathing) {
      // Pass skipInitialScreen=true for exclusive challenges
      const skipInitialScreen = selectedChallenge?.isExclusive === true;
      onNavigateToBreathing(skipInitialScreen);
    }
  }, [handleCloseModal, onNavigateToBreathing, selectedChallenge]);

  // Memoize the challenges list
  const challengesList = useMemo(() => (
    <View className="px-0">
      {visibleChallenges.map((ch) => {
        if (!ch.id) {
          console.warn('Challenge ID not found for:', ch.title);
          return null;
        }
        
        return (
          <MemoizedChallengeCard
            key={`${ch.title}-${ch.id}`}
            {...ch}
            onCheckIn={() => handleCheckIn(ch.id!)}
            onPress={() => handleChallengePress(ch, ch.id!)}
            onNavigateToBreathing={onNavigateToBreathing}
            onRestartChallenge={handleRestartChallenge}
          />
        );
      })}

      {/* Collapse/Expand Button */}
      <View className="items-center mt-2 mb-8">
         <Pressable 
            className="z-10 bg-black/50 rounded-full justify-center items-center px-2 py-2"
            onPress={toggleCollapsed}
          >
            <Ionicons 
              name={isCollapsed ? "arrow-down" : "arrow-up"} 
              size={20} 
              color="#ffffff"
            />
          </Pressable>
      </View>
    </View>
  ), [visibleChallenges, handleCheckIn, handleChallengePress, handleRestartChallenge, toggleCollapsed, isCollapsed]);

  // Memoize the title
  const title = useMemo(() => (
    <Text className="text-white text-center text-2xl font-bold mb-6">{t('challenges.title')}</Text>
  ), [t]);

  return (
    <View className="flex-1 mb-8 pb-8">
      {/* Title */}
      {title}

      {/* Challenge List */}
      {challengesList}

      {/* Challenge Modal */}
      <ChallengeModal
        key={selectedChallengeId} // Force re-render when challengeId changes
        visible={modalVisible}
        challenge={selectedChallenge}
        challengeId={selectedChallengeId || undefined}
        onClose={handleCloseModal}
        onNavigateToBreathing={handleNavigateToBreathingFromModal}
      />
    </View>
  );
};

// Memoized ChallengeCard component to prevent unnecessary re-renders
const MemoizedChallengeCard = React.memo<ChallengeCardProps>((props) => (
  <ChallengeCard {...props} />
));

export default React.memo(Challenges);

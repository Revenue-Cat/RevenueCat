import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ChallengeCard, { ChallengeCardProps } from '../components/ChallengeCard';
import ChallengeModal from '../components/ChallengeModal';
import { CHALLENGES_DATA, convertToChallengeCardProps } from '../data/challengesData';
import { useApp } from '../contexts/AppContext';

const Challenges: React.FC = () => {
  const { t } = useTranslation();
  const { getChallengeStatus, getChallengeProgress, updateChallengeProgress, calculateProgressBasedOnTime } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeCardProps | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  // Convert challenges data to ChallengeCardProps format
  const sampleChallenges: ChallengeCardProps[] = useMemo(() => {
    return CHALLENGES_DATA.map((challenge) => {
      const status = getChallengeStatus(challenge.id);
      const progressData = getChallengeProgress(challenge.id);
      console.log("status", status)
      // Calculate progress based on time elapsed since start date (only for inprogress challenges)
      const timeBasedProgress = status === 'inprogress' ? calculateProgressBasedOnTime(
        challenge.id, 
        challenge.duration, 
        progressData.startDate
      ) : 0;
      
      return convertToChallengeCardProps(
        challenge, 
        status, 
        timeBasedProgress, 
        progressData.streak, 
        progressData.checkIns
      );
    });
  }, [getChallengeStatus, getChallengeProgress, calculateProgressBasedOnTime]);
  
  // Sort challenges to show unlocked first, then locked
  const sortedChallenges = useMemo(() => {
    return [...sampleChallenges].sort((a, b) => {
      // Priority: active > inprogress > locked
      const statusOrder = { 'inprogress': 0, 'active': 1, 'locked': 2 };
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
  }, [getChallengeProgress, updateChallengeProgress]);

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
          />
        );
      })}

      {/* Collapse/Expand Button */}
      <View className="items-center mt-2 mb-8">
        <Pressable
          className="flex-row items-center bg-black/50 px-2 py-2 rounded-full shadow-lg"
          onPress={toggleCollapsed}
        >
          <Ionicons name={isCollapsed ? "arrow-down" : "arrow-up"} size={16} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  ), [visibleChallenges, handleCheckIn, handleChallengePress, toggleCollapsed, isCollapsed]);

  // Memoize the title
  const title = useMemo(() => (
    <Text className="text-white text-center text-3xl font-bold mb-6">{t('challenges.title')}</Text>
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
      />
    </View>
  );
};

// Memoized ChallengeCard component to prevent unnecessary re-renders
const MemoizedChallengeCard = React.memo<ChallengeCardProps>((props) => (
  <ChallengeCard {...props} />
));

export default React.memo(Challenges);

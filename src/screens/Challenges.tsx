import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ChallengeCard, { ChallengeCardProps } from '../components/ChallengeCard';
import ChallengeModal from '../components/ChallengeModal';
import { CHALLENGES_DATA, convertToChallengeCardProps } from '../data/challengesData';

const Challenges: React.FC = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeCardProps | null>(null);
  
  // Convert challenges data to ChallengeCardProps format
  const sampleChallenges: ChallengeCardProps[] = useMemo(() => {
    return CHALLENGES_DATA.map((challenge, index) => {
      // First challenge is active, others are locked
      const status = index === 0 ? 'active' : 'locked';
      const progress = index === 0 ? 40 : undefined;
      const streak = index === 0 ? 4 : undefined;
      const checkIns = index === 0 ? 5 : undefined;
      
      return convertToChallengeCardProps(challenge, status, progress, streak, checkIns);
    });
  }, []);
  
  // Sort challenges to show unlocked first, then locked
  const sortedChallenges = useMemo(() => {
    return [...sampleChallenges].sort((a, b) => {
      if (a.status === 'active' && b.status === 'locked') return -1;
      if (a.status === 'locked' && b.status === 'active') return 1;
      return 0;
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
  const handleCheckIn = useCallback(() => {
    // Handle check-in logic here
  }, []);

  // Memoize the challenge press callback
  const handleChallengePress = useCallback((challenge: ChallengeCardProps) => {
    if (challenge.status === 'locked') {
      setSelectedChallenge(challenge);
      setModalVisible(true);
    }
  }, []);

  // Memoize the modal close callback
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedChallenge(null);
  }, []);

  // Memoize the challenges list
  const challengesList = useMemo(() => (
    <View className="px-0">
      {visibleChallenges.map((ch, idx) => (
        <MemoizedChallengeCard 
          key={`${ch.title}-${idx}`} 
          {...ch} 
          onCheckIn={handleCheckIn}
          onPress={() => handleChallengePress(ch)}
        />
      ))}

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
        visible={modalVisible}
        challenge={selectedChallenge}
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

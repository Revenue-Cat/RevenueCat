import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ChallengeCard, { ChallengeCardProps } from '../components/ChallengeCard';
import Challenge1Icon from '../assets/challenges/challenge1.svg';

const Challenges: React.FC = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // Move challenges array inside component to use translations
  const sampleChallenges: ChallengeCardProps[] = useMemo(() => [
    {
      title: t('challenges.masterOfAir.title'),
      description: t('challenges.masterOfAir.description'),
      points: 100,
      duration: '10 Days',
      icon: <Challenge1Icon width={100} height={100} />,
      status: 'active',
      progress: 40,
      streak: 4,
      checkIns: 5,
    },
    {
      title: t('challenges.hydrationBoost.title'),
      description: t('challenges.hydrationBoost.description'),
      points: 100,
      duration: '10 Days',
      icon: <Challenge1Icon width={100} height={100} />,
      status: 'locked',
    },
    {
      title: t('challenges.stepSlayer.title'),
      description: t('challenges.stepSlayer.description'),
      points: 100,
      duration: '10 Days',
      icon: <Challenge1Icon width={100} height={100} />,
      status: 'locked',
    },
    {
      title: t('challenges.snackBreak.title'),
      description: t('challenges.snackBreak.description'),
      points: 100,
      duration: '10 Days',
      icon: <Challenge1Icon width={100} height={100} />,
      status: 'locked',
    },
    {
      title: t('challenges.calmPower.title'),
      description: t('challenges.calmPower.description'),
      points: 100,
      duration: '10 Days',
      icon: <Challenge1Icon width={100} height={100} />,
      status: 'locked',
    },
    {
      title: t('challenges.fistFlow.title'),
      description: t('challenges.fistFlow.description'),
      points: 100,
      duration: '10 Days',
      icon: <Challenge1Icon width={100} height={100} />,
      status: 'locked',
    },
    {
      title: t('challenges.refresh.title'),
      description: t('challenges.refresh.description'),
      points: 100,
      duration: '10 Days',
      icon: <Challenge1Icon width={100} height={100} />,
      status: 'locked',
    },
    {
      title: t('challenges.craveCrusher.title'),
      description: t('challenges.craveCrusher.description'),
      points: 100,
      duration: '10 Days',
      icon: <Challenge1Icon width={100} height={100} />,
      status: 'locked',
    },
    {
      title: t('challenges.flowMinute.title'),
      description: t('challenges.flowMinute.description'),
      points: 100,
      duration: '10 Days',
      icon: <Challenge1Icon width={100} height={100} />,
      status: 'locked',
    }
  ], [t]);
  
  // Memoize the visible challenges to prevent recalculation
  const visibleChallenges = useMemo(() => 
    isCollapsed ? sampleChallenges.slice(0, 3) : sampleChallenges,
    [isCollapsed, sampleChallenges]
  );

  // Memoize the toggle callback
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Memoize the check-in callback
  const handleCheckIn = useCallback(() => {
    // Handle check-in logic here
  }, []);

  // Memoize the challenges list
  const challengesList = useMemo(() => (
    <View className="px-0">
      {visibleChallenges.map((ch, idx) => (
        <MemoizedChallengeCard key={`${ch.title}-${idx}`} {...ch} onCheckIn={handleCheckIn} />
      ))}

      {/* Collapse/Expand Button */}
      <View className="items-center mt-2 mb-8">
        <Pressable
          className="w-10 h-10 rounded-full bg-gray-600 justify-center items-center shadow-lg"
          onPress={toggleCollapsed}
        >
          <Ionicons name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={20} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  ), [visibleChallenges, handleCheckIn, toggleCollapsed, isCollapsed]);

  // Memoize the title
  const title = useMemo(() => (
    <Text className="text-white text-center text-3xl font-bold mb-6">{t('challenges.title')}</Text>
  ), [t]);

  return (
    <View className="flex-1">
      {/* Title */}
      {title}

      {/* Challenge List */}
      {challengesList}
    </View>
  );
};

// Memoized ChallengeCard component to prevent unnecessary re-renders
const MemoizedChallengeCard = React.memo<ChallengeCardProps>((props) => (
  <ChallengeCard {...props} />
));

export default React.memo(Challenges);

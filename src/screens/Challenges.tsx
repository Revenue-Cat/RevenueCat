import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChallengeCard, { ChallengeCardProps } from '../components/ChallengeCard';
import Challenge1Icon from '../assets/challenges/challenge1.svg';

// Move challenges array outside component to prevent recreation
const sampleChallenges: ChallengeCardProps[] = [
  {
    title: 'Master of air',
    description: 'Practice 5 deep breaths.',
    points: 100,
    duration: '10 Days',
    // imageUrl: 'https://picsum.photos/200/200?1',
    icon: <Challenge1Icon width={100} height={100} />,
    status: 'active',
    progress: 40,
    streak: 4,
    checkIns: 5,
  },
  {
    title: 'Hydration boost',
    description: 'Drink water each craving.',
    points: 100,
    duration: '10 Days',
     icon: <Challenge1Icon width={100} height={100} />,
    status: 'locked',
  },
  {
    title: 'Step slayer',
    description: 'Drink water each craving.',
    points: 100,
    duration: '10 Days',
    icon: <Challenge1Icon width={100} height={100} />,
    status: 'locked',
  },
  {
    title: 'Snack break',
    description: 'Drink water each craving.',
    points: 100,
    duration: '10 Days',
    icon: <Challenge1Icon width={100} height={100} />,
    status: 'locked',
  },
  {
    title: 'Calm power',
    description: 'Drink water each craving.',
    points: 100,
    duration: '10 Days',
     icon: <Challenge1Icon width={100} height={100} />,
    status: 'locked',
  },
  {
    title: 'Fist flow',
    description: 'Drink water each craving.',
    points: 100,
    duration: '10 Days',
    icon: <Challenge1Icon width={100} height={100} />,
    status: 'locked',
  },
  {
    title: 'Refresh',
    description: 'Drink water each craving.',
    points: 100,
    duration: '10 Days',
    icon: <Challenge1Icon width={100} height={100} />,
    status: 'locked',
  },
  {
    title: 'Crave crusher',
    description: 'Drink water each craving.',
    points: 100,
    duration: '10 Days',
    icon: <Challenge1Icon width={100} height={100} />,
    status: 'locked',
  },
  {
    title: 'Flow minute',
    description: 'Drink water each craving.',
    points: 100,
    duration: '10 Days',
    icon: <Challenge1Icon width={100} height={100} />,
    status: 'locked',
  }
  
];

// Memoized ChallengeCard component to prevent unnecessary re-renders
const MemoizedChallengeCard = React.memo<ChallengeCardProps>((props) => (
  <ChallengeCard {...props} />
));

const Challenges: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // Memoize the visible challenges to prevent recalculation
  const visibleChallenges = useMemo(() => 
    isCollapsed ? sampleChallenges.slice(0, 3) : sampleChallenges,
    [isCollapsed]
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
    <Text className="text-white text-center text-3xl font-bold mb-6">Challenges</Text>
  ), []);

  return (
    <View className="flex-1">
      {/* Title */}
      {title}

      {/* Challenge List */}
      {challengesList}
    </View>
  );
};

export default React.memo(Challenges);

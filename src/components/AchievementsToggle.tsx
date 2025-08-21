import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AchievementsToggleProps {
  scrollY: Animated.Value;
  isExclusiveSelected: boolean;
  setIsExclusiveSelected: (isExclusive: boolean) => void;
}

const AchievementsToggle: React.FC<AchievementsToggleProps> = ({ 
  scrollY, 
  isExclusiveSelected, 
  setIsExclusiveSelected 
}) => {

  const transform = useMemo(() => [{
    translateY: scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [0, -70],
      extrapolate: 'clamp'
    })
  }], [scrollY]);

  return (
    <Animated.View 
      className="absolute left-0 right-0 z-[60] items-center"
      style={{ 
        top: 300,
        transform
      }}
    >
      <View 
        className="rounded-2xl flex-row w-[220px] h-[44px] p-0.5 gap-1 bg-slate-100 shadow-lg"
        style={{ 
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 15,
          elevation: 8
        }}
      >
        <Pressable 
          className={`rounded-2xl flex-row items-center justify-center flex-1 ${
            !isExclusiveSelected 
              ? 'bg-white shadow-sm' 
              : ''
          }`}
          style={{ 
            shadowColor: !isExclusiveSelected ? '#000000' : 'transparent',
            shadowOffset: !isExclusiveSelected ? { width: 0, height: 1 } : { width: 0, height: 0 },
            shadowOpacity: !isExclusiveSelected ? 0.1 : 0,
            shadowRadius: !isExclusiveSelected ? 3 : 0,
            elevation: !isExclusiveSelected ? 2 : 0
          }}
          onPress={() => setIsExclusiveSelected(false)}
        >
          <Ionicons 
            name="ribbon" 
            size={16} 
            color={!isExclusiveSelected ? '#1E293B' : '#64748B'} 
          />
          <Text 
            className={`font-medium ml-2 ${
              !isExclusiveSelected ? 'text-slate-800' : 'text-slate-400'
            }`}
          >
            Regular
          </Text>
        </Pressable>
        <Pressable 
          className={`rounded-2xl flex-row items-center justify-center flex-1 ${
            isExclusiveSelected 
              ? 'bg-white shadow-sm' 
              : ''
          }`}
          style={{ 
            shadowColor: isExclusiveSelected ? '#000000' : 'transparent',
            shadowOffset: isExclusiveSelected ? { width: 0, height: 1 } : { width: 0, height: 0 },
            shadowOpacity: isExclusiveSelected ? 0.1 : 0,
            shadowRadius: isExclusiveSelected ? 3 : 0,
            elevation: isExclusiveSelected ? 2 : 0
          }}
          onPress={() => setIsExclusiveSelected(true)}
        >
          <Ionicons 
            name="star" 
            size={16} 
            color={isExclusiveSelected ? '#1E293B' : '#64748B'} 
          />
          <Text 
            className={`font-medium ml-2 ${
              isExclusiveSelected ? 'text-slate-800' : 'text-slate-400'
            }`}
          >
            Exclusive
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default React.memo(AchievementsToggle);


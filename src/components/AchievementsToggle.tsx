import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
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

  // Use the same transform as the Buddy icon
  const transform = useMemo(() => [{
    translateY: scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [0, -70],
      extrapolate: 'clamp'
    })
  }], [scrollY]);

  const handleRegularPress = useCallback(() => {
    setIsExclusiveSelected(false);
  }, [setIsExclusiveSelected]);

  const handleExclusivePress = useCallback(() => {
    setIsExclusiveSelected(true);
  }, [setIsExclusiveSelected]);

  return (
    <Animated.View style={{ 
      position: 'absolute',
      top: 300,
      left: 0,
      right: 0,
      zIndex: 9999,
      alignItems: 'center',
      justifyContent: 'center',
      transform
    }}>
      <View style={{ 
        flexDirection: 'row', 
        backgroundColor: '#f1f5f9', 
        borderRadius: 16, 
        padding: 2, 
        width: 220, 
        height: 44,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8
      }}>
        <TouchableOpacity 
          style={{ 
            flex: 1,
            backgroundColor: !isExclusiveSelected ? '#ffffff' : 'transparent',
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            shadowColor: !isExclusiveSelected ? '#000000' : 'transparent',
            shadowOffset: !isExclusiveSelected ? { width: 0, height: 1 } : { width: 0, height: 0 },
            shadowOpacity: !isExclusiveSelected ? 0.1 : 0,
            shadowRadius: !isExclusiveSelected ? 3 : 0,
            elevation: !isExclusiveSelected ? 2 : 0
          }}
          onPress={handleRegularPress}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="ribbon" 
            size={16} 
            color={!isExclusiveSelected ? '#1E293B' : '#64748B'} 
          />
          <Text style={{ 
            marginLeft: 8,
            fontWeight: '500',
            color: !isExclusiveSelected ? '#1E293B' : '#64748B'
          }}>
            Regular
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            flex: 1,
            backgroundColor: isExclusiveSelected ? '#ffffff' : 'transparent',
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            shadowColor: isExclusiveSelected ? '#000000' : 'transparent',
            shadowOffset: isExclusiveSelected ? { width: 0, height: 1 } : { width: 0, height: 0 },
            shadowOpacity: isExclusiveSelected ? 0.1 : 0,
            shadowRadius: isExclusiveSelected ? 3 : 0,
            elevation: isExclusiveSelected ? 2 : 0
          }}
          onPress={handleExclusivePress}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="star" 
            size={16} 
            color={isExclusiveSelected ? '#1E293B' : '#64748B'} 
          />
          <Text style={{ 
            marginLeft: 8,
            fontWeight: '500',
            color: isExclusiveSelected ? '#1E293B' : '#64748B'
          }}>
            Exclusive
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default AchievementsToggle;


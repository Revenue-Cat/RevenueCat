import { useState, useRef, useCallback, useMemo } from 'react';
import { Animated } from 'react-native';

export const useHomeScroll = () => {
  const [isAchievementsCollapsed, setIsAchievementsCollapsed] = useState(true);
  const [isBackgroundShrunk, setIsBackgroundShrunk] = useState(false);
  const maxScrollReached = useRef(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Memoize the scroll listener to prevent recreation
  const scrollListener = useCallback((event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    // Track the maximum scroll position reached
    maxScrollReached.current = Math.max(maxScrollReached.current, scrollPosition);
    
    // Only shrink when scrolling down past threshold, and stay shrunk once reached
    if (maxScrollReached.current > 50 && !isBackgroundShrunk) {
      setIsBackgroundShrunk(true);
    }

    // Auto-collapse Achievement Cards when scrolling
    if (scrollPosition > 10 && !isAchievementsCollapsed) {
      setIsAchievementsCollapsed(true);
    }
  }, [isBackgroundShrunk, isAchievementsCollapsed]);

  // Memoize the handleScroll callback to prevent recreation on every render
  const handleScroll = useCallback(
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { 
        useNativeDriver: false,
        listener: scrollListener
      }
    ),
    [scrollListener]
  );

  // Memoize the toggle achievements callback
  const toggleAchievements = useCallback(() => {
    setIsAchievementsCollapsed(prev => !prev);
  }, []);

  // Memoize the background height interpolation
  const backgroundHeight = useMemo(() => 
    isBackgroundShrunk ? 100 : scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [330, 100],
      extrapolate: 'clamp'
    }),
    [isBackgroundShrunk, scrollY]
  );

  // Memoize the scroll view transform
  const scrollViewTransform = useMemo(() => [{
    translateY: scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -100],
      extrapolate: 'clamp'
    })
  }], [scrollY]);

  // Memoize the buddy transform
  const buddyTransform = useMemo(() => [{
    translateY: scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [0, -100],
      extrapolate: 'clamp'
    })
  }], [scrollY]);

  return {
    isAchievementsCollapsed,
    isBackgroundShrunk,
    scrollY,
    handleScroll,
    toggleAchievements,
    backgroundHeight,
    scrollViewTransform,
    buddyTransform
  };
};

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Animated, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useHomeScroll = () => {
  const [isAchievementsCollapsed, setIsAchievementsCollapsed] = useState(true);
  const [isBackgroundShrunk, setIsBackgroundShrunk] = useState(false);
  const maxScrollReached = useRef(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Create Animated.Value with proper initial value
  const [scrollY] = useState(() => new Animated.Value(0));
  
  // Ensure scrollY is properly initialized
  if (!scrollY) {
    console.error('scrollY is undefined!');
  }


  // Load saved scroll position on mount
  useEffect(() => {
    const loadScrollPosition = async () => {
      try {
        const savedPosition = await AsyncStorage.getItem('homeScrollPosition');
        if (savedPosition) {
          const position = parseFloat(savedPosition);

          scrollY.setValue(position);
          maxScrollReached.current = position;
          
          // Update background state based on saved position
          if (position > 50) {
            setIsBackgroundShrunk(true);
          }
        } else {
          console.log("No saved position found, starting at 0");
        }
      } catch (error) {
        console.log('Error loading scroll position:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadScrollPosition();
  }, [scrollY]);
  // Memoize the scroll listener to prevent recreation
  const scrollListener = useCallback((event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    
    // Debug logging for scroll events
    if (Math.floor(scrollPosition) % 50 === 0) {
      console.log('Scroll event triggered - position:', scrollPosition, 'Platform:', Platform.OS);
    }
    
    // Android optimization: Throttle AsyncStorage saves
    if (Platform.OS === 'android') {
      // Only save every 20px of scroll on Android for better performance
      if (Math.floor(scrollPosition) % 20 === 0) {
        AsyncStorage.setItem('homeScrollPosition', scrollPosition.toString()).catch(error => {
          console.log('Error saving scroll position:', error);
        });
      }
    } else {
      // iOS: Save every scroll position
      AsyncStorage.setItem('homeScrollPosition', scrollPosition.toString()).catch(error => {
        console.log('Error saving scroll position:', error);
      });
    }
    
    // Track the maximum scroll position reached
    maxScrollReached.current = Math.max(maxScrollReached.current, scrollPosition);
    
    // Only shrink when scrolling down past threshold, and stay shrunk once reached
    if (maxScrollReached.current > 50 && !isBackgroundShrunk) {
      console.log('Setting background shrunk to true, maxScroll:', maxScrollReached.current);
      setIsBackgroundShrunk(true);
    }

    // Note: Achievement Cards no longer auto-collapse on scroll
  }, [isBackgroundShrunk]);

  // Memoize the handleScroll callback to prevent recreation on every render
  const handleScroll = useCallback(
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { 
        useNativeDriver: false, // Set to false to support height animations
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
      outputRange: [300, 100],
      extrapolate: 'clamp'
    }),
    [isBackgroundShrunk, scrollY]
  );

  // Memoize the background transform for native driver compatibility
  const backgroundTransform = useMemo(() => [{
    scaleY: scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0.33], // 100/300 = 0.33
      extrapolate: 'clamp'
    })
  }], [scrollY]);

  // Memoize the scroll view transform
  const scrollViewTransform = useMemo(() => [{
    translateY: scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -60],
      extrapolate: 'clamp'
    })
  }], [scrollY]);

  // Memoize the buddy transform
  const buddyTransform = useMemo(() => [{
    translateY: scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [0, -70],
      extrapolate: 'clamp'
    })
  }], [scrollY]);

  // Background scale transform for native driver compatibility
  const backgroundScaleY = useMemo(() => {
    if (!scrollY) {
      console.error('scrollY is undefined in backgroundScaleY!');
      return new Animated.Value(1);
    }
    return scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0.33], // 100/300 = 0.33
      extrapolate: 'clamp'
    });
  }, [scrollY]);

  return {
    isAchievementsCollapsed,
    isBackgroundShrunk,
    scrollY,
    handleScroll,
    toggleAchievements,
    backgroundHeight: isBackgroundShrunk ? 100 : 300, // Static height values
    backgroundScaleY, // New scale transform
    backgroundTransform,
    scrollViewTransform,
    buddyTransform,
    isInitialized
  };
};

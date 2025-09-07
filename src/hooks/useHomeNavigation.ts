import { useState, useCallback, useMemo } from 'react';
import { Animated, Dimensions } from 'react-native';
import { PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';

type ViewType = 'home' | 'achievements' | 'shop';

export const useHomeNavigation = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const { width } = Dimensions.get('window');

  // Horizontal swipe animation state
  const [offsetX] = useState(() => new Animated.Value(-width)); // start at 'home' (middle)
  const [dragX] = useState(() => new Animated.Value(0));

  // Combined translateX that moves with drag over the base offset
  const contentTranslateX = useMemo(() => Animated.add(offsetX, dragX), [offsetX, dragX]);

  const viewToIndex = useCallback((view: ViewType) => {
    switch (view) {
      case 'achievements':
        return 0;
      case 'home':
        return 1;
      case 'shop':
        return 2;
      default:
        return 1;
    }
  }, []);

  const indexToView = useCallback((index: number): ViewType => {
    if (index <= 0) return 'achievements';
    if (index >= 2) return 'shop';
    return 'home';
  }, []);

  // Drive drag during ACTIVE state
  const onHeaderGestureEvent = useCallback(
    () =>
      Animated.event([
        { nativeEvent: { translationX: dragX } },
      ], { useNativeDriver: true }),
    [dragX]
  );

  const handleHeaderGesture = useCallback((event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      const { translationX, velocityX } = event.nativeEvent;
      const threshold = width * 0.2;

      // Determine intended direction
      let nextIndex = viewToIndex(currentView);
      if (translationX > threshold || (velocityX > 800 && translationX > 0)) {
        nextIndex = Math.max(0, nextIndex - 1);
      } else if (translationX < -threshold || (velocityX < -800 && translationX < 0)) {
        nextIndex = Math.min(2, nextIndex + 1);
      }

      const targetView = indexToView(nextIndex);
      
      // Animate to snap position and reset drag
      Animated.parallel([
        Animated.timing(offsetX, {
          toValue: -nextIndex * width,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(dragX, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update view state after animation completes to prevent content mismatch
        setCurrentView(targetView);
      });
    }
  }, [currentView, indexToView, offsetX, dragX, viewToIndex, width]);

  const changeView = useCallback((view: ViewType) => {
    setCurrentView(view);
    const index = viewToIndex(view);
    Animated.timing(offsetX, {
      toValue: -index * width,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [offsetX, viewToIndex, width]);

  return {
    currentView,
    handleHeaderGesture,
    changeView,
    onHeaderGestureEvent,
    contentTranslateX
  };
};

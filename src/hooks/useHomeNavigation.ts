import { useState, useCallback, useMemo } from 'react';
import { Animated, Dimensions } from 'react-native';
import { PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';

type ViewType = 'home' | 'achievements' | 'shop';

export const useHomeNavigation = () => {
  const { width } = Dimensions.get('window');
  const [currentPageIndex, setCurrentPageIndex] = useState(1); // Start at 'home' (index 1)

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

  const currentView = indexToView(currentPageIndex);

  // Handle continuous gesture updates
  const onHeaderGestureEvent = useCallback(
    (event: any) => {
      // Update dragX during continuous drag for immediate visual feedback
      dragX.setValue(event.nativeEvent.translationX);
    },
    [dragX]
  );

  const handleHeaderGesture = useCallback((event: PanGestureHandlerStateChangeEvent) => {
    const { state, translationX, velocityX } = event.nativeEvent;

    if (state === State.BEGAN) {
      // Reset drag when gesture begins
      dragX.setValue(0);
      return;
    }

    if (state === State.END || state === State.CANCELLED) {
      const threshold = width * 0.2; // Threshold for switching pages

      // Determine if we should switch pages based on drag distance and velocity
      let shouldSwitch = false;
      let nextIndex = currentPageIndex;

      // Check if dragged far enough or fast enough
      if (Math.abs(translationX) > threshold) {
        shouldSwitch = true;
        nextIndex = translationX > 0
          ? Math.max(0, currentPageIndex - 1) // Swipe right = previous page
          : Math.min(2, currentPageIndex + 1); // Swipe left = next page
      } else if (Math.abs(velocityX) > 400) {
        // Fast swipe regardless of distance
        shouldSwitch = true;
        nextIndex = velocityX > 0
          ? Math.max(0, currentPageIndex - 1)
          : Math.min(2, currentPageIndex + 1);
      }

      if (shouldSwitch && nextIndex !== currentPageIndex) {
        // Animate to new page
        Animated.parallel([
          Animated.timing(offsetX, {
            toValue: -nextIndex * width,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dragX, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setCurrentPageIndex(nextIndex);
        });
      } else {
        // Snap back to current page
        Animated.timing(dragX, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [currentPageIndex, offsetX, dragX, width]);

  const changeView = useCallback((view: ViewType) => {
    const index = viewToIndex(view);
    setCurrentPageIndex(index);
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

import { useState, useCallback } from 'react';
import { State } from 'react-native-gesture-handler';

type ViewType = 'home' | 'achievements' | 'shop';

export const useHomeNavigation = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const handleHeaderGesture = useCallback((event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      const threshold = 50;

      if (translationX > threshold) {
        // Swipe right - go to previous view
        if (currentView === 'shop') {
          setCurrentView('home');
        } else if (currentView === 'home') {
          setCurrentView('achievements');
        }
      } else if (translationX < -threshold) {
        // Swipe left - go to next view
        if (currentView === 'achievements') {
          setCurrentView('home');
        } else if (currentView === 'home') {
          setCurrentView('shop');
        }
      }
    }
  }, [currentView]);

  const changeView = useCallback((view: ViewType) => {
    setCurrentView(view);
  }, []);

  return {
    currentView,
    handleHeaderGesture,
    changeView
  };
};

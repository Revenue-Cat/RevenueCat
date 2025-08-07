import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Modal,
} from 'react-native';
import { AppProvider } from './src/contexts/AppContext';
import Welcome from './src/screens/Welcome';
import Setup from './src/screens/Setup';
import BuddySelection from './src/screens/BuddySelection';
import NotificationPermission from './src/screens/NotificationPermission';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Achievements from './src/screens/Achievements';
import Shop from './src/screens/Shop';
import CravingSOS from './src/screens/CravingSOS';
import BreathingExercise from './src/screens/BreathingExercise';
import ChatAssistance from './src/screens/ChatAssistance';

type Screen = 
  | 'welcome' 
  | 'setup' 
  | 'buddy-selection' 
  | 'notification-permission' 
  | 'home' 
  | 'profile' 
  | 'achievements' 
  | 'shop';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [showCravingSOS, setShowCravingSOS] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showChatAssistance, setShowChatAssistance] = useState(false);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleShowCravingSOS = () => {
    setShowCravingSOS(true);
  };

  const handleShowBreathingExercise = () => {
    setShowBreathingExercise(true);
  };

  const handleShowChatAssistance = () => {
    setShowChatAssistance(true);
  };

  const handleCloseCravingSOS = () => {
    setShowCravingSOS(false);
  };

  const handleCloseBreathingExercise = () => {
    setShowBreathingExercise(false);
  };

  const handleCloseChatAssistance = () => {
    setShowChatAssistance(false);
  };

  return (
    <AppProvider>
      <SafeAreaView style={styles.container}>
        {currentScreen === 'welcome' && (
          <Welcome onNext={() => navigateTo('setup')} />
        )}
        
        {currentScreen === 'setup' && (
          <Setup 
            onNext={() => navigateTo('buddy-selection')}
            onBack={() => navigateTo('welcome')}
          />
        )}
        
        {currentScreen === 'buddy-selection' && (
          <BuddySelection onNext={() => navigateTo('notification-permission')} />
        )}
        
        {currentScreen === 'notification-permission' && (
          <NotificationPermission onNext={() => navigateTo('home')} />
        )}
        
        {currentScreen === 'home' && (
          <Home 
            onShowCravingSOS={handleShowCravingSOS}
            onShowBreathingExercise={handleShowBreathingExercise}
            onShowChatAssistance={handleShowChatAssistance}
            onNavigateToProfile={() => navigateTo('profile')}
            onNavigateToAchievements={() => navigateTo('achievements')}
            onNavigateToShop={() => navigateTo('shop')}
          />
        )}
        
        {currentScreen === 'profile' && (
          <Profile onBack={() => navigateTo('home')} />
        )}
        
        {currentScreen === 'achievements' && (
          <Achievements onBack={() => navigateTo('home')} />
        )}
        
        {currentScreen === 'shop' && (
          <Shop onBack={() => navigateTo('home')} />
        )}

        {/* Modals */}
        <Modal
          visible={showCravingSOS}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <CravingSOS onClose={handleCloseCravingSOS} />
        </Modal>

        <Modal
          visible={showBreathingExercise}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <BreathingExercise 
            onClose={handleCloseBreathingExercise}
            onBack={handleCloseBreathingExercise}
          />
        </Modal>

        <Modal
          visible={showChatAssistance}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <ChatAssistance 
            onClose={handleCloseChatAssistance}
            onBack={handleCloseChatAssistance}
          />
        </Modal>
      </SafeAreaView>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;

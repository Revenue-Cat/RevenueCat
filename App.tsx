import "./global.css";
import React, { useState, useEffect, useCallback } from "react";
import { View, SafeAreaView, Modal } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "./src/contexts/AppContext";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import "./src/i18n"; // Import i18n configuration
import Welcome from "./src/screens/Welcome";
import Setup from "./src/screens/Setup";
import BuddySelection from "./src/screens/BuddySelection";
import NotificationPermission from "./src/screens/NotificationPermission";
import ChallengeStart from "./src/screens/ChallengeStart";
import Home from "./src/screens/Home";
import Profile from "./src/screens/Profile";
import Achievements from "./src/screens/Achievements";
import Shop from "./src/screens/Shop";
import CravingSOS from "./src/screens/CravingSOS";
import BreathingExercise from "./src/screens/BreathingExercise";
import ChatAssistance from "./src/screens/ChatAssistance";
import CoinPurchaseModal from "./src/components/CoinPurchaseModal";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";

type Screen =
  | "welcome"
  | "setup"
  | "buddy-selection"
  | "notification-permission"
  | "challenge-start"
  | "home"
  | "profile"
  | "achievements"
  | "shop"
  | "edit-habits"
  | "edit-buddy";

const AppContent: React.FC = () => {

  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [showCravingSOS, setShowCravingSOS] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showChatAssistance, setShowChatAssistance] = useState(false);
  const [isScenesSelected, setIsScenesSelected] = useState(false);
  const { theme } = useTheme();

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const handleShowCravingSOS = useCallback(() => {
    setShowCravingSOS(true);
  }, []);

  const handleCloseCravingSOS = useCallback(() => {
    setShowCravingSOS(false);
  }, []);

  const handleShowBreathingExercise = useCallback(() => {
    setShowBreathingExercise(true);
  }, []);

  const handleCloseBreathingExercise = useCallback(() => {
    setShowBreathingExercise(false);
  }, []);

  const handleShowChatAssistance = useCallback(() => {
    setShowChatAssistance(true);
  }, []);

  const handleCloseChatAssistance = useCallback(() => {
    setShowChatAssistance(false);
  }, []);

  useEffect(() => {
    // Initialize RevenueCat
    if (Platform.OS !== 'web') {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      Purchases.configure({
        apiKey: "goog_FzScAUIKXLprLfvKBhyYjdmLHvJ"
      });
    }
  }, []);

  return (
    <AppProvider>
      <SafeAreaView
        className={`flex-1 ${
          theme === "dark" ? "bg-dark-background" : "bg-light-background"
        }`}
      >
        {currentScreen === "welcome" && (
          <Welcome onNext={() => navigateTo("setup")} />
        )}

        {currentScreen === "setup" && (
          <Setup onNext={() => navigateTo("buddy-selection")} />
        )}

        {currentScreen === "buddy-selection" && (
          <BuddySelection
            onNext={() => navigateTo("notification-permission")}
          />
        )}

        {currentScreen === "notification-permission" && (
          <NotificationPermission
            onNext={() => navigateTo("challenge-start")}
          />
        )}

        {currentScreen === "challenge-start" && (
          <ChallengeStart onNext={() => navigateTo("home")} />
        )}

        {currentScreen === "home" && (
          <Home
            onShowCravingSOS={handleShowCravingSOS}
            onShowBreathingExercise={handleShowBreathingExercise}
            onShowChatAssistance={handleShowChatAssistance}
            onNavigateToProfile={() => navigateTo("profile")}
            onNavigateToAchievements={() => navigateTo("achievements")}
            onNavigateToShop={() => navigateTo("shop")}
          />
        )}

        {currentScreen === "profile" && (
          <Profile
            onBack={() => navigateTo("home")}
            onNavigateToAchievements={() => navigateTo("achievements")}
            onNavigateToShop={() => navigateTo("shop")}
            onNavigateToSetup={() => navigateTo("edit-habits")}
            onNavigateToBuddy={() => navigateTo("edit-buddy")}
          />
        )}

        {currentScreen === "edit-habits" && (
          <Setup
            fromProfile
            onBack={() => navigateTo("profile")}
            onNext={() => navigateTo("profile")}
          />
        )}

        {currentScreen === "edit-buddy" && (
          <BuddySelection
            fromProfile
            onBack={() => navigateTo("profile")}
            onNext={() => {}} // unused in fromProfile
          />
        )}

        {currentScreen === "achievements" && (
          <Achievements
            onBack={() => navigateTo("home")}
            isExclusiveSelected={false}
          />
        )}

        {currentScreen === "shop" && (
          <Shop 
            onBack={() => navigateTo("home")} 
            isScenesSelected={isScenesSelected}
            setIsScenesSelected={setIsScenesSelected}
          />
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

        {/* Coin Purchase Modal */}
        {/* <CoinPurchaseModal /> */}

        {/* Shop Modal */}
        {/* <ShopModal /> */}
      </SafeAreaView>
    </AppProvider>
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;

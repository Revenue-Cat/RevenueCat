import "./global.css";
import React, { useState, useEffect, useCallback } from "react";
import { Modal, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider, useApp } from "./src/contexts/AppContext";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import "./src/i18n"; // Import i18n configuration
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Welcome from "./src/screens/Welcome";
import Setup from "./src/screens/Setup";
import BuddySelection from "./src/screens/BuddySelection";
import NotificationPermission from "./src/screens/NotificationPermission";
import ChallengeStart from "./src/screens/ChallengeStart";
import Home from "./src/screens/Home";
import Profile from "./src/screens/Profile";
import Achievements from "./src/screens/Achievements";
import ProgressChallenges from "./src/screens/ProgressChallenges";
import Shop from "./src/screens/Shop";
import CravingSOSModal from "./src/components/CravingSOSModal";
import BreathingExercise from "./src/screens/BreathingExercise";
import ChatAssistance from "./src/screens/ChatAssistance";
import CoinPurchaseModal from "./src/components/CoinPurchaseModal";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";
import oneSignalService from "./src/services/oneSignalService";
import SlipsLog from "./src/screens/SlipsLog";
import LottieView from "lottie-react-native";

type Screen =
  | "welcome"
  | "setup"
  | "buddy-selection"
  | "notification-permission"
  | "challenge-start"
  | "home"
  | "profile"
  | "achievements"
  | "progress-challenges"
  | "shop"
  | "edit-habits"
  | "edit-buddy"
  | "breathing-exercise"
  | "slips-log";

const AppContent: React.FC = () => {
  const { isOnboardingDone, isLoading } = useApp();
  const [showCravingSOS, setShowCravingSOS] = useState(false);
  const [showChatAssistance, setShowChatAssistance] = useState(false);
  const [isScenesSelected, setIsScenesSelected] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [breathingSkipInitial, setBreathingSkipInitial] = useState(false);
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

  const handleShowBreathingExercise = useCallback(
    (skipInitialScreen: boolean = false) => {
      setBreathingSkipInitial(skipInitialScreen);
      navigateTo("breathing-exercise");
    },
    [navigateTo]
  );

  const handleShowChatAssistance = useCallback(() => {
    setShowChatAssistance(true);
  }, []);

  const handleCloseChatAssistance = useCallback(() => {
    setShowChatAssistance(false);
  }, []);

  const handleOpenSlipsLog = useCallback(() => {
    setShowCravingSOS(false);
    navigateTo("slips-log");
  }, [navigateTo]);

  useEffect(() => {
    // Initialize RevenueCat
    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: "appl_KopTWcANzpTAMEriDmzPeFhFiVu" });
    } else if (Platform.OS === "android") {
      Purchases.configure({ apiKey: "goog_FzScAUIKXLprLfvKBhyYjdmLHvJ" });
    } else if (Platform.OS !== "web") {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      Purchases.configure({
        apiKey: "goog_FzScAUIKXLprLfvKBhyYjdmLHvJ",
      });
    }

    // Initialize OneSignal and start background notification processing
    const initializeNotifications = async () => {
      try {
        await oneSignalService.initialize();
        
        // Import and initialize notification service to start background processing
        const notificationService = require('./src/services/notificationService').default;
        await notificationService.initialize();
        
        console.log('App: ✅ Background notification processing started');
      } catch (error) {
        console.error('App: ❌ Failed to initialize notification services:', error);
      }
    };
    
    initializeNotifications();
  }, []);

  useEffect(() => {
    if (isOnboardingDone && currentScreen == "welcome") setCurrentScreen("home");
  }, [isOnboardingDone]);

  return isLoading ? (
    <SafeAreaView
      className={`flex-1 justify-center items-center ${
        theme === "dark" ? "bg-dark-background" : "bg-light-background"
      }`}
    >
      <LottieView
        source={require("./src/assets/loader_color.json")}
        autoPlay
        loop
        style={{
          width: Dimensions.get("window").width * 0.8,
          height: 200,
          alignSelf: "center",
        }}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView
      className={`flex-1 ${
        theme === "dark" ? "bg-dark-background" : "bg-light-background"
      }`}
    >
      {currentScreen === "welcome" && !isOnboardingDone && (
        <Welcome onNext={() => navigateTo("setup")} />
      )}

      {currentScreen === "setup" && (
        <Setup onNext={() => navigateTo("buddy-selection")} />
      )}

      {currentScreen === "buddy-selection" && (
        <BuddySelection onNext={() => navigateTo("notification-permission")} />
      )}

      {currentScreen === "notification-permission" && (
        <NotificationPermission onNext={() => navigateTo("challenge-start")} />
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
          onNavigateToProgressChallenges={() =>
            navigateTo("progress-challenges")
          }
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

      {currentScreen === "progress-challenges" && (
        <ProgressChallenges onBack={() => navigateTo("home")} />
      )}

      {currentScreen === "shop" && (
        <Shop
          onBack={() => navigateTo("home")}
          isScenesSelected={isScenesSelected}
          setIsScenesSelected={setIsScenesSelected}
        />
      )}

      {currentScreen === "breathing-exercise" && (
        <BreathingExercise
          onClose={() => navigateTo("home")}
          onBack={() => navigateTo("home")}
          skipInitialScreen={breathingSkipInitial}
        />
      )}

      {currentScreen === "slips-log" && (
        <SlipsLog onBack={() => navigateTo("home")} />
      )}

      {/* Modals */}
      <CravingSOSModal
        visible={showCravingSOS}
        onClose={handleCloseCravingSOS}
        onStartBreathing={handleShowBreathingExercise}
        onOpenSlipsLog={handleOpenSlipsLog}
      />

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
      <CoinPurchaseModal />

      {/* Shop Modal */}
      {/* <ShopModal /> */}
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AppProvider>
              <AppContent />
            </AppProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

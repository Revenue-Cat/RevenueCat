import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import {
  achievementService,
  Achievement,
  UserProgress,
} from "../services/achievementService";
import { Scene, SCENES_DATA } from "../data/scenesData";
import Purchases from "react-native-purchases";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import {db, auth} from "../../firebaseConfig"
import {getOrCreatePersistentUserId} from "../utils/keychain"
import { DEFAULT_BACKGROUND, DEFAULT_CHARACTER, DEFAULT_STATE, ShopItem } from "../data/state";
import { getBuddyById } from "../data/buddiesData";
import { useLanguage } from "./LanguageContext";
import notificationService, { UserNotificationSettings, ScheduledNotification } from "../services/notificationService";
import oneSignalScheduler from "../services/oneSignalScheduler";
import { adjustCoinsBalance, fetchCoins, Transaction } from "../utils/revenueCat";

type ShopTab = "buddies" | "backgrounds" | "challenges";
export type UserGender = "man" | "lady" | "any";

const getCoinsFromAchievements = (achievements : Achievement[]):number => {
  return achievements.reduce((a:number,b:Achievement) => {
    console.log(b?.unlocked,b?.coins )
    return a + (b?.completedDate ? (b?.coins || 0) : 0)
  },0)
}

interface AppState {
  isLoading: boolean;
  
  // User data
  userCoins: number;
  selectedBuddy: ShopItem;
  selectedBackground: Scene;
  ownedBuddies: string[];
  ownedBackgrounds: string[];
  ownedChallenges: string[];
  ownedAccessories: string[];
  completedAchievements: string[] | undefined;
  transactions: Transaction[];
  isOnboardingDone: boolean;

  // Buddy/User selections
  gender: UserGender; // user's gender (m/w/any)
  selectedBuddyId: string; // which buddy was chosen (id from buddies list)
  buddyName: string; // custom display name for buddy

  // Setup selections
  smokeType: string;
  dailyAmount: string;
  packPrice: string;
  packPriceCurrency: string;
  goal: string;

  // Achievement system
  achievements: Achievement[];
  userProgress: UserProgress;
  daysSmokeFree: number;
  startDate: Date | null;

  // Challenge system
  activeChallenges: string[]; // Array of challenge IDs that are active (can be started)
  inProgressChallenges: string[]; // Array of challenge IDs that are in progress (started with startDate)
  challengeProgress: Record<
    string,
    {
      progress: number;
      streak: number;
      checkIns: number;
      startDate: Date | null;
      isCancelled?: boolean;
    }
  >; // Progress tracking for each challenge
  challengeCompletions: Record<
    string,
    Array<{
      startDate: Date;
      endDate: Date;
      checkIns: number;
      duration: number;
    }>
  >; // History of completed challenges
  dailyCheckIns: Record<string, Record<string, number>>; // Daily check-ins for each challenge: { challengeId: { "2024-09-04": 3, "2024-09-03": 2 } }

  // UI state
  showShop: boolean;
  showCoinPurchase: boolean;
  selectedShopTab: ShopTab;

  // Notification preferences (local storage)
  notificationsEnabled: boolean;
  notificationSoundEnabled: boolean;
  morningNotificationTime: string;
  eveningNotificationTime: string;
  lastNotificationCheck: Date | null;

  // Safe notification loading states
  isNotificationsLoaded: boolean;
  isLoadingNotifications: boolean;
  notificationSettings: UserNotificationSettings | null;
  notificationStats: {
    totalScheduled: number;
    sent: number;
    pending: number;
    nextNotification?: Date;
  } | null;

  slipsUsed: number; // total slips recorded
  slipsDates: string[]; // ISO dates of slips (latest first)
  extraSlipPacks: number; // each pack adds +5 to allowed limit

  // Actions
  addTransaction: (amount:number, description: string) => void;
  refreshCoinsBalance: () => void;
  setUserCoins: (coins: number) => void;
  setCompletedAchievements: (items: string[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setSelectedBuddy: (buddy: ShopItem) => void;
  setSelectedBackground: (background: Scene) => void;
  purchaseItem: (item: ShopItem, category: ShopTab) => Promise<boolean>;
  setShowShop: (show: boolean) => void;
  setShowCoinPurchase: (show: boolean) => void;
  setSelectedShopTab: (tab: ShopTab) => void;
  openShopWithTab: (tab: ShopTab) => void;

  // Achievement actions
  setStartDate: (startDate: Date) => Promise<void>;
  getProgressForAchievement: (achievementId: string) => {
    current: number;
    max: number;
    percentage: number;
  };
  resetProgress: () => Promise<void>;
  setSampleData: () => Promise<void>;
  completeOnboarding: () => Promise<void>;

  // Selection setters
  setGender: (gender: UserGender) => void;
  setSelectedBuddyId: (id: string) => void;
  setBuddyName: (name: string) => void;

  // Setup setters
  setSmokeType: (value: string) => void;
  setDailyAmount: (value: string) => void;
  setPackPrice: (value: string) => void;
  setPackPriceCurrency: (value: string) => void;
  setGoal: (value: string) => void;

  // Challenge actions
  startChallenge: (challengeId: string) => void;
  updateChallengeProgress: (
    challengeId: string,
    progress: number,
    streak: number,
    checkIns: number
  ) => void;
  cancelChallenge: (challengeId: string) => void;
  getChallengeStatus: (
    challengeId: string
  ) => "active" | "locked" | "inprogress" | "completed";
  getChallengeProgress: (challengeId: string) => {
    progress: number;
    streak: number;
    checkIns: number;
    startDate: Date | null;
    isCancelled?: boolean;
  };
  getChallengeCompletions: (challengeId: string) => Array<{
    startDate: Date;
    endDate: Date;
    checkIns: number;
    duration: number;
  }>;
  setChallengeCompletionsForId: (
    challengeId: string,
    completions: Array<{
      startDate: Date;
      endDate: Date;
      checkIns: number;
      duration: number;
    }>
  ) => void;
  calculateProgressBasedOnTime: (
    challengeId: string,
    duration: string,
    startDate: Date | null | undefined
  ) => number;
  getDailyCheckIns: (challengeId: string) => Record<string, number>;
  addDailyCheckIn: (challengeId: string, date: string, count: number) => void;

  getSlipsAllowed: () => number; // 10 + extraSlipPacks*5
  shouldOfferProtectStreak: () => boolean; // show buy card when on 9/14/19...
  addSlip: () => "ok" | "limit"; // returns 'limit' if crossed current cap
  purchaseExtraSlips: (costCoins?: number) => Promise<boolean>; // +5 slips

  // Notification system
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationSoundEnabled: (enabled: boolean) => void;
  setMorningNotificationTime: (time: string) => void;
  setEveningNotificationTime: (time: string) => void;
  setLastNotificationCheck: (date: Date | null) => void;
  initializeNotifications: () => Promise<void>;
  scheduleUserNotifications: () => Promise<void>;
  updateNotificationSettings: (settings: Partial<UserNotificationSettings>) => Promise<void>;
  ensureNotificationSettingsExist: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  getNotificationStats: () => Promise<{
    totalScheduled: number;
    sent: number;
    pending: number;
    nextNotification?: Date;
  }>;
  areNotificationsEnabled: () => Promise<boolean>;

  // Safe notification loading functions
  safeLoadNotificationSettings: () => Promise<{
    settings: UserNotificationSettings | null;
    success: boolean;
    error?: string;
  }>;
  safeLoadNotificationStats: () => Promise<{
    stats: {
      totalScheduled: number;
      sent: number;
      pending: number;
      nextNotification?: Date;
    } | null;
    success: boolean;
    error?: string;
  }>;
  safeLoadAllNotifications: () => Promise<{
    settings: {
      settings: UserNotificationSettings | null;
      success: boolean;
      error?: string;
    };
    stats: {
      stats: {
        totalScheduled: number;
        sent: number;
        pending: number;
        nextNotification?: Date;
      } | null;
      success: boolean;
      error?: string;
    };
    overallSuccess: boolean;
  }>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Language context
  const { language: contextLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Helper function to map language context to notification language
  const getNotificationLanguage = (): 'ua' | 'en' | 'es' => {
    switch (contextLanguage) {
      case 'uk': return 'ua';
      case 'es': return 'es';
      case 'en':
      default: return 'en';
    }
  };
  
  // Shop/state
  const [userCoins, setUserCoinsState] = useState(0);
  const [isOnboardingDone, setIsOnboardingDoneState] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [completedAchievements, setCompletedAchievementsState] = useState<string[] | undefined>(undefined);
  const [selectedBuddy, setSelectedBuddyState] =
    useState<ShopItem>(DEFAULT_CHARACTER);
  const [selectedBackground, setSelectedBackgroundState] =
    useState<Scene>(DEFAULT_BACKGROUND);
  const [ownedBuddies, setOwnedBuddies] = useState<string[]>([
    "llama-m",
    "llama-w",
    "zebra-m",
    "zebra-w",
    "dog-m",
    "dog-w",
  ]);
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>([
    "bg1",
    "bg3",
  ]);

  const [ownedChallenges, setOwnedChallenges] = useState<string[]>([]);

  const [slipsUsed, setSlipsUsed] = useState(0);
  const [slipsDates, setSlipsDates] = useState<string[]>([]);
  const [extraSlipPacks, setExtraSlipPacks] = useState(0);

  const [ownedAccessories, setOwnedAccessories] = useState<string[]>([]);

  // Notification preferences (local storage)
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [notificationSoundEnabled, setNotificationSoundEnabled] = useState<boolean>(true);
  const [morningNotificationTime, setMorningNotificationTime] = useState<string>("08:00");
  const [eveningNotificationTime, setEveningNotificationTime] = useState<string>("20:00");
  const [lastNotificationCheck, setLastNotificationCheck] = useState<Date | null>(null);

  // Notification loading states
  const [isNotificationsLoaded, setIsNotificationsLoaded] = useState<boolean>(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState<boolean>(false);
  const [notificationSettings, setNotificationSettings] = useState<UserNotificationSettings | null>(null);
  const [notificationStats, setNotificationStats] = useState<{
    totalScheduled: number;
    sent: number;
    pending: number;
    nextNotification?: Date;
  } | null>(null);

  // Buddy/User selections
  const [gender, setGenderState] = useState<UserGender>("man");
  const [selectedBuddyId, setSelectedBuddyIdState] =
    useState<string>("llama-m");
  const [buddyName, setBuddyNameState] = useState<string>("Llama Calmington");

  // Setup selections
  const [smokeType, setSmokeTypeState] = useState<string>("");
  const [dailyAmount, setDailyAmountState] = useState<string>("");
  const [packPrice, setPackPriceState] = useState<string>("");
  const [packPriceCurrency, setPackPriceCurrencyState] = useState<string>("$");
  const [goal, setGoalState] = useState<string>("");

  // Achievement system state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    startDate: null,
    daysSmokeFree: 0,
    totalMoneySaved: 0,
    cigarettesAvoided: 0,
    breathingExercisesCompleted: 0,
    challengesCompleted: 0,
    purchasesMade: 0,
  });
  const [daysSmokeFree, setDaysSmokeFree] = useState(0);

  // Challenge system state
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]);
  const [inProgressChallenges, setInProgressChallenges] = useState<string[]>(
    []
  );
  const [challengeProgress, setChallengeProgress] = useState<
    Record<
      string,
      {
        progress: number;
        streak: number;
        checkIns: number;
        startDate: Date | null;
        isCancelled?: boolean;
      }
    >
  >({});
  const [challengeCompletions, setChallengeCompletions] = useState<
    Record<
      string,
      Array<{
        startDate: Date;
        endDate: Date;
        checkIns: number;
        duration: number;
      }>
    >
  >({});
  const [dailyCheckIns, setDailyCheckIns] = useState<
    Record<string, Record<string, number>>
  >({});

  // UI state
  const [showShop, setShowShop] = useState(false);
  const [showCoinPurchase, setShowCoinPurchase] = useState(false);
  const [selectedShopTab, setSelectedShopTab] = useState<ShopTab>("buddies");

  // RevenueCat appUserId for Firebase key
  const [appUserId, setAppUserId] = useState<string | null>(null);

  // Loading state for initial data load
  const [isLoading, setIsLoading] = useState(true);

  // Load from Firebase on mount
  useEffect(() => {

    const loadState = async () => {
      try {
        const userId = await getOrCreatePersistentUserId()

        setIsLoading(true);
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }

        setAppUserId(userId);

        if (!userId) {
          throw new Error("No user ID available");
        }
        if (userId) {
          await Purchases.logIn(userId); // Link RevenueCat to generated UID
        }

        const userDocRef = doc(db, "users", userId); // Using Firebase UID as the document key
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const savedState = docSnap.data()?.appState;

          if (savedState) {
            if (typeof savedState !== "string") {
              console.warn("appState is not a string, initializing with defaults");
              await saveDefaultState(userDocRef);
              return;
            }
            try {
              const parsed = JSON.parse(savedState);
              // Only update state if parsed data is valid
              if (parsed && typeof parsed === "object") {
                setUserCoinsState(parsed.userCoins ?? 0);
                setSelectedBuddyState(parsed.selectedBuddy ?? DEFAULT_CHARACTER);
                setSelectedBackgroundState(
                  parsed.selectedBackground ?? DEFAULT_BACKGROUND
                );
                setOwnedBuddies(
                  parsed.ownedBuddies ?? [
                    "llama-m",
                    "llama-w",
                    "zebra-m",
                    "zebra-w",
                    "dog-m",
                    "dog-w",
                  ]
                );
                setOwnedBackgrounds(parsed.ownedBackgrounds ?? ["bg1", "bg3"]);
                setOwnedChallenges(parsed.ownedChallenges ?? []);
                setOwnedAccessories(parsed.ownedAccessories ?? []);
                setGenderState(parsed.gender ?? "man");
                setSelectedBuddyIdState(parsed.selectedBuddyId ?? "llama-m");
                setBuddyNameState(parsed.buddyName ?? "Llama Calmington");
                setSmokeTypeState(parsed.smokeType ?? "");
                setDailyAmountState(parsed.dailyAmount ?? "");
                setPackPriceState(parsed.packPrice ?? "");
                setPackPriceCurrencyState(parsed.packPriceCurrency ?? "$");
                setGoalState(parsed.goal ?? "");
                setTransactionsState(parsed.transactions ?? [])
                setIsOnboardingDoneState(parsed.isOnboardingDone ?? false)

                // Fix: Convert userProgress startDate to Date (was missing in original code)
                const userProgressData = parsed.userProgress ?? {
                  startDate: null,
                  daysSmokeFree: 0,
                  totalMoneySaved: 0,
                  cigarettesAvoided: 0,
                  breathingExercisesCompleted: 0,
                  challengesCompleted: 0,
                  purchasesMade: 0,
                };
                userProgressData.startDate = userProgressData.startDate
                  ? new Date(userProgressData.startDate)
                  : null;
                setUserProgress(userProgressData);

                setActiveChallenges(parsed.activeChallenges ?? []);

                setInProgressChallenges(parsed.inProgressChallenges ?? []);
                // Convert string dates back to Date objects for challengeProgress
                const challengeProgress = parsed.challengeProgress ?? {};
                const convertedChallengeProgress: Record<
                  string,
                  {
                    progress: number;
                    streak: number;
                    checkIns: number;
                    startDate: Date | null;
                    isCancelled?: boolean;
                  }
                > = {};

                Object.keys(challengeProgress).forEach((challengeId) => {
                  const progress = challengeProgress[challengeId];
                  convertedChallengeProgress[challengeId] = {
                    ...progress,
                    startDate: progress.startDate
                      ? new Date(progress.startDate)
                      : null,
                  };
                });

                setChallengeProgress(convertedChallengeProgress);
                // Convert string dates back to Date objects for challengeCompletions
                const challengeCompletions = parsed.challengeCompletions ?? {};
                const convertedChallengeCompletions: Record<
                  string,
                  Array<{
                    startDate: Date;
                    endDate: Date;
                    checkIns: number;
                    duration: number;
                  }>
                > = {};

                Object.keys(challengeCompletions).forEach((challengeId) => {
                  convertedChallengeCompletions[challengeId] = challengeCompletions[
                    challengeId
                  ].map((completion: any) => ({
                    ...completion,
                    startDate: new Date(completion.startDate),
                    endDate: new Date(completion.endDate),
                  }));
                });

                setChallengeCompletions(convertedChallengeCompletions);
                setDailyCheckIns(parsed.dailyCheckIns ?? {});
                setSlipsUsed(parsed.slipsUsed ?? 0);
                setSlipsDates(parsed.slipsDates ?? []);
                setExtraSlipPacks(parsed.extraSlipPacks ?? 0);
                setCompletedAchievementsState(parsed.completedAchievements ?? [])

                // Load notification preferences
                setNotificationsEnabled(parsed.notificationsEnabled ?? true);
                setNotificationSoundEnabled(parsed.notificationSoundEnabled ?? true);
                setMorningNotificationTime(parsed.morningNotificationTime ?? "08:00");
                setEveningNotificationTime(parsed.eveningNotificationTime ?? "20:00");
                setLastNotificationCheck(parsed.lastNotificationCheck ? new Date(parsed.lastNotificationCheck) : null);

                setIsLoaded(true)
              } else {
                console.warn("Parsed data is invalid, using defaults");
                await saveDefaultState(userDocRef);
              }
            } catch (parseError) {
              console.error("Failed to parse Firestore data:", parseError);
              await saveDefaultState(userDocRef);
            }
          } else {
            console.warn("No appState found in Firestore document");
            await saveDefaultState(userDocRef);
          }
        } else {
          console.log("Firestore document does not exist, creating with defaults");
          await saveDefaultState(userDocRef);
        }
      } catch (error) {
        console.error("Failed to load state:", error);
        console.error("Error details:", {
          message: (error as Error).message,
          code: (error as any).code,
          stack: (error as Error).stack
        });
        // Don't show alert immediately - try to continue with default state
        console.log("Continuing with default state due to error");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Helper function to save default state to Firestore
    const saveDefaultState = async (userDocRef: any) => {
      try {
        await setDoc(userDocRef, { appState: JSON.stringify(DEFAULT_STATE) });
      } catch (error) {
        console.error("Failed to save default state:", error);
        console.error("Save error details:", {
          message: (error as Error).message,
          code: (error as any).code,
          stack: (error as Error).stack
        });
        // Don't show alert - just log the error and continue
        console.log("Continuing without saving to Firestore");
      }
    };

    loadState();
  }, []);

  const saveState = async(stateToSave: any, userId: string) => {
    const userDocRef = doc(db, "users", userId);
    try {
      await setDoc(userDocRef, { appState: JSON.stringify(stateToSave) });
      
      // Also save notification settings with current app state
      try {
        const selectedBuddy = getBuddyById(selectedBuddyId);
        const actualBuddyName = selectedBuddy?.name || buddyName || 'Your Buddy';
        
        const notificationSettings: UserNotificationSettings = {
          userId: userId,
          language: getNotificationLanguage(),
          buddyName: actualBuddyName,
          selectedBuddyId: selectedBuddyId,
          gender: gender,
          startDate: userProgress.startDate || new Date(),
          isEnabled: notificationsEnabled,
          morningTime: morningNotificationTime,
          eveningTime: eveningNotificationTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        
        await notificationService.saveUserSettings(notificationSettings);
        console.log('AppContext: Notification settings saved with app state');
        
        // Also reschedule notifications with current app state
        await scheduleUserNotifications();
        console.log('AppContext: Notifications rescheduled with app state');
      } catch (notificationError) {
        console.error('AppContext: Error saving notification settings:', notificationError);
        // Don't fail the main saveState if notification save fails
      }
    } catch (error) {
      console.error("Failed to save state:", error);
      console.error("Save state error details:", {
        message: (error as Error).message,
        code: (error as any).code,
        stack: (error as Error).stack
      });
      // Don't show alert - just log the error
      console.log("Failed to save state to Firestore, continuing with local state");
    }
  };

  // Save to Firebase when state changes
  useEffect(() => {
    if (!appUserId) return;

    const stateToSave = {
      userCoins,
      selectedBuddy,
      selectedBackground,
      ownedBuddies,
      ownedBackgrounds,
      ownedChallenges,
      ownedAccessories,
      gender,
      selectedBuddyId,
      buddyName,
      smokeType,
      dailyAmount,
      packPrice,
      packPriceCurrency,
      goal,
      userProgress,
      activeChallenges,
      inProgressChallenges,
      challengeProgress,
      challengeCompletions,
      dailyCheckIns,
      slipsUsed,
      slipsDates,
      extraSlipPacks,
      transactions,
      isOnboardingDone,
      completedAchievements,
      // Notification preferences
      notificationsEnabled,
      notificationSoundEnabled,
      morningNotificationTime,
      eveningNotificationTime,
      lastNotificationCheck
    };

    if(!isLoading) {
      saveState(stateToSave, appUserId);
    }
  }, [
    appUserId,
    userCoins,
    selectedBuddy,
    selectedBackground,
    ownedBuddies,
    ownedBackgrounds,
    ownedChallenges,
    ownedAccessories,
    gender,
    selectedBuddyId,
    buddyName,
    smokeType,
    dailyAmount,
    packPrice,
    packPriceCurrency,
    goal,
    userProgress,
    activeChallenges,
    inProgressChallenges,
    challengeProgress,
    challengeCompletions,
    dailyCheckIns,
    slipsUsed,
    slipsDates,
    extraSlipPacks,
    transactions,
    isOnboardingDone,
    completedAchievements,
    // Notification preferences
    notificationsEnabled,
    notificationSoundEnabled,
    morningNotificationTime,
    eveningNotificationTime,
    lastNotificationCheck,
    // Add notification service dependencies
    notificationService,
    contextLanguage
  ]);

  // Sync with achievement service
  useEffect(() => {
    const unsubscribe = achievementService.subscribe(() => {
      setAchievements(achievementService.getAllAchievements());
      setUserProgress(achievementService.getUserProgress());
      setDaysSmokeFree(achievementService.calculateDaysPassed());
    });

    // Initial load
    setAchievements(achievementService.getAllAchievements());
    setUserProgress(achievementService.getUserProgress());
    setDaysSmokeFree(achievementService.calculateDaysPassed());

    return unsubscribe;
  }, []);

  // Sync start date changes with achievement service
  useEffect(() => {
    if (userProgress.startDate) {
      achievementService.setStartDate(userProgress.startDate);
    }
  }, [userProgress.startDate]);

  // Memoize all action functions to prevent recreation
  const setUserCoins = useCallback(
    (coins: number) => setUserCoinsState(coins),
    []
  );
  const setTransactions = useCallback(
    (transactions: Transaction[]) => setTransactionsState(transactions),
    []
  );
  const setSelectedBuddy = useCallback(
    (buddy: ShopItem) => setSelectedBuddyState(buddy),
    []
  );
  const setSelectedBackground = useCallback(
    (background: Scene) => setSelectedBackgroundState(background),
    []
  );

  const refreshCoinsBalance = useCallback(async() => {
    try {
      const coins = await fetchCoins()
      setUserCoins(coins)
    } catch(e) {
      console.error("Error fetching virtual currencies:", e);
    }
  }, [])

  const addTransaction = useCallback(async(amount:number, description: string) => {
    const transaction = Transaction.create(amount, description)
    setTransactions([...transactions, transaction])
  },[transactions])


  const purchaseItem = useCallback(
    async (item: ShopItem | Scene, category: ShopTab): Promise<boolean> => {
      // Use coin field for price (both buddies and scenes use coin)
      const price = (item as any).coin || 0;

      if (userCoins < price) {
        return false;
      }

      await adjustCoinsBalance(-price)
      addTransaction(-price, `Purchase ${item.name} from ${category}`)
      setUserCoinsState((prev) => prev - price);
      switch (category) {
        case "buddies":
          setOwnedBuddies((prev) => [...prev, item.id]);
          break;
        case "backgrounds":
          setOwnedBackgrounds((prev) => [...prev, item.id]);
          break;
        case "challenges":
          setOwnedChallenges((prev) => [...prev, item.id]);
          break;
      }
      refreshCoinsBalance();
      return true;
    },
    [userCoins]
  );

  const openShopWithTab = useCallback((tab: ShopTab) => {
    setSelectedShopTab(tab);
    setShowShop(true);
  }, []);

  // Selection setters (exposed) - memoized
  const setGender = useCallback((g: UserGender) => setGenderState(g), []);
  const setSelectedBuddyId = useCallback(
    (id: string) => setSelectedBuddyIdState(id),
    []
  );
  const setBuddyName = useCallback(
    (name: string) => setBuddyNameState(name),
    []
  );
  const setCompletedAchievements = useCallback(
    (items: string[]) => setCompletedAchievementsState(items),
    []
  );

  // Setup setters (exposed) - memoized
  const setSmokeType = useCallback(
    (value: string) => setSmokeTypeState(value),
    []
  );
  const setDailyAmount = useCallback(
    (value: string) => setDailyAmountState(value),
    []
  );
  const setPackPrice = useCallback(
    (value: string) => setPackPriceState(value),
    []
  );
  const setPackPriceCurrency = useCallback(
    (value: string) => setPackPriceCurrencyState(value),
    []
  );
  const setGoal = useCallback((value: string) => setGoalState(value), []);

  // Challenge actions (exposed) - memoized
  const startChallenge = useCallback(
    (challengeId: string) => {
      const startDate = new Date();

      console.log("startChallenge called:", {
        challengeId,
        currentActiveChallenges: activeChallenges,
        currentInProgressChallenges: inProgressChallenges,
      });

      // Remove from activeChallenges and add to inProgressChallenges
      setActiveChallenges((prev) => {
        const newActive = prev.filter((id) => id !== challengeId);
        console.log("Updated activeChallenges:", newActive);
        return newActive;
      });
      setInProgressChallenges((prev) => {
        if (!prev.includes(challengeId)) {
          const newInProgress = [...prev, challengeId];
          console.log("Updated inProgressChallenges:", newInProgress);
          return newInProgress;
        }
        return prev;
      });

      // Initialize or update progress for the challenge with start date
      setChallengeProgress((prev) => {
        const existingProgress = prev[challengeId];
        return {
          ...prev,
          [challengeId]: {
            progress: existingProgress?.progress || 0,
            streak: existingProgress?.streak || 0,
            checkIns: existingProgress?.checkIns || 0,
            startDate,
            isCancelled: false,
          },
        };
      });
    },
    [activeChallenges, inProgressChallenges]
  );

  const updateChallengeProgress = useCallback(
    (
      challengeId: string,
      progress: number,
      streak: number,
      checkIns: number
    ) => {
      setChallengeProgress((prev) => ({
        ...prev,
        [challengeId]: {
          progress,
          streak,
          checkIns,
          startDate: prev[challengeId]?.startDate || null,
        },
      }));
    },
    []
  );

  const cancelChallenge = useCallback(
    (challengeId: string) => {
      console.log("cancelChallenge called:", {
        challengeId,
        currentActiveChallenges: activeChallenges,
        currentInProgressChallenges: inProgressChallenges,
      });

      // Remove from inProgressChallenges
      setInProgressChallenges((prev) => {
        const newInProgress = prev.filter((id) => id !== challengeId);
        console.log("Updated inProgressChallenges:", newInProgress);
        return newInProgress;
      });

      // Only add to activeChallenges if it was never completed before
      const hasCompletions =
        challengeCompletions[challengeId] &&
        challengeCompletions[challengeId].length > 0;
      if (!hasCompletions) {
        setActiveChallenges((prev) => {
          if (!prev.includes(challengeId)) {
            const newActive = [...prev, challengeId];
            console.log("Updated activeChallenges:", newActive);
            return newActive;
          }
          return prev;
        });
      }

      // Reset progress for the challenge
      setChallengeProgress((prev) => ({
        ...prev,
        [challengeId]: {
          ...prev[challengeId],
          progress: 0,
          streak: 0,
          checkIns: 0,
          startDate: null,
          isCancelled: false,
        },
      }));

      console.log("Challenge cancelled:", challengeId);
    },
    [activeChallenges, inProgressChallenges, challengeCompletions]
  );

  const getChallengeStatus = useCallback(
    (challengeId: string): "active" | "locked" | "inprogress" | "completed" => {
      // Special case: master-of-air-breathing should always be unlocked
      if (challengeId === 'master-of-air-breathing') {
        const hasCompletions =
          challengeCompletions[challengeId] &&
          challengeCompletions[challengeId].length > 0;

        const inProgress = inProgressChallenges.includes(challengeId);

        if (hasCompletions) {
          return "completed";
        }

        if (inProgress) {
          return "inprogress";
        }

        return "active"; // Always active for master-of-air-breathing
      }

      const inProgress = inProgressChallenges.includes(challengeId);
      const active = activeChallenges.includes(challengeId);
      const purchased = ownedChallenges.includes(challengeId);
      const hasCompletions =
        challengeCompletions[challengeId] &&
        challengeCompletions[challengeId].length > 0;

      // Priority: completed > inprogress > purchased/active > locked
      if (hasCompletions) {
        return "completed"; // Challenge has been completed before (highest priority)
      }

      if (inProgress) {
        return "inprogress"; // Challenge is being worked on
      }

      if (purchased || active) {
        return "active"; // Challenge has been purchased or is active
      }

      return "locked"; // Challenge not started
    },
    [activeChallenges, inProgressChallenges, challengeCompletions, ownedChallenges]
  );

  const getChallengeProgress = useCallback(
    (challengeId: string) => {
      const baseProgress = challengeProgress[challengeId] || {
        progress: 0,
        streak: 0,
        checkIns: 0,
        startDate: null,
        isCancelled: false,
      };
      
      // Calculate total check-ins from dailyCheckIns
      const dailyCheckInsData = dailyCheckIns[challengeId] || {};
      const totalCheckIns = Object.values(dailyCheckInsData).reduce((sum, count) => sum + count, 0);
      
      return {
        ...baseProgress,
        checkIns: totalCheckIns,
      };
    },
    [challengeProgress, dailyCheckIns]
  );

  const getChallengeCompletions = useCallback(
    (challengeId: string) => {
      return challengeCompletions[challengeId] || [];
    },
    [challengeCompletions]
  );

  const setChallengeCompletionsForId = useCallback(
    (
      challengeId: string,
      completions: Array<{
        startDate: Date;
        endDate: Date;
        checkIns: number;
        duration: number;
      }>
    ) => {
      setChallengeCompletions((prev) => ({
        ...prev,
        [challengeId]: completions,
      }));
    },
    []
  );

  const calculateProgressBasedOnTime = useCallback(
    (
      challengeId: string,
      duration: string,
      startDate: Date | null | undefined
    ) => {
      if (
        !startDate ||
        !(startDate instanceof Date) ||
        isNaN(startDate.getTime())
      ) {
        console.log(
          "calculateProgressBasedOnTime: Invalid startDate for",
          challengeId,
          startDate
        );
        return 0;
      }

      // Extract number from duration string (e.g., "10 Days" -> 10)
      const durationMatch = duration.match(/(\d+)/);
      const totalDays = durationMatch ? parseInt(durationMatch[1]) : 10; // Default to 10 days

      // Calculate days elapsed since start date
      const now = new Date();
      const timeDiff = now.getTime() - startDate.getTime();
      const daysElapsed = Math.floor(timeDiff / (1000 * 3600 * 24));

      // Calculate progress based on days elapsed vs total days
      const progressPerDay = 100 / totalDays;
      const calculatedProgress = Math.min(daysElapsed * progressPerDay, 100);
      const finalProgress = Math.round(Math.max(calculatedProgress, 0));

      return finalProgress;
    },
    []
  );

  const getDailyCheckIns = useCallback(
    (challengeId: string): Record<string, number> => {
      return dailyCheckIns[challengeId] || {};
    },
    [dailyCheckIns]
  );

  const addDailyCheckIn = useCallback(
    (challengeId: string, date: string, count: number) => {
      setDailyCheckIns((prev) => ({
        ...prev,
        [challengeId]: {
          ...prev[challengeId],
          [date]: (prev[challengeId]?.[date] || 0) + count,
        },
      }));
    },
    []
  );

  // Achievement functions

  const getProgressForAchievement = useCallback((achievementId: string) => {
    return achievementService.getProgressForAchievement(achievementId);
  }, []);

  const resetProgress = useCallback(async () => {
    await achievementService.resetProgress();
  }, []);

  const setSampleData = useCallback(async () => {
    // Set to 2 hours ago for testing - should show ~2 hours elapsed
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    startDate.setMinutes(30);
    startDate.setSeconds(0);

    console.log(
      "setSampleData: Setting startDate to:",
      startDate.toISOString()
    );
    setUserProgress((prev) => ({ ...prev, startDate }));
    await achievementService.setStartDate(startDate);
  }, []);

  // Function to set August 21st start date for specific testing
  const setTodayStartDate = useCallback(async () => {
    const startDate = new Date(); // August 21st, 2024 at 10:30 AM
    console.log(
      "setTodayStartDate: Setting startDate to:",
      startDate.toISOString()
    );
    setUserProgress((prev) => ({ ...prev, startDate }));
    await achievementService.setStartDate(startDate);
  }, []);

  // Function to set startDate when onboarding is completed
  const completeOnboarding = useCallback(async () => {
    const startDate = new Date();
    console.log(
      "completeOnboarding: Setting startDate to:",
      startDate.toISOString()
    );
    setUserProgress((prev) => ({ ...prev, startDate }));
    await achievementService.setStartDate(startDate);
    setIsOnboardingDoneState(true)
    
    // Initialize and schedule notifications after onboarding completion
    try {
      await adjustCoinsBalance(100);
      addTransaction(100, `Completed onboarding`)
      await refreshCoinsBalance()
      
        await initializeNotifications();
        await scheduleUserNotifications();
        await ensureNotificationSettingsExist();
        
    } catch (error) {
      console.error('Error setting up notifications after onboarding:', error as Error);
    }
  }, []);

  // Notification system functions
  const initializeNotifications = useCallback(async () => {
    try {
      await notificationService.initialize();
      console.log('AppContext: Notifications initialized');

      // Send installation notification if user has permissions and start date is set
      if (userProgress.startDate && (await notificationService.areNotificationsEnabled())) {
        const userId = await getOrCreatePersistentUserId();

        // Check if installation notification was already sent using safe loading
        const safeResult = await notificationService.safeGetUserSettings(userId);
        if (!safeResult.success) {
          console.warn('AppContext: Failed to load user notification settings safely:', safeResult.error);
          // Continue with notification sending even if we can't check existing settings
        }

        const userSettingsFromFirebase = safeResult.settings;
        if (!userSettingsFromFirebase?.lastNotificationSent) {
          // Only send if no notifications have been sent yet (indicating first install)
          const selectedBuddy = getBuddyById(selectedBuddyId);
          const actualBuddyName = selectedBuddy?.name || buddyName || 'Your Buddy';

          const userSettings: UserNotificationSettings = {
            userId,
            language: getNotificationLanguage(),
            buddyName: actualBuddyName,
            selectedBuddyId: selectedBuddyId,
            gender: gender,
            startDate: userProgress.startDate,
            isEnabled: true,
            morningTime: '08:00',
            eveningTime: '20:00',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            lastNotificationSent: new Date() // Mark that notifications have started
          };

          // Save settings and send installation notification
          await notificationService.saveUserSettings(userSettings);
          await notificationService.sendInstallationNotification(userSettings);
        }
      }
    } catch (error) {
      console.error('AppContext: Error initializing notifications:', error as Error);
      throw error;
    }
  }, [userProgress.startDate, selectedBuddyId, buddyName, gender]);


  const scheduleUserNotifications = useCallback(async () => {
    try {
      if (!userProgress.startDate) {
        console.log('AppContext: No startDate set, skipping notification scheduling');
        return;
      }

      // Get the actual buddy name from the buddy data
      const selectedBuddy = getBuddyById(selectedBuddyId);
      const actualBuddyName = selectedBuddy?.name || buddyName || 'Your Buddy';

      const userSettings: UserNotificationSettings = {
        userId: await getOrCreatePersistentUserId(),
        language: getNotificationLanguage(),
        buddyName: actualBuddyName,
        selectedBuddyId: selectedBuddyId,
        gender: gender,
        startDate: userProgress.startDate,
        isEnabled: true,
        morningTime: '08:00',
        eveningTime: '20:00',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      await notificationService.scheduleUserNotifications(userSettings);
      
      console.log('AppContext: User notifications scheduled');
    } catch (error) {
      console.error('AppContext: Error scheduling user notifications:', error as Error);
      throw error;
    }
  }, [userProgress.startDate, buddyName, gender, selectedBuddyId, contextLanguage]);

  // Achievement functions
  const setStartDate = useCallback(async (startDate: Date) => {
    setUserProgress((prev) => ({ ...prev, startDate }));
    await achievementService.setStartDate(startDate);
    
    // Automatically reschedule notifications when start date changes
    try {
      await scheduleUserNotifications();
      console.log('AppContext: Notifications rescheduled after start date change');
    } catch (error) {
      console.error('AppContext: Error rescheduling notifications after start date change:', error);
    }
  }, [scheduleUserNotifications]);

  const updateNotificationSettings = useCallback(async (settings: Partial<UserNotificationSettings>) => {
    try {
      const userId = await getOrCreatePersistentUserId();
      const safeResult = await notificationService.safeGetUserSettings(userId);

      if (!safeResult.success) {
        console.warn('AppContext: Failed to load current notification settings safely:', safeResult.error);
        // Continue with update even if we can't get current settings
      }

      const currentSettings = safeResult.settings;
      
      if (!currentSettings) {
        console.log('AppContext: No existing notification settings found, creating new ones');
        // Create new settings with the provided values
        const newSettings: UserNotificationSettings = {
          userId: userId,
          language: getNotificationLanguage(),
          buddyName: settings.buddyName || buddyName || 'Your Buddy',
          selectedBuddyId: settings.selectedBuddyId || selectedBuddyId || 'llama-m',
          gender: settings.gender || gender || 'man',
          startDate: userProgress.startDate || new Date(),
          isEnabled: true,
          morningTime: '08:00',
          eveningTime: '20:00',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...settings
        };
        
        await notificationService.saveUserSettings(newSettings);
        console.log('AppContext: New notification settings created');
        return;
      }

      const updatedSettings = { ...currentSettings, ...settings };
      await notificationService.updateUserSettings(updatedSettings);
      
      console.log('AppContext: Notification settings updated');
    } catch (error) {
      console.error('AppContext: Error updating notification settings:', error as Error);
      throw error;
    }
  }, [buddyName, selectedBuddyId, gender, userProgress.startDate, contextLanguage]);

  // Ensure notification settings exist with current app state
  const ensureNotificationSettingsExist = useCallback(async () => {
    try {
      const userId = await getOrCreatePersistentUserId();
      const safeResult = await notificationService.safeGetUserSettings(userId);
      
      if (!safeResult.success || !safeResult.settings) {
        console.log('AppContext: Creating initial notification settings with current app state');
        
        const selectedBuddy = getBuddyById(selectedBuddyId);
        const actualBuddyName = selectedBuddy?.name || buddyName || 'Your Buddy';
        
        const initialSettings: UserNotificationSettings = {
          userId: userId,
          language: getNotificationLanguage(),
          buddyName: actualBuddyName,
          selectedBuddyId: selectedBuddyId,
          gender: gender,
          startDate: userProgress.startDate || new Date(),
          isEnabled: true,
          morningTime: '08:00',
          eveningTime: '20:00',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        
        await notificationService.saveUserSettings(initialSettings);
        console.log('AppContext: Initial notification settings created');
      }
    } catch (error) {
      console.error('AppContext: Error ensuring notification settings exist:', error);
    }
  }, [selectedBuddyId, buddyName, gender, userProgress.startDate, contextLanguage]);



  const sendTestNotification = useCallback(async () => {
    try {
      // Get the actual buddy name from the buddy data
      const selectedBuddy = getBuddyById(selectedBuddyId);
      const actualBuddyName = selectedBuddy?.name || buddyName || 'Your Buddy';

      const userSettings: UserNotificationSettings = {
        userId: await getOrCreatePersistentUserId(),
        language: getNotificationLanguage(),
        buddyName: actualBuddyName,
        selectedBuddyId: selectedBuddyId,
        gender: gender,
        startDate: userProgress.startDate || new Date(),
        isEnabled: true,
        morningTime: '08:00',
        eveningTime: '20:00',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      await notificationService.sendTestNotification(userSettings);
      
      console.log('AppContext: Test notification sent');
    } catch (error) {
      console.error('AppContext: Error sending test notification:', error as Error);
      throw error;
    }
  }, [userProgress.startDate, buddyName, gender, selectedBuddyId, contextLanguage]);

  /**
   * Safely save notification settings to Firebase (similar to saveState pattern)
   */
  const safeSaveNotificationSettings = useCallback(async (settings: UserNotificationSettings) => {
    try {
      console.log('AppContext: Safely saving notification settings for user:', settings.userId);

      const result = await notificationService.saveUserSettings(settings);

      console.log('AppContext: Notification settings saved successfully');
      return {
        success: true
      };
    } catch (error) {
      console.error('AppContext: Error safely saving notification settings:', error);
      return {
        success: false,
        error: `Failed to save notification settings: ${(error as Error).message}`
      };
    }
  }, []);

  /**
   * Safely save scheduled notification to Firebase
   */
  const safeSaveScheduledNotification = useCallback(async (notification: ScheduledNotification) => {
    try {
      console.log('AppContext: Safely saving scheduled notification:', notification.id);

      const result = await notificationService.safeSaveScheduledNotification(notification);

      if (result.success) {
        console.log('AppContext: Scheduled notification saved successfully');
      } else {
        console.error('AppContext: Failed to save scheduled notification:', result.error);
      }

      return result;
    } catch (error) {
      console.error('AppContext: Error in safeSaveScheduledNotification:', error);
      return {
        success: false,
        error: `Unexpected error: ${(error as Error).message}`
      };
    }
  }, []);

  /**
   * Safely clear all scheduled notifications for current user
   */
  const safeClearScheduledNotifications = useCallback(async () => {
    try {
      const userId = await getOrCreatePersistentUserId();
      console.log('AppContext: Safely clearing scheduled notifications for user:', userId);

      const result = await notificationService.safeClearScheduledNotifications(userId);

      if (result.success) {
        console.log('AppContext: Scheduled notifications cleared successfully, deleted:', result.deletedCount);
        // Refresh notification stats after clearing
        await safeLoadNotificationStats();
      } else {
        console.error('AppContext: Failed to clear scheduled notifications:', result.error);
      }

      return result;
    } catch (error) {
      console.error('AppContext: Error in safeClearScheduledNotifications:', error);
      return {
        success: false,
        error: `Unexpected error: ${(error as Error).message}`
      };
    }
  }, []);

  /**
   * Force process all pending notifications (for testing and recovery)
   */
  const forceProcessPendingNotifications = useCallback(async () => {
    try {
      console.log('AppContext: Force processing pending notifications');

      const result = await notificationService.forceProcessPendingNotifications();

      if (result.processed > 0) {
        console.log(`AppContext: Force processed ${result.processed} notifications`);
        // Refresh notification stats after processing
        await safeLoadNotificationStats();
      }

      if (result.errors > 0) {
        console.warn(`AppContext: ${result.errors} errors occurred during force processing`);
      }

      return result;
    } catch (error) {
      console.error('AppContext: Error in force processing:', error);
      return {
        processed: 0,
        errors: 1
      };
    }
  }, []);

  /**
   * Safely load notification settings from Firebase
   */
  const safeLoadNotificationSettings = useCallback(async () => {
    try {
      setIsLoadingNotifications(true);
      console.log('AppContext: Starting safe load of notification settings');

      const userId = await getOrCreatePersistentUserId();
      const result = await notificationService.safeGetUserSettings(userId);

      if (result.success) {
        setNotificationSettings(result.settings);
        console.log('AppContext: Successfully loaded notification settings:', result.settings ? 'Found' : 'None');
      } else {
        console.error('AppContext: Failed to load notification settings:', result.error);
        setNotificationSettings(null);
      }

      return result;
    } catch (error) {
      console.error('AppContext: Error in safeLoadNotificationSettings:', error);
      setNotificationSettings(null);
      return {
        settings: null,
        success: false,
        error: `Unexpected error: ${(error as Error).message}`
      };
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  /**
   * Safely load notification statistics from Firebase
   */
  const safeLoadNotificationStats = useCallback(async () => {
    try {
      console.log('AppContext: Starting safe load of notification stats');

      const userId = await getOrCreatePersistentUserId();
      const result = await notificationService.safeGetUserNotificationStats(userId);

      if (result.success) {
        setNotificationStats(result.stats);
        console.log('AppContext: Successfully loaded notification stats:', result.stats);
      } else {
        console.error('AppContext: Failed to load notification stats:', result.error);
        setNotificationStats(null);
      }

      return result;
    } catch (error) {
      console.error('AppContext: Error in safeLoadNotificationStats:', error);
      setNotificationStats(null);
      return {
        stats: null,
        success: false,
        error: `Unexpected error: ${(error as Error).message}`
      };
    }
  }, []);

  /**
   * Safely load all notification data from Firebase
   */
  const safeLoadAllNotifications = useCallback(async () => {
    try {
      setIsLoadingNotifications(true);
      setIsNotificationsLoaded(false);

      console.log('AppContext: Starting safe load of all notification data');

      // Load notification settings
      const settingsResult = await safeLoadNotificationSettings();

      // Load notification stats
      const statsResult = await safeLoadNotificationStats();

      const allSuccessful = settingsResult.success && statsResult.success;

      if (allSuccessful) {
        setIsNotificationsLoaded(true);
        console.log('AppContext: Successfully loaded all notification data');
      } else {
        console.warn('AppContext: Some notification data failed to load');
        console.warn('Settings result:', settingsResult);
        console.warn('Stats result:', statsResult);
      }

      return {
        settings: settingsResult,
        stats: statsResult,
        overallSuccess: allSuccessful
      };
    } catch (error) {
      console.error('AppContext: Error in safeLoadAllNotifications:', error);
      setNotificationSettings(null);
      setNotificationStats(null);
      return {
        settings: { settings: null, success: false, error: (error as Error).message },
        stats: { stats: null, success: false, error: (error as Error).message },
        overallSuccess: false
      };
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [safeLoadNotificationSettings, safeLoadNotificationStats]);

  const getNotificationStats = useCallback(async () => {
    try {
      const userId = await getOrCreatePersistentUserId();
      const firebaseStats = await notificationService.getUserNotificationStats(userId);
      const oneSignalStats = oneSignalScheduler.getNotificationStats();
      
      return {
        ...firebaseStats,
        oneSignal: oneSignalStats
      };
    } catch (error) {
      console.error('AppContext: Error getting notification stats:', error as Error);
      throw error;
    }
  }, []);

  const areNotificationsEnabled = useCallback(async () => {
    try {
      // Check OneSignal permission status instead
      return await notificationService.areNotificationsEnabled();
    } catch (error) {
      console.error('AppContext: Error checking notification permissions:', error as Error);
      return false;
    }
  }, []);

  // Set up achievement completion callback to add coins
  useEffect(() => {
    achievementService.setOnAchievementCompleted((achievement) => {
      const coins = achievement.coins || 0;
      if (coins > 0) {
        //setUserCoinsState((prev) => prev + coins);
        console.log(
          `Achievement completed: ${achievement.name}, added ${coins} coins`
        );
      }
    });
  }, []);

  // Calculate initial coins based on onboarding bonus and completed achievements
  useEffect(() => {
    const init = async() => {
      if(completedAchievements) {
        let updated = false;
        let coins = 0
        const ids:string[] = [] 
        achievements.forEach((item: Achievement) => {
          if(item.completedDate && item.coins && !completedAchievements.includes(item.id)) {
            console.log(item.id, item)
            coins += item.coins;
            ids.push(item.id)
            updated = true
          }
        })
        if(updated) {
          await adjustCoinsBalance(coins)
          addTransaction(coins, `Achievements done: ${ids.join(",")}`)
          setCompletedAchievements([...completedAchievements, ...ids])
        }
      }
      await refreshCoinsBalance()
    }
    if(isLoaded){
      init()
    }
  }, [achievements, completedAchievements, isLoading]);

  // --- SLIPS HELPERS & ACTIONS (place after other handlers like purchaseItem/openShopWithTab) ---
  const getSlipsAllowed = useCallback(
    () => 10 + extraSlipPacks * 5,
    [extraSlipPacks]
  );

  const isOneBeforeLimit = useCallback(() => {
    const allowed = getSlipsAllowed();
    return slipsUsed === allowed - 1; // 9, 14, 19, ...
  }, [slipsUsed, getSlipsAllowed]);

  const shouldOfferProtectStreak = useCallback(
    () => isOneBeforeLimit(),
    [isOneBeforeLimit]
  );

  const addSlip = useCallback((): "ok" | "limit" => {
    const allowed = getSlipsAllowed();
    const newCount = slipsUsed + 1;

    const nowIso = new Date().toISOString();

    // Always record the slip in history (optional—remove if you don't want to keep the last one)
    setSlipsDates((prev) => [nowIso, ...prev]);

    if (newCount >= allowed) {
      // Exceeded allowance → reset current cycle
      setSlipsUsed(0);
      setSlipsDates([]); // clear the visible grid for the new cycle
      // Note: Start date reset is handled by the calling component (SlipsLog)
      return "limit";
    }

    // Still within allowance → increment normally
    setSlipsUsed(newCount);
    return "ok";
  }, [slipsUsed, getSlipsAllowed]);

  const purchaseExtraSlips = useCallback(
    async (costCoins: number = 1000): Promise<boolean> => {
      if (userCoins < costCoins) {
        // Show coin purchase modal instead of just returning false
        setShowCoinPurchase(true);
        return false;
      }

      try {
        await adjustCoinsBalance(-costCoins)
        addTransaction(-costCoins, `Purchase extra slips`)
        setUserCoinsState((prev) => prev - costCoins);
        setExtraSlipPacks((prev) => prev + 1);
        refreshCoinsBalance();
        return true;
      } catch (e) {
        console.error("purchaseExtraSlips error", e);
        return false;
      }
    },
    [userCoins, setShowCoinPurchase]
  );


  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      isLoading,
      userCoins,
      selectedBuddy,
      selectedBackground,
      ownedBuddies,
      ownedBackgrounds,
      ownedChallenges,
      ownedAccessories,
      transactions,
      isOnboardingDone,
      completedAchievements,

      gender,
      selectedBuddyId,
      buddyName,

      smokeType,
      dailyAmount,
      packPrice,
      packPriceCurrency,
      goal,

      // Achievement system
      achievements,
      userProgress,
      daysSmokeFree,
      startDate: userProgress.startDate,


      // Challenge system
      activeChallenges,
      inProgressChallenges,
      challengeProgress,
      challengeCompletions,
      dailyCheckIns,

      showShop,
      showCoinPurchase,
      selectedShopTab,

      addTransaction,
      refreshCoinsBalance,
      setUserCoins,
      setSelectedBuddy,
      setSelectedBackground,
      purchaseItem,
      setShowShop,
      setShowCoinPurchase,
      setSelectedShopTab,
      openShopWithTab,
      setTransactions,
      setCompletedAchievements,

      // Achievement actions
      setStartDate,
      getProgressForAchievement,
      resetProgress,
      setSampleData,
      completeOnboarding,

      setGender,
      setSelectedBuddyId,
      setBuddyName,

      setSmokeType,
      setDailyAmount,
      setPackPrice,
      setPackPriceCurrency,
      setGoal,

      // Challenge actions
      startChallenge,
      updateChallengeProgress,
      cancelChallenge,
      getChallengeStatus,
      getChallengeProgress,
      getChallengeCompletions,
      setChallengeCompletionsForId,
      calculateProgressBasedOnTime,
      getDailyCheckIns,
      addDailyCheckIn,
      slipsUsed,
      slipsDates,
      extraSlipPacks,
      getSlipsAllowed,
      shouldOfferProtectStreak,
      addSlip,
      purchaseExtraSlips,

      // Notification system
      initializeNotifications,
      scheduleUserNotifications,
      updateNotificationSettings,
      ensureNotificationSettingsExist,
      sendTestNotification,
      getNotificationStats,
      areNotificationsEnabled,

      // Safe notification loading
      safeLoadNotificationSettings,
      safeLoadNotificationStats,
      safeLoadAllNotifications,
      isNotificationsLoaded,
      isLoadingNotifications,
      notificationSettings,
      notificationStats,
    }),
    [
      completedAchievements,
      isLoading,
      userCoins,
      selectedBuddy,
      selectedBackground,
      ownedBuddies,
      ownedBackgrounds,
      ownedAccessories,
      gender,
      selectedBuddyId,
      buddyName,
      smokeType,
      dailyAmount,
      packPrice,
      packPriceCurrency,
      goal,
      achievements,
      userProgress,
      daysSmokeFree,
      activeChallenges,
      inProgressChallenges,
      challengeProgress,
      dailyCheckIns,
      showShop,
      showCoinPurchase,
      selectedShopTab,
      purchaseItem,
      openShopWithTab,
      setStartDate,
      getProgressForAchievement,
      resetProgress,
      setSampleData,
      startChallenge,
      updateChallengeProgress,
      cancelChallenge,
      getChallengeStatus,
      getChallengeProgress,
      getChallengeCompletions,
      setChallengeCompletionsForId,
      calculateProgressBasedOnTime,
      getDailyCheckIns,
      addDailyCheckIn,
      slipsUsed,
      slipsDates,
      extraSlipPacks,
      getSlipsAllowed,
      shouldOfferProtectStreak,
      addSlip,
      purchaseExtraSlips,
      // Notification preferences
      notificationsEnabled,
      notificationSoundEnabled,
      morningNotificationTime,
      eveningNotificationTime,
      lastNotificationCheck,

      // Safe notification loading states
      isNotificationsLoaded,
      isLoadingNotifications,
      notificationSettings,
      notificationStats,

      // Notification setters
      setNotificationsEnabled,
      setNotificationSoundEnabled,
      setMorningNotificationTime,
      setEveningNotificationTime,
      setLastNotificationCheck,
      initializeNotifications,
      scheduleUserNotifications,
      updateNotificationSettings,
      ensureNotificationSettingsExist,
      sendTestNotification,
      getNotificationStats,
      areNotificationsEnabled,

      // Safe notification loading
      safeLoadNotificationSettings,
      safeLoadNotificationStats,
      safeLoadAllNotifications,

      // Safe notification saving
      safeSaveNotificationSettings,
      safeSaveScheduledNotification,
      safeClearScheduledNotifications,
      forceProcessPendingNotifications,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
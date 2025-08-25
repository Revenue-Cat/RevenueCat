import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { achievementService, Achievement, UserProgress } from '../services/achievementService';
import { Scene, SCENES_DATA } from '../data/scenesData';

type ShopTab = 'buddies' | 'backgrounds';
export type UserGender = 'man' | 'lady' | 'any';

interface ShopItem {
  id: string;
  emoji: string;
  name: string;
  price: number;
  owned: boolean;
  isNew?: boolean;
}

interface AppState {
  // User data
  userCoins: number;
  selectedBuddy: ShopItem;
  selectedBackground: Scene;
  ownedBuddies: string[];
  ownedBackgrounds: string[];
  ownedAccessories: string[];

  // Buddy/User selections
  gender: UserGender;           // user's gender (m/w/any)
  selectedBuddyId: string;      // which buddy was chosen (id from buddies list)
  buddyName: string;            // custom display name for buddy

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

  // UI state
  showShop: boolean;
  showCoinPurchase: boolean;
  selectedShopTab: ShopTab;

  // Actions
  setUserCoins: (coins: number) => void;
  setSelectedBuddy: (buddy: ShopItem) => void;
  setSelectedBackground: (background: Scene) => void;
  purchaseItem: (item: ShopItem, category: ShopTab) => boolean;
  setShowShop: (show: boolean) => void;
  setShowCoinPurchase: (show: boolean) => void;
  setSelectedShopTab: (tab: ShopTab) => void;
  openShopWithTab: (tab: ShopTab) => void;

  // Achievement actions
  setStartDate: (startDate: Date) => Promise<void>;
  getProgressForAchievement: (achievementId: string) => { current: number; max: number; percentage: number };
  resetProgress: () => Promise<void>;
  setSampleData: () => Promise<void>;
  setAugustStartDate: () => Promise<void>;

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
}

const defaultCharacter: ShopItem = {
  id: "1",
  emoji: "🦫",
  name: "Chill Capybara",
  price: 0,
  owned: true
};

const defaultBackground: Scene = SCENES_DATA[0]; // Use the first scene as default

const AppContext = createContext<AppState | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Shop/state
  const [userCoins, setUserCoinsState] = useState(100);
  const [selectedBuddy, setSelectedBuddyState] = useState<ShopItem>(defaultCharacter);
  const [selectedBackground, setSelectedBackgroundState] = useState<Scene>(defaultBackground);
  const [ownedBuddies, setOwnedBuddies] = useState<string[]>(['zebra-m', 'dog-m']);
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(['bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'bg6', 'bg7']);
  const [ownedAccessories, setOwnedAccessories] = useState<string[]>([]);

  // Buddy/User selections
  const [gender, setGenderState] = useState<UserGender>('man');
  const [selectedBuddyId, setSelectedBuddyIdState] = useState<string>('alpaca-m');
  const [buddyName, setBuddyNameState] = useState<string>('Alpaca Calmington');

  // Setup selections
  const [smokeType, setSmokeTypeState] = useState<string>('');
  const [dailyAmount, setDailyAmountState] = useState<string>('');
  const [packPrice, setPackPriceState] = useState<string>('');
  const [packPriceCurrency, setPackPriceCurrencyState] = useState<string>('$');
  const [goal, setGoalState] = useState<string>('');

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

  // UI state
  const [showShop, setShowShop] = useState(false);
  const [showCoinPurchase, setShowCoinPurchase] = useState(false);
  const [selectedShopTab, setSelectedShopTab] = useState<ShopTab>('buddies');

  // Load from AsyncStorage on mount (TODO)
  useEffect(() => {
    // TODO: Implement AsyncStorage load if desired
  }, []);

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

  // Save to AsyncStorage when state changes (TODO)
  useEffect(() => {
    const stateToSave = {
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
    };
    // TODO: AsyncStorage.setItem('@app_state', JSON.stringify(stateToSave));
    console.log('State to save:', stateToSave);
  }, [
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
  ]);

  // Memoize all action functions to prevent recreation
  const setUserCoins = useCallback((coins: number) => setUserCoinsState(coins), []);
  const setSelectedBuddy = useCallback((buddy: ShopItem) => setSelectedBuddyState(buddy), []);
  const setSelectedBackground = useCallback((background: Scene) => setSelectedBackgroundState(background), []);

  const purchaseItem = useCallback((item: ShopItem | Scene, category: ShopTab): boolean => {
    if (userCoins < item.price) return false;
    setUserCoinsState(prev => prev - item.price);

    switch (category) {
      case 'buddies':
        setOwnedBuddies(prev => [...prev, item.id]);
        break;
      case 'backgrounds':
        setOwnedBackgrounds(prev => [...prev, item.id]);
        break;
    }
    return true;
  }, [userCoins]);

  const openShopWithTab = useCallback((tab: ShopTab) => {
    setSelectedShopTab(tab);
    setShowShop(true);
  }, []);

  // Selection setters (exposed) - memoized
  const setGender = useCallback((g: UserGender) => setGenderState(g), []);
  const setSelectedBuddyId = useCallback((id: string) => setSelectedBuddyIdState(id), []);
  const setBuddyName = useCallback((name: string) => setBuddyNameState(name), []);

  // Setup setters (exposed) - memoized
  const setSmokeType = useCallback((value: string) => setSmokeTypeState(value), []);
  const setDailyAmount = useCallback((value: string) => setDailyAmountState(value), []);
  const setPackPrice = useCallback((value: string) => setPackPriceState(value), []);
  const setPackPriceCurrency = useCallback((value: string) => setPackPriceCurrencyState(value), []);
  const setGoal = useCallback((value: string) => setGoalState(value), []);

  // Achievement functions
  const setStartDate = useCallback(async (startDate: Date) => {
    setUserProgress(prev => ({ ...prev, startDate }));
    await achievementService.setStartDate(startDate);
  }, []);

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
    
    console.log('setSampleData: Setting startDate to:', startDate.toISOString());
    setUserProgress(prev => ({ ...prev, startDate }));
    await achievementService.setStartDate(startDate);
  }, []);

  // Function to set August 21st start date for specific testing
  const setAugustStartDate = useCallback(async () => {
    const startDate = new Date(2025, 7, 21, 10, 30, 0); // August 21st, 2024 at 10:30 AM
    console.log('setAugustStartDate: Setting startDate to:', startDate.toISOString());
    setUserProgress(prev => ({ ...prev, startDate }));
    await achievementService.setStartDate(startDate);
  }, []);

  // Set August start date as default when app initializes
  useEffect(() => {
    if (!userProgress.startDate) {
      console.log('AppContext: Setting default August start date');
      setAugustStartDate();
    }
  }, [userProgress.startDate, setAugustStartDate]);

  // Memoize the context value to prevent unnecessary re-renders
  const value: AppState = useMemo(() => ({
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

    // Achievement system
    achievements,
    userProgress,
    daysSmokeFree,
    startDate: userProgress.startDate,

    showShop,
    showCoinPurchase,
    selectedShopTab,

    setUserCoins,
    setSelectedBuddy,
    setSelectedBackground,
    purchaseItem,
    setShowShop,
    setShowCoinPurchase,
    setSelectedShopTab,
    openShopWithTab,

    // Achievement actions
    setStartDate,
    getProgressForAchievement,
    resetProgress,
    setSampleData,
    setAugustStartDate,

    setGender,
    setSelectedBuddyId,
    setBuddyName,

    setSmokeType,
    setDailyAmount,
    setPackPrice,
    setPackPriceCurrency,
    setGoal,
  }), [
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
    showShop,
    showCoinPurchase,
    selectedShopTab,
    purchaseItem,
    openShopWithTab,
    setStartDate,
    getProgressForAchievement,
    resetProgress,
    setSampleData,
    setAugustStartDate,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

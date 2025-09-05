import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { achievementService, Achievement, UserProgress } from '../services/achievementService';
import { Scene, SCENES_DATA } from '../data/scenesData';
import { parse } from 'react-native-svg';
import Purchases from 'react-native-purchases';

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

  // Challenge system
  activeChallenges: string[];   // Array of challenge IDs that are active (can be started)
  inProgressChallenges: string[];   // Array of challenge IDs that are in progress (started with startDate)
  challengeProgress: Record<string, { progress: number; streak: number; checkIns: number; startDate: Date | null; isCancelled?: boolean }>; // Progress tracking for each challenge

  // UI state
  showShop: boolean;
  showCoinPurchase: boolean;
  selectedShopTab: ShopTab;

  // Actions
  fetchCoins: () => void;
  setUserCoins: (coins: number) => void;
  setSelectedBuddy: (buddy: ShopItem) => void;
  setSelectedBackground: (background: Scene) => void;
  purchaseItem: (item: ShopItem, category: ShopTab) => Promise<boolean>;
  setShowShop: (show: boolean) => void;
  setShowCoinPurchase: (show: boolean) => void;
  setSelectedShopTab: (tab: ShopTab) => void;
  openShopWithTab: (tab: ShopTab) => void;

  // Achievement actions
  setStartDate: (startDate: Date) => Promise<void>;
  getProgressForAchievement: (achievementId: string) => { current: number; max: number; percentage: number };
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
  updateChallengeProgress: (challengeId: string, progress: number, streak: number, checkIns: number) => void;
  cancelChallenge: (challengeId: string) => void;
  getChallengeStatus: (challengeId: string) => 'active' | 'locked' | 'inprogress';
  getChallengeProgress: (challengeId: string) => { progress: number; streak: number; checkIns: number; startDate: Date | null; isCancelled?: boolean };
  calculateProgressBasedOnTime: (challengeId: string, duration: string, startDate: Date | null | undefined) => number;
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
  const [userCoins, setUserCoinsState] = useState(0);
  const [selectedBuddy, setSelectedBuddyState] = useState<ShopItem>(defaultCharacter);
  const [selectedBackground, setSelectedBackgroundState] = useState<Scene>(defaultBackground);
  const [ownedBuddies, setOwnedBuddies] = useState<string[]>(['llama-m', 'llama-w', 'zebra-m', 'zebra-w', 'dog-m', 'dog-w']);
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(['bg1', 'bg3']);
  
  const [ownedAccessories, setOwnedAccessories] = useState<string[]>([]);

  // Buddy/User selections
  const [gender, setGenderState] = useState<UserGender>('man');
  const [selectedBuddyId, setSelectedBuddyIdState] = useState<string>('llama-m');
  const [buddyName, setBuddyNameState] = useState<string>('Llama Calmington');

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

  // Challenge system state
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]);
  const [inProgressChallenges, setInProgressChallenges] = useState<string[]>([]);
  const [challengeProgress, setChallengeProgress] = useState<Record<string, { progress: number; streak: number; checkIns: number; startDate: Date | null; isCancelled?: boolean }>>({});

  // UI state
  const [showShop, setShowShop] = useState(false);
  const [showCoinPurchase, setShowCoinPurchase] = useState(false);
  const [selectedShopTab, setSelectedShopTab] = useState<ShopTab>('buddies');

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('@app_state');
        if (savedState) {
          const parsed = JSON.parse(savedState);
           setUserCoinsState(parsed.userCoins || 0);
          setSelectedBuddyState(parsed.selectedBuddy || defaultCharacter);
          setSelectedBackgroundState(parsed.selectedBackground || defaultBackground);
          setOwnedBuddies(parsed.ownedBuddies || ['llama-m', 'llama-w', 'zebra-m', 'zebra-w', 'dog-m', 'dog-w']);
          setOwnedBackgrounds(parsed.ownedBackgrounds || ['bg1', 'bg3']);
          setOwnedAccessories(parsed.ownedAccessories || []);
          setGenderState(parsed.gender || 'man');
          setSelectedBuddyIdState(parsed.selectedBuddyId || 'llama-m');
          setBuddyNameState(parsed.buddyName || 'Llama Calmington');
          setSmokeTypeState(parsed.smokeType || '');
          setDailyAmountState(parsed.dailyAmount || '');
          setPackPriceState(parsed.packPrice || '');
          setPackPriceCurrencyState(parsed.packPriceCurrency || '$');
          setGoalState(parsed.goal || '');
          setUserProgress(parsed.userProgress || {
            startDate: null,
            daysSmokeFree: 0,
            totalMoneySaved: 0,
            cigarettesAvoided: 0,
            breathingExercisesCompleted: 0,
            challengesCompleted: 0,
            purchasesMade: 0,
          });
          setActiveChallenges(parsed.activeChallenges || []);
          setInProgressChallenges(parsed.inProgressChallenges || []);
          setChallengeProgress(parsed.challengeProgress || {});
        }
      } catch (error) {
        console.error('Failed to load state:', error);
      }
    };
    loadState();
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

  // Save to AsyncStorage when state changes
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
      userProgress,
      activeChallenges,
      inProgressChallenges,
      challengeProgress
    };
    AsyncStorage.setItem('@app_state', JSON.stringify(stateToSave))
      .catch(error => console.error('Failed to save state:', error));
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
    userProgress,
    activeChallenges,
    inProgressChallenges,
    challengeProgress
  ]);

  // Memoize all action functions to prevent recreation
  const setUserCoins = useCallback((coins: number) => setUserCoinsState(coins), []);
  const setSelectedBuddy = useCallback((buddy: ShopItem) => setSelectedBuddyState(buddy), []);
  const setSelectedBackground = useCallback((background: Scene) => setSelectedBackgroundState(background), []);

  const fetchCoins = async () => {
    try {
      await Purchases.invalidateVirtualCurrenciesCache();
      const virtualCurrencies = await Purchases.getVirtualCurrencies();
      const coinsBalance = virtualCurrencies.all['QUITQLY']?.balance ?? 0;
      setUserCoins(coinsBalance);
    } catch (error) {
      console.error('Error fetching virtual currencies:', error);
    }
  };

  const purchaseItem = useCallback(async(item: ShopItem | Scene, category: ShopTab): Promise<boolean> => {
    // Use coin field for price (both buddies and scenes use coin)
    const price = (item as any).coin || 0;
    
    if (userCoins < price) {
      alert("Not enough of coins")
      return false;
    }

    const customerInfo = await Purchases.getCustomerInfo();
    console.log("----- customer", customerInfo)
    const appUserId = customerInfo.originalAppUserId;

    const API_KEY = 'sk_wvGZopHNPiRznxZZiJKvIxKaOXbRE'; // Replace with your RevenueCat secret key (DO NOT COMMIT TO GIT)
    const PROJECT_ID = '2ea2fbba'; // Replace with your RevenueCat project ID

    const response = await fetch(
      `https://api.revenuecat.com/v2/projects/${PROJECT_ID}/customers/${appUserId}/virtual_currencies/transactions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          adjustments: {
            QUITQLY: -price,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to debit coins: ${response.statusText}`);
    }
    
    setUserCoinsState(prev => prev - price);

    switch (category) {
      case 'buddies':
        setOwnedBuddies(prev => [...prev, item.id]);
        break;
      case 'backgrounds':
        setOwnedBackgrounds(prev => [...prev, item.id]);
        break;
    }

    fetchCoins();
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

  // Challenge actions (exposed) - memoized
  const startChallenge = useCallback((challengeId: string) => {
    // const startDate = new Date();
    const startDate = new Date(Date.now() - (5 * 24 * 60 * 60 * 1000)); // 5 days ago
    
    console.log('startChallenge called:', {
      challengeId,
      currentActiveChallenges: activeChallenges,
      currentInProgressChallenges: inProgressChallenges
    });
    
    // Remove from activeChallenges and add to inProgressChallenges
    setActiveChallenges(prev => {
      const newActive = prev.filter(id => id !== challengeId);
      console.log('Updated activeChallenges:', newActive);
      return newActive;
    });
    setInProgressChallenges(prev => {
      if (!prev.includes(challengeId)) {
        const newInProgress = [...prev, challengeId];
        console.log('Updated inProgressChallenges:', newInProgress);
        return newInProgress;
      }
      return prev;
    });
    
    // Initialize or update progress for the challenge with start date
    setChallengeProgress(prev => {
      const existingProgress = prev[challengeId];
      return {
        ...prev,
        [challengeId]: { 
          progress: existingProgress?.progress || 0, 
          streak: existingProgress?.streak || 0, 
          checkIns: existingProgress?.checkIns || 0, 
          startDate,
          isCancelled: false
        }
      };
    });
  }, [activeChallenges, inProgressChallenges]);

  const updateChallengeProgress = useCallback((challengeId: string, progress: number, streak: number, checkIns: number) => {
    setChallengeProgress(prev => ({
      ...prev,
      [challengeId]: { 
        progress, 
        streak, 
        checkIns, 
        startDate: prev[challengeId]?.startDate || null 
      }
    }));
  }, []);

  const cancelChallenge = useCallback((challengeId: string) => {
    console.log('cancelChallenge called:', {
      challengeId,
      currentActiveChallenges: activeChallenges,
      currentInProgressChallenges: inProgressChallenges
    });
    
    // Remove from inProgressChallenges and add to activeChallenges
    setInProgressChallenges(prev => {
      const newInProgress = prev.filter(id => id !== challengeId);
      console.log('Updated inProgressChallenges:', newInProgress);
      return newInProgress;
    });
    setActiveChallenges(prev => {
      if (!prev.includes(challengeId)) {
        const newActive = [...prev, challengeId];
        console.log('Updated activeChallenges:', newActive);
        return newActive;
      }
      return prev;
    });
    
    // Reset progress for the challenge
    setChallengeProgress(prev => ({
      ...prev,
      [challengeId]: {
        ...prev[challengeId],
        progress: 0,
        streak: 0,
        checkIns: 0,
        startDate: null,
        isCancelled: false
      }
    }));
    
    console.log('Challenge cancelled:', challengeId);
  }, [activeChallenges, inProgressChallenges]);

  const getChallengeStatus = useCallback((challengeId: string): 'active' | 'locked' | 'inprogress' => {
    const inProgress = inProgressChallenges.includes(challengeId);
    const active = activeChallenges.includes(challengeId);
    
    console.log('getChallengeStatus:', {
      challengeId,
      inProgressChallenges,
      activeChallenges,
      inProgress,
      active
    });
    
    // Priority: inprogress > active > locked
    if (inProgress) {
      return 'inprogress'; // Challenge is being worked on
    }
    
    if (active) {
      return 'active'; // Challenge can be started
    }
    
    return 'locked'; // Challenge not started
  }, [activeChallenges, inProgressChallenges]);

  const getChallengeProgress = useCallback((challengeId: string) => {
    return challengeProgress[challengeId] || { progress: 0, streak: 0, checkIns: 0, startDate: null, isCancelled: false };
  }, [challengeProgress]);

  const calculateProgressBasedOnTime = useCallback((challengeId: string, duration: string, startDate: Date | null | undefined) => {
    if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) {
      console.log('calculateProgressBasedOnTime: Invalid startDate for', challengeId, startDate);
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
    
    console.log('Progress calculation:', {
      challengeId,
      duration,
      totalDays,
      startDate: startDate.toISOString(),
      now: now.toISOString(),
      daysElapsed,
      progressPerDay,
      calculatedProgress,
      finalProgress
    });
    
    return finalProgress;
  }, []);

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
  const setTodayStartDate = useCallback(async () => {
    const startDate = new Date(); // August 21st, 2024 at 10:30 AM
    console.log('setTodayStartDate: Setting startDate to:', startDate.toISOString());
    setUserProgress(prev => ({ ...prev, startDate }));
    await achievementService.setStartDate(startDate);
  }, []);

  // Function to set startDate when onboarding is completed
  const completeOnboarding = useCallback(async () => {
    const startDate = new Date();
    console.log('completeOnboarding: Setting startDate to:', startDate.toISOString());
    setUserProgress(prev => ({ ...prev, startDate }));
    await achievementService.setStartDate(startDate);
  }, []);


  // Set up achievement completion callback to add coins
  useEffect(() => {
    achievementService.setOnAchievementCompleted((achievement) => {
      const coins = achievement.coins || 0;
      if (coins > 0) {
        setUserCoinsState(prev => prev + coins);
        console.log(`Achievement completed: ${achievement.name}, added ${coins} coins`);
      }
    });
  }, []);

  // Calculate initial coins based on onboarding bonus and completed achievements
  useEffect(() => {
    const completedAchievements = achievements.filter(achievement => 
      achievement.completedDate && achievement.coins && achievement.coins > 0
    );
    const totalRewardCoins = completedAchievements.reduce((total, achievement) => 
      total + (achievement.coins || 0), 0
    );
    
    // Set initial coins to 100 (onboarding bonus) + rewards from completed achievements
    const initialCoins = 100 + totalRewardCoins;
    setUserCoinsState(initialCoins);
  }, [achievements]);

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

    // Challenge system
    activeChallenges,
    inProgressChallenges,
    challengeProgress,

    showShop,
    showCoinPurchase,
    selectedShopTab,

    fetchCoins,
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
    calculateProgressBasedOnTime,
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
    activeChallenges,
    inProgressChallenges,
    challengeProgress,
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
    calculateProgressBasedOnTime,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
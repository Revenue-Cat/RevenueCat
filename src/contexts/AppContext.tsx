import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

type ShopTab = 'characters' | 'backgrounds' | 'accessories';
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
  selectedCharacter: ShopItem;
  selectedBackground: ShopItem;
  ownedCharacters: string[];
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

  // UI state
  showShop: boolean;
  showCoinPurchase: boolean;
  selectedShopTab: ShopTab;

  // Actions
  setUserCoins: (coins: number) => void;
  setSelectedCharacter: (character: ShopItem) => void;
  setSelectedBackground: (background: ShopItem) => void;
  purchaseItem: (item: ShopItem, category: ShopTab) => boolean;
  setShowShop: (show: boolean) => void;
  setShowCoinPurchase: (show: boolean) => void;
  setSelectedShopTab: (tab: ShopTab) => void;
  openShopWithTab: (tab: ShopTab) => void;

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

const defaultBackground: ShopItem = {
  id: "default",
  emoji: "🌅",
  name: "Default",
  price: 0,
  owned: true
};

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
  const [selectedCharacter, setSelectedCharacterState] = useState<ShopItem>(defaultCharacter);
  const [selectedBackground, setSelectedBackgroundState] = useState<ShopItem>(defaultBackground);
  const [ownedCharacters, setOwnedCharacters] = useState<string[]>(['1']);
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(['default']);
  const [ownedAccessories, setOwnedAccessories] = useState<string[]>([]);

  // Buddy/User selections
  const [gender, setGenderState] = useState<UserGender>('man');
  const [selectedBuddyId, setSelectedBuddyIdState] = useState<string>('alpaca');
  const [buddyName, setBuddyNameState] = useState<string>('Alpaca Calmington');

  // Setup selections
  const [smokeType, setSmokeTypeState] = useState<string>('');
  const [dailyAmount, setDailyAmountState] = useState<string>('');
  const [packPrice, setPackPriceState] = useState<string>('');
  const [packPriceCurrency, setPackPriceCurrencyState] = useState<string>('$');
  const [goal, setGoalState] = useState<string>('');

  // UI state
  const [showShop, setShowShop] = useState(false);
  const [showCoinPurchase, setShowCoinPurchase] = useState(false);
  const [selectedShopTab, setSelectedShopTab] = useState<ShopTab>('characters');

  // Load from AsyncStorage on mount (TODO)
  useEffect(() => {
    // TODO: Implement AsyncStorage load if desired
  }, []);

  // Save to AsyncStorage when state changes (TODO)
  useEffect(() => {
    const stateToSave = {
      userCoins,
      selectedCharacter,
      selectedBackground,
      ownedCharacters,
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
    selectedCharacter,
    selectedBackground,
    ownedCharacters,
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
  const setSelectedCharacter = useCallback((character: ShopItem) => setSelectedCharacterState(character), []);
  const setSelectedBackground = useCallback((background: ShopItem) => setSelectedBackgroundState(background), []);

  const purchaseItem = useCallback((item: ShopItem, category: ShopTab): boolean => {
    if (userCoins < item.price) return false;
    setUserCoinsState(prev => prev - item.price);

    switch (category) {
      case 'characters':
        setOwnedCharacters(prev => [...prev, item.id]);
        break;
      case 'backgrounds':
        setOwnedBackgrounds(prev => [...prev, item.id]);
        break;
      case 'accessories':
        setOwnedAccessories(prev => [...prev, item.id]);
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

  // Memoize the context value to prevent unnecessary re-renders
  const value: AppState = useMemo(() => ({
    userCoins,
    selectedCharacter,
    selectedBackground,
    ownedCharacters,
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

    showShop,
    showCoinPurchase,
    selectedShopTab,

    setUserCoins,
    setSelectedCharacter,
    setSelectedBackground,
    purchaseItem,
    setShowShop,
    setShowCoinPurchase,
    setSelectedShopTab,
    openShopWithTab,

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
    selectedCharacter,
    selectedBackground,
    ownedCharacters,
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
    showShop,
    showCoinPurchase,
    selectedShopTab,
    setUserCoins,
    setSelectedCharacter,
    setSelectedBackground,
    purchaseItem,
    setShowShop,
    setShowCoinPurchase,
    setSelectedShopTab,
    openShopWithTab,
    setGender,
    setSelectedBuddyId,
    setBuddyName,
    setSmokeType,
    setDailyAmount,
    setPackPrice,
    setPackPriceCurrency,
    setGoal,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

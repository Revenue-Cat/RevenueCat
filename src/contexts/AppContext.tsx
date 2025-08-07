import React, { createContext, useContext, useState, useEffect } from 'react';

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
  
  // UI state
  showShop: boolean;
  showCoinPurchase: boolean;
  selectedShopTab: 'characters' | 'backgrounds' | 'accessories';
  
  // Actions
  setUserCoins: (coins: number) => void;
  setSelectedCharacter: (character: ShopItem) => void;
  setSelectedBackground: (background: ShopItem) => void;
  purchaseItem: (item: ShopItem, category: 'characters' | 'backgrounds' | 'accessories') => boolean;
  setShowShop: (show: boolean) => void;
  setShowCoinPurchase: (show: boolean) => void;
  setSelectedShopTab: (tab: 'characters' | 'backgrounds' | 'accessories') => void;
  openShopWithTab: (tab: 'characters' | 'backgrounds' | 'accessories') => void;
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
  const [userCoins, setUserCoinsState] = useState(100);
  const [selectedCharacter, setSelectedCharacterState] = useState<ShopItem>(defaultCharacter);
  const [selectedBackground, setSelectedBackgroundState] = useState<ShopItem>(defaultBackground);
  const [ownedCharacters, setOwnedCharacters] = useState<string[]>(['1']);
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(['default']);
  const [ownedAccessories, setOwnedAccessories] = useState<string[]>([]);
  
  // UI state
  const [showShop, setShowShop] = useState(false);
  const [showCoinPurchase, setShowCoinPurchase] = useState(false);
  const [selectedShopTab, setSelectedShopTab] = useState<'characters' | 'backgrounds' | 'accessories'>('characters');

  // Load from AsyncStorage on mount (React Native equivalent of localStorage)
  useEffect(() => {
    // TODO: Implement AsyncStorage for persistence
    // For now, we'll use the default state
  }, []);

  // Save to AsyncStorage when state changes
  useEffect(() => {
    const stateToSave = {
      userCoins,
      selectedCharacter,
      selectedBackground,
      ownedCharacters,
      ownedBackgrounds,
      ownedAccessories
    };
    // TODO: Implement AsyncStorage save
    console.log('State to save:', stateToSave);
  }, [userCoins, selectedCharacter, selectedBackground, ownedCharacters, ownedBackgrounds, ownedAccessories]);

  const setUserCoins = (coins: number) => {
    setUserCoinsState(coins);
  };

  const setSelectedCharacter = (character: ShopItem) => {
    setSelectedCharacterState(character);
  };

  const setSelectedBackground = (background: ShopItem) => {
    setSelectedBackgroundState(background);
  };

  const purchaseItem = (item: ShopItem, category: 'characters' | 'backgrounds' | 'accessories'): boolean => {
    if (userCoins < item.price) {
      return false;
    }

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
  };

  const openShopWithTab = (tab: 'characters' | 'backgrounds' | 'accessories') => {
    setSelectedShopTab(tab);
    setShowShop(true);
  };

  const value: AppState = {
    userCoins,
    selectedCharacter,
    selectedBackground,
    ownedCharacters,
    ownedBackgrounds,
    ownedAccessories,
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
    openShopWithTab
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 
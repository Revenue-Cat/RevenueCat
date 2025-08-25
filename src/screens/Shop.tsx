import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Alert,
  Animated,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';
import { BUDDIES_DATA } from '../data/buddiesData';
import BuddyModal from '../components/BuddyModal';
import CoinIcon from "../assets/icons/coins.svg";

const { width } = Dimensions.get('window');

interface ShopProps {
  onBack: () => void;
  isScenesSelected: boolean;
  setIsScenesSelected: (isScenes: boolean) => void;
}

const Shop: React.FC<ShopProps> = ({ onBack, isScenesSelected, setIsScenesSelected }) => {
  const {
    userCoins,
    selectedBuddy,
    selectedBackground,
    ownedBuddies,
    ownedBackgrounds,
    ownedAccessories,
    setSelectedBuddy,
    setSelectedBackground,
    purchaseItem,
    setShowCoinPurchase,
    selectedBuddyId,
    setSelectedBuddyId,
    gender,
  } = useApp();
  const sexKey: SexKey = gender === "lady" ? "w" : "m";
  
  const [selectedBuddyForModal, setSelectedBuddyForModal] = useState<any>(null);
  const [showBuddyModal, setShowBuddyModal] = useState(false);

  // Function to handle buddy selection
  const handleBuddySelect = (buddy: any) => {
    if (ownedBuddies?.includes(buddy.id)) {
      // If buddy is owned, select it directly
      setSelectedBuddyId(buddy.id);
    } else {
      // If buddy is not owned, show the modal for purchase
      setSelectedBuddyForModal(buddy);
      setShowBuddyModal(true);
    }
  };


  // Scenes data - backgrounds only
  const scenes = [
    { id: "default", emoji: "🌅", name: "Default", price: 0, owned: true },
    { id: "1", emoji: "🌅", name: "Sunset", price: 50, owned: false },
    { id: "2", emoji: "🌊", name: "Ocean", price: 100, owned: false },
    { id: "3", emoji: "🌲", name: "Forest", price: 150, owned: false },
    { id: "4", emoji: "💜", name: "Purple", price: 200, owned: false },
    { id: "5", emoji: "🌑", name: "Dark", price: 250, owned: false },
    { id: "6", emoji: "🌸", name: "Cherry Blossom", price: 175, owned: false },
    { id: "7", emoji: "🏔️", name: "Mountain", price: 225, owned: false },
    { id: "8", emoji: "🌆", name: "City", price: 125, owned: false },
  ];


  console.log('selectedBuddy', selectedBuddy);
  
  const renderBuddiesGrid = () => (
    <View className="w-full -mx-1 -my-1 flex-row flex-wrap">
      {BUDDIES_DATA.map((item) => {
        const isOwned = ownedBuddies?.includes(item.id) || false;
        const isSelected = selectedBuddyId === item.id;
        
        return (
          <Pressable
            key={item.id}
            className={`w-1/4 px-1 py-1`}
            onPress={() => handleBuddySelect(item)}
          >
            <View className={`items-center bg-white/10 rounded-xl p-2 relative ${isOwned && !isSelected ? 'bg-white/15' : ''}`}>
              <View className="w-[80px] h-[80px] overflow-hidden relative">
                <Image source={item.icon} className='w-[80px] h-[110px]' resizeMode="contain" />
                {!isOwned && (
                  <View className="absolute bottom-1 left-4 z-10 rounded-3xl bg-black/70 px-2 py-0.5">
                    <View className="flex-row items-center justify-center">
                      <Text className="text-xs font-bold text-amber-500 gap-2">{item.coin}</Text>
                      <CoinIcon width={18} height={18} className="ml-1" />
                    </View>
                  </View>
                )}
              </View>
              {isSelected && (
                <View className="absolute top-1 right-1">
                  <Ionicons className="bg-green-500 rounded-full p-0 bold" name="checkmark" size={18} color="white" fill="white" />
                </View>
              )}
            </View>
      
            
          </Pressable>
        );
      })}
    </View>
  );

  const renderScenesGrid = () => (
    <View className="flex-row flex-wrap gap-2">
      {scenes.map((item) => {
        const isOwned = ownedBackgrounds.includes(item.id);
        const isSelected = selectedBackground.id === item.id;

        return (
          <Pressable
            key={item.id}
            className={`w-[${(width - 80) / 4}px] bg-white/10 rounded-xl p-3 items-center relative ${
              isSelected ? 'bg-white/20 border-2 border-white' : ''
            } ${isOwned && !isSelected ? 'bg-white/15' : ''}`}
            // onPress={() => handleSelect(item, 'backgrounds')}
          >
            <Text className="text-2xl mb-1.5">{item.emoji}</Text>
            <Text className="text-xs font-bold text-white mb-0.5 text-center">{item.name}</Text>
            <Text className="text-[10px] text-white/70 text-center">
              {isOwned ? (isSelected ? 'Selected' : 'Owned') : item.price === 0 ? 'Free' : `${item.price} coins`}
            </Text>
            {isSelected && (
              <View className="absolute top-2 right-2">
                <Ionicons name="checkmark-circle" size={16} color="#000000" />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View className="flex-1 bg-[#1F1943]">

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 20 }}
      >

        {/* Items */}
        <View className="flex-1">
          {!isScenesSelected ? renderBuddiesGrid() : renderScenesGrid()}
        </View>
      </ScrollView>

      <BuddyModal
        visible={showBuddyModal}
        buddy={selectedBuddyForModal}
        onClose={() => {
          setShowBuddyModal(false);
          setSelectedBuddyForModal(null);
        }}
      />
    </View>
  );
};

export default Shop; 
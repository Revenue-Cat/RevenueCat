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
import { SCENES_DATA } from '../data/scenesData';
import BuddyModal from '../components/BuddyModal';
import SceneModal from '../components/SceneModal';
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
  const [selectedSceneForModal, setSelectedSceneForModal] = useState<any>(null);
  const [showSceneModal, setShowSceneModal] = useState(false);

  // Helper function to parse gradient string and return colors
  const parseGradient = useCallback((gradientString: string): [string, string] => {
    // Extract colors from linear-gradient string
    const colorMatch = gradientString.match(/#[A-Fa-f0-9]{6}/g);
    if (colorMatch && colorMatch.length >= 2) {
      return [colorMatch[0], colorMatch[1]]; // Return first two colors
    }
    return ['#1F1943', '#4E3EA9']; // Default fallback
  }, []);

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

  // Function to handle scene selection
  const handleSceneSelect = (scene: any) => {
    if (ownedBackgrounds.includes(scene.id)) {
      // If scene is owned, select it directly
      setSelectedBackground(scene);
    } else {
      // If scene is not owned, show the modal for purchase
      setSelectedSceneForModal(scene);
      setShowSceneModal(true);
    }
  };


  // Use imported scenes data
  const scenes = SCENES_DATA;


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
    <View className="w-full -mx-1 -my-1 flex-row flex-wrap">
      {scenes.map((item) => {
        const isOwned = ownedBackgrounds.includes(item.id);
        const isSelected = selectedBackground.id === item.id;

        return (
          <Pressable
            key={item.id}
            className={`w-1/4 px-1 py-1`}
            onPress={() => handleSceneSelect(item)}
          >
             <View className={`items-center bg-white/10 rounded-xl relative`}>
              <View className="w-[80px] h-[80px] overflow-hidden relative">
                <Image source={item.background} className="w-full h-full rounded-2xl" resizeMode="cover" />
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
                  <Ionicons className="bg-green-500 rounded-full p-0.5 bold" name="checkmark" size={18} color="white" />
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );

  const gradientColors = parseGradient(selectedBackground.backgroundColor);
  
  return (
    <View className="flex-1" style={{ backgroundColor: gradientColors[0] }}>
      {/* Header with coins */}
      {/* <View className="flex-row justify-between items-center px-4 py-3 bg-white/10">
        <Text className="text-white text-lg font-bold">Shop</Text>
        <View className="flex-row items-center">
          <Text className="text-white text-lg font-bold mr-2">{userCoins}</Text>
          <CoinIcon width={24} height={24} />
        </View>
      </View> */}

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 20,  minHeight: Dimensions.get('window').height * 0.8,
 }}
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
      <SceneModal
        visible={showSceneModal}
        scene={selectedSceneForModal}
        onClose={() => {
          setShowSceneModal(false);
          setSelectedSceneForModal(null);
        }}
              />
      </View>
    );
};

export default Shop; 
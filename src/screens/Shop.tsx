import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import ParallaxBackground from '../components/ParallaxBackground';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';

const { width } = Dimensions.get('window');

interface ShopProps {
  onBack: () => void;
}

const Shop: React.FC<ShopProps> = ({ onBack }) => {
  const {
    userCoins,
    selectedCharacter,
    selectedBackground,
    ownedCharacters,
    ownedBackgrounds,
    ownedAccessories,
    setSelectedCharacter,
    setSelectedBackground,
    purchaseItem,
    setShowCoinPurchase,
    selectedBuddyId,
    gender,
  } = useApp();
  const sexKey: SexKey = gender === "lady" ? "w" : "m";
  const scrollY = new Animated.Value(0);

  const [selectedTab, setSelectedTab] = useState<'characters' | 'backgrounds' | 'accessories'>('characters');

  const characters = [
    { id: "1", emoji: "🦫", name: "Chill Capybara", price: 0, owned: true },
    { id: "2", emoji: "🐨", name: "Zen Koala", price: 150, owned: false },
    { id: "3", emoji: "🦥", name: "Slow Sloth", price: 200, owned: false },
    { id: "4", emoji: "🐧", name: "Cool Penguin", price: 100, owned: false },
    { id: "5", emoji: "🐼", name: "Panda Bear", price: 200, owned: false },
    { id: "6", emoji: "🦉", name: "Wise Owl", price: 100, owned: false },
    { id: "7", emoji: "🦆", name: "Duck Friend", price: 150, owned: false },
  ];

  const backgrounds = [
    { id: "default", emoji: "🌅", name: "Default", price: 0, owned: true },
    { id: "1", emoji: "🌅", name: "Sunset", price: 50, owned: false },
    { id: "2", emoji: "🌊", name: "Ocean", price: 100, owned: false },
    { id: "3", emoji: "🌲", name: "Forest", price: 150, owned: false },
    { id: "4", emoji: "💜", name: "Purple", price: 200, owned: false },
    { id: "5", emoji: "🌑", name: "Dark", price: 250, owned: false },
  ];

  const accessories = [
    { id: "1", emoji: "🎩", name: "Top Hat", price: 75, owned: false },
    { id: "2", emoji: "👓", name: "Sunglasses", price: 50, owned: false },
    { id: "3", emoji: "🎀", name: "Bow Tie", price: 25, owned: false },
    { id: "4", emoji: "💍", name: "Ring", price: 100, owned: false },
    { id: "5", emoji: "👜", name: "Bag", price: 125, owned: false },
    { id: "6", emoji: "👑", name: "Crown", price: 300, owned: false },
  ];

  const handlePurchase = (item: any, category: 'characters' | 'backgrounds' | 'accessories') => {
    const isOwned = category === 'characters' 
      ? ownedCharacters.includes(item.id)
      : category === 'backgrounds'
      ? ownedBackgrounds.includes(item.id)
      : ownedAccessories.includes(item.id);

    if (isOwned) {
      Alert.alert('Already Owned', `${item.name} is already in your collection!`);
      return;
    }

    if (userCoins < item.price) {
      Alert.alert('Insufficient Coins', `You need ${item.price - userCoins} more coins to purchase ${item.name}.`);
      setShowCoinPurchase(true);
      return;
    }

    const success = purchaseItem(item, category);
    if (success) {
      Alert.alert('Purchase Successful', `${item.name} has been added to your collection!`);
    } else {
      Alert.alert('Purchase Failed', 'Something went wrong. Please try again.');
    }
  };

  const handleSelect = (item: any, category: 'characters' | 'backgrounds' | 'accessories') => {
    const isOwned = category === 'characters' 
      ? ownedCharacters.includes(item.id)
      : category === 'backgrounds'
      ? ownedBackgrounds.includes(item.id)
      : ownedAccessories.includes(item.id);

    if (!isOwned) {
      handlePurchase(item, category);
      return;
    }

    if (category === 'characters') {
      setSelectedCharacter({...item, owned: true});
    } else if (category === 'backgrounds') {
      setSelectedBackground({...item, owned: true});
    }
  };

  const renderItems = (items: any[], category: 'characters' | 'backgrounds' | 'accessories') => (
    <View style={styles.itemsGrid}>
      {items.map((item) => {
        const isOwned = category === 'characters' 
          ? ownedCharacters.includes(item.id)
          : category === 'backgrounds'
          ? ownedBackgrounds.includes(item.id)
          : ownedAccessories.includes(item.id);
        
        const isSelected = category === 'characters'
          ? selectedCharacter.id === item.id
          : category === 'backgrounds'
          ? selectedBackground.id === item.id
          : false;

        return (
          <Pressable
            key={item.id}
            style={[
              styles.itemCard,
              isSelected && styles.selectedItemCard,
              isOwned && !isSelected && styles.ownedItemCard
            ]}
            onPress={() => handleSelect(item, category)}
          >
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>
              {isOwned ? (isSelected ? 'Selected' : 'Owned') : item.price === 0 ? 'Free' : `${item.price} coins`}
            </Text>
            {isSelected && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#000000" />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with ParallaxBackground */}
      <View style={{ height: 330 }}>
        <ParallaxBackground scrollY={scrollY} height={330} />
        
        {/* Header - On top of ParallaxBackground */}
        <View style={styles.headerOverlay}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <Text style={styles.titleOverlay}>Shop</Text>
            <Pressable 
              style={styles.coinsButton}
              onPress={() => setShowCoinPurchase(true)}
            >
              <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
              <Text style={styles.coinsTextOverlay}>{userCoins}</Text>
            </Pressable>
          </View>
        </View>

        {/* Buddy Icon */}
        <Animated.View style={styles.buddyContainer}>
          <Animated.Image
            source={buddyAssets[selectedBuddyId as BuddyKey][sexKey]}
            style={styles.buddyImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, selectedTab === 'characters' && styles.tabActive]}
              onPress={() => setSelectedTab('characters')}
            >
              <Text style={[styles.tabText, selectedTab === 'characters' && styles.tabTextActive]}>
                Characters
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, selectedTab === 'backgrounds' && styles.tabActive]}
              onPress={() => setSelectedTab('backgrounds')}
            >
              <Text style={[styles.tabText, selectedTab === 'backgrounds' && styles.tabTextActive]}>
                Backgrounds
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, selectedTab === 'accessories' && styles.tabActive]}
              onPress={() => setSelectedTab('accessories')}
            >
              <Text style={[styles.tabText, selectedTab === 'accessories' && styles.tabTextActive]}>
                Accessories
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Items */}
        <View style={styles.itemsContainer}>
          {selectedTab === 'characters' && renderItems(characters, 'characters')}
          {selectedTab === 'backgrounds' && renderItems(backgrounds, 'backgrounds')}
          {selectedTab === 'accessories' && renderItems(accessories, 'accessories')}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1943',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleOverlay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  coinsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  coinsTextOverlay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buddyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 99,
  },
  buddyImage: {
    width: 100,
    height: 220,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  coinsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  itemsContainer: {
    flex: 1,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemCard: {
    width: (width - 72) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  selectedItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  ownedItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  itemEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default Shop; 
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import SlideModal from './SlideModal';

const { width } = Dimensions.get('window');

interface ShopItem {
  id: string;
  emoji: string;
  name: string;
  price: number;
  owned: boolean;
  isNew?: boolean;
  gradient?: string;
}

const ShopModal: React.FC = () => {
  const { 
    showShop, 
    setShowShop, 
    userCoins, 
    selectedBuddy,
    selectedBackground,
    ownedBuddies,
    ownedBackgrounds,
    purchaseItem,
    setSelectedBuddy,
    setSelectedBackground,
    selectedShopTab,
    setSelectedShopTab,
    setShowCoinPurchase
  } = useApp();
  
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const buddies = useMemo(() => [
    { id: "zebra-boy", emoji: "🦓", name: "ZebraBro", price: 0, owned: ownedBuddies.includes("zebra-boy") },
    { id: "bulldog-boy", emoji: "🐶", name: "SpudDog", price: 150, owned: ownedBuddies.includes("bulldog-boy") },
    { id: "fox-boy", emoji: "🦊", name: "GingerBoss", price: 200, owned: ownedBuddies.includes("fox-boy") },
    { id: "llama-boy", emoji: "🦙", name: "Lamburger", price: 100, owned: ownedBuddies.includes("llama-boy") },
    { id: "koala-boy", emoji: "🐨", name: "Don Snooze", price: 200, owned: ownedBuddies.includes("koala-boy") },
    { id: "bulldog-girl", emoji: "🐶", name: "SpudQueen", price: 100, owned: ownedBuddies.includes("bulldog-girl") },
    { id: "llama-girl", emoji: "🦙", name: "Lamazing", price: 150, owned: ownedBuddies.includes("llama-girl") }
  ], [ownedBuddies]);

  const backgrounds = useMemo(() => [
    { id: "default", emoji: "🌅", name: "Default", price: 0, owned: ownedBackgrounds.includes("default") },
    { id: "1", emoji: "🌅", name: "Sunset", price: 50, owned: ownedBackgrounds.includes("1") },
    { id: "2", emoji: "🌊", name: "Ocean", price: 100, owned: ownedBackgrounds.includes("2") },
    { id: "3", emoji: "🌲", name: "Forest", price: 150, owned: ownedBackgrounds.includes("3") },
    { id: "4", emoji: "💜", name: "Purple", price: 200, owned: ownedBackgrounds.includes("4") },
    { id: "5", emoji: "🌑", name: "Dark", price: 250, owned: ownedBackgrounds.includes("5") }
  ], [ownedBackgrounds]);

  // accessories removed in buddies/backgrounds only flow

  const handleItemClick = (item: ShopItem) => {
    if (item.owned && selectedShopTab === 'buddies') {
      setSelectedBuddy(item);
      setShowShop(false);
      return;
    }
    
    if (item.owned && selectedShopTab === 'backgrounds') {
      setSelectedBackground(item);
      setShowShop(false);
      return;
    }
    
    // Disable purchase functionality - only allow selection of owned items
    return;
  };

  const handlePurchase = (item: ShopItem) => {
    const success = purchaseItem(item, selectedShopTab);
    if (success) {
      setSelectedItem(null);
      // Auto-select if it's a buddy or background
      if (selectedShopTab === 'buddies') {
        setSelectedBuddy(item);
      } else if (selectedShopTab === 'backgrounds') {
        setSelectedBackground(item);
      }
    } else {
      setShowCoinPurchase(true);
      setSelectedItem(null);
    }
  };

  const getCurrentItems = () => {
    switch (selectedShopTab) {
      case 'buddies': return buddies as unknown as ShopItem[];
      case 'backgrounds': return backgrounds;
      default: return buddies as unknown as ShopItem[];
    }
  };

  const renderItemGrid = (items: ShopItem[]) => (
    <View style={styles.itemsGrid}>
      {items.map((item) => {
        // Recalculate ownership status dynamically (exactly like web app)
        const isOwned = selectedShopTab === 'characters' ? ownedCharacters.includes(item.id) :
                       selectedShopTab === 'backgrounds' ? ownedBackgrounds.includes(item.id) :
                       ownedAccessories.includes(item.id);
        
        const isSelected = (selectedShopTab === 'characters' && item.id === selectedCharacter.id) ||
                          (selectedShopTab === 'backgrounds' && item.id === selectedBackground.id);
        
        return (
          <Pressable
            key={item.id}
            style={[
              styles.itemCard,
              isOwned && styles.ownedItemCard,
              isSelected && styles.selectedItemCard
            ]}
            onPress={() => handleItemClick({...item, owned: isOwned})}
          >
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            )}
            {selectedShopTab === 'backgrounds' ? (
              <View style={[styles.backgroundPreview, { backgroundColor: item.gradient || '#e0f2fe' }]} />
            ) : (
              <Text style={styles.itemEmoji}>{item.emoji}</Text>
            )}
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemStatus}>
              {isOwned ? (
                isSelected ? "Selected" : "Owned"
              ) : item.price === 0 ? (
                "Free"
              ) : (
                `${item.price} coins`
              )}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <>
      <SlideModal visible={showShop} onClose={() => setShowShop(false)} title="Shop">
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => setShowShop(false)}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.title}>Shop</Text>
          <Pressable style={styles.coinsButton} onPress={() => setShowCoinPurchase(true)}>
            <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
            <Text style={styles.coinsText}>{userCoins}</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.characterPreview}>
            <Text style={styles.characterEmoji}>{selectedBuddy?.emoji || '🙂'}</Text>
          </View>

          <View style={styles.tabsContainer}>
            <View style={styles.tabs}>
              <Pressable
                style={[styles.tab, selectedShopTab === 'buddies' && styles.tabActive]}
                onPress={() => setSelectedShopTab('buddies')}
              >
                <Text style={[styles.tabText, selectedShopTab === 'buddies' && styles.tabTextActive]}>
                  Buddies
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, selectedShopTab === 'backgrounds' && styles.tabActive]}
                onPress={() => setSelectedShopTab('backgrounds')}
              >
                <Text style={[styles.tabText, selectedShopTab === 'backgrounds' && styles.tabTextActive]}>
                  Backgrounds
                </Text>
              </Pressable>
              {/* Accessories tab removed */}
            </View>
          </View>

          <View style={styles.itemsContainer}>
            {renderItemGrid(getCurrentItems())}
          </View>
        </ScrollView>
      </SlideModal>

      {selectedItem && (
        <SlideModal visible={true} onClose={() => setSelectedItem(null)} title={`Buy ${selectedItem.name}`}>
          <View style={styles.purchaseContent}>
            <View style={styles.purchaseHeader}>
              <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
              <Text style={styles.purchaseCoins}>{userCoins}</Text>
            </View>
            
            <Text style={styles.purchaseEmoji}>{selectedItem.emoji}</Text>
            
            <View style={styles.purchaseDetails}>
              <Text style={styles.purchaseName}>{selectedItem.name}</Text>
              <Text style={styles.purchaseDescription}>
                Stays calm when cravings creep in — too chill to care, too lazy to light up. 😎🦫
              </Text>
            </View>
            
            <Pressable style={styles.purchaseButton} onPress={() => handlePurchase(selectedItem)}>
              <View style={styles.purchaseButtonContent}>
                <Text style={styles.purchaseButtonText}>Buy for </Text>
                <Ionicons name="logo-bitcoin" size={16} color="white" />
                <Text style={styles.purchaseButtonText}> {selectedItem.price}</Text>
              </View>
            </Pressable>
          </View>
        </SlideModal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  coinsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  coinsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  characterPreview: {
    alignItems: 'center',
    marginBottom: 24,
  },
  characterEmoji: {
    fontSize: 96,
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
  itemsContainer: {
    marginBottom: 24,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemCard: {
    width: (width - 72) / 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  ownedItemCard: {
    backgroundColor: '#e5f3ff',
  },
  selectedItemCard: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 12,
    color: '#ffffff',
  },
  itemEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  backgroundPreview: {
    width: 40,
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  itemStatus: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  purchaseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  purchaseContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    margin: 24,
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  purchaseContent: {
    alignItems: 'center',
  },
  purchaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  purchaseCoins: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  purchaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  purchaseEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  purchaseDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  purchaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  purchaseDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  purchaseButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  purchaseButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  closePurchaseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShopModal; 
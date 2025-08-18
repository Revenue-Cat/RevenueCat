import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import SlideModal from './SlideModal';

const { width } = Dimensions.get('window');

interface CoinPackage {
  amount: number;
  price: string;
  popular?: boolean;
  strikethrough?: string;
}

const CoinPurchaseModal: React.FC = () => {
  const { 
    showCoinPurchase, 
    setShowCoinPurchase, 
    userCoins, 
    setUserCoins, 
    selectedCharacter 
  } = useApp();

  const coinPackages: CoinPackage[] = [
    { amount: 100, price: "2.99 USD" },
    { amount: 500, price: "5.99 USD", popular: true, strikethrough: "7.99 USD" },
    { amount: 1000, price: "10.99 USD", strikethrough: "14.99 USD" }
  ];

  const handleCoinPurchase = (amount: number) => {
    setUserCoins(userCoins + amount);
    setShowCoinPurchase(false);
  };

  return (
    <SlideModal visible={showCoinPurchase} onClose={() => setShowCoinPurchase(false)} title="Get More Buddy Coins">
      <View style={styles.header}>
        <View style={styles.characterContainer}>
          <Text style={styles.characterEmoji}>{selectedCharacter.emoji}</Text>
        </View>
        <View style={styles.coinsDisplay}>
          <Ionicons name="logo-bitcoin" size={16} color="#FFD700" />
          <Text style={styles.coinsText}>{userCoins}</Text>
        </View>
      </View>

      <View style={styles.packagesContainer}>
        {coinPackages.map((pkg, index) => (
          <Pressable
            key={index}
            style={[
              styles.packageCard,
              pkg.popular && styles.popularPackage
            ]}
            onPress={() => handleCoinPurchase(pkg.amount)}
          >
            {pkg.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Popular ✓</Text>
              </View>
            )}
            <View style={styles.packageContent}>
              <View style={styles.packageLeft}>
                <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
                <Text style={styles.packageAmount}>+{pkg.amount} Buddy coins</Text>
              </View>
              <View style={styles.packageRight}>
                <Text style={styles.packagePrice}>{pkg.price}</Text>
                {pkg.strikethrough && (
                  <Text style={styles.strikethroughPrice}>{pkg.strikethrough}</Text>
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </SlideModal>
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
    padding: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  characterContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 24,
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  packagesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  packageCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  popularPackage: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderColor: '#000000',
  },
  popularBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  popularText: {
    fontSize: 12,
    color: '#ffffff',
  },
  packageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  packageAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  packageRight: {
    alignItems: 'flex-end',
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  strikethroughPrice: {
    fontSize: 12,
    color: '#666666',
    textDecorationLine: 'line-through',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default CoinPurchaseModal; 
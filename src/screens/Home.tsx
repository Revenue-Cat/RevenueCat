import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

interface HomeProps {
  onShowCravingSOS: () => void;
  onShowBreathingExercise: () => void;
  onShowChatAssistance: () => void;
  onNavigateToProfile: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToShop: () => void;
}

const Home: React.FC<HomeProps> = ({
  onShowCravingSOS,
  onShowBreathingExercise,
  onShowChatAssistance,
  onNavigateToProfile,
  onNavigateToAchievements,
  onNavigateToShop,
}) => {
  const {
    userCoins,
    selectedCharacter,
    selectedBackground,
    ownedCharacters,
    ownedBackgrounds,
    setSelectedCharacter,
    setSelectedBackground,
    setShowCoinPurchase,
    purchaseItem
  } = useApp();

  const [selectedPurchaseItem, setSelectedPurchaseItem] = useState<any>(null);
  const [purchaseItemType, setPurchaseItemType] = useState<'characters' | 'backgrounds'>('characters');
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 23,
    minutes: 47,
    seconds: 32
  });
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'characters' | 'backgrounds'>('achievements');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newSeconds = prev.seconds + 1;
        if (newSeconds >= 60) {
          const newMinutes = prev.minutes + 1;
          if (newMinutes >= 60) {
            const newHours = prev.hours + 1;
            if (newHours >= 24) {
              return {
                days: prev.days + 1,
                hours: 0,
                minutes: 0,
                seconds: 0
              };
            }
            return { ...prev, hours: newHours, minutes: 0, seconds: 0 };
          }
          return { ...prev, minutes: newMinutes, seconds: 0 };
        }
        return { ...prev, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const characters = [
    { id: "1", emoji: "🦫", name: "Chill Capybara", price: 0 },
    { id: "2", emoji: "🐨", name: "Zen Koala", price: 150 },
    { id: "3", emoji: "🦥", name: "Slow Sloth", price: 200 },
    { id: "4", emoji: "🐧", name: "Cool Penguin", price: 100 },
    { id: "5", emoji: "🐼", name: "Panda Bear", price: 200 },
    { id: "6", emoji: "🦉", name: "Wise Owl", price: 100 },
    { id: "7", emoji: "🦆", name: "Duck Friend", price: 150 }
  ];

  const backgrounds = [
    { id: "default", emoji: "🌅", name: "Default", price: 0, gradient: "from-blue-50 to-indigo-100" },
    { id: "1", emoji: "🌅", name: "Sunset", price: 50, gradient: "from-orange-400 to-pink-500" },
    { id: "2", emoji: "🌊", name: "Ocean", price: 100, gradient: "from-blue-400 to-cyan-500" },
    { id: "3", emoji: "🌲", name: "Forest", price: 150, gradient: "from-green-400 to-emerald-600" },
    { id: "4", emoji: "💜", name: "Purple", price: 200, gradient: "from-purple-400 to-pink-600" },
    { id: "5", emoji: "🌑", name: "Dark", price: 250, gradient: "from-gray-800 to-gray-900" }
  ];

  const handleCharacterSelect = (character: any) => {
    const isOwned = ownedCharacters.includes(character.id);
    const isSelected = character.id === selectedCharacter.id;
    
    if (isSelected) {
      return;
    }
    
    if (isOwned) {
      setSelectedCharacter({...character, owned: true});
    } else {
      setSelectedPurchaseItem({...character, owned: false});
      setPurchaseItemType('characters');
      Alert.alert('Purchase Required', `Would you like to purchase ${character.name} for ${character.price} coins?`);
    }
  };

  const handleBackgroundSelect = (background: any) => {
    const isOwned = ownedBackgrounds.includes(background.id);
    const isSelected = background.id === selectedBackground.id;
    
    if (isSelected) {
      return;
    }
    
    if (isOwned) {
      setSelectedBackground({...background, owned: true});
    } else {
      setSelectedPurchaseItem({...background, owned: false});
      setPurchaseItemType('backgrounds');
      Alert.alert('Purchase Required', `Would you like to purchase ${background.name} for ${background.price} coins?`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.profileButton} onPress={onNavigateToProfile}>
            <Ionicons name="person-outline" size={24} color="#000000" />
          </Pressable>
          <Pressable 
            style={styles.coinsButton} 
            onPress={() => setShowCoinPurchase(true)}
          >
            <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
            <Text style={styles.coinsText}>{userCoins}</Text>
          </Pressable>
        </View>

        {/* Buddy */}
        <View style={styles.buddySection}>
          <Text style={styles.buddyEmoji}>{selectedCharacter.emoji}</Text>
          <Text style={styles.buddyMessage}>
            "You've got this! Every smoke-free moment counts."
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Cigarettes Avoided</Text>
            <Text style={styles.statValue}>47</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Money Saved</Text>
            <Text style={styles.statValue}>€23.50</Text>
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerCard}>
          <Text style={styles.timerTitle}>Smoke-Free Time</Text>
          <Text style={styles.timerValue}>
            {timeElapsed.days}d {timeElapsed.hours}h {timeElapsed.minutes}m {timeElapsed.seconds}s
          </Text>
          <Text style={styles.timerSubtitle}>Keep going strong!</Text>
        </View>

        {/* Challenges */}
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Ionicons name="star" size={20} color="#000000" />
            <Text style={styles.challengeTitle}>Challenges</Text>
          </View>
          <View style={styles.challengeItem}>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeText}>Go one full day without a single puff</Text>
              <View style={styles.challengeBadge}>
                <Text style={styles.challengeBadgeText}>+25 coins</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
            <Text style={styles.challengeTime}>18 hours left</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, selectedTab === 'achievements' && styles.tabActive]}
              onPress={() => setSelectedTab('achievements')}
            >
              <Text style={[styles.tabText, selectedTab === 'achievements' && styles.tabTextActive]}>
                Achievements
              </Text>
            </Pressable>
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
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {selectedTab === 'achievements' && (
              <View style={styles.achievementsGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Pressable
                    key={i}
                    style={styles.achievementCard}
                    onPress={onNavigateToAchievements}
                  >
                    <Ionicons name="trophy" size={32} color="#666666" />
                    <Text style={styles.achievementText}>Day {i}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {selectedTab === 'characters' && (
              <View style={styles.charactersGrid}>
                {characters.map((character) => {
                  const isOwned = ownedCharacters.includes(character.id);
                  const isSelected = character.id === selectedCharacter.id;
                  
                  return (
                    <Pressable
                      key={character.id}
                      style={[
                        styles.characterCard,
                        isSelected && styles.selectedCharacterCard
                      ]}
                      onPress={() => handleCharacterSelect(character)}
                    >
                      <Text style={styles.characterEmoji}>{character.emoji}</Text>
                      <Text style={styles.characterName}>{character.name}</Text>
                      <Text style={styles.characterStatus}>
                        {isSelected ? "Selected" : isOwned ? "Owned" : 
                         character.price === 0 ? "Free" : `${character.price} coins`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {selectedTab === 'backgrounds' && (
              <View style={styles.backgroundsGrid}>
                {backgrounds.map((background) => {
                  const isOwned = ownedBackgrounds.includes(background.id);
                  const isSelected = background.id === selectedBackground.id;
                  
                  return (
                    <Pressable
                      key={background.id}
                      style={[
                        styles.backgroundCard,
                        isSelected && styles.selectedBackgroundCard
                      ]}
                      onPress={() => handleBackgroundSelect(background)}
                    >
                      <View style={styles.backgroundPreview} />
                      <Text style={styles.backgroundName}>{background.name}</Text>
                      <Text style={styles.backgroundStatus}>
                        {isSelected ? "Selected" : isOwned ? "Owned" : 
                         background.price === 0 ? "Free" : `${background.price} coins`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Craving SOS Button */}
        <Pressable style={styles.sosButton} onPress={onShowCravingSOS}>
          <Text style={styles.sosButtonText}>Craving SOS</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
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
  buddySection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  buddyEmoji: {
    fontSize: 96,
    marginBottom: 16,
  },
  buddyMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  timerCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  timerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  timerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  challengeCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  challengeItem: {
    gap: 8,
  },
  challengeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  challengeBadge: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  challengeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  challengeTime: {
    fontSize: 12,
    color: '#666666',
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
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
  tabContent: {
    minHeight: 200,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 72) / 3,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
  charactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  characterCard: {
    width: (width - 72) / 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectedCharacterCard: {
    backgroundColor: '#e5e5e5',
    borderWidth: 2,
    borderColor: '#000000',
  },
  characterEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  characterStatus: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  backgroundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  backgroundCard: {
    width: (width - 72) / 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectedBackgroundCard: {
    backgroundColor: '#e5e5e5',
    borderWidth: 2,
    borderColor: '#000000',
  },
  backgroundPreview: {
    width: 40,
    height: 20,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    marginBottom: 8,
  },
  backgroundName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  backgroundStatus: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  sosButton: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sosButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home; 
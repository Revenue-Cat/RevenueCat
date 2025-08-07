import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CigaretteModal from '../components/CigaretteModal';

interface OnboardingPathScreenProps {
  onNext?: () => void;
}

const { width } = Dimensions.get('window');

interface PathCard {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const pathCards: PathCard[] = [
  {
    id: 'smoke-type',
    title: 'What do you usually smoke?',
    icon: 'remove-circle-outline',
  },
  {
    id: 'daily-usage',
    title: 'How much do you use daily?',
    icon: 'reader-outline',
  },
  {
    id: 'cost',
    title: 'How much do you pay for one unit?',
    icon: 'wallet-outline',
  },
  {
    id: 'goal',
    title: "What's your main goal?",
    icon: 'navigate-circle-outline',
  },
];

const OnboardingPathScreen: React.FC<OnboardingPathScreenProps> = ({
  onNext,
}) => {
  const navigation = useNavigation();
  const [showCigaretteModal, setShowCigaretteModal] = useState(false);
  const [selectedCigaretteOption, setSelectedCigaretteOption] = useState<string>('');

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigation.navigate('OnboardingProfile' as never);
    }
  };

  const handleCardPress = (cardId: string) => {
    if (cardId === 'smoke-type') {
      setShowCigaretteModal(true);
    } else {
      console.log(`Selected: ${cardId}`);
    }
  };

  const handleCigaretteSelect = (option: string) => {
    setSelectedCigaretteOption(option);
    console.log(`Selected cigarette option: ${option}`);
  };

  const handleCloseModal = () => {
    setShowCigaretteModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Main Heading */}
        <Text style={styles.mainHeading}>
          Set your path to quitting
        </Text>

        {/* Subheading */}
        <Text style={styles.subheading}>
          Answer a few quick questions to personalize your quitting plan. It won't take more than 20 seconds.
        </Text>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsNumber}>70%</Text>
          <Text style={styles.statsText}>
            of smokers say they want to quit — you're not alone.
          </Text>
        </View>

        {/* Path Cards */}
        <View style={styles.cardsContainer}>
          {pathCards.map((card) => (
            <Pressable
              key={card.id}
              style={styles.card}
              onPress={() => handleCardPress(card.id)}
            >
              <Text style={styles.cardText}>{card.title}</Text>
              <Ionicons name={card.icon} size={24} color="#666" />
            </Pressable>
          ))}
        </View>

        {/* Next Button */}
        <Pressable
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Pressable>
      </View>

      {/* Cigarette Modal */}
      <CigaretteModal
        visible={showCigaretteModal}
        onClose={handleCloseModal}
        onSelect={handleCigaretteSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 16,
  },
  subheading: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  statsSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statsNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    flex: 1,
    gap: 12,
    marginBottom: 32,
  },
  card: {
    width: width * 0.9,
    height: 56,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  cardText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    flex: 1,
  },
  nextButton: {
    width: width * 0.8,
    height: 56,
    backgroundColor: '#48484a',
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingPathScreen; 
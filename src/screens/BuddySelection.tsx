import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface BuddySelectionProps {
  onNext: () => void;
}

const BuddySelection: React.FC<BuddySelectionProps> = ({ onNext }) => {
  const [selectedBuddy, setSelectedBuddy] = useState<string>('capybara');

  const buddies = [
    { id: 'capybara', emoji: '🦫', name: 'Chill Capybara', description: 'Relaxed and supportive' },
    { id: 'koala', emoji: '🐨', name: 'Zen Koala', description: 'Calm and peaceful' },
    { id: 'sloth', emoji: '🦥', name: 'Slow Sloth', description: 'Patient and steady' },
    { id: 'penguin', emoji: '🐧', name: 'Cool Penguin', description: 'Cool and collected' },
    { id: 'panda', emoji: '🐼', name: 'Panda Bear', description: 'Gentle and caring' },
    { id: 'owl', emoji: '🦉', name: 'Wise Owl', description: 'Smart and insightful' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose your buddy</Text>
          <Text style={styles.subtitle}>
            Pick a character to accompany you on your quitting journey.
          </Text>
        </View>

        {/* Buddy Selection */}
        <View style={styles.buddiesContainer}>
          {buddies.map((buddy) => (
            <Pressable
              key={buddy.id}
              style={[
                styles.buddyCard,
                selectedBuddy === buddy.id && styles.selectedBuddyCard
              ]}
              onPress={() => setSelectedBuddy(buddy.id)}
            >
              <Text style={styles.buddyEmoji}>{buddy.emoji}</Text>
              <Text style={styles.buddyName}>{buddy.name}</Text>
              <Text style={styles.buddyDescription}>{buddy.description}</Text>
              {selectedBuddy === buddy.id && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color="#000000" />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={onNext}>
            <Text style={styles.buttonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </Pressable>
        </View>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buddiesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  buddyCard: {
    width: width * 0.9,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'relative',
  },
  selectedBuddyCard: {
    backgroundColor: '#e5e5e5',
    borderWidth: 2,
    borderColor: '#000000',
  },
  buddyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  buddyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  buddyDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    width: width * 0.8,
    height: 56,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BuddySelection; 
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

interface AchievementsProps {
  onBack: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ onBack }) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "First Step",
      description: "Complete your first day smoke-free",
      emoji: "👣",
      unlocked: true
    },
    {
      id: "2",
      name: "Week Warrior",
      description: "Stay smoke-free for 7 days straight",
      emoji: "⚡",
      unlocked: false
    },
    {
      id: "3",
      name: "Chill Capybar",
      description: "Stays calm when cravings creep in — too chill to care, too lazy to light up. 😎🦫",
      emoji: "🦫",
      unlocked: true
    },
    {
      id: "4",
      name: "Money Saver",
      description: "Save your first $50 by not smoking",
      emoji: "💰",
      unlocked: true
    },
    {
      id: "5",
      name: "Health Hero",
      description: "Notice improved breathing after 2 weeks",
      emoji: "❤️",
      unlocked: false
    },
    {
      id: "6",
      name: "Social Supporter",
      description: "Help someone else quit smoking",
      emoji: "🤝",
      unlocked: false
    },
    {
      id: "7",
      name: "Month Master",
      description: "Complete 30 days smoke-free",
      emoji: "🏆",
      unlocked: false
    },
    {
      id: "8",
      name: "Craving Crusher",
      description: "Successfully resist 10 strong cravings",
      emoji: "💪",
      unlocked: true
    },
    // Add more achievements for a full grid
    ...Array.from({ length: 24 }, (_, i) => ({
      id: `${i + 9}`,
      name: `Achievement ${i + 9}`,
      description: `Description for achievement ${i + 9}`,
      emoji: "🏆",
      unlocked: false
    }))
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.title}>Achievements</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Achievements Grid */}
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <Pressable
              key={achievement.id}
              style={[
                styles.achievementCard,
                achievement.unlocked ? styles.unlockedCard : styles.lockedCard
              ]}
              onPress={() => setSelectedAchievement(achievement)}
            >
              {achievement.unlocked ? (
                <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
              ) : (
                <View style={styles.lockedPlaceholder} />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Achievement Details Modal */}
      {selectedAchievement && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedAchievement(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Achievement details</Text>
                
                <View style={styles.achievementIconContainer}>
                  {selectedAchievement.unlocked ? (
                    <Text style={styles.achievementIconEmoji}>{selectedAchievement.emoji}</Text>
                  ) : (
                    <View style={styles.achievementIconPlaceholder} />
                  )}
                </View>
                
                <View style={styles.achievementDetails}>
                  <Text style={styles.achievementName}>{selectedAchievement.name}</Text>
                  <Text style={styles.achievementDescription}>{selectedAchievement.description}</Text>
                </View>
                
                <Pressable style={styles.closeButton} onPress={() => setSelectedAchievement(null)}>
                  <Ionicons name="close" size={24} color="#000000" />
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 72) / 4,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedCard: {
    backgroundColor: '#e5f3ff',
  },
  lockedCard: {
    backgroundColor: '#f5f5f5',
  },
  achievementEmoji: {
    fontSize: 24,
  },
  lockedPlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: '#cccccc',
    borderRadius: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    margin: 24,
    maxWidth: 300,
    alignItems: 'center',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  achievementIconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#f5f5f5',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementIconEmoji: {
    fontSize: 48,
  },
  achievementIconPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: '#cccccc',
    borderRadius: 24,
  },
  achievementDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  achievementName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Achievements; 
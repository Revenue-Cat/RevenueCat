import React from 'react';
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

interface AchievementsProps {
  onBack: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ onBack }) => {
  const achievements = [
    {
      id: 'first-day',
      title: 'First Day',
      description: 'Complete your first smoke-free day',
      icon: 'calendar-outline',
      unlocked: true,
      date: '2024-01-15',
    },
    {
      id: 'first-week',
      title: 'Week Warrior',
      description: 'Stay smoke-free for 7 days',
      icon: 'trophy-outline',
      unlocked: true,
      date: '2024-01-22',
    },
    {
      id: 'first-month',
      title: 'Month Master',
      description: 'Complete 30 days smoke-free',
      icon: 'star-outline',
      unlocked: false,
      date: null,
    },
    {
      id: 'money-saver',
      title: 'Money Saver',
      description: 'Save €50 by not smoking',
      icon: 'wallet-outline',
      unlocked: true,
      date: '2024-01-20',
    },
    {
      id: 'health-improver',
      title: 'Health Improver',
      description: 'Notice improved breathing',
      icon: 'heart-outline',
      unlocked: false,
      date: null,
    },
    {
      id: 'social-supporter',
      title: 'Social Supporter',
      description: 'Help someone else quit',
      icon: 'people-outline',
      unlocked: false,
      date: null,
    },
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

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>50%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        {/* Achievements List */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Your Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  achievement.unlocked && styles.unlockedAchievement
                ]}
              >
                <View style={styles.achievementIcon}>
                  <Ionicons 
                    name={achievement.icon as keyof typeof Ionicons.glyphMap} 
                    size={32} 
                    color={achievement.unlocked ? '#000000' : '#cccccc'} 
                  />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[
                    styles.achievementTitle,
                    achievement.unlocked && styles.unlockedTitle
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    achievement.unlocked && styles.unlockedDescription
                  ]}>
                    {achievement.description}
                  </Text>
                  {achievement.unlocked && achievement.date && (
                    <Text style={styles.achievementDate}>
                      Unlocked on {new Date(achievement.date).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                {achievement.unlocked && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={24} color="#000000" />
                  </View>
                )}
              </View>
            ))}
          </View>
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
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  achievementsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  unlockedAchievement: {
    backgroundColor: '#e5e5e5',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cccccc',
    marginBottom: 4,
  },
  unlockedTitle: {
    color: '#000000',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4,
  },
  unlockedDescription: {
    color: '#666666',
  },
  achievementDate: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  checkmark: {
    marginLeft: 'auto',
  },
});

export default Achievements; 
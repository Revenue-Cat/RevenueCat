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

interface ProfileProps {
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#666666" />
            </View>
            <Pressable style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="white" />
            </Pressable>
          </View>
          <Text style={styles.userName}>User Name</Text>
          <Text style={styles.userEmail}>user@example.com</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>Days Smoke-Free</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Cigarettes Avoided</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>€23.50</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsList}>
            <Pressable style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={24} color="#000000" />
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </Pressable>
            <Pressable style={styles.settingItem}>
              <Ionicons name="shield-outline" size={24} color="#000000" />
              <Text style={styles.settingText}>Privacy</Text>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </Pressable>
            <Pressable style={styles.settingItem}>
              <Ionicons name="help-circle-outline" size={24} color="#000000" />
              <Text style={styles.settingText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </Pressable>
            <Pressable style={styles.settingItem}>
              <Ionicons name="information-circle-outline" size={24} color="#000000" />
              <Text style={styles.settingText}>About</Text>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
          <Text style={styles.logoutText}>Log Out</Text>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 72) / 2,
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
    textAlign: 'center',
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsList: {
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
  },
});

export default Profile; 
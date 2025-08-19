import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface DetailedAchievementProps {
  onClose: () => void;
}

const DetailedAchievement: React.FC<DetailedAchievementProps> = ({ onClose }) => {
  return (
    <View style={styles.container}>
      {/* Background Scene */}
      <LinearGradient
        colors={['#1F1943', '#2D1B69']}
        style={styles.background}
      >
        {/* Forest Illustration */}
        <View style={styles.forestContainer}>
          {/* Pine Trees */}
          <View style={styles.treeContainer}>
            <View style={styles.tree1} />
            <View style={styles.tree2} />
            <View style={styles.tree3} />
          </View>
          
          {/* Character in orange jacket (partial) */}
          <View style={styles.characterPartial}>
            <View style={styles.orangeJacket} />
          </View>
        </View>

        {/* Card Stack Background */}
        <View style={styles.cardStackContainer}>
          {/* Back Card */}
          <View style={styles.backCard} />
          {/* Middle Card */}
          <View style={styles.middleCard} />
        </View>

        {/* Main Achievement Card */}
        <View style={styles.mainCard}>
          {/* Left Side - Content */}
          <View style={styles.cardContent}>
            {/* Reward Points */}
            <View style={styles.rewardContainer}>
              <View style={styles.rewardPill}>
                <Text style={styles.rewardText}>+150</Text>
                <View style={styles.starContainer}>
                  <Ionicons name="star" size={12} color="#FF6B35" />
                </View>
              </View>
            </View>

            {/* Time Limit */}
            <Text style={styles.timeLimit}>4h left</Text>

            {/* Title */}
            <Text style={styles.achievementTitle}>First spark</Text>

            {/* Description */}
            <Text style={styles.achievementDescription}>
              First 24 hours without smoke...
            </Text>
          </View>

          {/* Right Side - Illustration */}
          <View style={styles.illustrationContainer}>
            {/* Progress Ring */}
            <View style={styles.progressRing}>
              <View style={styles.progressArc} />
            </View>
            
            {/* Badge */}
            <View style={styles.badgeContainer}>
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                style={styles.badgeBackground}
              >
                {/* Bear Character */}
                <View style={styles.bearCharacter}>
                  {/* Bear Body */}
                  <View style={styles.bearBody} />
                  
                  {/* Bear Head */}
                  <View style={styles.bearHead} />
                  
                  {/* Backwards Cap */}
                  <View style={styles.cap} />
                  
                  {/* Sunglasses */}
                  <View style={styles.sunglasses} />
                  
                  {/* Orange T-shirt */}
                  <View style={styles.tshirt} />
                  
                  {/* Green Pants */}
                  <View style={styles.pants} />
                  
                  {/* Rock */}
                  <View style={styles.rock} />
                </View>

                {/* Sparkles */}
                <View style={styles.sparklesContainer}>
                  <Text style={styles.sparkle}>✨</Text>
                  <Text style={styles.sparkle}>✨</Text>
                  <Text style={styles.sparkle}>✨</Text>
                  <Text style={styles.sparkle}>✨</Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Collapse Button */}
        <View style={styles.collapseButtonContainer}>
          <Pressable style={styles.collapseButton} onPress={onClose}>
            <Ionicons name="chevron-down" size={20} color="#ffffff" />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forestContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  treeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tree1: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 60,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#2D5016',
  },
  tree2: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 80,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#2D5016',
  },
  tree3: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 70,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#2D5016',
  },
  characterPartial: {
    position: 'absolute',
    top: 10,
    right: 50,
  },
  orangeJacket: {
    width: 20,
    height: 15,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
  },
  cardStackContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    transform: [{ translateY: -100 }],
  },
  backCard: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  middleCard: {
    position: 'absolute',
    top: 10,
    left: 5,
    right: 5,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    marginRight: 20,
  },
  rewardContainer: {
    marginBottom: 8,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  starContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLimit: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F1943',
    marginBottom: 8,
  },
  achievementDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  illustrationContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  progressRing: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#4CAF50',
    borderRightColor: '#4CAF50',
    transform: [{ rotate: '-45deg' }],
  },
  progressArc: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#4CAF50',
    borderRightColor: '#4CAF50',
    transform: [{ rotate: '135deg' }],
  },
  badgeContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
  },
  badgeBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bearCharacter: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  bearBody: {
    position: 'absolute',
    bottom: 0,
    left: 15,
    width: 30,
    height: 25,
    backgroundColor: '#FFD700',
    borderRadius: 15,
  },
  bearHead: {
    position: 'absolute',
    top: 5,
    left: 12,
    width: 36,
    height: 36,
    backgroundColor: '#FFD700',
    borderRadius: 18,
  },
  cap: {
    position: 'absolute',
    top: 2,
    left: 8,
    width: 20,
    height: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  sunglasses: {
    position: 'absolute',
    top: 15,
    left: 10,
    width: 16,
    height: 6,
    backgroundColor: '#7B2CBF',
    borderRadius: 3,
  },
  tshirt: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    width: 26,
    height: 12,
    backgroundColor: '#FF6B35',
    borderRadius: 6,
  },
  pants: {
    position: 'absolute',
    bottom: 0,
    left: 13,
    width: 24,
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  rock: {
    position: 'absolute',
    bottom: -5,
    left: 8,
    width: 20,
    height: 10,
    backgroundColor: '#666666',
    borderRadius: 5,
  },
  sparklesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    fontSize: 10,
    position: 'absolute',
    color: '#ffffff',
  },
  collapseButtonContainer: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
  },
  collapseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default DetailedAchievement;

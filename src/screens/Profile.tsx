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
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import SlideModal from '../components/SlideModal';

const { width } = Dimensions.get('window');

interface ProfileProps {
  onBack: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToShop: () => void;
}

interface SmokingHabits {
  smokeType: string;
  dailyAmount: string;
  packPrice: string;
  goal: string;
}

const Profile: React.FC<ProfileProps> = ({ onBack, onNavigateToAchievements, onNavigateToShop }) => {
  const { userCoins, setShowCoinPurchase, openShopWithTab } = useApp();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [smokingHabits, setSmokingHabits] = useState<SmokingHabits>({
    smokeType: "cigarettes",
    dailyAmount: "5-10",
    packPrice: "5",
    goal: "quit-completely"
  });
  
  const [editingField, setEditingField] = useState<string | null>(null);

  const setupFields = [
    {
      id: "smokeType",
      label: "What do you usually smoke?",
      icon: "remove-circle-outline" as keyof typeof Ionicons.glyphMap,
      value: smokingHabits.smokeType,
      options: [
        { value: "cigarettes", label: "Cigarettes" },
        { value: "tobacco-heater", label: "Tobacco heater" },
        { value: "roll-your-own", label: "Roll-your-own" }
      ]
    },
    {
      id: "dailyAmount",
      label: "How much do you use daily?",
      icon: "reader-outline" as keyof typeof Ionicons.glyphMap,
      value: smokingHabits.dailyAmount,
      options: [
        { value: "1-5", label: "1-5 cigarettes per day" },
        { value: "5-10", label: "5-10 cigarettes per day" },
        { value: "11-15", label: "11-15 cigarettes per day" },
        { value: "16-20", label: "16-20 cigarettes per day (1 pack)" },
        { value: "21-30", label: "21-30 cigarettes per day" },
        { value: "31-40", label: "31-40 cigarettes per day (2 packs)" }
      ]
    },
    {
      id: "packPrice",
      label: "How much do you pay for one unit?",
      icon: "wallet-outline" as keyof typeof Ionicons.glyphMap,
      value: smokingHabits.packPrice,
      options: [
        { value: "3", label: "$3" },
        { value: "4", label: "$4" },
        { value: "5", label: "$5" },
        { value: "6", label: "$6" },
        { value: "7", label: "$7" }
      ]
    },
    {
      id: "goal",
      label: "What's your main goal?",
      icon: "navigate-circle-outline" as keyof typeof Ionicons.glyphMap,
      value: smokingHabits.goal,
      options: [
        { value: "quit-completely", label: "Quit completely" },
        { value: "reduce-gradually", label: "Reduce gradually" },
        { value: "save-money", label: "Save money" },
        { value: "improve-health", label: "Improve health" },
        { value: "gain-control", label: "Gain control" },
        { value: "doesnt-matter", label: "Doesn't matter" }
      ]
    }
  ];

  const handleFieldEdit = (fieldId: string) => {
    setEditingField(fieldId);
  };

  const handleSelection = (field: keyof SmokingHabits, value: string) => {
    setSmokingHabits(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
  };

  const getDisplayText = (field: any) => {
    const option = field.options.find((opt: any) => opt.value === field.value);
    const label = option?.label || field.value;
    
    switch (field.id) {
      case "smokeType":
        return `I am smoking ${label.toLowerCase()}`;
      case "dailyAmount":
        return `I smoke ${label.toLowerCase()}`;
      case "packPrice":
        return `One pack cost me $${field.value}`;
      case "goal":
        return `I want ${label.toLowerCase()}`;
      default:
        return label;
    }
  };

  const currentField = setupFields.find(field => field.id === editingField);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.title}>Profile</Text>
          <Pressable style={styles.coinsButton} onPress={() => setShowCoinPurchase(true)}>
            <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
            <Text style={styles.coinsText}>{userCoins}</Text>
          </Pressable>
        </View>

        {/* Achievement Preview */}
        <Pressable style={styles.previewCard} onPress={onNavigateToAchievements}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Achievements</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </View>
          <View style={styles.previewGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={styles.previewItem} />
            ))}
          </View>
        </Pressable>

        {/* Characters Preview */}
        <Pressable style={styles.previewCard} onPress={() => openShopWithTab('characters')}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Characters</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </View>
          <View style={styles.previewGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={styles.previewItem} />
            ))}
          </View>
        </Pressable>

        {/* Backgrounds Preview */}
        <Pressable 
          style={styles.previewCard} 
          onPress={() => openShopWithTab('backgrounds')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Backgrounds</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </View>
          <View style={styles.previewGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={[styles.previewItem, styles.backgroundPreview]} />
            ))}
          </View>
        </Pressable>

        {/* Subscription */}
        <View style={styles.subscriptionCard}>
          <Text style={styles.cardTitle}>Subscription</Text>
          <View style={styles.subscriptionOptions}>
            <View style={styles.subscriptionOption}>
              <View>
                <Text style={styles.subscriptionLabel}>12 month</Text>
                <Text style={styles.subscriptionSubtext}>Save 80%</Text>
              </View>
              <View style={styles.subscriptionPrice}>
                <Text style={styles.priceText}>10.99 USD</Text>
                <Text style={styles.originalPrice}>15.99 USD</Text>
              </View>
            </View>
            <View style={styles.subscriptionOption}>
              <Text style={styles.subscriptionLabel}>3 month</Text>
              <Text style={styles.priceText}>5.99 USD</Text>
            </View>
            <View style={styles.subscriptionOption}>
              <Text style={styles.subscriptionLabel}>1 month</Text>
              <Text style={styles.priceText}>2.99 USD</Text>
            </View>
            <View style={styles.subscriptionOption}>
              <Text style={styles.subscriptionLabel}>App for life</Text>
              <Text style={styles.priceText}>20.99 USD</Text>
            </View>
          </View>
          <Pressable style={styles.unlockButton}>
            <Text style={styles.unlockButtonText}>Unlock the entire program</Text>
          </Pressable>
        </View>

        {/* Settings */}
        <View style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Smoking Habits</Text>
            <Ionicons name="create-outline" size={20} color="#666666" />
          </View>
          <View style={styles.habitsList}>
            {setupFields.map((field) => (
              <Pressable
                key={field.id}
                style={styles.habitItem}
                onPress={() => handleFieldEdit(field.id)}
              >
                <View style={styles.habitContent}>
                  <Ionicons name={field.icon} size={24} color="#000000" />
                  <Text style={styles.habitText}>{getDisplayText(field)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </Pressable>
            ))}
          </View>
          <View style={styles.notificationToggle}>
            <Text style={styles.notificationLabel}>Notifications</Text>
            <View style={styles.toggleSwitch}>
              <View style={styles.toggleKnob} />
            </View>
          </View>
        </View>
      </ScrollView>

      {editingField && currentField && (
        <SlideModal visible={true} onClose={() => setEditingField(null)} title={currentField.label}>
          <ScrollView className="max-h-96">
            <View className="gap-4">
              {currentField.options.map((option) => (
                <Pressable
                  key={option.value}
                  className={`w-11/12 h-16 rounded-3xl flex-row justify-between items-center px-5 self-center ${
                    smokingHabits[editingField as keyof SmokingHabits] === option.value 
                      ? (isDark ? 'bg-slate-600' : 'bg-indigo-100') 
                      : (isDark ? 'bg-slate-700' : 'bg-indigo-50')
                  }`}
                  onPress={() => handleSelection(editingField as keyof SmokingHabits, option.value)}
                >
                  <Text className={`text-base ${smokingHabits[editingField as keyof SmokingHabits] === option.value ? 'font-bold' : 'font-medium'} ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
                    {option.label}
                  </Text>
                  {smokingHabits[editingField as keyof SmokingHabits] === option.value && (
                    <Ionicons 
                      name="checkmark" 
                      size={24} 
                      color="#4f46e5" 
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </SlideModal>
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
  previewCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  previewGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  previewItem: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#e5e5e5',
    borderRadius: 12,
  },
  backgroundPreview: {
    backgroundColor: '#e0f2fe',
  },
  subscriptionCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  subscriptionOptions: {
    gap: 12,
    marginBottom: 16,
  },
  subscriptionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  subscriptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  subscriptionSubtext: {
    fontSize: 12,
    color: '#666666',
  },
  subscriptionPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  originalPrice: {
    fontSize: 12,
    color: '#666666',
    textDecorationLine: 'line-through',
  },
  unlockButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  unlockButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  habitsList: {
    gap: 12,
    marginBottom: 16,
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  habitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  notificationToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    backgroundColor: '#e5e5e5',
    borderRadius: 15,
    padding: 2,
  },
  toggleKnob: {
    width: 26,
    height: 26,
    backgroundColor: '#ffffff',
    borderRadius: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '70%',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    maxHeight: 400,
  },
  option: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  optionUnselected: {
    backgroundColor: '#f5f5f5',
  },
  optionSelected: {
    backgroundColor: '#000000',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  optionTextUnselected: {
    color: '#000000',
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default Profile; 
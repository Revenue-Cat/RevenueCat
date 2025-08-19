import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Alert,
  ImageBackground,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import AchievementCard from '../components/AchievementCard';
import AchievementCascadeCard from '../components/AchievementCascadeCard';
import Challenges from './Challenges';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';
import ParallaxBackground from '../components/ParallaxBackground';

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
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  
  const {
    userCoins,
    selectedCharacter,
    selectedBackground,
    ownedCharacters,
    ownedBackgrounds,
    setSelectedCharacter,
    setSelectedBackground,
    setShowCoinPurchase,
    purchaseItem,
    selectedBuddyId,
    gender,
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
  const [isAchievementsCollapsed, setIsAchievementsCollapsed] = useState(true);

  // Achievement Cards Data
  const achievementCards = [
    {
      id: 1,
      title: "First spark",
      description: "First 24 hours without smoke...",
      reward: 150,
      timeLeft: "4h left",
      emoji: "🐻"
    },
    {
      id: 2,
      title: "Hold on",
      description: "Three days smoke-free — pro...",
      reward: 300,
      timeLeft: "2d 23h left",
      emoji: "🐨"
    },
    {
      id: 3,
      title: "Steel week",
      description: "One week without nicotine —...",
      reward: 500,
      timeLeft: "5d 12h left",
      emoji: "🦓"
    }
  ];

  const sexKey: SexKey = gender === "lady" ? "w" : "m";

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
  console.log('selectedCharacter', selectedCharacter)

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

    // Scroll animation for parallax effect
  const scrollY = new Animated.Value(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

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
    <Animated.ScrollView 
      className="flex-1 bg-[#1F1943]"
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Background Image */}
      <ParallaxBackground scrollY={scrollY} height={330} />

      {/* Header - On top of ParallaxBackground */}
      <View className="absolute top-0 left-0 right-0 z-[1000] p-6">
        <View className="flex-row justify-between items-start mb-8">
          <Pressable 
            className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
            onPress={onNavigateToProfile}
          >
            <Ionicons name="person-outline" size={24} color="#ffffff" />
          </Pressable>

          {/* Timer */}
          <View className="rounded-xl items-center">
            <Text className="text-xl font-bold text-white">Zero Poofs</Text>
            
            {/* Timer Units */}
            <View className="flex-row gap-6">
              {/* Days */}
              <View className="items-center">
                <Text className="text-4xl font-bold text-white">{timeElapsed.days}</Text>
                <Text className="text-sm text-white opacity-80">Days</Text>
              </View>
              
              {/* Hours */}
              <View className="items-center">
                <Text className="text-4xl font-bold text-white">{timeElapsed.hours}</Text>
                <Text className="text-sm text-white opacity-80">Hours</Text>
              </View>
              
              {/* Minutes */}
              <View className="items-center">
                <Text className="text-4xl font-bold text-white">{timeElapsed.minutes}</Text>
                <Text className="text-sm text-white opacity-80">Minutes</Text>
              </View>
            </View>
          </View>
          
          <Pressable 
            className="flex-row items-center bg-white/20 px-3 py-2 rounded-full gap-2"
            onPress={() => setShowCoinPurchase(true)}
          >
            <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
            <Text className="text-base font-bold text-white">{userCoins}</Text>
          </Pressable>
        </View>
      </View>

      {/* Buddy Icon and Achievement Cards Container */}
      <Animated.View className="absolute top-0 left-0 right-0 z-[99]" style={{ height: 330 }}>
        {/* Buddy Icon */}
        <Animated.View className="absolute inset-0 items-center justify-end">
          <Animated.Image
            source={buddyAssets[selectedBuddyId as BuddyKey][sexKey]}
            style={{ 
              width: 100, 
              height: 220,
              transform: [{
                translateY: scrollY.interpolate({
                  inputRange: [0, 200],
                  outputRange: [0, -30],
                  extrapolate: 'clamp'
                })
              }]
            }}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Achievement Cards - On top of Buddy Icon */}
        <View className="absolute top-0 left-5 right-5 z-[999]" style={{ top: 300 }}>
          {!isAchievementsCollapsed ? (
           <View className="mb-1">            
             {achievementCards.map((card) => (
               <AchievementCard
                 key={card.id}
                 title={card.title}
                 description={card.description}
                 reward={card.reward}
                 timeLeft={card.timeLeft}
                 emoji={card.emoji}
               />
             ))}
           </View>
         ) : (
           /* Main Achievement Card - Collapsed View with Cascade Effect */
           <View className="mb-1 relative">
             {/* Card Stack Background - Cascade Effect */}
             <View className="absolute top-8 left-5 right-5 h-32">
               {/* Card 3 - Back (smallest) */}
               <View className="absolute top-5 left-7 right-6 h-20 bg-white/5 rounded-xl" />
               {/* Card 2 - Middle (medium) */}
               <View className="absolute top-4 left-5 right-5 h-24 bg-white/10 rounded-xl" />
             </View>

             <AchievementCard
               title={achievementCards[0].title}
               description={achievementCards[0].description}
               reward={achievementCards[0].reward}
               timeLeft={achievementCards[0].timeLeft}
               emoji={achievementCards[0].emoji}
               containerClassName="relative z-10"
             />

             <View className="relative">
               {/* Medium and Small cascade cards overlapping 50% under Card 1 */}
               <AchievementCascadeCard
                 variant="medium"
                 title={achievementCards[1].title}
                 description=""
                 reward={achievementCards[1].reward}
                 timeLeft=""
                 emoji={achievementCards[1].emoji}
                 containerClassName="relative z-5 mx-2"
                 overlapRatio={0.99}
               />
               <AchievementCascadeCard
                 variant="small"
                 title=""
                 description=""
                 reward={achievementCards[2].reward}
                 timeLeft=""
                 emoji={achievementCards[2].emoji}
                 containerClassName="relative z-0 mx-4"
                 overlapRatio={0.99}
               />
             </View>
           </View>
         )}

        {/* Collapse Button */}
        <View className="items-center mb-8">
          <Pressable 
            className="w-10 h-10 rounded-full bg-gray-600 justify-center items-center shadow-lg"
            onPress={() => setIsAchievementsCollapsed(!isAchievementsCollapsed)}
          >
            <Ionicons 
              name={isAchievementsCollapsed ? "chevron-down" : "chevron-up"} 
              size={20} 
              color="#ffffff" 
            />
          </Pressable>
        </View>
      </View>
      </Animated.View>

      {/* Spacer for Achievement Cards */}
      <View style={{ height: isAchievementsCollapsed ? 150 : 400 }} />

      {/* Content */}
      <View style={{ paddingHorizontal: 24 }}>

        {/* Stats */}
        <View className="flex-row gap-1 mb-1">
          <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
            <Text className="text-2xl font-bold text-white">145</Text>
            <Text className="text-xs font-medium text-white">Cigs avoided</Text>
          </View>
          <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
            <Text className="text-2xl font-bold text-white">127$</Text>
            <Text className="text-xs font-medium text-white">Money saved</Text>
          </View>
        </View>
         <View className="flex-row gap-1 mb-6">
          <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
            <Text className="text-2xl font-bold text-white">2h</Text>
            <Text className="text-xs font-medium text-white">Time saved</Text>
          </View>
          <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
            <Text className="text-2xl font-bold text-white">8/20</Text>
            <Text className="text-xs font-medium text-white">Slips</Text>
          </View>
        </View>
        <Challenges />

        {/* Craving SOS Button */}
        <Pressable className="bg-red-500 rounded-xl py-4 items-center" onPress={onShowCravingSOS}>
          <Text className="text-white text-lg font-bold">Craving SOS</Text>
        </Pressable>
      </View>
    </Animated.ScrollView>
  );
};

export default Home;
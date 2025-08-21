import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import AchievementCard from '../components/AchievementCard';
import AchievementCascadeCard from '../components/AchievementCascadeCard';
import Challenges from './Challenges';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';
import ParallaxBackground from '../components/ParallaxBackground';
import Achievements from './Achievements';

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
    setShowCoinPurchase,
    selectedBuddyId,
    gender,
  } = useApp();

  const sexKey: SexKey = gender === "lady" ? "w" : "m";
  const [isAchievementsCollapsed, setIsAchievementsCollapsed] = useState(true);
  const [isBackgroundShrunk, setIsBackgroundShrunk] = useState(false);
  const maxScrollReached = useRef(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Timer logic
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 32
  });
  const [currentView, setCurrentView] = useState<'home' | 'achievements' | 'shop'>('home');

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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        // Track the maximum scroll position reached
        maxScrollReached.current = Math.max(maxScrollReached.current, scrollPosition);
        
        // Only shrink when scrolling down past threshold, and stay shrunk once reached
        if (maxScrollReached.current > 50 && !isBackgroundShrunk) {
          setIsBackgroundShrunk(true);
        }

        // Auto-collapse Achievement Cards when scrolling
        if (scrollPosition > 10 && !isAchievementsCollapsed) {
          setIsAchievementsCollapsed(true);
        }
      }
    }
  );

  const handleHeaderGesture = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      const threshold = 50;

      if (translationX > threshold) {
        // Swipe right - go to previous view
        if (currentView === 'shop') {
          setCurrentView('home');
        } else if (currentView === 'home') {
          setCurrentView('achievements');
        }
      } else if (translationX < -threshold) {
        // Swipe left - go to next view
        if (currentView === 'achievements') {
          setCurrentView('home');
        } else if (currentView === 'home') {
          setCurrentView('shop');
        }
      }
    }
  };

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

  // Preserve scroll state when view changes
  useEffect(() => {
    // Don't reset scrollY when view changes - keep the current scroll position
    // This prevents the ParallaxBackground from jumping back to original position
  }, [currentView]);

  return (
    <View className="flex-1 bg-[#1F1943]">
      {/* Full Screen PanGestureHandler for left/right navigation */}
      <PanGestureHandler onHandlerStateChange={handleHeaderGesture}>
        <View className="absolute top-0 left-0 right-0 bottom-0 z-[1000]">
          {/* Shrinking ParallaxBackground - shrinks when scrolling achievements */}
          <Animated.View 
            style={{ 
              height: isBackgroundShrunk ? 100 : scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [330, 100],
                extrapolate: 'clamp'
              })
            }}
          >
            <ParallaxBackground scrollY={scrollY} height={330} />
          </Animated.View>

          {/* Fixed Header - On top of ParallaxBackground */}
          <View className="absolute top-0 left-0 right-0 p-6" style={{ height: 140 }}>
            <View className="flex-row justify-between items-start mb-8">
              <Pressable 
                className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
                onPress={onNavigateToProfile}
              >
                <Ionicons name="person-outline" size={24} color="#ffffff" />
              </Pressable>

              {/* Carousel Header */}
              <View className="rounded-xl items-center">
                {/* Title */}
                <Text className="text-xl font-bold text-white">
                  {currentView === 'home' ? 'Zero Poofs' : 
                   currentView === 'achievements' ? 'Achievements' : 'Shop'}
                </Text>
                
                {/* Timer Units - Only show for Home view */}
                {currentView === 'home' && (
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
                )}

                {/* Preview content for other views */}
                {currentView === 'achievements' && (
                  <View className="items-center mt-2">
                    <Text className="text-sm text-white opacity-80">Tap to view achievements</Text>
                  </View>
                )}

                {currentView === 'shop' && (
                  <View className="items-center mt-2">
                    <Text className="text-sm text-white opacity-80">Tap to open shop</Text>
                  </View>
                )}
              </View>
              
              <Pressable 
                className="flex-row items-center bg-white/20 px-3 py-2 rounded-full gap-2"
                onPress={() => setShowCoinPurchase(true)}
              >
                <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
                <Text className="text-base font-bold text-white">{userCoins}</Text>
              </Pressable>
            </View>

            {/* Carousel Navigation Dots - Inside Header Area */}
            <View className="flex-row justify-center mt-4">
              <Pressable 
                className={`w-2 h-2 rounded-full mx-1 ${
                  currentView === 'achievements' ? 'bg-white' : 'bg-white/40'
                }`}
                onPress={() => setCurrentView('achievements')}
              />
              <Pressable 
                className={`w-2 h-2 rounded-full mx-1 ${
                  currentView === 'home' ? 'bg-white' : 'bg-white/40'
                }`}
                onPress={() => setCurrentView('home')}
              />
              <Pressable 
                className={`w-2 h-2 rounded-full mx-1 ${
                  currentView === 'shop' ? 'bg-white' : 'bg-white/40'
                }`}
                onPress={() => setCurrentView('shop')}
              />
            </View>
          </View>

          {/* Fixed Buddy Icon - On top of ParallaxBackground */}
          <Animated.View className="absolute top-0 left-0 right-0 z-[60] items-center justify-end" style={{ height: 360 }}>
            <Animated.Image
              source={buddyAssets[selectedBuddyId as BuddyKey][sexKey]}
              style={{ 
                width: 100, 
                height: 220,
                transform: [{
                  translateY: scrollY.interpolate({
                    inputRange: [0, 80],
                    outputRange: [0, -100],
                    extrapolate: 'clamp'
                  })
                }]
              }}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Scrollable Content */}
          <Animated.ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            // contentContainerStyle={{ paddingBottom: 40 }}
            style={{ 
              flex: 1, 
              marginTop: 270, 
              zIndex: 1000,
              transform: [{
                translateY: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, -100],
                  extrapolate: 'clamp'
                })
              }]
            }}
          >
            {/* Achievement Cards - Only show for Home view */}
            {currentView === 'home' && (
              <View className="relative px-5 border-2 border-orange-500">
                {/* Toggle Arrow Button */}
                <Pressable 
                  className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 bg-black/20 rounded-full justify-center items-center border-2 border-green-500"
                  onPress={() => setIsAchievementsCollapsed(!isAchievementsCollapsed)}
                >
                  <Ionicons 
                    name={isAchievementsCollapsed ? "chevron-down" : "chevron-up"} 
                    size={20} 
                    color="#ffffff" 
                  />
                </Pressable>

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
                 <View className="mb-1 relative" style={{ minHeight: 160 }}>
                    {/* Card Stack Background - Cascade Effect */}
                    <View className="absolute top-0 left-0 right-0 h-56" style={{ zIndex: 1 }}>
                    {/* Card 2 - Middle (medium) - positioned in middle */}
                    <View className="absolute top-28 left-4 right-4 h-10 bg-white/55 rounded-xl" />
                    {/* Card 3 - Back (smallest) - positioned behind everything */}
                    <View className="absolute top-24 left-2 right-2 h-12 bg-white/75 rounded-xl" />
                  </View>

                   {/* Main Card - Front layer */}
                   <View style={{ zIndex: 2, marginTop: 0 }}>
                     <AchievementCard
                       title={achievementCards[0].title}
                       description={achievementCards[0].description}
                       reward={achievementCards[0].reward}
                       timeLeft={achievementCards[0].timeLeft}
                       emoji={achievementCards[0].emoji}
                     />
                   </View>
                 </View>
               )}
              </View>
            )}

            {/* Spacer for Achievement Cards - Only for Home view */}
            {currentView === 'home' && (
              <View style={{ height: isAchievementsCollapsed ? 200 : 400 }} />
            )}

            {/* Content with Carousel */}
            <View style={{ paddingHorizontal: 24 }}>
             

             {/* Conditional Content Based on View */}
             {currentView === 'home' && (
               <>
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
               </>
             )}

             {currentView === 'achievements' && (
                 <Achievements onBack={ () => {}} />
             )}

             {currentView === 'shop' && (
               <View className="items-center py-8">
                 <Text className="text-white text-lg mb-4">Shop Preview</Text>
                 <Pressable 
                   className="bg-green-500 rounded-xl px-6 py-3"
                   onPress={onNavigateToShop}
                 >
                   <Text className="text-white font-bold">Open Shop</Text>
                 </Pressable>
               </View>
             )}
           </View>
         </Animated.ScrollView>
        </View>
      </PanGestureHandler>
    </View>
  );
};

export default Home;
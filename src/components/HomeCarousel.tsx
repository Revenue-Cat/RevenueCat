import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';
import ParallaxBackground from './ParallaxBackground';

const { width } = Dimensions.get('window');

interface HomeCarouselProps {
  selectedBuddyId: string;
  gender: string;
  onNavigateToAchievements: () => void;
  onNavigateToShop: () => void;
  onNavigateToProfile: () => void;
  userCoins: number;
  setShowCoinPurchase: (show: boolean) => void;
  timeElapsed: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({
  selectedBuddyId,
  gender,
  onNavigateToAchievements,
  onNavigateToShop,
  onNavigateToProfile,
  userCoins,
  setShowCoinPurchase,
  timeElapsed,
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(1); // Start with Home (middle slide)
  const scrollY = new Animated.Value(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const sexKey: SexKey = gender === "lady" ? "w" : "m";

  const slides = [
    {
      id: 'achievements',
      title: 'Achievements',
      icon: 'trophy-outline',
      action: onNavigateToAchievements,
    },
    {
      id: 'home',
      title: 'Zero Poofs',
      icon: 'home-outline',
      action: null, // No action for home slide
    },
    {
      id: 'shop',
      title: 'Shop',
      icon: 'bag-outline',
      action: onNavigateToShop,
    },
  ];

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const renderSlide = (slide: any, index: number) => {
    const isActive = index === currentIndex;
    const isHome = slide.id === 'home';

    return (
      <View
        key={slide.id}
        className="flex-1 items-center justify-center"
        style={{ width }}
      >
        {/* Header - Same for all slides */}
        <View className="absolute top-0 left-0 right-0 z-[1000] p-6">
          <View className="flex-row justify-between items-start mb-8">
            <Pressable 
              className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
              onPress={onNavigateToProfile}
            >
              <Ionicons name="person-outline" size={24} color="#ffffff" />
            </Pressable>

            {/* Title */}
            <View className="rounded-xl items-center">
              <Text className="text-xl font-bold text-white">{slide.title}</Text>
              
              {isHome && (
                <>
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
                </>
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
        </View>

        {/* ParallaxBackground */}
        <ParallaxBackground scrollY={scrollY} height={330} />

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

        {/* Slide Content */}
        <View className="absolute inset-0 items-center justify-center">
          {!isHome && (
            <Pressable
              className="bg-white/20 rounded-xl p-6 items-center"
              onPress={slide.action}
            >
              <Ionicons name={slide.icon} size={48} color="#ffffff" />
              <Text className="text-white text-lg font-bold mt-4">{slide.title}</Text>
              <Text className="text-white/80 text-sm mt-2">Tap to open</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentOffset={{ x: width, y: 0 }} // Start at home slide (middle)
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>
      
      {/* Pagination Dots */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default HomeCarousel;

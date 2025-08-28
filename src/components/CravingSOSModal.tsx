import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Animated, Dimensions, Pressable, Text, View } from 'react-native';
import SlideModal from './SlideModal';
import { useTheme } from '../contexts/ThemeContext';
import { strategies as strategiesData } from '../data/strategiesData';
import HeartIcon from '../assets/strategies/heart.svg';
import { useTranslation } from 'react-i18next';
import BreathIcon from '../assets/challenges/challenge1.svg';
import SmokeIcon from '../assets/icons/smoke.svg';

interface CravingSOSModalProps {
  visible: boolean;
  onClose: () => void;
  onStartBreathing: () => void;
}

const strategies = strategiesData;

const CravingSOSModal: React.FC<CravingSOSModalProps> = ({ visible, onClose, onStartBreathing }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const { width } = Dimensions.get('window');
  const ITEM_WIDTH = width * 0.7; // center card width (~70%)
  const SIDE_GUTTER = width * 0.1; // side visibility (~10% each side)

  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<Animated.FlatList>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  // Finite carousel state

  // Finite data (no looping)
  const data = strategies;

  // Reset to first card when modal becomes visible
  useEffect(() => {
    if (visible) {
      setActiveIndex(0);
      setHasInteracted(false);
    }
  }, [visible]);

  const keyExtractor = useCallback((item: typeof data[number], index: number) => `${item.id}-${index}`, []);

  const getItemLayout = useCallback((_: unknown, index: number) => ({ length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index }), [ITEM_WIDTH]);

  const renderItem = useCallback(({ item, index }: { item: typeof data[number]; index: number }) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];
    const scale = scrollX.interpolate({
      inputRange,
            outputRange: [0.94, 1, 0.94],
            extrapolate: 'clamp',
          });
          const heightScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.9], // 160/240 = 0.67 for side cards, 1 for active
      extrapolate: 'clamp',
    });
    const translateY = scrollX.interpolate({
      inputRange,
            outputRange: [9, 0, 9],
      extrapolate: 'clamp',
    });
    const isInitiallyActive = !hasInteracted && index === activeIndex;
    return (
      <Animated.View
        style={{
          width: ITEM_WIDTH,
                transform: [
                  { scale },
                  { scaleY: isInitiallyActive ? 1 : heightScale },
                  { translateY: isInitiallyActive ? 0 : (translateY as unknown as number) },
                ],
        }}
      >
        <View
          className={`${isDark ? 'bg-slate-700' : 'bg-indigo-50'} rounded-2xl px-3 py-4`}
          style={{ minHeight: 320, justifyContent: 'space-between' }}
        >
          {/* Heart Icon */}
          <View className="items-center mb-1">
            <HeartIcon width={40} height={40} color={isDark ? '#CBD5E1' : '#1e1b4b'} />
          </View>

          {/* Title */}
          <Text
            className={`${isDark ? 'text-slate-100' : 'text-indigo-950'} mb-1`}
            style={{ fontWeight: '700', fontSize: 16, lineHeight: 22, textAlign: 'center' }}
          >
            {t(item.titleKey)}
          </Text>

          {/* Description */}
          <Text
            className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            style={{ fontWeight: '500', fontSize: 14, lineHeight: 20, marginBottom: 16 }}
          >
            {t(item.descriptionKey)}
          </Text>

          {/* Challenge Box */}
          <View className={`${item.bgColor} rounded-xl p-1 flex-row justify-between items-center`}>
            <View className="flex-1 p-3">
              <Text
                className={`${isDark ? 'text-slate-100' : 'text-indigo-950'}`}
                style={{ fontWeight: '700', fontSize: 14, lineHeight: 18 }}
              >
                {t(item.challengeKey)}
              </Text>
              <Text
                className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                style={{ fontWeight: '500', fontSize: 12, lineHeight: 16 }}
              >
                {t(item.daysKey)}
              </Text>
            </View>
            <View className="ml-3 mr-1">
              <item.icon width={48} height={48} color={isDark ? '#CBD5E1' : '#1e1b4b'} />
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }, [ITEM_WIDTH, isDark, scrollX, t]);

  return (
    <SlideModal visible={visible} onClose={onClose} title={t('cravingSOS.modal.title')} showCloseButton={false}>
      <Text
        className={`${isDark ? 'text-slate-300' : 'text-slate-500'} text-center`}
        style={{ fontSize: 14, lineHeight: 20 }}
      >
        {t('cravingSOS.modal.subtitle')}
      </Text>

      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        pagingEnabled={false}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        getItemLayout={getItemLayout}
        contentContainerStyle={{ paddingHorizontal: SIDE_GUTTER, paddingVertical: 16 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true, listener: () => { if (!hasInteracted) setHasInteracted(true); } }
        )}
        scrollEventThrottle={32}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
          const boundedIndex = Math.max(0, Math.min(index, data.length - 1));
          setActiveIndex(boundedIndex);
        }}
        renderItem={renderItem}
      />

      {/* Indicators */}
      <View className="flex-row justify-center">
        <View className="flex-row bg-indigo-50 h-4 rounded-full px-1 py-1 gap-1">
          {data.map((_, i) => {
            const position = Animated.divide(scrollX, ITEM_WIDTH);
            const scale = position.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [1, 1.2, 1],
              extrapolate: 'clamp',
            });
            const opacity = position.interpolate({
              inputRange: [i - 0.5, i, i + 0.5],
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 4,
                  backgroundColor: '#312e81',
                  marginHorizontal: 0.5,
                  transform: [{ scale }],
                  opacity,
                }}
              />
            );
          })}
        </View>
      </View>

      {/* SlideModal Actions */}
      <View className="flex-row mt-4 justify-center items-center relative rounded-3xl overflow-hidden -ml-5 -mr-5 -mb-10" style={{ 
        height: 122, 
        gap: 8
      }}>
          
        {/* Background BreathIcon */}
        <View className="absolute -bottom-10">
          <BreathIcon 
            width={width} 
            height={400} 
            color={isDark ? '#CBD5E1' : '#1e1b4b'} 
            style={{
              opacity: 0.8,
            }}
          />

        </View>
          
          {/* Action Buttons */}
          <View className="flex-row items-center gap-5 justify-center w-full">
            {/* Close Button */}
              <Pressable 
                className={`w-15 h-15 rounded-2xl justify-center items-center іelf-center ${
                  isDark ? 'bg-slate-700' : 'bg-indigo-50'
                }`} 
                onPress={onClose}
              >
                <Text className={`text-2xl rounded-2xl px-4 py-2 font-bold ${isDark ? 'text-slate-50 bg-slate-700' : 'text-indigo-900 bg-indigo-50'}`}>✕</Text>
              </Pressable>
            
            {/* Take 5 Breaths Button */}
            <Pressable 
              className="bg-indigo-600 rounded-2xl justify-center items-center px-6 py-2 w-1/2"
              onPress={onStartBreathing}
            >
              <Text className="text-white font-bold text-lg">Take 5 breaths</Text>
            </Pressable>
            
            {/* Smoke Button */}
            <Pressable 
               className={`w-15 h-15 rounded-2xl justify-center items-center align-middle p-2 pr-3 self-center bg-red-500`} 
              onPress={onClose}
            >
              <SmokeIcon width={24} height={24} color={'#CBD5E1' } />
            </Pressable>
          </View>
        </View>
    </SlideModal>
  );
};

export default CravingSOSModal;

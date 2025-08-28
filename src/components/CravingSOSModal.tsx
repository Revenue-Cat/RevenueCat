import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Animated, Dimensions, Pressable, Text, View } from 'react-native';
import SlideModal from './SlideModal';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { strategies } from '../data/strategiesData';
import HeartIcon from '../assets/strategies/heart.svg';

interface CravingSOSModalProps {
  visible: boolean;
  onClose: () => void;
  onStartBreathing: () => void;
}

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

  // Use original data instead of tripling it for better performance
  const data = useMemo(() => strategies, []);

  // Reset to first card when modal becomes visible
  useEffect(() => {
    if (visible) {
      setActiveIndex(0);
      scrollX.setValue(0);
      // Add a small delay to ensure the modal is fully rendered
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 5);
    }
  }, [visible, scrollX]);

  return (
    <SlideModal visible={visible} onClose={onClose} title="Want to smoke?" showCloseButton>
      <Text
        className={`${isDark ? 'text-slate-300' : 'text-slate-500'} text-center`}
        style={{ fontSize: 14, lineHeight: 20 }}
      >
        Use breathing exercises or quick tips
      </Text>

      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        pagingEnabled={false}
        initialNumToRender={3}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews
        contentContainerStyle={{ paddingHorizontal: SIDE_GUTTER, paddingVertical: 16 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={32}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
          setActiveIndex(index);
        }}
        renderItem={useCallback(({ item, index }: { item: any; index: number }) => {
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
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [9, 0, 9],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={{
                width: ITEM_WIDTH,
                transform: [{ scale }, { translateY }],
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
        }, [ITEM_WIDTH, isDark, scrollX, t])}
      />

      {/* Indicators */}
      <View className="flex-row justify-center">
        <View className="flex-row bg-indigo-50 h-4 rounded-full px-1 py-1 gap-1">
          {strategies.map((_, i) => {
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
    </SlideModal>
  );
};

export default CravingSOSModal;
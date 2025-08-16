// src/components/BuddyCarousel.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from "react-native";
import { FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { buddyAssets, BuddyKey, SexKey } from "../assets/buddies";

const { width: SCREEN_W } = Dimensions.get("window");

// Image + card geometry
const IMG_W = 132;
const IMG_H = 168;
const IMG_H_EXPANDED = IMG_H * 1.5; // 252
const CARD_PAD = 8;
const ITEM_W = IMG_W + CARD_PAD * 2; // blue card width
const ITEM_H = 168;
const GUTTER = 24;

// Each snap "cell" = card + gutter
const CELL_W = ITEM_W + GUTTER;

// Header/footer spacer so the first card is centered with side peeks
const SIDE_SPACING = Math.max(0, (SCREEN_W - ITEM_W) / 2);

// Infinite loop
const LOOP_MULTIPLIER = 800;

export type Buddy = {
  id: BuddyKey;
  name: string;
  description: string;
};

type Props = {
  data: Buddy[];
  sex: SexKey; // 'm' | 'w'
  isDark?: boolean;
  onChange?: (activeBaseIndex: number) => void; // normalized index in `data`
};

export default function BuddyCarousel({
  data,
  sex,
  isDark = false,
  onChange,
}: Props) {
  const listRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Hide badge while scrolling/settling to avoid flicker
  const [isSettling, setIsSettling] = useState(false);
  const settleTimer = useRef<NodeJS.Timeout | null>(null);
  const hideBadgeNow = () => {
    setIsSettling(true);
    if (settleTimer.current) clearTimeout(settleTimer.current);
  };
  const showBadgeSoon = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => setIsSettling(false), 150);
  };
  useEffect(() => () => settleTimer.current && clearTimeout(settleTimer.current), []);

  // Long list for infinite feel
  const extended = useMemo(
    () => Array.from({ length: data.length * LOOP_MULTIPLIER }, (_, i) => data[i % data.length]),
    [data]
  );

  // Start centered on the first buddy but deep in the list
  const mid = Math.floor(LOOP_MULTIPLIER / 2);
  const startIndex = mid * data.length;

  const [centerExtIndex, setCenterExtIndex] = useState(startIndex);

  // Report normalized base index to parent
  useEffect(() => {
    const base = ((centerExtIndex % data.length) + data.length) % data.length;
    onChange?.(base);
  }, [centerExtIndex, data.length, onChange]);

  // Offset/index math (no SIDE_SPACING here — header/footer provide centering)
  const getItemLayout = (_: any, index: number) => ({
    length: CELL_W,
    offset: CELL_W * index,
    index,
  });

  const onScrollToIndexFailed = (info: any) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: info.index, animated: false });
    });
  };

  const handleMomentumBegin = () => {
    hideBadgeNow();
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / CELL_W);
    if (i !== centerExtIndex) setCenterExtIndex(i);

    // Re-center near middle to keep the infinite illusion
    const cycle = data.length;
    const center = mid * cycle;
    if (Math.abs(i - center) > cycle * 6) {
      const normalized = center + (i % cycle);
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: normalized, animated: false });
        setCenterExtIndex(normalized);
        showBadgeSoon();
      });
    } else {
      showBadgeSoon();
    }
  };

  const scrollTo = (i: number) => {
    hideBadgeNow();
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  const renderItem = ({ index }: { item: Buddy; index: number }) => {
    const isCenter = index === centerExtIndex;
    const baseIdx = ((index % data.length) + data.length) % data.length;
    const src = buddyAssets[data[baseIdx].id][sex];

    // Center offset in scroll space
    const centerOffset = index * CELL_W;

    // ±35° rotation for neighbors, 0° for center
    const rotate = scrollX.interpolate({
      inputRange: [centerOffset - CELL_W, centerOffset, centerOffset + CELL_W],
      outputRange: ["35deg", "0deg", "-35deg"],
      extrapolate: "clamp",
    });

    // Side cards down by 30px, center at 0
    const translateY = scrollX.interpolate({
      inputRange: [centerOffset - CELL_W, centerOffset, centerOffset + CELL_W],
      outputRange: [60, 0, 60],
      extrapolate: "clamp",
    });

    // Opacity: unselected 0.5, center 1
    const opacity = scrollX.interpolate({
      inputRange: [centerOffset - CELL_W, centerOffset, centerOffset + CELL_W],
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });

    const showBadge = isCenter && !isSettling;

    return (
      <View style={{ width: CELL_W, overflow: "visible" }} className="items-center">
        <Pressable onPress={() => scrollTo(index)}>
          {/* OUTER wrapper: allow badge to hang; inner rotated/masked */}
          <View className="relative" style={{ width: ITEM_W, height: ITEM_H, overflow: "visible" as any }}>
            {/* Rotated + translated MASK: clips the tall image */}
            <Animated.View
              className="rounded-3xl bg-blue-300"
              style={{
                width: ITEM_W,
                height: ITEM_H,
                overflow: "hidden",
                opacity,
                transform: [{ translateY }, { rotate }],
              }}
            >
              <Image
                source={src}
                resizeMode="contain"
                className="absolute top-[10px] self-center rounded-3xl"
                style={{ width: IMG_W, height: IMG_H_EXPANDED }}
              />
            </Animated.View>

            {/* Selected badge (not rotated) */}
            {showBadge && (
              <View
                className="bg-green-500 rounded-full p-1 absolute left-1/2 -translate-x-1/2"
                style={{ width: 32, height: 32, bottom: -16 }}
              >
                <Ionicons name="checkmark" size={24} color="#fff" />
              </View>
            )}
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <Animated.FlatList
      ref={listRef}
      data={extended}
      keyExtractor={(_, i) => `buddy-${i}`}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      // Center first card via header/footer spacers (these create side peeks)
      ListHeaderComponent={<View style={{ width: SIDE_SPACING }} />}
      ListFooterComponent={<View style={{ width: SIDE_SPACING }} />}
      // Snap card-by-card
      snapToInterval={CELL_W}
      snapToAlignment="start"
      decelerationRate="fast"
      disableIntervalMomentum
      bounces={false}
      // Start deep near the middle for "infinite"
      initialScrollIndex={startIndex}
      getItemLayout={getItemLayout}
      onScrollToIndexFailed={onScrollToIndexFailed}
      onMomentumScrollBegin={handleMomentumBegin}
      onMomentumScrollEnd={handleMomentumEnd}
      // Rotation/translate driver
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      // leave space for badge overhang
      style={{ marginBottom: 16, overflow: "visible" }}
      removeClippedSubviews={false}
    />
  );
}

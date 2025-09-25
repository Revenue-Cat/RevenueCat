// src/utils/gridUtils.tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import CoinIcon from '../assets/icons/coins.svg';
import LockLight from '../assets/icons/lock.svg';

export interface GridItemProps {
  item: any;
  isOwned: boolean;
  isSelected: boolean;
  onPress: () => void;
  type: 'buddy' | 'scene' | 'placeholder-buddy' | 'placeholder-scene';
  isDark: boolean;
  className?: string;
  itemSize?: number;
}

export interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  columns?: number;
}

/**
 * Reusable grid item component for Shop screens
 * Handles different item types: buddy, scene, placeholder-buddy, placeholder-scene
 */
export const GridItem: React.FC<GridItemProps> = ({
  item,
  isOwned,
  isSelected,
  onPress,
  type,
  isDark,
  className = "w-1/4",
  itemSize = 80
}) => {
  const getItemContent = () => {
    switch (type) {
      case 'buddy':
        return (
          <LottieView
            source={item.icon}
            autoPlay={isSelected}
            loop={isSelected}
            {...(!isSelected ? ({ progress: 0 } as any) : {})}
            style={{ 
              width: itemSize, 
              height: itemSize + 30, // Original height behavior (taller than container)
              marginTop: -5 
            }}
            resizeMode="contain"
            enableMergePathsAndroidForKitKatAndAbove
          />
        );
      case 'scene':
        return (
          <Image
            source={item.background}
            style={{ 
              width: itemSize, 
              height: itemSize, 
              borderRadius: gridStyles.borderRadius.value // Use consistent border radius
            }}
            resizeMode="cover"
          />
        );
      case 'placeholder-buddy':
        return (
          <View
            style={{
              width: itemSize,
              height: itemSize + 30, // Original height behavior (taller than container)
              marginTop: -5,
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            {React.createElement(item.icon, {
              width: itemSize + 15, // Original size behavior
              height: itemSize + 15,
              color: isSelected ? "#22C55E" : "#FFFFFF33",
            })}
          </View>
        );
      case 'placeholder-scene':
        return (
          <View
            style={{
              width: itemSize,
              height: itemSize,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.createElement(item.icon, {
              width: itemSize,
              height: itemSize,
              color: isSelected ? "#22C55E" : "#FFFFFF33",
            })}
          </View>
        );
      default:
        return null;
    }
  };

  const getPriceOverlay = () => {
    if (isOwned) return null;
    
    if (type === 'placeholder-buddy' || type === 'placeholder-scene') {
      return (
        <View className="absolute top-1 right-1 z-10 rounded-3xl bg-black/40 p-1.5">
          <LockLight width={12} height={12} color="white" opacity={0.5} />
        </View>
      );
    }
    
    return (
      <View className="absolute bottom-1 left-4 z-10 rounded-3xl bg-black/70 px-2 py-0.5">
        <View className="flex-row items-center justify-center">
          <Text className="text-s font-bold text-amber-500 gap-2">
            {item.coin}
          </Text>
          <CoinIcon width={16} height={16} className="ml-1" />
        </View>
      </View>
    );
  };

  return (
    <Pressable
      key={item.id}
      className={className}
      onPress={onPress}
      style={{ width: itemSize, height: itemSize }} // Ensure consistent sizing
    >
      <View
        className={`items-center rounded-xl relative ${
          isDark ? "bg-slate-700/50" : "bg-white/10"
        }`}
        style={{ width: itemSize, height: itemSize }} // Consistent container size
      >
        <View 
          className="overflow-hidden relative"
          style={{ width: itemSize, height: itemSize }} // Consistent content area
        >
          {getItemContent()}
          {getPriceOverlay()}
        </View>

        {isSelected && (
          <View className="absolute top-1 right-1">
            <Ionicons
              className="bg-green-500 rounded-full p-0.5 bold"
              name="checkmark"
              size={18}
              color="white"
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

/**
 * Reusable grid container component
 */
export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  className = "w-full flex-row flex-wrap",
  columns = 4
}) => {
  return (
    <View 
      className={className}
      style={{ gap: 2 }} // 2px gap between items
    >
      {children}
    </View>
  );
};

/**
 * Grid styles configuration
 */
export const gridStyles = {
  container: "w-full flex-row flex-wrap",
  item: {
    default: "w-1/4", // No padding, gap handles spacing
    small: "w-1/5",
    large: "w-1/3",
  },
  background: {
    dark: "bg-slate-700/50",
    light: "bg-white/10",
  },
  borderRadius: {
    container: "rounded-xl", // 12px border radius
    value: 12, // Consistent border radius value
  },
  overlay: {
    price: "absolute bottom-1 left-4 z-10 rounded-3xl bg-black/70 px-2 py-0.5",
    lock: "absolute top-1 right-1 z-10 rounded-3xl bg-black/40 p-1.5",
    selected: "absolute top-1 right-1",
  },
  text: {
    price: "text-s font-bold text-amber-500 gap-2",
  },
  icon: {
    coin: { width: 16, height: 16 },
    lock: { width: 12, height: 12 },
    checkmark: { size: 18 },
  }
};

/**
 * Helper function to create grid items with consistent styling
 */
export const createGridItem = (
  item: any,
  isOwned: boolean,
  isSelected: boolean,
  onPress: () => void,
  type: 'buddy' | 'scene' | 'placeholder-buddy' | 'placeholder-scene',
  isDark: boolean,
  options?: {
    className?: string;
    itemSize?: number;
  }
) => {
  return (
    <GridItem
      item={item}
      isOwned={isOwned}
      isSelected={isSelected}
      onPress={onPress}
      type={type}
      isDark={isDark}
      className={options?.className || gridStyles.item.default}
      itemSize={options?.itemSize || 80}
    />
  );
};

/**
 * Helper function to render a complete grid
 */
export const renderGrid = (
  items: any[],
  isOwnedItems: string[],
  selectedItemId: string,
  onItemPress: (item: any) => void,
  type: 'buddy' | 'scene' | 'placeholder-buddy' | 'placeholder-scene',
  isDark: boolean,
  options?: {
    className?: string;
    itemSize?: number;
  }
) => {
  return (
    <GridContainer className={gridStyles.container}>
      {items.map((item) => {
        const isOwned = isOwnedItems.includes(item.id);
        const isSelected = selectedItemId === item.id;
        
        return createGridItem(
          item,
          isOwned,
          isSelected,
          () => onItemPress(item),
          type,
          isDark,
          options
        );
      })}
    </GridContainer>
  );
};

/**
 * Helper function to render a combined grid with regular and placeholder items
 */
export const renderCombinedGrid = (
  regularItems: any[],
  placeholderItems: any[],
  isOwnedItems: string[],
  selectedItemId: string,
  onItemPress: (item: any) => void,
  regularType: 'buddy' | 'scene',
  isDark: boolean,
  options?: {
    className?: string;
    itemSize?: number;
  }
) => {
  const allItems = [...regularItems, ...placeholderItems];
  
  return (
    <View style={{ alignSelf: 'center' }}>
      <GridContainer className={gridStyles.container}>
        {allItems.map((item) => {
          const isOwned = isOwnedItems.includes(item.id);
          const isSelected = selectedItemId === item.id;
          const isPlaceholder = placeholderItems.some(pi => pi.id === item.id);
          const type = isPlaceholder ? `placeholder-${regularType}` as const : regularType;
          
          return createGridItem(
            item,
            isOwned,
            isSelected,
            () => onItemPress(item),
            type,
            isDark,
            options
          );
        })}
      </GridContainer>
    </View>
  );
};

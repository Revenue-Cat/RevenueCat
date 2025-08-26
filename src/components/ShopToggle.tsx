import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import PaintIcon from '../assets/shop/scenes/paint.svg';
import FluffyIcon from '../assets/shop/buddies/fluffy.svg';

interface ShopToggleProps {
  scrollY: Animated.Value;
  isScenesSelected: boolean;
  setIsScenesSelected: (isScenes: boolean) => void;
}

const ShopToggle: React.FC<ShopToggleProps> = ({ 
  scrollY,
  isScenesSelected, 
  setIsScenesSelected 
}) => {
  const { t } = useTranslation();

  // Use the same transform as the Buddy icon
  const transform = useMemo(() => [{
    translateY: scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [0, -70],
      extrapolate: 'clamp'
    })
  }], [scrollY]);

  const handleBuddiesPress = useCallback(() => {
    setIsScenesSelected(false);
  }, [setIsScenesSelected]);

  const handleScenesPress = useCallback(() => {
    setIsScenesSelected(true);
  }, [setIsScenesSelected]);

  return (
    <Animated.View style={{ 
      position: 'absolute',
      top: 300,
      left: 0,
      right: 0,
      zIndex: 9999,
      alignItems: 'center',
      justifyContent: 'center',
      transform
    }}>
      <View style={{ 
        flexDirection: 'row', 
        backgroundColor: '#f1f5f9', 
        borderRadius: 16, 
        padding: 2, 
        width: 220, 
        height: 44,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8
      }}>
        <TouchableOpacity 
          style={{ 
            flex: 1,
            backgroundColor: !isScenesSelected ? '#ffffff' : 'transparent',
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            shadowColor: !isScenesSelected ? '#000000' : 'transparent',
            shadowOffset: !isScenesSelected ? { width: 0, height: 1 } : { width: 0, height: 0 },
            shadowOpacity: !isScenesSelected ? 0.1 : 0,
            shadowRadius: !isScenesSelected ? 3 : 0,
            elevation: !isScenesSelected ? 2 : 0
          }}
          onPress={handleBuddiesPress}
          activeOpacity={0.7}
        >
          <FluffyIcon
            color={!isScenesSelected ? '#1E293B' : '#64748B'} 
          />
          <Text style={{ 
            marginLeft: 8,
            fontWeight: '500',
            color: !isScenesSelected ? '#1E293B' : '#64748B'
          }}>
            {t('toggles.buddies')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            flex: 1,
            backgroundColor: isScenesSelected ? '#ffffff' : 'transparent',
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            shadowColor: isScenesSelected ? '#000000' : 'transparent',
            shadowOffset: isScenesSelected ? { width: 0, height: 1 } : { width: 0, height: 0 },
            shadowOpacity: isScenesSelected ? 0.1 : 0,
            shadowRadius: isScenesSelected ? 3 : 0,
            elevation: isScenesSelected ? 2 : 0
          }}
          onPress={handleScenesPress}
          activeOpacity={0.7}
        >
          <PaintIcon
            color={isScenesSelected ? '#1E293B' : '#64748B'} 
          />
          <Text style={{ 
            marginLeft: 8,
            fontWeight: '500',
            color: isScenesSelected ? '#1E293B' : '#64748B'
          }}>
            {t('toggles.scenes')}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ShopToggle;

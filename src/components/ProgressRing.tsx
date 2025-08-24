import React from 'react';
import { View } from 'react-native';

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  borderColor?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  size, 
  strokeWidth, 
  color,
  borderColor
}) => {
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      {/* Background circle */}
      <View 
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: progress > 0 ? (borderColor || '#374151' ) : 'transparent',
          position: 'absolute',
        }}
      />
      
      {/* Progress indicator - simple border approach */}
      {progress > 0 && (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: progress > 0 ? color : 'transparent',
            borderRightColor: progress > 25 ? color : 'transparent',
            borderBottomColor: progress > 50 ? color : 'transparent',
            borderLeftColor: progress > 75 ? color : 'transparent',
            position: 'absolute',
            transform: [{ rotate: '40deg' }],
          }}
        />
      )}
    </View>
  );
};

export default ProgressRing;

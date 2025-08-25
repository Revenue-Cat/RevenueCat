import React from 'react';
import SlideModal from './SlideModal';
import SceneModalContent from './SceneModalContent';
import SceneModalActions from './SceneModalActions';
import { useApp } from '../contexts/AppContext';

interface SceneModalProps {
  visible: boolean;
  scene: any;
  onClose: () => void;
}

const SceneModal: React.FC<SceneModalProps> = ({ visible, scene, onClose }) => {
  const { userCoins, purchaseItem } = useApp();

  const handlePurchase = () => {
    if (scene) {
      const success = purchaseItem(scene, 'backgrounds');
      if (success) {
        onClose();
      }
    }
  };

  if (!scene) return null;

  return (
     <SlideModal
        visible={visible}
        onClose={onClose}
        title={""}
        showCloseButton={false}
        confirmText="Purchase"
      >
        <SceneModalContent scene={scene} userCoins={userCoins} />
        <SceneModalActions 
          scene={scene} 
          userCoins={userCoins} 
          onPurchase={handlePurchase} 
          onClose={onClose} 
        />
    </SlideModal>
  );
};

export default SceneModal;

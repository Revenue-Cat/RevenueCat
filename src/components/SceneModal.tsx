import React from 'react';
import SlideModal from './SlideModal';
import SceneModalContent from './SceneModalContent';
import SceneModalActions from './SceneModalActions';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from 'react-i18next';

interface SceneModalProps {
  visible: boolean;
  scene: any;
  onClose: () => void;
}

const SceneModal: React.FC<SceneModalProps> = ({ visible, scene, onClose }) => {
  const { t } = useTranslation();
  const { userCoins, purchaseItem } = useApp();

  const handlePurchase = () => {
    if (scene) {
      const success = purchaseItem(scene, 'backgrounds');
      if (success) {
        // Show success feedback
        console.log(`Successfully purchased ${scene.name} for ${scene.coin} coins!`);
        onClose();
      } else {
        // Show error feedback
        console.log('Purchase failed - not enough coins');
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
        confirmText={t('shop.purchase')}
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

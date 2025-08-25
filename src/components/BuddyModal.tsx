import React from 'react';
import SlideModal from './SlideModal';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import BuddyModalContent from './BuddyModalContent';
import BuddyModalActions from './BuddyModalActions';

interface BuddyModalProps {
  visible: boolean;
  buddy: any | null;
  onClose: () => void;
}

const BuddyModal: React.FC<BuddyModalProps> = ({
  visible,
  buddy,
  onClose,
}) => {
  const { t } = useTranslation();
  const { userCoins, purchaseItem } = useApp();

  const handlePurchase = () => {
    if (buddy) {
      const success = purchaseItem(buddy, 'buddies');
      if (success) {
        // Show success feedback
        console.log(`Successfully purchased ${buddy.name} for ${buddy.coin} coins!`);
        onClose();
      } else {
        // Show error feedback
        console.log('Purchase failed - not enough coins');
      }
    }
  };

  if (!buddy) return null;

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={""}
      showCloseButton={false}
      confirmText={t('shop.purchase')}
    >
      <BuddyModalContent
        buddy={buddy}
        userCoins={userCoins}
      />
      
      <BuddyModalActions
        buddy={buddy}
        userCoins={userCoins}
        onPurchase={handlePurchase}
        onClose={onClose}
      />
    </SlideModal>
  );
};

export default BuddyModal;

import React from 'react';
import SlideModal from './SlideModal';
import { useApp } from '../contexts/AppContext';
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
  const { userCoins, purchaseItem } = useApp();

  if (!buddy) return null;

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={""}
      showCloseButton={false}
      confirmText="Purchase"
    >
      <BuddyModalContent
        buddy={buddy}
        userCoins={userCoins}
      />
      
      <BuddyModalActions
        buddy={buddy}
        userCoins={userCoins}
        onPurchase={() => purchaseItem(buddy.id, 'character')}
        onClose={onClose}
      />
    </SlideModal>
  );
};

export default BuddyModal;

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Coins, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface ShopItem {
  id: string;
  emoji: string;
  name: string;
  price: number;
  owned: boolean;
  gradient?: string;
}

interface PurchaseDrawerProps {
  selectedItem: ShopItem | null;
  onClose: () => void;
  itemType: "characters" | "backgrounds";
}

const PurchaseDrawer = ({
  selectedItem,
  onClose,
  itemType,
}: PurchaseDrawerProps) => {
  const {
    userCoins,
    purchaseItem,
    setSelectedCharacter,
    setSelectedBackground,
    setShowCoinPurchase,
  } = useApp();

  const handlePurchase = (item: ShopItem) => {
    const success = purchaseItem(item, itemType);
    if (success) {
      onClose();
      // Auto-select the purchased item
      if (itemType === "characters") {
        setSelectedCharacter(item);
      } else if (itemType === "backgrounds") {
        setSelectedBackground(item);
      }
    } else {
      setShowCoinPurchase(true);
      onClose();
    }
  };

  const getDescription = (item: ShopItem) => {
    if (itemType === "characters") {
      return "Stay motivated on your quit journey with this awesome companion! 🎯";
    } else {
      return "Transform your app with this beautiful background theme! ✨";
    }
  };

  return (
    <Drawer open={!!selectedItem} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        {selectedItem && (
          <div className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coins className="w-5 h-5" />
                <span className="font-bold">{userCoins}</span>
              </div>

              <h3 className="text-lg font-semibold mb-2">
                Buy {selectedItem.name}
              </h3>

              {itemType === "characters" ? (
                <div className="text-6xl mb-4">{selectedItem.emoji}</div>
              ) : (
                <div
                  className={`w-24 h-16 rounded-lg mx-auto mb-4 ${selectedItem.gradient}`}
                ></div>
              )}

              <div className="mb-4">
                <h4 className="font-semibold">{selectedItem.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {getDescription(selectedItem)}
                </p>
              </div>

              <Button
                onClick={() => handlePurchase(selectedItem)}
                className="w-full mb-4 bg-foreground text-background hover:bg-foreground/90"
                disabled={userCoins < selectedItem.price}
              >
                <span className="flex items-center gap-2">
                  Buy for <Coins className="w-4 h-4" /> {selectedItem.price}
                </span>
              </Button>

              {userCoins < selectedItem.price && (
                <p className="text-s text-destructive mb-4">
                  Not enough coins! Need {selectedItem.price - userCoins} more.
                </p>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="mx-auto"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default PurchaseDrawer;

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Coins, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface CoinPackage {
  amount: number;
  price: string;
  popular?: boolean;
  strikethrough?: string;
}

const CoinPurchaseDrawer = () => {
  const { showCoinPurchase, setShowCoinPurchase, userCoins, setUserCoins, selectedCharacter } = useApp();

  const coinPackages: CoinPackage[] = [
    { amount: 100, price: "2.99 USD" },
    { amount: 500, price: "5.99 USD", popular: true, strikethrough: "7.99 USD" },
    { amount: 1000, price: "10.99 USD", strikethrough: "14.99 USD" }
  ];

  const handleCoinPurchase = (amount: number) => {
    setUserCoins(userCoins + amount);
    setShowCoinPurchase(false);
  };

  return (
    <Drawer open={showCoinPurchase} onOpenChange={setShowCoinPurchase}>
      <DrawerContent className="max-h-[90vh]">
        <div className="p-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-coin-gold/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">{selectedCharacter.emoji}</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4" />
                <span className="font-bold">{userCoins}</span>
              </div>
            </div>
          </div>

          <h3 className="text-center font-semibold mb-6">Get More Buddy Coins</h3>

          <div className="space-y-3 mb-6">
            {coinPackages.map((pkg, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  pkg.popular ? "bg-primary/10 border-primary" : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => handleCoinPurchase(pkg.amount)}
              >
                {pkg.popular && (
                  <div className="text-xs bg-foreground text-background px-2 py-1 rounded mb-2 w-fit">
                    Popular ✓
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    <span className="font-semibold">+{pkg.amount} Buddy coins</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{pkg.price}</div>
                    {pkg.strikethrough && (
                      <div className="text-xs text-muted-foreground line-through">
                        {pkg.strikethrough}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCoinPurchase(false)}
            className="mx-auto block"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CoinPurchaseDrawer;
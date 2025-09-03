import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Coins, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ShopItem {
  id: string;
  emoji: string;
  name: string;
  price: number;
  owned: boolean;
  isNew?: boolean;
}

interface CoinPackage {
  amount: number;
  price: string;
  popular?: boolean;
  strikethrough?: string;
}

const Shop = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showCoinPurchase, setShowCoinPurchase] = useState(false);
  const [userCoins] = useState(100);

  const characters: ShopItem[] = [
    { id: "1", emoji: "🦫", name: "Chill Capybar", price: 0, owned: true },
    { id: "2", emoji: "🐨", name: "Zen Koala", price: 150, owned: false },
    { id: "3", emoji: "🦥", name: "Slow Sloth", price: 200, owned: false },
    { id: "4", emoji: "🐧", name: "Cool Penguin", price: 100, owned: false },
    { id: "5", emoji: "🐨", name: "Sleepy Koala", price: 100, owned: false },
    { id: "6", emoji: "🐼", name: "Panda Bear", price: 200, owned: false },
    {
      id: "7",
      emoji: "🦉",
      name: "Wise Owl",
      price: 100,
      owned: false,
      isNew: true,
    },
    {
      id: "8",
      emoji: "🦆",
      name: "Duck Friend",
      price: 150,
      owned: false,
      isNew: true,
    },
  ];

  const backgrounds: ShopItem[] = [
    { id: "1", emoji: "🌅", name: "Sunrise", price: 50, owned: false },
    { id: "2", emoji: "🌊", name: "Ocean", price: 100, owned: false },
    { id: "3", emoji: "🏔️", name: "Mountains", price: 150, owned: false },
    { id: "4", emoji: "🌲", name: "Forest", price: 200, owned: false },
  ];

  const accessories: ShopItem[] = [
    { id: "1", emoji: "🎩", name: "Top Hat", price: 50, owned: false },
    { id: "2", emoji: "👓", name: "Glasses", price: 75, owned: false },
    { id: "3", emoji: "🎪", name: "Party Hat", price: 100, owned: false },
    { id: "4", emoji: "⚡", name: "Lightning", price: 300, owned: false },
  ];

  const coinPackages: CoinPackage[] = [
    { amount: 100, price: "2.99 USD" },
    {
      amount: 500,
      price: "5.99 USD",
      popular: true,
      strikethrough: "7.99 USD",
    },
    { amount: 1000, price: "10.99 USD", strikethrough: "14.99 USD" },
  ];

  const handleItemClick = (item: ShopItem) => {
    if (item.owned || item.price === 0) return;
    setSelectedItem(item);
  };

  const handlePurchase = (item: ShopItem) => {
    if (userCoins < item.price) {
      setShowCoinPurchase(true);
    } else {
      // Handle purchase logic
      setSelectedItem(null);
    }
  };

  const renderItemGrid = (items: ShopItem[]) => (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className={`p-4 text-center cursor-pointer transition-colors relative ${
            item.owned
              ? "bg-buddy-accent border-buddy-primary"
              : "hover:bg-surface-light"
          }`}
          onClick={() => handleItemClick(item)}
        >
          {item.isNew && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-s px-2 py-1 rounded">
              New
            </div>
          )}
          <div className="text-4xl mb-2">{item.emoji}</div>
          <div className="text-sm font-medium text-foreground mb-1">
            {item.name}
          </div>
          <div className="text-s text-muted-foreground flex items-center justify-center gap-1">
            {item.owned ? (
              "Owned"
            ) : item.price === 0 ? (
              "Free"
            ) : (
              <>
                <Coins className="w-3 h-3" />
                {item.price}
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold">Shop</h1>
          <div className="flex items-center gap-2 bg-coin-gold/20 px-3 py-1 rounded-full">
            <Coins className="w-4 h-4 text-coin-gold" />
            <span className="font-bold text-sm">{userCoins}</span>
          </div>
        </div>

        {/* Character Preview */}
        <div className="text-center mb-6">
          <div className="text-8xl mb-2">🦫</div>
        </div>

        {/* Shop Tabs */}
        <Tabs defaultValue="characters">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>

          <TabsContent value="characters" className="mt-4">
            {renderItemGrid(characters)}
          </TabsContent>

          <TabsContent value="backgrounds" className="mt-4">
            {renderItemGrid(backgrounds)}
          </TabsContent>

          <TabsContent value="accessories" className="mt-4">
            {renderItemGrid(accessories)}
          </TabsContent>
        </Tabs>
      </div>

      {/* Purchase Item Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-sm mx-auto">
          {selectedItem && (
            <div className="text-center p-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coins className="w-5 h-5" />
                <span className="font-bold">{userCoins}</span>
              </div>

              <h3 className="text-lg font-semibold mb-2">
                Buy an octopus that is not simple
              </h3>

              <div className="text-6xl mb-4">{selectedItem.emoji}</div>

              <div className="mb-4">
                <h4 className="font-semibold">{selectedItem.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Stays calm when cravings creep in — too chill to care, too
                  lazy to light up. 😎🦫
                </p>
              </div>

              <Button
                onClick={() => handlePurchase(selectedItem)}
                className="w-full mb-4 bg-foreground text-background hover:bg-foreground/90"
              >
                <span className="flex items-center gap-2">
                  Buy for <Coins className="w-4 h-4" /> {selectedItem.price}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedItem(null)}
                className="mx-auto"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Coin Purchase Modal */}
      <Dialog open={showCoinPurchase} onOpenChange={setShowCoinPurchase}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-coin-gold/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🦫</span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  <span className="font-bold">{userCoins}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {coinPackages.map((pkg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    pkg.popular
                      ? "bg-primary/10 border-primary"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {pkg.popular && (
                    <div className="text-s bg-foreground text-background px-2 py-1 rounded mb-2 w-fit">
                      Popular ✓
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      <span className="font-semibold">
                        +{pkg.amount} Buddy coins
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{pkg.price}</div>
                      {pkg.strikethrough && (
                        <div className="text-s text-muted-foreground line-through">
                          {pkg.strikethrough}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-center font-semibold mb-4">
              Buy an octopus that is not simple
            </h3>

            <Button className="w-full mb-4 bg-foreground text-background hover:bg-foreground/90">
              <span className="flex items-center gap-2">
                Buy for <Coins className="w-4 h-4" /> 150
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCoinPurchase(false)}
              className="mx-auto block"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shop;

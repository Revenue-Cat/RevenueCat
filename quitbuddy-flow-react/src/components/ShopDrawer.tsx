import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ArrowLeft, Coins, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

interface ShopItem {
  id: string;
  emoji: string;
  name: string;
  price: number;
  owned: boolean;
  isNew?: boolean;
  gradient?: string;
}

const ShopDrawer = () => {
  const { 
    showShop, 
    setShowShop, 
    userCoins, 
    selectedCharacter,
    selectedBackground,
    ownedCharacters,
    ownedBackgrounds,
    ownedAccessories,
    purchaseItem,
    setSelectedCharacter,
    setSelectedBackground,
    selectedShopTab,
    setSelectedShopTab,
    setShowCoinPurchase
  } = useApp();
  
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const characters: ShopItem[] = [
    { id: "1", emoji: "🦫", name: "Chill Capybara", price: 0, owned: ownedCharacters.includes("1") },
    { id: "2", emoji: "🐨", name: "Zen Koala", price: 150, owned: ownedCharacters.includes("2") },
    { id: "3", emoji: "🦥", name: "Slow Sloth", price: 200, owned: ownedCharacters.includes("3") },
    { id: "4", emoji: "🐧", name: "Cool Penguin", price: 100, owned: ownedCharacters.includes("4") },
    { id: "5", emoji: "🐼", name: "Panda Bear", price: 200, owned: ownedCharacters.includes("5") },
    { id: "6", emoji: "🦉", name: "Wise Owl", price: 100, owned: ownedCharacters.includes("6"), isNew: true },
    { id: "7", emoji: "🦆", name: "Duck Friend", price: 150, owned: ownedCharacters.includes("7"), isNew: true }
  ];

  const backgrounds: ShopItem[] = [
    { id: "default", emoji: "🌅", name: "Default", price: 0, owned: ownedBackgrounds.includes("default"), gradient: "bg-gradient-to-br from-blue-50 to-indigo-100" },
    { id: "1", emoji: "🌅", name: "Sunset", price: 50, owned: ownedBackgrounds.includes("1"), gradient: "bg-gradient-to-br from-orange-400 to-pink-500" },
    { id: "2", emoji: "🌊", name: "Ocean", price: 100, owned: ownedBackgrounds.includes("2"), gradient: "bg-gradient-to-br from-blue-400 to-cyan-500" },
    { id: "3", emoji: "🌲", name: "Forest", price: 150, owned: ownedBackgrounds.includes("3"), gradient: "bg-gradient-to-br from-green-400 to-emerald-600" },
    { id: "4", emoji: "💜", name: "Purple", price: 200, owned: ownedBackgrounds.includes("4"), gradient: "bg-gradient-to-br from-purple-400 to-pink-600" },
    { id: "5", emoji: "🌑", name: "Dark", price: 250, owned: ownedBackgrounds.includes("5"), gradient: "bg-gradient-to-br from-gray-800 to-gray-900" }
  ];

  const accessories: ShopItem[] = [
    { id: "1", emoji: "🎩", name: "Top Hat", price: 50, owned: ownedAccessories.includes("1") },
    { id: "2", emoji: "👓", name: "Glasses", price: 75, owned: ownedAccessories.includes("2") },
    { id: "3", emoji: "🎪", name: "Party Hat", price: 100, owned: ownedAccessories.includes("3") },
    { id: "4", emoji: "⚡", name: "Lightning", price: 300, owned: ownedAccessories.includes("4") }
  ];

  const handleItemClick = (item: ShopItem) => {
    if (item.owned && selectedShopTab === 'characters') {
      setSelectedCharacter(item);
      setShowShop(false);
      return;
    }
    
    if (item.owned && selectedShopTab === 'backgrounds') {
      setSelectedBackground(item);
      setShowShop(false);
      return;
    }
    
    if (item.owned || item.price === 0) return;
    setSelectedItem(item);
  };

  const handlePurchase = (item: ShopItem) => {
    const success = purchaseItem(item, selectedShopTab);
    if (success) {
      setSelectedItem(null);
      // Auto-select if it's a character or background
      if (selectedShopTab === 'characters') {
        setSelectedCharacter(item);
      } else if (selectedShopTab === 'backgrounds') {
        setSelectedBackground(item);
      }
    } else {
      setShowCoinPurchase(true);
      setSelectedItem(null);
    }
  };

  const getCurrentItems = () => {
    switch (selectedShopTab) {
      case 'characters': return characters;
      case 'backgrounds': return backgrounds;
      case 'accessories': return accessories;
      default: return characters;
    }
  };

  const renderItemGrid = (items: ShopItem[]) => (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => {
        // Recalculate ownership status dynamically
        const isOwned = selectedShopTab === 'characters' ? ownedCharacters.includes(item.id) :
                       selectedShopTab === 'backgrounds' ? ownedBackgrounds.includes(item.id) :
                       ownedAccessories.includes(item.id);
        
        return (
          <Card 
            key={item.id} 
            className={`p-4 text-center cursor-pointer transition-colors relative ${
              isOwned ? "bg-buddy-accent border-buddy-primary" : "hover:bg-surface-light"
            } ${
              (selectedShopTab === 'characters' && item.id === selectedCharacter.id) ||
              (selectedShopTab === 'backgrounds' && item.id === selectedBackground.id)
                ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleItemClick({...item, owned: isOwned})}
          >
          {item.isNew && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              New
            </div>
           )}
           {selectedShopTab === 'backgrounds' && item.gradient ? (
             <div className={`w-full h-8 rounded-md mb-2 mx-auto ${item.gradient}`}></div>
           ) : (
             <div className="text-4xl mb-2">{item.emoji}</div>
           )}
          <div className="text-sm font-medium text-foreground mb-1">{item.name}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              {isOwned ? (
                selectedShopTab === 'characters' && item.id === selectedCharacter.id ? "Selected" :
                selectedShopTab === 'backgrounds' && item.id === selectedBackground.id ? "Selected" :
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
        );
      })}
    </div>
  );

  return (
    <>
      <Drawer open={showShop} onOpenChange={setShowShop}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setShowShop(false)}>
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <DrawerTitle>Shop</DrawerTitle>
              <div 
                className="flex items-center gap-2 bg-coin-gold/20 px-3 py-1 rounded-full cursor-pointer hover:bg-coin-gold/30 transition-colors"
                onClick={() => setShowCoinPurchase(true)}
              >
                <Coins className="w-4 h-4 text-coin-gold" />
                <span className="font-bold text-sm">{userCoins}</span>
              </div>
            </div>
          </DrawerHeader>

          <div className="p-6 overflow-y-auto">
            {/* Character Preview */}
            <div className="text-center mb-6">
              <div className="text-8xl mb-2">{selectedCharacter.emoji}</div>
            </div>

            {/* Shop Tabs */}
            <Tabs value={selectedShopTab} onValueChange={(value) => setSelectedShopTab(value as any)}>
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
        </DrawerContent>
      </Drawer>

      {/* Purchase Item Drawer */}
      <Drawer open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DrawerContent className="max-h-[90vh]">
          {selectedItem && (
            <div className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Coins className="w-5 h-5" />
                  <span className="font-bold">{userCoins}</span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Buy {selectedItem.name}</h3>
                
                <div className="text-6xl mb-4">{selectedItem.emoji}</div>
                
                <div className="mb-4">
                  <h4 className="font-semibold">{selectedItem.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Stays calm when cravings creep in — too chill to care, too lazy to light up. 😎🦫
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
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ShopDrawer;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Coins, Crown, MapPin, Star, Trophy, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import CravingSOS from "./CravingSOS";
import ShopDrawer from "@/components/ShopDrawer";
import CoinPurchaseDrawer from "@/components/CoinPurchaseDrawer";
import PurchaseDrawer from "@/components/PurchaseDrawer";

const Home = () => {
  const navigate = useNavigate();
  const { 
    userCoins, 
    selectedCharacter,
    selectedBackground, 
    ownedCharacters,
    ownedBackgrounds,
    setSelectedCharacter,
    setSelectedBackground,
    setShowCoinPurchase,
    purchaseItem
  } = useApp();
  
  const [selectedPurchaseItem, setSelectedPurchaseItem] = useState<any>(null);
  const [purchaseItemType, setPurchaseItemType] = useState<'characters' | 'backgrounds'>('characters');
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 23,
    minutes: 47,
    seconds: 32
  });
  const [showCravingSOS, setShowCravingSOS] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newSeconds = prev.seconds + 1;
        if (newSeconds >= 60) {
          const newMinutes = prev.minutes + 1;
          if (newMinutes >= 60) {
            const newHours = prev.hours + 1;
            if (newHours >= 24) {
              return {
                days: prev.days + 1,
                hours: 0,
                minutes: 0,
                seconds: 0
              };
            }
            return { ...prev, hours: newHours, minutes: 0, seconds: 0 };
          }
          return { ...prev, minutes: newMinutes, seconds: 0 };
        }
        return { ...prev, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get background gradient based on selected background
  const getBackgroundClass = () => {
    const backgrounds = {
      "default": "bg-gradient-to-br from-blue-50 to-indigo-100",
      "1": "bg-gradient-to-br from-orange-400 to-pink-500",
      "2": "bg-gradient-to-br from-blue-400 to-cyan-500", 
      "3": "bg-gradient-to-br from-green-400 to-emerald-600",
      "4": "bg-gradient-to-br from-purple-400 to-pink-600",
      "5": "bg-gradient-to-br from-gray-800 to-gray-900"
    };
    return backgrounds[selectedBackground.id] || backgrounds["default"];
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()}`}>
      <div className="px-6 py-8 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
            <User className="w-6 h-6" />
          </Button>
          <div 
            className="flex items-center gap-2 bg-coin-gold/20 px-4 py-2 rounded-full cursor-pointer hover:bg-coin-gold/30 transition-colors"
            onClick={() => setShowCoinPurchase(true)}
          >
            <Coins className="w-5 h-5 text-coin-gold" />
            <span className="font-bold text-foreground">{userCoins}</span>
          </div>
        </div>

        {/* Buddy */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-2">
            {selectedCharacter.emoji}
          </div>
          <p className="text-muted-foreground text-sm">
            "You've got this! Every smoke-free moment counts."
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Cigarettes Avoided</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Money Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€23.50</div>
            </CardContent>
          </Card>
        </div>

        {/* Timer */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Smoke-Free Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {timeElapsed.days}d {timeElapsed.hours}h {timeElapsed.minutes}m {timeElapsed.seconds}s
              </div>
              <p className="text-sm text-muted-foreground">Keep going strong!</p>
            </div>
          </CardContent>
        </Card>

        {/* Challenges */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Go one full day without a single puff</span>
                <Badge variant="secondary">+25 coins</Badge>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">18 hours left</p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="achievements" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="achievements" className="mt-4">
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card 
                    key={i} 
                    className="p-4 text-center cursor-pointer hover:bg-surface-light transition-colors"
                    onClick={() => navigate('/achievements')}
                  >
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">Day {i}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="characters" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "1", emoji: "🦫", name: "Chill Capybara", price: 0 },
                  { id: "2", emoji: "🐨", name: "Zen Koala", price: 150 },
                  { id: "3", emoji: "🦥", name: "Slow Sloth", price: 200 },
                  { id: "4", emoji: "🐧", name: "Cool Penguin", price: 100 },
                  { id: "5", emoji: "🐼", name: "Panda Bear", price: 200 },
                  { id: "6", emoji: "🦉", name: "Wise Owl", price: 100 },
                  { id: "7", emoji: "🦆", name: "Duck Friend", price: 150 }
                ].map((character) => {
                  const isOwned = ownedCharacters.includes(character.id);
                  const isSelected = character.id === selectedCharacter.id;
                  
                  return (
                    <Card 
                      key={character.id} 
                      className={`p-4 text-center cursor-pointer transition-colors ${
                        isSelected ? "bg-buddy-accent border-buddy-primary ring-2 ring-primary" : 
                        isOwned ? "bg-buddy-accent border-buddy-primary" : "hover:bg-surface-light"
                      }`}
                      onClick={() => {
                        if (isOwned) {
                          setSelectedCharacter({...character, owned: true});
                        } else {
                          setSelectedPurchaseItem({...character, owned: false});
                          setPurchaseItemType('characters');
                        }
                      }}
                    >
                      <div className="text-4xl mb-2">{character.emoji}</div>
                      <div className="text-sm font-medium text-foreground mb-1">{character.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {isSelected ? "Selected" : isOwned ? "Owned" : 
                         character.price === 0 ? "Free" : `${character.price} coins`}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="backgrounds" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "default", emoji: "🌅", name: "Default", price: 0, gradient: "bg-gradient-to-br from-blue-50 to-indigo-100" },
                  { id: "1", emoji: "🌅", name: "Sunset", price: 50, gradient: "bg-gradient-to-br from-orange-400 to-pink-500" },
                  { id: "2", emoji: "🌊", name: "Ocean", price: 100, gradient: "bg-gradient-to-br from-blue-400 to-cyan-500" },
                  { id: "3", emoji: "🌲", name: "Forest", price: 150, gradient: "bg-gradient-to-br from-green-400 to-emerald-600" },
                  { id: "4", emoji: "💜", name: "Purple", price: 200, gradient: "bg-gradient-to-br from-purple-400 to-pink-600" },
                  { id: "5", emoji: "🌑", name: "Dark", price: 250, gradient: "bg-gradient-to-br from-gray-800 to-gray-900" }
                ].map((background) => {
                  const isOwned = ownedBackgrounds.includes(background.id);
                  const isSelected = background.id === selectedBackground.id;
                  
                  return (
                    <Card 
                      key={background.id} 
                      className={`p-4 text-center cursor-pointer transition-colors ${
                        isSelected ? "bg-buddy-accent border-buddy-primary ring-2 ring-primary" : 
                        isOwned ? "bg-buddy-accent border-buddy-primary" : "hover:bg-surface-light"
                      }`}
                      onClick={() => {
                        if (isOwned) {
                          setSelectedBackground({...background, owned: true});
                        } else {
                          setSelectedPurchaseItem({...background, owned: false});
                          setPurchaseItemType('backgrounds');
                        }
                      }}
                    >
                      <div className={`w-full h-8 rounded-md mb-2 mx-auto ${background.gradient}`}></div>
                      <div className="text-sm font-medium text-foreground mb-1">{background.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {isSelected ? "Selected" : isOwned ? "Owned" : 
                         background.price === 0 ? "Free" : `${background.price} coins`}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Craving SOS Button */}
        <Button 
          onClick={() => setShowCravingSOS(true)}
          className="w-full py-6 text-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Craving SOS
        </Button>
      </div>

      {showCravingSOS && (
        <CravingSOS onClose={() => setShowCravingSOS(false)} />
      )}
      
      <PurchaseDrawer 
        selectedItem={selectedPurchaseItem}
        onClose={() => setSelectedPurchaseItem(null)}
        itemType={purchaseItemType}
      />
      
      <CoinPurchaseDrawer />
    </div>
  );
};

export default Home;
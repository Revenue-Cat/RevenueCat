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
    setShowCoinPurchase
  } = useApp();
  
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

  return (
    <div className="min-h-screen bg-background">
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
                  { id: "1", emoji: "🦫", name: "Chill Capybara" },
                  { id: "2", emoji: "🐨", name: "Zen Koala" },
                  { id: "3", emoji: "🦥", name: "Slow Sloth" },
                  { id: "4", emoji: "🐧", name: "Cool Penguin" },
                  { id: "5", emoji: "🐼", name: "Panda Bear" },
                  { id: "6", emoji: "🦉", name: "Wise Owl" },
                  { id: "7", emoji: "🦆", name: "Duck Friend" }
                ].filter(char => ownedCharacters.includes(char.id)).map((character) => (
                  <Card 
                    key={character.id} 
                    className={`p-4 text-center cursor-pointer transition-colors ${
                      character.id === selectedCharacter.id ? "bg-buddy-accent border-buddy-primary ring-2 ring-primary" : "hover:bg-surface-light"
                    }`}
                    onClick={() => setSelectedCharacter({...character, price: 0, owned: true})}
                  >
                    <div className="text-4xl mb-2">{character.emoji}</div>
                    <div className="text-sm font-medium text-foreground mb-1">{character.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {character.id === selectedCharacter.id ? "Selected" : "Owned"}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="backgrounds" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "default", emoji: "🌅", name: "Default" },
                  { id: "1", emoji: "🌅", name: "Sunrise" },
                  { id: "2", emoji: "🌊", name: "Ocean" },
                  { id: "3", emoji: "🏔️", name: "Mountains" },
                  { id: "4", emoji: "🌲", name: "Forest" }
                ].filter(bg => ownedBackgrounds.includes(bg.id)).map((background) => (
                  <Card 
                    key={background.id} 
                    className={`p-4 text-center cursor-pointer transition-colors ${
                      background.id === selectedBackground.id ? "bg-buddy-accent border-buddy-primary ring-2 ring-primary" : "hover:bg-surface-light"
                    }`}
                    onClick={() => setSelectedBackground({...background, price: 0, owned: true})}
                  >
                    <div className="text-4xl mb-2">{background.emoji}</div>
                    <div className="text-sm font-medium text-foreground mb-1">{background.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {background.id === selectedBackground.id ? "Selected" : "Owned"}
                    </div>
                  </Card>
                ))}
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
      
      <CoinPurchaseDrawer />
    </div>
  );
};

export default Home;
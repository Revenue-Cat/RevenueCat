import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ChevronRight, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import CoinPurchaseDrawer from "@/components/CoinPurchaseDrawer";
import ShopDrawer from "@/components/ShopDrawer";

const Profile = () => {
  const navigate = useNavigate();
  const { userCoins, setShowCoinPurchase, openShopWithTab } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold">Profile</h1>
          <div 
            className="flex items-center gap-2 bg-coin-gold/20 px-3 py-1 rounded-full cursor-pointer hover:bg-coin-gold/30 transition-colors"
            onClick={() => setShowCoinPurchase(true)}
          >
            <Coins className="w-4 h-4 text-coin-gold" />
            <span className="font-bold text-sm">{userCoins}</span>
          </div>
        </div>

        {/* Achievement Preview */}
        <Card className="p-4 mb-6 cursor-pointer" onClick={() => navigate("/achievements")}>
          <h3 className="font-semibold mb-3 flex items-center justify-between">
            Achievements
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-surface-light rounded-xl"></div>
            ))}
          </div>
        </Card>

        {/* Characters Preview */}
        <Card className="p-4 mb-6 cursor-pointer" onClick={() => openShopWithTab('characters')}>
          <h3 className="font-semibold mb-3 flex items-center justify-between">
            Characters
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-surface-light rounded-xl"></div>
            ))}
          </div>
        </Card>

        {/* Backgrounds Preview */}
        <Card className="p-4 mb-6 cursor-pointer" onClick={() => openShopWithTab('backgrounds')}>
          <h3 className="font-semibold mb-3 flex items-center justify-between">
            Backgrounds
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl"></div>
            ))}
          </div>
        </Card>

        {/* Subscription */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-3">Subscription</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border-2 border-primary">
              <div>
                <span className="font-medium">12 month</span>
                <div className="text-xs text-muted-foreground">Save 80%</div>
              </div>
              <div className="text-right">
                <div className="font-bold">10.99 USD</div>
                <div className="text-xs text-muted-foreground line-through">15.99 USD</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">3 month</span>
              <span className="font-bold">5.99 USD</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">1 month</span>
              <span className="font-bold">2.99 USD</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">App for life</span>
              <span className="font-bold">20.99 USD</span>
            </div>
          </div>
          <Button className="w-full mt-4 bg-primary text-primary-foreground">
            Unlock the entire program
          </Button>
        </Card>

        {/* Settings */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Settings</h3>
          <div className="space-y-3 text-sm">
            <p>I am smoking cigarettes</p>
            <p>I smoke 5-10 cigarettes per day</p>
            <p>One pack cost me ₴80</p>
            <p>I want quit completely</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-medium">Notifications</span>
            <Switch />
          </div>
        </Card>
      </div>
      <CoinPurchaseDrawer />
      <ShopDrawer />
    </div>
  );
};

export default Profile;
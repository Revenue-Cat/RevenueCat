import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ChevronRight, Coins, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import CoinPurchaseDrawer from "@/components/CoinPurchaseDrawer";
import ShopDrawer from "@/components/ShopDrawer";
import { SmokeIcon, AmountIcon, PayIcon, TargetIcon } from "@/components/ui/icons";
import { useState } from "react";

interface SmokingHabits {
  smokeType: string;
  dailyAmount: string;
  packPrice: string;
  goal: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { userCoins, setShowCoinPurchase, openShopWithTab } = useApp();
  
  const [smokingHabits, setSmokingHabits] = useState<SmokingHabits>({
    smokeType: "cigarettes",
    dailyAmount: "5-10",
    packPrice: "5",
    goal: "quit-completely"
  });
  
  const [editingField, setEditingField] = useState<string | null>(null);

  const setupFields = [
    {
      id: "smokeType",
      label: "What do you usually smoke?",
      icon: <SmokeIcon className="w-6 h-6" />,
      value: smokingHabits.smokeType,
      options: [
        { value: "cigarettes", label: "Cigarettes", icon: <SmokeIcon className="w-6 h-6" /> },
        { value: "tobacco-heater", label: "Tobacco heater", icon: <SmokeIcon className="w-6 h-6" /> },
        { value: "roll-your-own", label: "Roll-your-own", icon: <SmokeIcon className="w-6 h-6" /> }
      ]
    },
    {
      id: "dailyAmount",
      label: "How much do you use daily?",
      icon: <AmountIcon className="w-6 h-6" />,
      value: smokingHabits.dailyAmount,
      options: [
        { value: "1-5", label: "1-5 cigarettes per day" },
        { value: "5-10", label: "5-10 cigarettes per day" },
        { value: "11-15", label: "11-15 cigarettes per day" },
        { value: "16-20", label: "16-20 cigarettes per day (1 pack)" },
        { value: "21-30", label: "21-30 cigarettes per day" },
        { value: "31-40", label: "31-40 cigarettes per day (2 packs)" }
      ]
    },
    {
      id: "packPrice",
      label: "How much do you pay for one unit?",
      icon: <PayIcon className="w-6 h-6" />,
      value: smokingHabits.packPrice,
      options: [
        { value: "3", label: "$3" },
        { value: "4", label: "$4" },
        { value: "5", label: "$5" },
        { value: "6", label: "$6" },
        { value: "7", label: "$7" }
      ]
    },
    {
      id: "goal",
      label: "What's your main goal?",
      icon: <TargetIcon className="w-6 h-6" />,
      value: smokingHabits.goal,
      options: [
        { value: "quit-completely", label: "Quit completely" },
        { value: "reduce-gradually", label: "Reduce gradually" },
        { value: "save-money", label: "Save money" },
        { value: "improve-health", label: "Improve health" },
        { value: "gain-control", label: "Gain control" },
        { value: "doesnt-matter", label: "Doesn't matter" }
      ]
    }
  ];

  const handleFieldEdit = (fieldId: string) => {
    setEditingField(fieldId);
  };

  const handleSelection = (field: keyof SmokingHabits, value: string) => {
    setSmokingHabits(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
  };

  const getDisplayText = (field: any) => {
    const option = field.options.find((opt: any) => opt.value === field.value);
    const label = option?.label || field.value;
    
    switch (field.id) {
      case "smokeType":
        return `I am smoking ${label.toLowerCase()}`;
      case "dailyAmount":
        return `I smoke ${label.toLowerCase()}`;
      case "packPrice":
        return `One pack cost me $${field.value}`;
      case "goal":
        return `I want ${label.toLowerCase()}`;
      default:
        return label;
    }
  };

  const currentField = setupFields.find(field => field.id === editingField);

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
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Smoking Habits</h3>
            <Edit className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {setupFields.map((field) => (
              <div 
                key={field.id}
                className="flex items-center justify-between p-3 bg-surface-light rounded-lg cursor-pointer hover:bg-surface-medium transition-colors"
                onClick={() => handleFieldEdit(field.id)}
              >
                <div className="flex items-center gap-3">
                  {field.icon}
                  <span className="text-sm font-medium">{getDisplayText(field)}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <span className="font-medium">Notifications</span>
            <Switch />
          </div>
        </Card>
      </div>
      
      {/* Bottom Sheet for Editing Settings */}
      {editingField && currentField && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-[32px] p-4 max-h-[70vh] overflow-y-auto">
            <h3 className="text-base font-medium text-center mb-6 text-foreground">
              {currentField.label}
            </h3>
            
            <div className="space-y-4 mb-6">
              {currentField.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelection(editingField as keyof SmokingHabits, option.value)}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-colors ${
                    smokingHabits[editingField as keyof SmokingHabits] === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-light hover:bg-surface-medium text-foreground"
                  }`}
                >
                  <span className="text-base font-medium">
                    {option.label}
                  </span>
                  {option.icon}
                </button>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setEditingField(null)}
                className="w-10 h-10 bg-surface-medium rounded-2xl flex items-center justify-center"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* <CoinPurchaseDrawer /> */}
      {/* <ShopDrawer /> */}
    </div>
  );
};

export default Profile;
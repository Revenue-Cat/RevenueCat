import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import BreathingExercise from "./BreathingExercise";
import ChatAssistance from "./ChatAssistance";

interface CravingSOSProps {
  onClose: () => void;
}

const CravingSOS = ({ onClose }: CravingSOSProps) => {
  const [currentView, setCurrentView] = useState<'menu' | 'breathing' | 'chat'>('menu');

  const handleBreatheNow = () => {
    setCurrentView('breathing');
  };

  const handleGetAssistance = () => {
    setCurrentView('chat');
  };

  const handleBack = () => {
    setCurrentView('menu');
  };

  if (currentView === 'breathing') {
    return <BreathingExercise onClose={onClose} onBack={handleBack} />;
  }

  if (currentView === 'chat') {
    return <ChatAssistance onClose={onClose} onBack={handleBack} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-background rounded-t-3xl p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Craving SOS</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <Button 
            onClick={handleBreatheNow}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-semibold hover:bg-primary/90"
          >
            Breathe now
          </Button>
          
          <Button 
            onClick={handleGetAssistance}
            className="w-full py-4 bg-secondary text-secondary-foreground rounded-2xl text-lg font-semibold hover:bg-secondary/90"
          >
            Get assistance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CravingSOS;
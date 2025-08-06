import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";

interface BreathingExerciseProps {
  onClose: () => void;
  onBack: () => void;
}

const BreathingExercise = ({ onClose, onBack }: BreathingExerciseProps) => {
  const [currentStep, setCurrentStep] = useState<'setup' | 'inhale' | 'hold' | 'exhale' | 'complete'>('setup');
  const [breathCount, setBreathCount] = useState(1);
  const [totalBreaths, setTotalBreaths] = useState(5);
  const [selectedBreaths, setSelectedBreaths] = useState("5");

  const handleStartBreathing = () => {
    setTotalBreaths(parseInt(selectedBreaths));
    setBreathCount(1);
    setCurrentStep('inhale');
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'inhale':
        setCurrentStep('hold');
        break;
      case 'hold':
        setCurrentStep('exhale');
        break;
      case 'exhale':
        if (breathCount < totalBreaths) {
          setBreathCount(prev => prev + 1);
          setCurrentStep('inhale');
        } else {
          setCurrentStep('complete');
        }
        break;
    }
  };

  const renderSetupScreen = () => (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="px-6 py-8 max-w-md mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h2 className="text-xl font-semibold">Craving SOS</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🦫</div>
            <h1 className="text-2xl font-bold mb-4">You don't need a cigarette.</h1>
            <h2 className="text-xl font-semibold mb-2">You need a moment.</h2>
            <p className="text-muted-foreground">Your lungs just want air, not smoke.</p>
          </div>

          <div className="mb-8">
            <Select value={selectedBreaths} onValueChange={setSelectedBreaths}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 breaths</SelectItem>
                <SelectItem value="5">5 breaths</SelectItem>
                <SelectItem value="10">10 breaths</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleStartBreathing}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-semibold"
          >
            Take {selectedBreaths} breaths
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="mx-auto mt-4"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );

  const renderBreathingScreen = () => {
    const getStepText = () => {
      switch (currentStep) {
        case 'inhale':
          return 'Inhale';
        case 'hold':
          return 'Breath hold';
        case 'exhale':
          return 'Exhale';
        default:
          return '';
      }
    };

    const getCountText = () => {
      switch (currentStep) {
        case 'inhale':
          return `${breathCount}`;
        case 'hold':
          return `${totalBreaths} inhales`;
        case 'exhale':
          return `${breathCount} inhales`;
        default:
          return '';
      }
    };

    const getBuddyEmoji = () => {
      switch (currentStep) {
        case 'inhale':
          return '😮‍💨'; // Buddy inhaling
        case 'hold':
          return '😌'; // Buddy holding breath
        case 'exhale':
          return '😮‍💨'; // Buddy exhaling
        default:
          return '🦫';
      }
    };

    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full flex flex-col justify-center items-center px-6">
          <div className="text-center mb-8">
            <div className="text-sm text-muted-foreground mb-2">{getCountText()}</div>
            <h1 className="text-3xl font-bold mb-8">{getStepText()}</h1>
            <div className="text-8xl mb-8">{getBuddyEmoji()}</div>
          </div>

          <Button 
            onClick={handleNextStep}
            className="w-full max-w-sm py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-semibold mb-8"
          >
            {currentStep === 'exhale' && breathCount === totalBreaths ? 'Finish' : 'Continue'}
          </Button>

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
    );
  };

  const renderCompleteScreen = () => (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="h-full flex flex-col justify-center items-center px-6">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🦫</div>
          <h1 className="text-2xl font-bold mb-4">Well done!</h1>
          <p className="text-muted-foreground">You've completed your breathing exercise.</p>
        </div>

        <Button 
          onClick={onClose}
          className="w-full max-w-sm py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-semibold"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  if (currentStep === 'setup') {
    return renderSetupScreen();
  }

  if (currentStep === 'complete') {
    return renderCompleteScreen();
  }

  return renderBreathingScreen();
};

export default BreathingExercise;
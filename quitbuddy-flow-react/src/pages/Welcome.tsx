import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
            Welcome to QuitQly!
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Your friendly guide to quitting smoking — one small step at a time.
          </p>
        </div>

        {/* Placeholder for illustration */}
        <div className="w-full h-[524px] bg-surface-light rounded-2xl mb-16 animate-slide-up flex items-center justify-center">
          <div className="text-6xl animate-pulse-gentle">🚭</div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={() => navigate('/setup')}
          className="flex items-center gap-6 px-6 py-3 bg-primary text-primary-foreground rounded-[18px] hover:bg-primary/90 transition-all duration-300 text-xl font-medium h-12 animate-slide-up"
        >
          Let's start
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
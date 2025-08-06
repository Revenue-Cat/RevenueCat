import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BuddySelection = () => {
  const navigate = useNavigate();
  const [buddyName, setBuddyName] = useState("");
  const [selectedBuddy, setSelectedBuddy] = useState(0);

  const buddies = [
    {
      emoji: "🦫",
      name: "Chill Capybar",
      description: "Stays calm when cravings creep in — too chill to care, too lazy to light up."
    },
    {
      emoji: "🐨",
      name: "Zen Koala",
      description: "Embraces mindfulness and helps you find inner peace when urges arise."
    },
    {
      emoji: "🦥",
      name: "Slow Sloth",
      description: "Takes everything slow and steady — no rush, no stress, just progress."
    },
    {
      emoji: "🐧",
      name: "Cool Penguin",
      description: "Keeps it cool under pressure and waddles through challenges with ease."
    }
  ];

  const handleContinue = () => {
    if (buddyName.trim()) {
      navigate('/location-permission');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-6 tracking-tight">
            Pick your quit buddy
          </h1>
          <p className="text-muted-foreground text-sm">
            Choose your support animal to guide you on your journey!
          </p>
        </div>

        {/* Buddy Carousel */}
        <div className="w-full mb-8 animate-slide-up">
          <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
              {buddies.map((buddy, index) => (
                <CarouselItem key={index}>
                  <div className="w-full bg-buddy-accent rounded-2xl p-8 text-center">
                    <div className="text-8xl mb-4">{buddy.emoji}</div>
                    <h2 className="text-xl font-bold text-foreground mb-2">{buddy.name}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {buddy.description}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Name Input */}
        <div className="w-full mb-8 animate-slide-up">
          <Input
            placeholder="Give your buddy a name"
            value={buddyName}
            onChange={(e) => setBuddyName(e.target.value)}
            className="w-full p-4 text-base rounded-2xl border-input bg-surface-light focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={!buddyName.trim()}
          className={`w-full py-4 rounded-[18px] text-xl font-medium h-14 transition-all duration-300 animate-slide-up ${
            buddyName.trim()
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : "bg-primary/50 text-primary-foreground cursor-not-allowed"
          }`}
        >
          Let's Go, Buddy!
        </Button>

      </div>
    </div>
  );
};

export default BuddySelection;
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

const Achievements = () => {
  const navigate = useNavigate();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "First Step",
      description: "Complete your first day smoke-free",
      emoji: "👣",
      unlocked: true
    },
    {
      id: "2",
      name: "Week Warrior",
      description: "Stay smoke-free for 7 days straight",
      emoji: "⚡",
      unlocked: false
    },
    {
      id: "3",
      name: "Chill Capybar",
      description: "Stays calm when cravings creep in — too chill to care, too lazy to light up. 😎🦫",
      emoji: "🦫",
      unlocked: true
    },
    // Add more achievements for a full grid
    ...Array.from({ length: 29 }, (_, i) => ({
      id: `${i + 4}`,
      name: `Achievement ${i + 4}`,
      description: `Description for achievement ${i + 4}`,
      emoji: "🏆",
      unlocked: false
    }))
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold">Achievements</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                achievement.unlocked 
                  ? "bg-buddy-accent hover:bg-buddy-accent/80" 
                  : "bg-surface-light hover:bg-surface-light/80"
              }`}
              onClick={() => setSelectedAchievement(achievement)}
            >
              {achievement.unlocked ? (
                <span className="text-2xl">{achievement.emoji}</span>
              ) : (
                <div className="w-8 h-8 bg-muted rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Details Modal */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="max-w-sm mx-auto">
          {selectedAchievement && (
            <div className="text-center p-4">
              <h3 className="text-lg font-semibold mb-4">Achievement details</h3>
              
              <div className="w-24 h-24 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
                {selectedAchievement.unlocked ? (
                  <span className="text-4xl">{selectedAchievement.emoji}</span>
                ) : (
                  <div className="w-12 h-12 bg-muted rounded-full" />
                )}
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">{selectedAchievement.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedAchievement.description}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedAchievement(null)}
                className="mx-auto"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Achievements;
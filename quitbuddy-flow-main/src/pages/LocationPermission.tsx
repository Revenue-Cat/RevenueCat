import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LocationPermission = () => {
  const navigate = useNavigate();
  
  const handleLocationPermission = () => {
    // Here you can implement actual location permission request
    console.log("Requesting location permission...");
    // Navigate to dashboard after permission (regardless of allow/deny)
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-6 tracking-tight">
            Stay on track, your way
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Let buddy nudge you with chill reminders — no pressure, just progress.
          </p>
        </div>

        {/* Illustration Area */}
        <div className="w-full bg-buddy-accent rounded-2xl p-12 text-center mb-12 animate-slide-up">
          <div className="text-8xl mb-4">📍</div>
          <p className="text-muted-foreground text-sm">
            Help your buddy send you personalized reminders based on your location
          </p>
        </div>

        {/* Permission Button */}
        <Button 
          onClick={handleLocationPermission}
          className="w-full py-4 rounded-[18px] text-xl font-medium h-14 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 animate-slide-up"
        >
          Let's do it
        </Button>
      </div>
    </div>
  );
};

export default LocationPermission;
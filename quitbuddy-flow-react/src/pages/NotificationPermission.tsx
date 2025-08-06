import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotificationPermission = () => {
  const navigate = useNavigate();
  
  const handleNotificationPermission = async () => {
    try {
      // Request notification permission using the Notifications API
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      
      // Navigate to home regardless of permission granted or denied
      navigate("/home");
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      // Navigate to home even if there's an error
      navigate("/home");
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-6 tracking-tight">
            Stay motivated with reminders
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Let your buddy send you gentle reminders and encouragement to help you stay on track.
          </p>
        </div>

        {/* Illustration Area */}
        <div className="w-full bg-buddy-accent rounded-2xl p-12 text-center mb-12 animate-slide-up">
          <div className="text-8xl mb-4">🔔</div>
          <p className="text-muted-foreground text-sm">
            Get timely reminders for achievements, challenges, and motivational messages
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          <Button 
            onClick={handleNotificationPermission}
            className="w-full py-4 rounded-[18px] text-xl font-medium h-14 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 animate-slide-up"
          >
            Enable notifications
          </Button>
          
          <Button 
            onClick={handleSkip}
            variant="ghost"
            className="w-full py-4 rounded-[18px] text-xl font-medium h-14 text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermission;
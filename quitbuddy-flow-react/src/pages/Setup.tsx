import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SmokeIcon, AmountIcon, PayIcon, TargetIcon } from "@/components/ui/icons";

interface SetupData {
  smokeType: string;
  dailyAmount: string;
  packPrice: string;
  goal: string;
}

const Setup = () => {
  const navigate = useNavigate();
  const [setupData, setSetupData] = useState<SetupData>({
    smokeType: "",
    dailyAmount: "",
    packPrice: "",
    goal: ""
  });
  
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  const allFieldsCompleted = Object.values(setupData).every(value => value !== "");

  const handleFieldClick = (field: string) => {
    setCurrentStep(field);
  };

  const handleSelection = (field: keyof SetupData, value: string) => {
    setSetupData(prev => ({ ...prev, [field]: value }));
    setCurrentStep(null);
  };

  const setupFields = [
    {
      id: "smokeType",
      label: "What do you usually smoke?",
      icon: <SmokeIcon className="w-8 h-8" />,
      value: setupData.smokeType,
      options: [
        { value: "cigarettes", label: "Cigarettes", icon: <SmokeIcon className="w-8 h-8" /> },
        { value: "tobacco-heater", label: "Tobacco heater", icon: <SmokeIcon className="w-8 h-8" /> },
        { value: "roll-your-own", label: "Roll-your-own", icon: <SmokeIcon className="w-8 h-8" /> }
      ]
    },
    {
      id: "dailyAmount",
      label: "How much do you use daily?",
      icon: <AmountIcon className="w-8 h-8" />,
      value: setupData.dailyAmount,
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
      icon: <PayIcon className="w-8 h-8" />,
      value: setupData.packPrice,
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
      icon: <TargetIcon className="w-8 h-8" />,
      value: setupData.goal,
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

  const currentField = setupFields.find(field => field.id === currentStep);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="px-6 py-16 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
            Set your path to quitting
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Answer a few quick questions to personalize your quitting plan. It won't take more than 20 seconds.
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-surface-light rounded-2xl p-6 text-center mb-8">
          <div className="text-5xl font-bold text-foreground mb-2">70%</div>
          <p className="text-base text-foreground">
            of smokers say they want to quit — you're not alone.
          </p>
        </div>

        {/* Setup Fields */}
        <div className="space-y-4 mb-8">
          {setupFields.map((field) => (
            <button
              key={field.id}
              onClick={() => handleFieldClick(field.id)}
              className={`w-full p-4 rounded-2xl flex items-center justify-between transition-colors ${
                field.value 
                  ? "bg-surface-medium" 
                  : "bg-surface-light hover:bg-surface-medium"
              }`}
            >
              <span className="text-base font-medium text-foreground">
                {field.value ? (
                  <span>
                    {field.id === "smokeType" && `I am smoking `}
                    {field.id === "dailyAmount" && `I smoke `}
                    {field.id === "packPrice" && `One pack cost me `}
                    {field.id === "goal" && `I want `}
                    <span className="font-bold">
                      {field.options.find(opt => opt.value === field.value)?.label || field.value}
                    </span>
                    {field.id === "packPrice" && field.value && `$${field.value}`}
                  </span>
                ) : (
                  field.label
                )}
              </span>
              {field.icon}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate('/buddy-selection')}
            disabled={!allFieldsCompleted}
            className={`flex items-center gap-6 px-6 py-3 rounded-[18px] text-xl font-medium h-12 transition-all duration-300 ${
              allFieldsCompleted 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-primary/50 text-primary-foreground cursor-not-allowed"
            }`}
          >
            Next
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Bottom Sheet for Options */}
      {currentStep && currentField && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-[32px] p-4 max-h-[70vh] overflow-y-auto">
            <h3 className="text-base font-medium text-center mb-6 text-foreground">
              {currentField.label}
            </h3>
            
            <div className="space-y-4 mb-6">
              {currentField.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelection(currentStep as keyof SetupData, option.value)}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-colors ${
                    setupData[currentStep as keyof SetupData] === option.value
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
                onClick={() => setCurrentStep(null)}
                className="w-10 h-10 bg-surface-medium rounded-2xl flex items-center justify-center"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setup;
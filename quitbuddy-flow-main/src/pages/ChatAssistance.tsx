import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

interface ChatAssistanceProps {
  onClose: () => void;
  onBack: () => void;
}

const ChatAssistance = ({ onClose, onBack }: ChatAssistanceProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi, I'm your personal assistant. Ask me anything about quitting smoking. I have all available resources about triggers, researched expert advice, etc."
    }
  ]);

  const exampleQuestions = [
    "Why do I have headaches after quitting smoking?",
    "How can I avoid gaining weight when I quit smoking?",
    "Any ideas for a balanced menu that helps me feel without adding weight?",
    "What should I do if I'm angry?",
    "I just ate a filling lunch pasta salad and a fruit yogurt — how many calories is that?",
    "I want to go back to exercising safely — where should I start?",
    "What are the main side effects of quitting smoking, and how can I work with those?",
    "Find me a tobacco specialist in Paris — phone number and opening hours",
    "I want to get back to exercising safely — where should I start?",
    "Find me a tobacco specialist in Paris — phone number and opening hours."
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        content: message
      }]);
      setMessage("");
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'bot',
          content: "Thanks for your question! I'm here to help you with your quit smoking journey."
        }]);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h2 className="text-xl font-semibold">Tchat QuitAI</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <Card className={`max-w-[80%] p-3 ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{msg.content}</p>
              </Card>
            </div>
          ))}

          {/* Example Questions */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Example questions:</p>
              {exampleQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3 whitespace-normal"
                  onClick={() => setMessage(question)}
                >
                  • {question}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistance;
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, HeartPulse, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  text: string;
  sender: "bot" | "user";
};

const QNA_DB: Record<string, string> = {
  "eligibility": "To donate blood, you must be between 18-65 years old, weigh at least 50kg, and be in generally good health.",
  "who can donate": "Healthy adults aged 18-65, weighing over 50kg, without recent tattoos, major surgeries, or active infections.",
  "benefits": "Blood donation reduces risk of heart disease, burns calories, and provides a free mini health check-up. Plus, you save up to 3 lives!",
  "blood groups": "The main blood groups are A, B, AB, and O, each can be positive or negative. O- is the universal donor, AB+ is the universal receiver.",
  "process": "The process involves registration, a brief medical screening, the donation (takes ~10 mins), and resting with refreshments. Total time: ~45 mins.",
  "hi": "Hello! I'm the Jivan Daan assistant. How can I help you save a life today?",
  "hello": "Hi there! Ready to be a hero? Ask me about blood donation.",
  "default": "I'm not sure I understand. Try asking about 'eligibility', 'benefits', or 'blood groups'."
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi! I'm the Jivan Daan health assistant. How can I help you today?", sender: "bot" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = { id: Date.now().toString(), text, sender: "user" as const };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simple rule-based logic
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let botResponse = QNA_DB["default"];
      
      for (const [key, value] of Object.entries(QNA_DB)) {
        if (lowerText.includes(key)) {
          botResponse = value;
          break;
        }
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: botResponse, sender: "bot" }]);
    }, 600);
  };

  const quickReplies = ["Eligibility", "Benefits", "Process", "Blood groups"];

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button 
              size="icon" 
              className="w-14 h-14 rounded-full shadow-xl shadow-primary/30 bg-gradient-to-br from-primary to-rose-700 hover:scale-110 transition-transform"
              onClick={() => setIsOpen(true)}
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-100px)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-rose-700 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Health Assistant</h3>
                  <div className="flex items-center gap-1 text-xs text-white/80">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-card border border-border text-foreground rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Disclaimer & Quick Replies */}
            <div className="p-3 bg-card border-t border-border">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickReplies.map((reply) => (
                  <button 
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="whitespace-nowrap px-3 py-1.5 bg-secondary text-secondary-foreground text-xs rounded-full hover:bg-primary/10 hover:text-primary transition-colors border border-border"
                  >
                    {reply}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground text-center mb-2 flex items-center justify-center gap-1">
                ⚠️ Not medical advice. Consult a doctor.
              </div>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex items-center gap-2"
              >
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20"
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

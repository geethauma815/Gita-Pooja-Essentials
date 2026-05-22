'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, X, Send, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AIChatbot() {
  const { API_BASE } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! I am your Divine AI assistant. I can help you prepare for festivals, explain ritual step-by-step guides, estimate budgets, and build your custom pooja kit. What ritual are you planning today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "I am performing Satyanarayana Vratham for the first time.",
    "What do I need for Diwali Lakshmi Pooja?",
    "Checklist & Muhurtham for Ganesh Chaturthi"
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');

    // Add user message
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.reply,
          ritualKey: data.ritualKey
        }]);
      } else {
        throw new Error('Response error');
      }
    } catch (e) {
      // Offline Local Fallback simulation
      setTimeout(() => {
        let reply = "Namaste! I am operating in offline mode. I can give you quick outlines. If you ask about 'Diwali', 'Satyanarayana', or 'Ganesh Chaturthi', I can find their details.";
        let ritualKey = null;

        const lowText = text.toLowerCase();
        if (lowText.includes('satyanarayana')) {
          ritualKey = 'satyanarayana-vratham';
          reply = `I see you are planning a **Satyanarayana Vratham**. 
          
### 🌟 Essentials:
- Wooden Altar cloth, Copper Kalash, Coconuts, Betel leaves, Tulsi leaves, and pure Cow Ghee.
- **Estimated Budget**: ~₹2800.
- **Muhurtham Timings**: Morning (9:00 AM - 12:30 PM).

Click the link below to configure your custom kit instantly!`;
        } else if (lowText.includes('diwali') || lowText.includes('lakshmi')) {
          ritualKey = 'diwali-lakshmi-pooja';
          reply = `I see you are preparing for **Diwali Lakshmi Pooja**. 
          
### 🌟 Essentials:
- 11 Clay diyas, Kumkum-haldi, Akshata, Ganga jal, fresh marigold garlands, mango leaves.
- **Estimated Budget**: ~₹1500.
- **Muhurtham Timings**: Evening Pradosh Kaal (5:42 PM - 7:21 PM).

Would you like to build your customized Diwali kit? Click the link below.`;
        } else if (lowText.includes('ganesh') || lowText.includes('chaturthi')) {
          ritualKey = 'ganesh-chaturthi-pooja';
          reply = `Preparing for **Ganesh Chaturthi Pooja**? 
          
### 🌟 Essentials:
- Eco Clay Ganesha Idol, Durva grass blades, Hibiscus flowers, Modak sweets.
- **Estimated Budget**: ~₹1800.
- **Muhurtham Timings**: Shukla Chaturthi (11:03 AM - 1:32 PM).

Configure your eco-friendly kit in the builder below.`;
        }

        setMessages(prev => [...prev, { role: 'assistant', content: reply, ritualKey }]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-crimson to-amber text-white p-4 rounded-full shadow-2xl divine-glow border border-gold/40 hover:scale-110 active:scale-95 duration-200 flex items-center justify-center"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber"></span>
          </span>
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div className="bg-white dark:bg-darkslate border-2 border-gold rounded-3xl shadow-2xl w-[320px] sm:w-[380px] h-[500px] flex flex-col overflow-hidden divine-glow animate-fade-in">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-crimson to-amber text-white p-4 flex justify-between items-center border-b border-gold/20 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold animate-pulse-subtle" />
              <div>
                <h4 className="font-serif font-bold text-sm">Divine AI Purohit</h4>
                <p className="text-[10px] text-cream/70">Worship & Ritual Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-mandala text-xs leading-relaxed">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div 
                  className={`p-3 rounded-2xl shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-amber/15 border-amber/30 text-slate-800 dark:text-cream rounded-tr-none' 
                      : 'bg-white dark:bg-black/30 border-gold/20 rounded-tl-none space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  
                  {/* Custom Action Direct Link Button */}
                  {msg.ritualKey && (
                    <div className="pt-2 border-t border-gold/10">
                      <Link 
                        href={`/rituals/${msg.ritualKey}`}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[10px] font-extrabold text-crimson dark:text-gold hover:underline"
                      >
                        Open Kit Builder <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-center gap-1 bg-white dark:bg-black/20 p-3 rounded-2xl max-w-[100px] border border-gold/10">
                <span className="h-1.5 w-1.5 bg-amber rounded-full animate-bounce"></span>
                <span className="h-1.5 w-1.5 bg-amber rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-1.5 w-1.5 bg-amber rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggesters */}
          {messages.length === 1 && (
            <div className="p-3 bg-gold/5 border-t border-gold/10 space-y-1.5 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <HelpCircle className="h-3 w-3" /> Suggested queries
              </span>
              <div className="flex flex-col gap-1.5">
                {suggestedPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p)}
                    className="w-full text-left text-[11px] bg-white dark:bg-black/20 border border-gold/20 hover:bg-gold/10 hover:border-gold px-2.5 py-1.5 rounded-lg transition text-slate-700 dark:text-cream truncate"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Input */}
          <div className="p-3 border-t border-gold/20 flex gap-2 items-center bg-white dark:bg-darkslate shrink-0">
            <input
              type="text"
              placeholder="Ask anything about rituals..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow bg-cream/30 dark:bg-black/25 text-xs px-3 py-2.5 rounded-full border border-gold/30 focus:outline-none focus:border-amber"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading}
              className="bg-amber hover:bg-amber-dark text-darkslate p-2.5 rounded-full duration-200 shadow disabled:opacity-50 shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

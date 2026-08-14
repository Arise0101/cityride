import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Navigation, MapPin, Bus, Clock } from 'lucide-react';
import { askCityRideAIAssistant } from '../../services/aiService';

export default function CityRideAIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hi! I'm **CityRide AI**, your Tumakuru transit assistant.\n\nAsk me anything about bus routes, live ETAs, nearest stops, or transfer directions!",
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Useful quick question chips requested in specification
  const sampleQuestions = [
    "Find nearest bus stop",
    "How do I reach Bengaluru?",
    "When is the next bus?",
    "Show live buses",
    "Find a route"
  ];

  const handleSend = async (queryToSend) => {
    const query = queryToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Pass full conversation history to maintain context
      const responseText = await askCityRideAIAssistant(query, newMessages);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I am having trouble reaching the transit server right now. Please try again.",
        timestamp: 'Just now'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-500 pb-16 md:pb-12">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-card-hover flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-4 sm:gap-0">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-white">CityRide AI</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                TRANSIT ASSISTANT
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">Real-time route directions, live ETAs, and general knowledge</p>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white border border-slate-200 rounded-3xl h-[calc(100vh-280px)] sm:h-[450px] md:h-[500px] lg:h-[540px] flex flex-col shadow-card-soft overflow-hidden">
        {/* Messages Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-white shadow-sm'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-400" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[80%] p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none font-medium'
                  : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl rounded-tl-none whitespace-pre-wrap'
              }`}>
                {msg.text}
                <div className={`text-[10px] mt-1.5 font-semibold ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                <span className="font-medium">CityRide AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Suggestions */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase text-slate-400 whitespace-nowrap">Suggested:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3.5 py-2 min-h-[40px] rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-semibold whitespace-nowrap transition-all touch-target"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask CityRide AI (e.g. 'nearest bus stop' or 'route to Bengaluru')..."
            className="flex-1 px-4 py-3 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputQuery.trim()}
            className="px-5 py-3 min-h-[44px] justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-electric-glow transition-all touch-target"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

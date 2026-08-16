import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bot, Send, User, Sparkles, Navigation, MapPin } from 'lucide-react';
import { askCityRideAIAssistant } from '../../services/aiService';

export default function CityRideAIAssistant() {
  const navigate = useNavigate();
  const { buses, stops, routes, setSelectedBusForTracking } = useApp();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hi! I'm **CityRide AI**, your Tumakuru transit assistant.\n\nAsk me to find the nearest bus stop, calculate walking routes, or check live bus ETAs!",
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const chatEndRef = useRef(null);

  // Request GPS location for map actions
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 13.3400, lng: 77.1000 })
      );
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sampleQuestions = [
    "Find nearest bus stop",
    "How do I reach Bengaluru?",
    "Show bus 102",
    "When is the next bus?",
    "What is the capital of India?"
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
      const res = await askCityRideAIAssistant(query, newMessages, { userLocation, stops, buses, routes });

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.answer || res,
        action: res.action || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Execute AI Map Action if triggered
      if (res.action) {
        if (res.action.type === 'SHOW_BUS') {
          const targetBus = buses.find(b => b.busNumber.toLowerCase().includes(res.action.busNumber.toLowerCase()));
          if (targetBus) setSelectedBusForTracking(targetBus);
        }
      }
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
                SMART ASSISTANT
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">Your intelligent transportation & route navigation guide</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/map')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-electric-glow flex items-center gap-1.5 transition-all touch-target"
        >
          <Navigation className="w-4 h-4" />
          <span>Open Full Map</span>
        </button>
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
                msg.sender === 'user' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-900 text-white shadow-sm'
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

                {/* AI Action Button inside chat */}
                {msg.action && (
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => navigate('/map')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>View Route on Map</span>
                    </button>
                  </div>
                )}

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
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
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
            placeholder="Ask CityRide anything (e.g. 'nearest bus stop' or 'capital of India')..."
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

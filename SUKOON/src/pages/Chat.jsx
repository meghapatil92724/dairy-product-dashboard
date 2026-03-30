import { useState } from 'react';
import { Send, Mic, User, Bot, History } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there. I'm SukoonAI. How are you feeling today?", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if(!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
      setMessages(p => [...p, { 
        id: Date.now()+1, 
        text: "I hear you. Taking a deep breath might help. Would you like to try a quick exercise?", 
        sender: 'ai' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-fade-in relative z-10 p-4">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 glass rounded-3xl p-6 flex-col">
        <h3 className="font-heading font-bold text-gray-800 mb-6 flex items-center gap-2">
          <History size={18} className="text-primary"/> History
        </h3>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-500 mb-2">Today</div>
          <button className="text-left w-full truncate text-sm px-3 py-2 rounded-xl bg-white/50 text-gray-700 hover:bg-white/80 transition shadow-sm border border-white/40">
            Feeling overwhelmed...
          </button>
          <div className="text-sm font-medium text-gray-500 mt-4 mb-2">Yesterday</div>
          <button className="text-left w-full truncate text-sm px-3 py-2 rounded-xl text-gray-500 hover:bg-white/50 transition">
            Exam anxiety discussion
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 glass rounded-3xl flex flex-col overflow-hidden relative border border-white/30">
        
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-black/5 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-lavender flex items-center justify-center text-white shadow-md">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-gray-800 text-lg">Sukoon AI Therapist</h2>
              <div className="flex items-center gap-1.5 flex-row">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-emerald-600 font-medium">Online, ready to listen</span>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-white text-primary' : 'bg-gradient-to-br from-primary to-lavender text-white'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`px-5 py-3.5 max-w-[75%] rounded-2xl shadow-sm text-[15px] leading-relaxed font-body ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-primary to-lavender text-white rounded-tr-sm' 
                  : 'bg-white/80 text-gray-800 rounded-tl-sm border border-white'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/40 border-t border-black/5">
          <div className="flex items-center gap-3 max-w-4xl mx-auto bg-white/60 rounded-full p-2 pl-6 shadow-sm border border-white backdrop-blur-md focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Share how you're feeling..."
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400"
            />
            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
              <Mic size={20} />
            </button>
            <button 
              onClick={handleSend}
              className="p-3 bg-primary hover:bg-primaryHover text-white rounded-full transition-transform hover:scale-105 shadow-md flex items-center justify-center"
            >
              <Send size={18} className="translate-x-[1px]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

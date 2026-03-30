import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenChatPage = () => {
    navigate('/chat');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass w-80 p-6 rounded-3xl flex flex-col gap-4 shadow-2xl overflow-hidden relative"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-heading font-bold text-gray-800">Hi, I'm SukoonAI</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700 transition">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 font-body">
              Need someone to talk to, or want to explore some calming exercises?
            </p>

            <button 
              onClick={handleOpenChatPage}
              className="w-full mt-2 bg-gradient-to-r from-primary to-lavender text-white font-medium py-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              Open Therapist Chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-lavender text-white shadow-[0_4px_24px_rgba(93,76,172,0.4)] flex items-center justify-center hover:scale-105 transition-transform duration-300"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, Send, Bot, Loader, RefreshCw, Volume2, Clock } from 'lucide-react';
import { detectExpression, loadFaceModels } from '../services/faceAnalysis';
import { getAIResponse, getAIGreeting } from '../services/ai';
import { saveChatMessage } from '../services/firebase';

const analyzeTextEmotion = (text) => {
  const t = text.toLowerCase();
  if (t.match(/\b(happy|good|great|excited|awesome|joy)\b/)) return ['happy'];
  if (t.match(/\b(sad|upset|low|depressed|cry)\b/)) return ['sad'];
  if (t.match(/\b(stress|exam|pressure|overwhelmed|worry|anxious)\b/)) return ['fearful', 'sad', 'angry']; 
  if (t.match(/\b(angry|frustrated|irritated|mad)\b/)) return ['angry'];
  if (t.match(/\b(tired|exhausted|sleepy)\b/)) return ['neutral', 'sad'];
  return []; 
};

export default function MentalWellness() {
  const navigate = useNavigate();
  const [stage, setStage] = useState('loading'); // loading, camera, result
  const [capturedImages, setCapturedImages] = useState([]);
  const [emotion, setEmotion] = useState('neutral');
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [emotionStatus, setEmotionStatus] = useState('Unclear');
  const [greeting, setGreeting] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  const videoRef = useRef(null);
  const bgVideoRef = useRef(null); // Dedicated background video element
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        
        // Brief delay before sending for visibility
        setTimeout(() => {
          handleUserMessage(transcript);
        }, 500);
        
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
          setError('Please speak clearly');
        } else {
          setError('Microphone not detected');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    if (stage === 'result' && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (stage === 'result' && timeLeft === 0) {
      handleSessionEnd();
    }
  }, [timeLeft, stage]);

  const isListeningRef = useRef(isListening);
  useEffect(() => {
     isListeningRef.current = isListening;
  }, [isListening]);

  // Background Auto-Capture Effect (Every 5 mins)
  useEffect(() => {
    if (stage !== 'result') return;
    
    const bgTimer = setInterval(async () => {
       if (isListeningRef.current) return; // Don't interrupt voice input

       const video = bgVideoRef.current;
       const canvas = canvasRef.current;
       if (video && canvas && streamRef.current) {
          const ctx = canvas.getContext('2d');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const result = await detectExpression(canvas);
          if (result) {
             const detected = result.dominant;
             const timeString = new Date().toLocaleTimeString();
             console.log(`Image captured at ${timeString}. Detected emotion: ${detected}`);
             
             setEmotion(detected);
             setCapturedImages(prev => {
                const updated = [...prev, canvas.toDataURL('image/jpeg')];
                return updated.length > 3 ? updated.slice(updated.length - 3) : updated;
             });
             
             setEmotionHistory(prev => {
                const updated = [...prev, detected];
                // Store last 3
                return updated.length > 3 ? updated.slice(updated.length - 3) : updated;
             });
          }
       }
    }, 300000);

    return () => clearInterval(bgTimer);
  }, [stage]);

  const handleSessionEnd = () => {
    alert("More connection to device is harmful, please connect socially lively like a thought");
    setMessages([]);
    stopCamera();
    navigate('/');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setError(null);
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      setError('Microphone not detected');
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1;
      utterance.rate = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const initCamera = async () => {
    setStage('loading');
    setError(null);
    try {
      await loadFaceModels();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      if (bgVideoRef.current) bgVideoRef.current.srcObject = stream;
      
      setStage('camera');

      // Auto capture after 2 seconds
      setTimeout(() => {
        captureAndAnalyze();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Camera access required');
      setStage('error');
    }
  };

  useEffect(() => {
    initCamera();
    return () => stopCamera();
  }, [stopCamera]);

  const handleUserMessage = async (text) => {
    if (!text.trim()) {
      setError('Say something to continue');
      return;
    }
    
    setInputText('');
    const newMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setIsLoadingAI(true);
    setError(null);

    // Consistency & Validation Engine
    const textMappedEmotions = analyzeTextEmotion(text);
    const faceEmotion = emotion;

    let isMismatch = false;
    if (textMappedEmotions.length > 0 && !textMappedEmotions.includes(faceEmotion)) {
       isMismatch = true;
    }

    let isGenuine = false;
    // History check
    if (emotionHistory.length >= 2 && emotionHistory.every(e => e === faceEmotion)) {
       if (!isMismatch) {
           isGenuine = true;
       }
    }

    let calculatedStatus = 'Unclear';
    if (isMismatch) calculatedStatus = 'Acting';
    else if (isGenuine) calculatedStatus = 'Genuine';
    setEmotionStatus(calculatedStatus);

    let interceptResponse = null;
    if (calculatedStatus === 'Acting') {
       interceptResponse = "I noticed a difference between what you're saying and your facial expression. Sometimes we hide our feelings. Would you like to share what's really going on?";
    } else if (calculatedStatus === 'Genuine') {
       interceptResponse = `I'm noticing that you're consistently feeling ${faceEmotion}. I'm here to support you. Do you want to talk more about it?`;
    }
    
    try {
      let responseText = "";
      if (interceptResponse) {
          responseText = interceptResponse;
      } else {
          // Send to real LLM if no strict intervention needed
          responseText = await getAIResponse(messages, text, emotion);
      }
      
      const aiResponse = { 
        id: Date.now() + 1, 
        text: responseText, 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, aiResponse]);
      speak(responseText);

      // Save complete chat turn persistently
      await saveChatMessage("anonymous_user", text, responseText, emotion);

    } catch (err) {
      setError("Please try again");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const captureAndAnalyze = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImages([dataUrl]);
      setStage('analyzing');

      const result = await detectExpression(canvas);
      let detectedEmotion = result ? result.dominant : 'neutral';
      
      setEmotion(detectedEmotion);
      setEmotionHistory([detectedEmotion]); // Initialize history
      
      // Dynamic AI Greeting from the actual LLM
      const dynamicGreeting = await getAIGreeting(detectedEmotion);
      
      setGreeting(dynamicGreeting);
      setStage('result');
      speak(dynamicGreeting);
      
      // Start history with the greeting
      setMessages([{ id: 'greeting', text: dynamicGreeting, sender: 'ai' }]);
      
      // Auto start listening after greeting
      setTimeout(() => startListening(), dynamicGreeting.length * 100);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) {
      setError('Say something to continue');
      return;
    }
    handleUserMessage(inputText);
    setInputText('');
  };

  const getGlowClass = (emo) => {
    switch(emo) {
      case 'happy': return 'border-green-400 shadow-[0_0_40px_rgba(74,222,128,0.5)]';
      case 'sad': return 'border-blue-400 shadow-[0_0_40px_rgba(96,165,250,0.5)]';
      case 'angry': return 'border-red-400 shadow-[0_0_40px_rgba(248,113,113,0.5)]';
      default: return 'border-gray-300 shadow-[0_0_40px_rgba(156,163,175,0.4)]';
    }
  };

  // SVG Circular Progress Calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((1800 - timeLeft) / 1800) * circumference;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#F472B6]/10 via-[#A5B4FC]/10 to-[#6C63FF]/10 font-sans text-gray-800 flex flex-col items-center justify-start py-8 px-4 animate-fade-in transition-all duration-1000 -mt-8">
      
      {stage !== 'result' ? (
        // INITIAL CAMERA PHASE - CENTERED LAYOUT
        <div className="w-full max-w-2xl flex flex-col gap-10 items-center mt-12">
          
          <div className="text-center space-y-3">
             <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">Welcome to Sukoon</h1>
             <p className="text-lg text-gray-600 font-medium">Breathe deeply. Your sanctuary is preparing.</p>
          </div>

          <div className="relative w-64 h-64 rounded-full overflow-hidden bg-white/50 backdrop-blur-md shadow-2xl shadow-[#6C63FF]/20 border-8 border-white/60 transition-all duration-700">
            
            {(stage === 'camera' || stage === 'loading') && (
              <div className="w-full h-full relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
                {stage === 'loading' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md gap-4 transition-all duration-300">
                    <Loader className="text-[#6C63FF] animate-spin" size={40} />
                  </div>
                )}
              </div>
            )}

            {stage === 'analyzing' && capturedImages.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full relative"
              >
                <img 
                  src={capturedImages[capturedImages.length - 1]} 
                  alt="Captured mood" 
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm gap-3">
                  <div className="flex gap-1.5">
                    <motion.div className="w-3 h-3 bg-[#6C63FF] rounded-full" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-3 h-3 bg-[#6C63FF] rounded-full" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-3 h-3 bg-[#6C63FF] rounded-full" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'error' && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-white/80 gap-4 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-1">
                  <Camera size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Camera Required</h3>
                <button 
                  onClick={initCamera}
                  className="px-5 py-2 bg-gradient-to-r from-[#6C63FF] to-[#A5B4FC] text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm flex gap-2"
                >
                  <RefreshCw size={16} /> Retry
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (

        // RESULTS PHASE - 3 COLUMN LAYOUT (Timer, Chat, Face)
        <div className="w-full max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-0 md:px-4">
          
          {/* COLUMN 1: LEFT TIMER */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
             className="w-full flex-col hidden lg:flex items-center gap-4"
          >
            <div className="backdrop-blur-2xl bg-white/60 w-full rounded-[2.5rem] p-8 shadow-[0_8px_32px_0_rgba(108,99,255,0.05)] border border-white/60 flex flex-col items-center text-center sticky top-24">
              
              <div className="relative w-48 h-48 flex items-center justify-center mb-4">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/50" />
                  <circle 
                    cx="96" 
                    cy="96" 
                    r={radius} 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round" 
                    className="text-[#6C63FF] transition-all duration-1000 ease-linear" 
                  />
                </svg>
                <div className="flex flex-col items-center justify-center z-10">
                   <Clock size={28} className={`mb-2 ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-[#6C63FF]'}`} />
                   <p className={`text-3xl font-black tracking-widest ${timeLeft < 300 ? 'text-rose-500' : 'text-gray-900'}`}>
                     {formatTime(timeLeft)}
                   </p>
                </div>
              </div>

              <h3 className="text-md font-bold text-gray-700 uppercase tracking-widest mt-2">Session Timer</h3>
              <p className="text-sm font-medium text-gray-500 mt-2 leading-relaxed">
                Dedicated time for your mental well-being.
              </p>
            </div>
          </motion.div>


          {/* COLUMN 2 & 3: CENTER CHAT */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:col-span-2 flex flex-col gap-6"
          >
            <div className="text-center px-6 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">Hello, Varsha 👋</h1>
              <div className="flex items-center justify-center gap-2 text-[#6C63FF] font-semibold text-lg">
                <span>{greeting}</span>
              </div>
            </div>

            <div className="w-full backdrop-blur-2xl bg-white/70 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(108,99,255,0.05)] border border-white/60 flex flex-col overflow-hidden min-h-[500px] max-h-[70vh]">
              
              <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id} 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {msg.sender === 'ai' && (
                         <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm text-[#6C63FF]">
                           <Bot size={20} />
                         </div>
                      )}
                      <div className={`px-6 py-4 max-w-[85%] rounded-[1.5rem] shadow-sm text-base leading-relaxed font-medium ${
                        msg.sender === 'user' 
                          ? 'bg-gradient-to-r from-[#6C63FF] to-[#A5B4FC] text-white rounded-tr-sm shadow-indigo-200/50' 
                          : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}

                  {isSpeaking && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex items-center gap-2 ml-14 text-[#6C63FF]">
                       <div className="flex items-end gap-1 h-4">
                          <motion.div className="w-1 bg-[#6C63FF] rounded-full" animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                          <motion.div className="w-1 bg-[#6C63FF] rounded-full" animate={{ height: [8, 12, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} />
                          <motion.div className="w-1 bg-[#6C63FF] rounded-full" animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} />
                       </div>
                       <span className="text-xs font-bold uppercase tracking-wider ml-2">Speaking...</span>
                    </motion.div>
                  )}
                  {isLoadingAI && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex items-center gap-3 ml-14 text-indigo-400">
                       <Loader size={16} className="animate-spin" />
                       <span className="text-xs font-bold uppercase tracking-wider">Reflecting...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Control */}
              <div className="p-4 md:p-6 bg-white/40 border-t border-white/60 relative z-20 flex justify-center items-end gap-4">
                 <div className="flex-1 bg-white/80 backdrop-blur-md rounded-full px-6 py-4 border border-white/60 shadow-lg shadow-[#6C63FF]/5 focus-within:ring-2 ring-[#A5B4FC] transition-all flex items-center gap-3">
                    <input 
                      type="text" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Speak or type your thoughts..."
                      className="w-full bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 font-medium"
                    />
                    <button onClick={handleSend} className="text-[#6C63FF] hover:scale-110 active:scale-95 transition-transform">
                      <Send size={22} />
                    </button>
                 </div>

                 <div className="relative group shrink-0 flex items-center justify-center">
                   {isListening && (
                     <span className="absolute inset-0 rounded-full animate-ping bg-[#F472B6] opacity-75"></span>
                   )}
                   <button 
                     onClick={startListening}
                     className={`relative p-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                       isListening 
                         ? 'bg-gradient-to-r from-[#F472B6] to-[#6C63FF] text-white shadow-[0_0_30px_#F472B6] scale-110' 
                         : 'bg-white text-[#6C63FF] shadow-xl border border-white/60 hover:shadow-2xl hover:scale-105'
                     }`}
                   >
                     <Mic size={26} />
                   </button>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* COLUMN 4: RIGHT SAVED FACE IMAGE AND STATUS */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="w-full hidden lg:flex flex-col gap-4 items-center"
          >
             <div className="backdrop-blur-2xl bg-white/60 w-full rounded-[2.5rem] p-6 shadow-[0_8px_32px_0_rgba(108,99,255,0.05)] border border-white/60 flex flex-col items-center text-center sticky top-24">
                
                {/* STATUS BADGE */}
                {emotionStatus && (
                  <div className={`w-full py-2.5 mb-6 rounded-2xl font-bold text-sm tracking-widest uppercase border backdrop-blur-md shadow-sm transition-all duration-500
                    ${emotionStatus === 'Genuine' ? 'bg-green-100/50 text-green-700 border-green-200' :
                      emotionStatus === 'Acting' ? 'bg-rose-100/50 text-rose-700 border-rose-200' :
                      'bg-gray-100/50 text-gray-500 border-gray-100 shadow-inner'}`}>
                    Status: {emotionStatus}
                  </div>
                )}

                <div className={`w-40 h-40 rounded-full overflow-hidden mb-6 border-4 relative transition-all duration-1000 ${getGlowClass(emotion)}`}>
                  {(capturedImages.length > 0) && (
                    <img 
                      src={capturedImages[capturedImages.length - 1]} 
                      alt="Captured mood" 
                      className="w-full h-full object-cover mirror"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  )}
                </div>

                <div className="backdrop-blur-xl bg-white/80 px-6 py-2 rounded-full border border-white/60 shadow-sm mb-4">
                   <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
                      Detected: <span className="text-[#6C63FF]">{emotion}</span>
                   </h3>
                </div>

                <p className="text-sm font-medium text-gray-500 px-2 leading-relaxed">
                  Sukoon AI uses your facial expression to tailor the conversation directly to your feelings.
                </p>
             </div>
          </motion.div>
          
        </div>
      )}

      {/* HIDDEN PERSISTENT BACKGROUND ELEMENTS */}
      <video ref={bgVideoRef} autoPlay muted playsInline className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

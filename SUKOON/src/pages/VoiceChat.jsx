import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Volume2, VolumeX } from 'lucide-react';
import FaceCaptureModal from '../components/FaceCaptureModal';
import { speak, stopSpeaking } from '../services/elevenlabs';
import { getAIResponse } from '../services/ai';

const STATIC_HEIGHTS = [...Array(20)].map(() => Math.max(8, Math.random() * 60));

export default function VoiceChat() {
  const [showCamera, setShowCamera] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const recognitionRef = useRef(null);

  const handleFaceResult = (result) => {
    setGreeting(result.greeting);
    setShowCamera(false);
    // Speak the greeting
    if (!muted) {
      setIsSpeaking(true);
      speak(result.greeting).then(() => setIsSpeaking(false));
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    }
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording and process
      setIsRecording(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
      }
      
      if (transcript.trim()) {
        setIsProcessing(true);
        const response = await getAIResponse([], transcript);
        setAiResponse(response);
        setIsProcessing(false);

        // Speak the response
        if (!muted) {
          setIsSpeaking(true);
          await speak(response);
          setIsSpeaking(false);
        }
      }
    } else {
      // Start recording
      setTranscript('');
      setAiResponse('');
      setIsRecording(true);
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch { /* ignore */ }
      }
    }
  };

  const toggleMute = () => {
    if (isSpeaking) stopSpeaking();
    setMuted(!muted);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] gap-10 px-4 relative">
      {/* Face Capture */}
      <FaceCaptureModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onResult={handleFaceResult}
      />

      {/* Background */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-skyBlue/15 rounded-full blur-[120px] -z-10"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lavender/15 rounded-full blur-[120px] -z-10"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="text-center max-w-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-800 mb-3">
          Voice Companion
        </h1>
        <p className="text-gray-500 font-body text-base">
          {greeting || 'Speak freely. We\'re here to listen.'}
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        className="glass-glow w-full max-w-2xl rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden min-h-[280px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center text-center px-4 w-full min-h-[120px]">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full border-3 border-primary/20 border-t-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-gray-400 font-body text-sm">Thinking...</p>
              </motion.div>
            ) : aiResponse ? (
              <motion.p
                key="response"
                className="text-lg font-body text-gray-700 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {aiResponse}
              </motion.p>
            ) : transcript ? (
              <motion.p
                key="transcript"
                className="text-xl font-heading font-medium text-gray-700 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {transcript}
              </motion.p>
            ) : (
              <motion.p
                key="placeholder"
                className="text-lg font-body text-gray-400 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isRecording ? 'Listening...' : 'Tap the microphone to start a session.'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Visualizer */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              className="flex items-center gap-1 h-12 w-full justify-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 0.7, height: 48 }}
              exit={{ opacity: 0, height: 0 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-to-t from-primary to-mint rounded-full"
                  animate={{
                    height: [STATIC_HEIGHTS[i], STATIC_HEIGHTS[(i + 5) % 20], STATIC_HEIGHTS[i]],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.03,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <motion.button
            onClick={toggleMute}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white transition"
            whileTap={{ scale: 0.9 }}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </motion.button>

          <motion.button
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
              isRecording
                ? 'bg-rose-500 text-white shadow-rose-500/40'
                : 'bg-gradient-to-tr from-primary to-lavender text-white shadow-primary/40'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
            transition={isRecording ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
          >
            {isRecording ? <Square size={28} /> : <Mic size={32} />}
          </motion.button>

          <motion.button
            onClick={() => setShowCamera(true)}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-gray-500 hover:text-primary hover:bg-white transition"
            whileTap={{ scale: 0.9 }}
            title="Mood check-in"
          >
            <span className="text-lg">😊</span>
          </motion.button>
        </div>

        {/* Speaking indicator */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-primary font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              /> Speaking...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

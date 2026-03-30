import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Sparkles, Loader } from 'lucide-react';
import { detectExpression, getGreeting, getExpressionEmoji, getMoodValue, loadFaceModels } from '../services/faceAnalysis';
import { saveMood, saveFacialExpression } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export default function FaceCaptureModal({ isOpen, onClose, onResult }) {
  const [stage, setStage] = useState('loading'); // loading, camera, countdown, analyzing, result
  const [countdown, setCountdown] = useState(3);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const { user } = useAuth();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const init = async () => {
      setStage('loading');
      setResult(null);
      setCountdown(3);

      await loadFaceModels();
      if (cancelled) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 }
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStage('camera');
      } catch {
        setStage('camera');
      }
    };

    init();
    return () => { cancelled = true; stopCamera(); };
  }, [isOpen, stopCamera]);

  // Auto-countdown
  useEffect(() => {
    if (stage !== 'countdown') return;
    if (countdown <= 0) {
      captureAndAnalyze();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, countdown]);

  const startCountdown = () => {
    setCountdown(3);
    setStage('countdown');
  };

  const captureAndAnalyze = async () => {
    setStage('analyzing');
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const expressionResult = await detectExpression(canvas);

      if (expressionResult) {
        const greeting = getGreeting(expressionResult.dominant);
        const emoji = getExpressionEmoji(expressionResult.dominant);
        const moodVal = getMoodValue(expressionResult.dominant);

        const finalResult = {
          expression: expressionResult.dominant,
          scores: expressionResult.scores,
          greeting,
          emoji,
          moodValue: moodVal,
        };
        setResult(finalResult);
        setStage('result');

        // Save to Firestore
        if (user) {
          saveFacialExpression(user.uid, expressionResult.dominant, expressionResult.scores);
          saveMood(user.uid, moodVal, expressionResult.dominant, 'facial');
        }

        if (onResult) onResult(finalResult);
      } else {
        // Fallback if no face detected
        const fallback = {
          expression: 'neutral',
          scores: {},
          greeting: getGreeting('neutral'),
          emoji: '😌',
          moodValue: 3,
        };
        setResult(fallback);
        setStage('result');
        if (onResult) onResult(fallback);
      }
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 glass-glow rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <div className="flex items-center gap-2">
              <Camera size={20} className="text-primary" />
              <h3 className="font-heading font-bold text-gray-800">Mood Check-in</h3>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-700 transition p-1">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 flex flex-col items-center gap-6">
            {/* Camera View */}
            {(stage === 'camera' || stage === 'countdown' || stage === 'analyzing') && (
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />

                {/* Scan line overlay */}
                {(stage === 'countdown' || stage === 'analyzing') && (
                  <div className="absolute inset-0">
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
                  </div>
                )}

                {/* Corner brackets */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/80 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/80 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/80 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/80 rounded-br-lg" />
                </div>

                {/* Countdown overlay */}
                {stage === 'countdown' && countdown > 0 && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.span
                      key={countdown}
                      className="text-7xl font-heading font-bold text-white drop-shadow-lg"
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {countdown}
                    </motion.span>
                  </motion.div>
                )}

                {/* Analyzing overlay */}
                {stage === 'analyzing' && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader className="text-white animate-spin" size={32} />
                    <p className="text-white font-body text-sm">Reading your expression...</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Loading State */}
            {stage === 'loading' && (
              <motion.div
                className="w-full aspect-[4/3] rounded-2xl bg-gray-100 flex flex-col items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-full border-3 border-primary/20 border-t-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-gray-500 font-body text-sm">Warming up the camera...</p>
              </motion.div>
            )}

            {/* Result */}
            {stage === 'result' && result && (
              <motion.div
                className="w-full flex flex-col items-center gap-5 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="text-7xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                >
                  {result.emoji}
                </motion.div>
                <p className="text-center font-heading font-bold text-gray-800 text-lg capitalize">
                  Feeling {result.expression}
                </p>
                <motion.p
                  className="text-center font-body text-gray-600 text-sm leading-relaxed px-4 max-w-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {result.greeting}
                </motion.p>
              </motion.div>
            )}

            {/* Action Button */}
            {stage === 'camera' && (
              <motion.button
                onClick={startCountdown}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-lavender text-white font-heading font-bold shadow-lg shadow-primary/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles size={18} /> Capture My Mood
              </motion.button>
            )}
            {stage === 'result' && (
              <motion.button
                onClick={handleClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-lavender text-white font-heading font-bold shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Continue to SukoonAI
              </motion.button>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

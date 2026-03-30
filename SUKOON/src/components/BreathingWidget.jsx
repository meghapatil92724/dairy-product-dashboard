import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

export default function BreathingWidget({ size = 'default' }) {
  const [breathingState, setBreathingState] = useState('inhale');
  const [timer, setTimer] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 1) return prev - 1;
          if (breathingState === 'inhale') {
            setBreathingState('hold');
            return 7;
          } else if (breathingState === 'hold') {
            setBreathingState('exhale');
            return 8;
          } else {
            setBreathingState('inhale');
            return 4;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, breathingState]);

  const toggleBreath = () => {
    if (isActive) {
      setBreathingState('inhale');
      setTimer(4);
    }
    setIsActive(!isActive);
  };

  const getMessage = () => {
    if (!isActive) return 'Ready to breathe?';
    if (breathingState === 'inhale') return 'Inhale deeply...';
    if (breathingState === 'hold') return 'Hold gently...';
    if (breathingState === 'exhale') return 'Exhale slowly...';
  };

  const isCompact = size === 'compact';
  const containerSize = isCompact ? 'w-40 h-40' : 'w-64 h-64';
  const timerSize = isCompact ? 'text-3xl' : 'text-5xl';
  const labelSize = isCompact ? 'text-[10px]' : 'text-sm';

  // Petal count
  const petalCount = 8;
  const petals = Array.from({ length: petalCount });

  // Dynamic petal scale
  const petalScale = breathingState === 'inhale' || breathingState === 'hold'
    ? (isActive ? 1 : 0.3 )
    : 0.3;

  // Ripple rings for exhale
  const showRipples = isActive && breathingState === 'exhale';

  return (
    <div className="flex flex-col items-center gap-6">
      <div className={`relative ${containerSize} flex items-center justify-center`}>
        {/* Ripple rings */}
        {showRipples && [0, 1, 2].map(i => (
          <motion.div
            key={`ripple-${i}`}
            className="absolute inset-0 rounded-full border-2 border-mint/40"
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 2.5,
              delay: i * 0.8,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Blossom petals */}
        {petals.map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute"
            style={{
              width: isCompact ? '24px' : '40px',
              height: isCompact ? '60px' : '90px',
              transformOrigin: 'center bottom',
              left: '50%',
              top: '50%',
              marginLeft: isCompact ? '-12px' : '-20px',
              marginTop: isCompact ? '-60px' : '-90px',
              rotate: `${(360 / petalCount) * i}deg`,
            }}
            animate={{
              scale: petalScale,
              opacity: isActive ? (breathingState === 'hold' ? 0.7 : breathingState === 'inhale' ? 0.8 : 0.2) : 0.2,
            }}
            transition={{
              duration: breathingState === 'inhale' ? 4 : breathingState === 'exhale' ? 8 : 0.3,
              ease: 'easeInOut',
              delay: i * 0.05,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `linear-gradient(to top, rgba(165,148,249,0.6), rgba(152,216,200,0.4))`,
                filter: 'blur(2px)',
              }}
            />
          </motion.div>
        ))}

        {/* Inner circle */}
        <motion.div
          className="absolute rounded-full bg-white/70 backdrop-blur-lg border border-white/60 flex flex-col items-center justify-center shadow-lg z-10"
          style={{
            width: isCompact ? '80px' : '140px',
            height: isCompact ? '80px' : '140px',
          }}
          animate={{
            scale: isActive
              ? (breathingState === 'inhale' ? 1.15 : breathingState === 'hold' ? 1.15 : 0.95)
              : 1,
          }}
          transition={{
            duration: breathingState === 'inhale' ? 4 : breathingState === 'exhale' ? 8 : 0.5,
            ease: 'easeInOut',
          }}
        >
          <span className={`${labelSize} font-medium text-gray-500 uppercase tracking-widest mb-0.5`}>
            {breathingState}
          </span>
          <span className={`${timerSize} font-heading font-light text-primary`}>
            {timer}
          </span>
        </motion.div>

        {/* Ambient glow behind */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-lavender/30 to-mint/30 blur-2xl -z-10"
          animate={{
            scale: isActive
              ? (breathingState === 'inhale' ? 1.5 : breathingState === 'hold' ? 1.5 : 1)
              : 1,
            opacity: isActive ? 0.8 : 0.3,
          }}
          transition={{
            duration: breathingState === 'inhale' ? 4 : breathingState === 'exhale' ? 8 : 1,
            ease: 'easeInOut',
          }}
        />
      </div>

      <p className="text-gray-500 font-body text-sm">{getMessage()}</p>

      <motion.button
        onClick={toggleBreath}
        className="px-6 py-3 rounded-full bg-primary text-white font-heading font-medium hover:bg-primaryHover transition shadow-lg hover:-translate-y-0.5 flex items-center gap-2 text-sm"
        whileTap={{ scale: 0.96 }}
      >
        {isActive ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
      </motion.button>
    </div>
  );
}

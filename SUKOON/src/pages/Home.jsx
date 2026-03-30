import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, Activity, Heart, Headphones,
  Shield, Calendar, MessageCircle, Mic, Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FaceCaptureModal from '../components/FaceCaptureModal';
import BreathingWidget from '../components/BreathingWidget';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const { user } = useAuth();
  const [showCamera, setShowCamera] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [moodEmoji, setMoodEmoji] = useState('🌸');
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  // Open camera modal on first visit
  useEffect(() => {
    const checkedToday = sessionStorage.getItem('sukoon_mood_checked');
    if (!checkedToday) {
      const timer = setTimeout(() => setShowCamera(true), 800);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setHasCheckedIn(true);
        setGreeting(sessionStorage.getItem('sukoon_greeting') || 'Welcome back! 🌿');
        setMoodEmoji(sessionStorage.getItem('sukoon_emoji') || '😌');
      }, 0);
    }
  }, []);

  const handleFaceResult = (result) => {
    setGreeting(result.greeting);
    setMoodEmoji(result.emoji);
    setHasCheckedIn(true);
    sessionStorage.setItem('sukoon_mood_checked', 'true');
    sessionStorage.setItem('sukoon_greeting', result.greeting);
    sessionStorage.setItem('sukoon_emoji', result.emoji);
  };

  const features = [
    { title: 'AI Therapist', desc: 'Talk to an AI that listens without judgment, anytime.', icon: <Heart className="text-lavender" size={24} />, path: '/chat', gradient: 'from-lavender/20 to-primary/10' },
    { title: 'Mood Dashboard', desc: 'Track your emotions and discover patterns.', icon: <Activity className="text-mint" size={24} />, path: '/dashboard', gradient: 'from-mint/20 to-skyBlue/10' },
    { title: 'Voice Companion', desc: 'Speak your mind freely with voice AI.', icon: <Mic className="text-skyBlue" size={24} />, path: '/voice', gradient: 'from-skyBlue/20 to-mint/10' },
    { title: 'Wellness Exercises', desc: 'Breathing, meditation, and calming sounds.', icon: <Sparkles className="text-yellow-400" size={24} />, path: '/wellness', gradient: 'from-yellow-100/40 to-orange-100/20' },
    { title: 'Emergency Support', desc: '24/7 crisis helplines and grounding tools.', icon: <Shield className="text-rose-400" size={24} />, path: '/emergency', gradient: 'from-rose-100/40 to-pink-100/20' },
    { title: 'Book a Session', desc: 'Connect with certified therapists near you.', icon: <Calendar className="text-primary" size={24} />, path: '/booking', gradient: 'from-primary/10 to-lavender/10' },
  ];

  const userName = user?.displayName?.split(' ')[0] || 'friend';

  return (
    <div className="flex flex-col gap-20 pt-4 pb-24">
      {/* Face Capture Modal */}
      <FaceCaptureModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onResult={handleFaceResult}
      />

      {/* ===== HERO SECTION ===== */}
      <motion.section
        className="text-center max-w-3xl mx-auto flex flex-col items-center gap-6 pt-8"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel text-sm font-medium text-primary mb-4">
            <Sparkles size={16} /> A sanctuary for your thoughts
          </div>
        </motion.div>

        {/* Mood emoji + greeting */}
        {hasCheckedIn && (
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <span className="text-5xl">{moodEmoji}</span>
            <p className="text-gray-600 font-body text-base max-w-md px-4">{greeting}</p>
          </motion.div>
        )}

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-gray-800 leading-tight"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Hey {userName},<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-lavender">
            how are you feeling?
          </span>
        </motion.h1>

        <motion.p
          className="text-lg text-gray-500 font-body px-4 max-w-xl"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Your calm, supportive AI companion — navigating stress and anxiety doesn't have to be a solo journey.
        </motion.p>

        <motion.div
          className="flex gap-4 flex-wrap justify-center"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            to="/chat"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-lavender text-white font-heading font-bold shadow-xl shadow-lavender/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
          >
            <MessageCircle size={20} /> Start Chatting
          </Link>
          <button
            onClick={() => setShowCamera(true)}
            className="px-6 py-4 rounded-full glass border border-primary/20 text-primary font-heading font-bold hover:bg-white/80 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
          >
            <Camera size={20} /> Mood Check-in
          </button>
        </motion.div>
      </motion.section>

      {/* ===== FEATURES SECTION ===== */}
      <motion.section
        className="max-w-5xl mx-auto w-full px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <motion.h2
          className="text-2xl font-heading font-bold text-gray-800 mb-8 text-center"
          variants={fadeInUp}
        >
          Everything you need, in one place
        </motion.h2>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" variants={stagger}>
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Link
                to={f.path}
                className={`block glass p-7 rounded-3xl hover:bg-white/80 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br ${f.gradient}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-heading font-bold text-gray-800 mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-body">{f.desc}</p>
                <ArrowRight size={16} className="mt-3 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ===== BREATHING SECTION ===== */}
      <motion.section
        className="max-w-3xl mx-auto w-full px-4 flex flex-col items-center gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.div className="text-center" variants={fadeInUp}>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">Take a Breath</h2>
          <p className="text-gray-500 font-body text-sm">The 4-7-8 technique to calm your nervous system</p>
        </motion.div>

        <motion.div
          className="glass rounded-[2.5rem] p-10 w-full max-w-xl flex flex-col items-center relative overflow-hidden"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-mint/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-lavender/20 rounded-full blur-3xl -ml-16 -mb-16" />
          <BreathingWidget size="compact" />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Link
            to="/wellness"
            className="text-primary font-heading font-medium text-sm hover:underline flex items-center gap-1"
          >
            Open full Wellness Sanctuary <ArrowRight size={14} />
          </Link>
        </motion.div>
      </motion.section>

      {/* ===== MOOD MINI-GRAPH SECTION ===== */}
      <motion.section
        className="max-w-3xl mx-auto w-full px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.div className="text-center mb-6" variants={fadeInUp}>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">Your Mood This Week</h2>
          <p className="text-gray-500 font-body text-sm">See how your emotions have evolved</p>
        </motion.div>

        <motion.div
          className="glass rounded-3xl p-8"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <MiniMoodChart />
          <div className="text-center mt-4">
            <Link to="/dashboard" className="text-primary font-heading font-medium text-sm hover:underline flex items-center justify-center gap-1">
              View full dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}

// Simple inline mood chart component
function MiniMoodChart() {
  const days = [
    { day: 'Mon', mood: 3, color: 'bg-yellow-400' },
    { day: 'Tue', mood: 4, color: 'bg-mint' },
    { day: 'Wed', mood: 2, color: 'bg-rose-400' },
    { day: 'Thu', mood: 5, color: 'bg-mint' },
    { day: 'Fri', mood: 4, color: 'bg-lavender' },
    { day: 'Sat', mood: 5, color: 'bg-mint' },
    { day: 'Sun', mood: 4, color: 'bg-lavender' },
  ];

  return (
    <div className="flex items-end justify-between h-32 gap-2">
      {days.map((d, i) => (
        <motion.div
          key={d.day}
          className="flex flex-col items-center gap-2 flex-1 group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          viewport={{ once: true }}
        >
          <div
            className={`w-full max-w-[36px] rounded-xl ${d.color}/60 transition-all group-hover:opacity-100 opacity-80 relative`}
            style={{ height: `${(d.mood / 5) * 100}%` }}
          >
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-heading font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition">
              {d.mood}/5
            </span>
          </div>
          <span className="text-xs font-medium text-gray-400">{d.day}</span>
        </motion.div>
      ))}
    </div>
  );
}

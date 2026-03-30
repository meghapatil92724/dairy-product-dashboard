import { motion } from 'framer-motion';
import { Activity, Wind, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  // Mock data — in production, pull from Firestore
  const weeklyMoods = [
    { day: 'Mon', mood: 3, happy: 30, sad: 50, neutral: 20 },
    { day: 'Tue', mood: 4, happy: 60, sad: 20, neutral: 20 },
    { day: 'Wed', mood: 2, happy: 15, sad: 65, neutral: 20 },
    { day: 'Thu', mood: 5, happy: 75, sad: 10, neutral: 15 },
    { day: 'Fri', mood: 4, happy: 55, sad: 25, neutral: 20 },
    { day: 'Sat', mood: 5, happy: 80, sad: 5, neutral: 15 },
    { day: 'Sun', mood: 5, happy: 70, sad: 10, neutral: 20 },
  ];

  const expressionData = [
    { day: 'Mon', happy: 35, sad: 45, neutral: 20 },
    { day: 'Tue', happy: 55, sad: 25, neutral: 20 },
    { day: 'Wed', happy: 20, sad: 60, neutral: 20 },
    { day: 'Thu', happy: 70, sad: 10, neutral: 20 },
    { day: 'Fri', happy: 50, sad: 30, neutral: 20 },
    { day: 'Sat', happy: 75, sad: 10, neutral: 15 },
    { day: 'Sun', happy: 65, sad: 15, neutral: 20 },
  ];

  return (
    <div className="flex flex-col gap-8 pb-16">
      <motion.header
        className="mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-heading font-extrabold text-gray-800 flex items-center gap-3">
          <Activity className="text-primary" /> Mood Dashboard
        </h1>
        <p className="text-gray-500 font-body mt-2">
          Track your emotional resonance and facial expression patterns.
        </p>
      </motion.header>

      {/* Overview Cards */}
      <motion.div
        className="grid md:grid-cols-3 gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div className="glass p-6 rounded-3xl relative overflow-hidden group" variants={fadeInUp}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-mint/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
          <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Current Mood</h3>
          <div className="text-3xl font-heading font-bold text-gray-800 flex items-center gap-3">
            Calm <Wind className="text-mint" size={28} />
          </div>
        </motion.div>

        <motion.div className="glass p-6 rounded-3xl relative overflow-hidden group" variants={fadeInUp}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-lavender/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
          <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Weekly Average</h3>
          <div className="text-3xl font-heading font-bold text-gray-800">
            4.0 <span className="text-lg text-gray-400">/ 5</span>
          </div>
          <p className="text-emerald-500 text-sm mt-1 font-medium flex items-center gap-1">
            <TrendingUp size={14} /> 12% improvement
          </p>
        </motion.div>

        <motion.div className="glass p-6 rounded-3xl relative overflow-hidden group" variants={fadeInUp}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-300/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
          <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Check-ins</h3>
          <div className="text-3xl font-heading font-bold text-gray-800 flex items-center gap-2">
            7 <Calendar size={22} className="text-primary" />
          </div>
          <p className="text-gray-400 text-sm mt-1">this week</p>
        </motion.div>
      </motion.div>

      {/* Mood Trend Chart */}
      <motion.div
        className="glass p-8 rounded-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-heading font-bold text-gray-800 mb-6">Weekly Mood Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyMoods}>
            <defs>
              <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A594F9" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#A594F9" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                fontSize: '13px',
              }}
            />
            <Area type="monotone" dataKey="mood" stroke="#A594F9" strokeWidth={3} fill="url(#moodGrad)" dot={{ r: 4, fill: '#A594F9', strokeWidth: 2, stroke: '#fff' }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Facial Expression Chart */}
      <motion.div
        className="glass p-8 rounded-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-heading font-bold text-gray-800 mb-2">Facial Expression Analysis</h3>
        <p className="text-gray-400 text-sm mb-6 font-body">How your face told your story this week</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={expressionData}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                fontSize: '13px',
              }}
            />
            <Line type="monotone" dataKey="happy" stroke="#98D8C8" strokeWidth={2.5} dot={{ r: 3, fill: '#98D8C8' }} name="😊 Happy" />
            <Line type="monotone" dataKey="sad" stroke="#FFB6C1" strokeWidth={2.5} dot={{ r: 3, fill: '#FFB6C1' }} name="😢 Sad" />
            <Line type="monotone" dataKey="neutral" stroke="#95D5EE" strokeWidth={2} dot={{ r: 3, fill: '#95D5EE' }} name="😌 Neutral" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <span className="flex items-center gap-1.5 text-sm font-body text-gray-500">
            <span className="w-3 h-3 rounded-full bg-mint inline-block" /> Happy
          </span>
          <span className="flex items-center gap-1.5 text-sm font-body text-gray-500">
            <span className="w-3 h-3 rounded-full bg-roseGlow inline-block" /> Sad
          </span>
          <span className="flex items-center gap-1.5 text-sm font-body text-gray-500">
            <span className="w-3 h-3 rounded-full bg-skyBlue inline-block" /> Neutral
          </span>
        </div>
      </motion.div>
    </div>
  );
}

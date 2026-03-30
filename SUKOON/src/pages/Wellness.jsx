import { motion } from 'framer-motion';
import { Play, Music } from 'lucide-react';
import BreathingWidget from '../components/BreathingWidget';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Wellness() {
  const sounds = [
    { name: 'Soft Rain', duration: '10 min' },
    { name: 'Forest Walk', duration: '15 min' },
    { name: 'Deep Space', duration: '20 min' },
    { name: 'Piano Flow', duration: '12 min' },
  ];

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto items-center pb-16">
      {/* Header */}
      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-800 mb-3">
          Wellness Sanctuary
        </h1>
        <p className="text-gray-500 font-body text-base">
          Take a moment for yourself. Breathe, listen, and reset.
        </p>
      </motion.div>

      {/* Breathing Exercise */}
      <motion.section
        className="glass rounded-[2.5rem] p-10 md:p-14 w-full max-w-2xl flex flex-col items-center gap-6 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-mint/20 rounded-full blur-3xl opacity-50 -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lavender/20 rounded-full blur-3xl opacity-50 -ml-20 -mb-20" />

        <h2 className="text-xl font-heading font-bold text-gray-800 z-10">4-7-8 Breathing</h2>

        <div className="z-10">
          <BreathingWidget size="default" />
        </div>
      </motion.section>

      {/* Sounds Grid */}
      <motion.section
        className="w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.h2
          className="text-xl font-heading font-bold text-gray-800 mb-6 px-4"
          variants={fadeInUp}
        >
          Calming Soundscapes
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {sounds.map((s) => (
            <motion.div
              key={s.name}
              className="glass p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white/80 transition shadow-sm hover:shadow-md"
              variants={fadeInUp}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Music size={18} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-gray-800">{s.name}</h4>
                  <span className="text-xs text-gray-400">{s.duration}</span>
                </div>
              </div>
              <Play size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

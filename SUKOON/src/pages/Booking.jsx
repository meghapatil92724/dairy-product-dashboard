import { Calendar, Clock, UserCheck } from 'lucide-react';

export default function Booking() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto px-4 pt-10 pb-20">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-heading font-extrabold text-[#2c2f30] mb-4">Book a Therapist</h1>
        <p className="text-gray-500 font-body text-lg">Schedule a session with a licensed professional.</p>
      </div>

      <div className="glass rounded-[3rem] p-8 md:p-12 shadow-xl border border-white/50">
        <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-heading">What are you struggling with?</label>
            <select className="w-full bg-white/50 border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 transition text-gray-700">
              <option>Anxiety & Stress</option>
              <option>Depression</option>
              <option>Academic/Career Pressure</option>
              <option>Relationship Issues</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-heading flex items-center gap-2">
                <Calendar size={16} className="text-primary"/> Select Date
              </label>
              <input type="date" className="w-full bg-white/50 border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 transition text-gray-700 font-body" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-heading flex items-center gap-2">
                <Clock size={16} className="text-primary"/> Select Time
              </label>
              <input type="time" className="w-full bg-white/50 border border-black/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 transition text-gray-700 font-body" />
            </div>
          </div>

          <div className="mt-4 bg-primary/5 rounded-2xl p-6 border border-primary/10">
            <h4 className="font-heading font-bold text-gray-800 mb-2 flex items-center gap-2">
              <UserCheck size={18} className="text-primary"/> Session details
            </h4>
            <p className="text-sm text-gray-600 font-body">This is a mock booking system for SukoonAI. In a production environment, this would integrate with a real therapist directory and booking API.</p>
          </div>

          <button className="w-full mt-4 bg-gradient-to-r from-primary to-lavender text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg">
            Confirm Booking
          </button>
        </form>
      </div>
      
    </div>
  );
}

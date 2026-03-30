import { PhoneCall, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function Emergency() {
  const helplines = [
    { name: 'Kiran Mental Health Helpline', number: '1800-599-0019', org: 'Govt. of India', available: '24/7' },
    { name: 'Vandrevala Foundation', number: '9999 666 555', org: 'NGO', available: '24/7' },
    { name: 'AASRA', number: '9820466726', org: 'Crisis Intervention Center', available: '24/7' },
    { name: 'Snehi', number: '011-65978181', org: 'Psychosocial Support', available: '10 AM to 6 PM' }
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-8 max-w-4xl mx-auto px-4 mt-8">
      
      {/* Panic Button Area */}
      <section className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/20 rounded-full text-rose-600">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-rose-700 mb-2">Feeling overwhelmed right now?</h2>
            <p className="text-rose-600/80 font-body">It's okay. You are not alone. Follow our guided grounding protocol immediately.</p>
          </div>
        </div>
        <button className="shrink-0 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg flex items-center gap-2">
          Start Panic Relief
        </button>
      </section>

      {/* Helplines */}
      <section className="mt-8">
        <h2 className="text-3xl font-heading font-bold text-gray-800 mb-6 flex items-center gap-3">
          <PhoneCall className="text-primary" /> Indian Helplines
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {helplines.map(line => (
            <div key={line.number} className="glass p-6 rounded-3xl group hover:bg-white/90 transition shadow-sm border border-white/50">
              <h3 className="text-xl font-heading font-bold text-gray-800 mb-1">{line.name}</h3>
              <p className="text-sm font-medium text-gray-500 mb-4">{line.org} • {line.available}</p>
              
              <a href={`tel:${line.number}`} className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-100 group-hover:bg-primary/10 group-hover:text-primary font-bold text-gray-700 transition">
                <PhoneCall size={16} /> {line.number}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Grounding Tip */}
      <section className="glass rounded-[2rem] p-8 mt-4 flex items-center gap-6 border-l-4 border-l-skyBlue">
        <HeartHandshake size={40} className="text-skyBlue shrink-0" />
        <div>
          <h3 className="text-lg font-heading font-bold text-gray-800 mb-1">5-4-3-2-1 Grounding Technique</h3>
          <p className="text-sm text-gray-600 font-body">
            Acknowledge <strong>5</strong> things you see, <strong>4</strong> things you can touch, <strong>3</strong> things you can hear, <strong>2</strong> things you can smell, and <strong>1</strong> thing you can taste. This brings you back to the present moment.
          </p>
        </div>
      </section>

    </div>
  );
}

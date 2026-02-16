import React, { useState, useEffect } from 'react';
import { fetchDailyStudy } from '../services/geminiService';
import { BibleStudy } from '../types';
import { Sparkles, Heart, MessageSquare, Send } from 'lucide-react';

const StudyView: React.FC = () => {
  const [study, setStudy] = useState<BibleStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyStudy().then(setStudy).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-12 bg-stone-200 rounded-2xl w-3/4 mx-auto"></div>
    <div className="h-64 bg-stone-200 rounded-3xl"></div>
  </div>;

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      <header className="text-center space-y-4">
        <div className="inline-flex bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-xs font-bold uppercase">Mergulho Profundo</div>
        <h2 className="text-4xl font-serif font-bold text-stone-900">{study?.theme}</h2>
        <p className="text-emerald-600 font-bold">{study?.reference}</p>
      </header>

      <section className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-800 flex items-center gap-2">
            <Sparkles className="text-amber-500" size={20} /> Contexto Histórico
          </h3>
          <p className="text-stone-600 leading-relaxed text-lg italic">{study?.context}</p>
        </div>

        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 space-y-4">
          <h3 className="font-bold text-emerald-900 flex items-center gap-2">
            <Heart className="text-emerald-500 fill-emerald-500" size={20} /> Aplicação Prática
          </h3>
          <p className="text-emerald-800 leading-relaxed text-lg">{study?.application}</p>
        </div>
      </section>

      <section className="space-y-4">
        <label className="font-bold text-stone-800 flex items-center gap-2 px-2">
          <MessageSquare size={18} /> Sua Reflexão
        </label>
        <div className="relative">
          <textarea 
            placeholder="O que esta palavra ensina para você hoje?" 
            className="w-full h-40 p-6 rounded-3xl border-2 border-stone-100 focus:border-emerald-200 outline-none transition-all text-lg bg-white resize-none"
          />
          <button className="absolute bottom-4 right-4 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg hover:bg-emerald-700 transition-colors">
            <Send size={20} />
          </button>
        </div>
      </section>

      <section className="bg-emerald-950 text-white rounded-[40px] p-10 md:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500"></div>
        <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Oração do Dia</h3>
        <p className="text-2xl md:text-3xl font-serif italic leading-snug opacity-90">
          "{study?.prayer}"
        </p>
        <p className="text-emerald-500 font-serif italic text-xl pt-4">— Amém.</p>
      </section>
    </div>
  );
};

export default StudyView;
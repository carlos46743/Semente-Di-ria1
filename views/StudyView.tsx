
import React, { useState, useEffect } from 'react';
import { fetchDailyStudy } from '../services/geminiService';
import { BibleStudy } from '../types';
import { CheckCircle, MessageSquare, PenTool, Share2, AlertCircle, RefreshCw } from 'lucide-react';

const StudyView: React.FC = () => {
  const [study, setStudy] = useState<BibleStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDailyStudy();
      setStudy(data);
    } catch (e: any) {
      console.error(e);
      setError("Não foi possível carregar o estudo detalhado no momento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveNote = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-stone-500">Mergulhando nas Escrituras...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6">
      <div className="bg-rose-50 p-6 rounded-full text-rose-500">
        <AlertCircle size={48} />
      </div>
      <h3 className="text-xl font-bold text-stone-800">{error}</h3>
      <button 
        onClick={loadData}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md"
      >
        <RefreshCw size={20} /> Tentar Novamente
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
      <header className="text-center space-y-4">
        <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
          Estudo Profundo
        </span>
        <h2 className="text-4xl font-serif font-bold text-stone-900">{study?.theme}</h2>
        <p className="text-emerald-600 font-bold text-lg">{study?.reference}</p>
      </header>

      <section className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-stone-800">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle size={18} />
          </div>
          Contexto e Entendimento
        </h3>
        <p className="text-stone-600 leading-relaxed text-lg">
          {study?.context}
        </p>
      </section>

      <section className="bg-emerald-50 rounded-3xl p-8 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-900">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
            <PenTool size={18} />
          </div>
          Aplicação Prática
        </h3>
        <p className="text-emerald-800 leading-relaxed italic">
          "{study?.application}"
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <MessageSquare size={18} className="text-stone-400" />
            Suas Reflexões
          </h3>
          <button 
            onClick={() => {
              navigator.share?.({
                title: 'Semente Diária',
                text: `${study?.verse} - ${study?.reference}`,
              }).catch(console.error);
            }}
            className="text-stone-500 hover:text-emerald-600 transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="O que Deus falou ao seu coração hoje?"
          className="w-full h-40 p-6 rounded-2xl border-2 border-stone-100 focus:border-emerald-200 focus:ring-0 outline-none transition-all text-stone-700 resize-none bg-stone-50/50"
        />
        <div className="flex justify-end">
          <button 
            onClick={handleSaveNote}
            className={`px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 ${
              saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
            }`}
          >
            {saved ? 'Salvo no Diário!' : 'Salvar Reflexão'}
          </button>
        </div>
      </section>

      <section className="bg-stone-900 text-stone-100 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
        <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Oração de Hoje</h3>
        <p className="text-2xl font-serif italic leading-relaxed opacity-90">
          "{study?.prayer}"
        </p>
        <div className="pt-4">
          <span className="text-stone-500 italic">— Amém.</span>
        </div>
      </section>
    </div>
  );
};

export default StudyView;

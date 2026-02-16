
import React, { useState, useEffect } from 'react';
import { Play, Star, Calendar, Volume2, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchDailyStudy, generateAudio, decodeAudioData } from '../services/geminiService';
import { BibleStudy } from '../types';

const HomeView: React.FC = () => {
  const [study, setStudy] = useState<BibleStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDailyStudy();
      setStudy(data);
    } catch (e: any) {
      console.error("UI Error Catch:", e);
      // Tenta extrair a mensagem de erro da API ou usa uma genérica
      const msg = e.message || "Não foi possível conectar com o servidor celestial.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAudio = async () => {
    if (!study || playing) return;
    setPlaying(true);
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const raw = await generateAudio(`${study.verse}. Pensamento de hoje: ${study.application}`);
      const buffer = await decodeAudioData(raw, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setPlaying(false);
      source.start();
    } catch (e) {
      console.error("Audio Playback Error:", e);
      setPlaying(false);
    }
  };

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-stone-400">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-inner"></div>
      <p className="font-serif italic animate-pulse">Buscando alimento espiritual...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="bg-rose-50 p-6 rounded-3xl text-rose-500 animate-bounce"><AlertCircle size={48} /></div>
      <div className="max-w-md space-y-4">
        <h3 className="text-xl font-bold text-stone-800">Ops! Tivemos um problema</h3>
        <div className="bg-stone-100 p-4 rounded-2xl text-stone-600 text-sm font-mono break-words">
          {error}
        </div>
        <p className="text-stone-500 text-sm italic">Isso pode ocorrer por instabilidade na rede ou configuração da chave de API.</p>
      </div>
      <button onClick={load} className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-all">
        <RefreshCw size={18} /> Tentar Novamente
      </button>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-stone-800">Paz do Senhor,</h2>
          <p className="text-stone-500 flex items-center gap-2 mt-1">
            <Calendar size={16} /> {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 text-stone-400 font-bold text-sm bg-white px-4 py-2 rounded-2xl border border-stone-100">
          <Star className="text-amber-400 fill-amber-400" size={16} /> 7 Dias Seguidos
        </div>
      </header>

      <section className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-stone-100 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="inline-flex bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            Versículo do Dia
          </div>
          
          <div className="space-y-4">
            <p className="text-3xl md:text-4xl font-serif italic text-stone-800 leading-tight">
              "{study?.verse}"
            </p>
            <p className="text-emerald-600 font-bold text-xl">— {study?.reference}</p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={handleAudio}
              disabled={playing}
              className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-bold transition-all transform active:scale-95 shadow-xl ${playing ? 'bg-stone-100 text-stone-400' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200'}`}
            >
              {playing ? <Volume2 className="animate-bounce" /> : <Play fill="currentColor" size={20} />}
              {playing ? 'Ouvindo...' : 'Ouvir Devocional'}
            </button>
            <button className="flex items-center gap-3 bg-white border border-stone-200 text-stone-700 px-8 py-4 rounded-3xl font-bold hover:bg-stone-50 transition-all">
              <Star size={20} /> Salvar
            </button>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-center justify-between group cursor-pointer hover:bg-amber-100/50 transition-colors">
          <div className="space-y-1">
            <h4 className="font-bold text-amber-900">Quiz Bíblico</h4>
            <p className="text-sm text-amber-700/70">Teste seus conhecimentos hoje</p>
          </div>
          <div className="bg-white p-3 rounded-2xl text-amber-500 shadow-sm group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </div>
        </div>
        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex items-center justify-between group cursor-pointer hover:bg-emerald-100/50 transition-colors">
          <div className="space-y-1">
            <h4 className="font-bold text-emerald-900">Jornada de Fé</h4>
            <p className="text-sm text-emerald-700/70">Continuar de onde parou</p>
          </div>
          <div className="bg-white p-3 rounded-2xl text-emerald-500 shadow-sm group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;

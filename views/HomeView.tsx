
import React, { useState, useEffect } from 'react';
import { Play, Calendar, Star, TrendingUp, BookOpen, Award } from 'lucide-react';
import { fetchDailyStudy, generateAudioDevotional, decodeAudioData } from '../services/geminiService';
import { BibleStudy } from '../types';

const HomeView: React.FC = () => {
  const [study, setStudy] = useState<BibleStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('bible_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }

    const load = async () => {
      try {
        const data = await fetchDailyStudy();
        setStudy(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePlayAudio = async () => {
    if (!study || playing) return;
    setPlaying(true);
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioData = await generateAudioDevotional(study.verse + ". " + study.application);
      const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setPlaying(false);
      source.start();
    } catch (e) {
      console.error(e);
      setPlaying(false);
    }
  };

  const isFavorited = study ? favorites.includes(study.reference) : false;

  const toggleFavorite = () => {
    if (!study) return;
    
    let newFavorites: string[];
    if (isFavorited) {
      newFavorites = favorites.filter(ref => ref !== study.reference);
    } else {
      newFavorites = [...favorites, study.reference];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('bible_favorites', JSON.stringify(newFavorites));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-stone-500 font-medium italic">Preparando seu alimento espiritual...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-800">Olá, Irmão(ã)</h2>
        <p className="text-stone-500 flex items-center gap-2">
          <Calendar size={16} /> {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </header>

      {/* Verse of the Day Card */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <BookOpen size={120} />
        </div>
        <div className="relative z-10 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Versículo do Dia</span>
          <blockquote className="space-y-4">
            <p className="text-2xl md:text-3xl font-serif italic text-stone-800 leading-relaxed">
              "{study?.verse}"
            </p>
            <cite className="block text-emerald-700 font-bold not-italic">— {study?.reference}</cite>
          </blockquote>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={handlePlayAudio}
              disabled={playing}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-6 py-3 rounded-full font-bold transition-all transform active:scale-95 shadow-md"
            >
              <Play size={20} fill="currentColor" />
              {playing ? 'Ouvindo...' : 'Ouvir Devocional'}
            </button>
            <button 
              onClick={toggleFavorite}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold border transition-all transform active:scale-95 ${
                isFavorited 
                ? 'bg-amber-50 border-amber-200 text-amber-600' 
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Star size={20} fill={isFavorited ? "currentColor" : "none"} />
              {isFavorited ? 'Favoritado' : 'Favoritar'}
            </button>
          </div>
        </div>
      </section>

      {/* Progress & Stats */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-2xl p-6 flex items-center gap-4">
          <div className="bg-emerald-600 text-white p-3 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-emerald-900/60 text-sm font-bold uppercase tracking-wider">Sementes de Hoje</p>
            <p className="text-2xl font-bold text-emerald-900">7 Dias de Fé</p>
          </div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-6 flex items-center gap-4">
          <div className="bg-amber-500 text-white p-3 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <p className="text-amber-900/60 text-sm font-bold uppercase tracking-wider">Nível Espiritual</p>
            <p className="text-2xl font-bold text-amber-900">Explorador da Palavra</p>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-stone-800">Próximos Passos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <h4 className="font-bold text-stone-800 mb-2">Desafio: 7 dias sem murmuração</h4>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[40%]"></div>
            </div>
            <p className="text-xs text-stone-500 mt-2">Dia 3 de 7 • 40% concluído</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <h4 className="font-bold text-stone-800 mb-2">Plano: Ansiedade e Paz</h4>
            <p className="text-sm text-stone-500">Continue sua leitura de hoje sobre como entregar suas preocupações.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;

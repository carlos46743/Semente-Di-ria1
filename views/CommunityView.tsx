import React, { useState } from 'react';
import { Heart, MessageSquare, Plus, User, HandsPraying } from 'lucide-react';
import { PrayerRequest } from '../types';

const INITIAL: PrayerRequest[] = [
  { id: '1', user: 'Maria de Fátima', request: 'Pela cirurgia do meu neto que acontecerá amanhã cedo.', likes: 12, timestamp: Date.now() - 3600000 },
  { id: '2', user: 'Ricardo Santos', request: 'Agradecimento por uma causa na justiça que foi resolvida hoje!', likes: 45, timestamp: Date.now() - 7200000 },
  { id: '3', user: 'Ana Clara', request: 'Orem pelo meu discernimento espiritual em um novo projeto.', likes: 28, timestamp: Date.now() - 10000000 },
];

const CommunityView: React.FC = () => {
  const [requests, setRequests] = useState(INITIAL);
  const [input, setInput] = useState("");

  const post = () => {
    if (!input.trim()) return;
    setRequests([{ id: Date.now().toString(), user: 'Você', request: input, likes: 0, timestamp: Date.now() }, ...requests]);
    setInput("");
  };

  const toggleAmen = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, likes: r.isAmen ? r.likes - 1 : r.likes + 1, isAmen: !r.isAmen } : r));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-20">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-800">Círculo de Oração</h2>
        <p className="text-stone-500">Levando as cargas uns dos outros em amor.</p>
      </header>

      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-stone-100 space-y-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Compartilhe seu pedido ou testemunho..."
          className="w-full p-6 bg-stone-50 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 border border-transparent focus:border-emerald-100 transition-all resize-none min-h-[120px] text-lg"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-stone-400 italic font-medium">Sua mensagem será vista por todos</span>
          <button onClick={post} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2">
            <Plus size={20} /> Publicar
          </button>
        </div>
      </section>

      <div className="space-y-6">
        {requests.map(req => (
          <article key={req.id} className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm transition-all hover:shadow-md animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                <User size={24} />
              </div>
              <div>
                <h4 className="font-bold text-stone-800">{req.user}</h4>
                <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">Postado agora</p>
              </div>
            </div>
            
            <p className="text-stone-700 leading-relaxed text-lg mb-8">
              "{req.request}"
            </p>
            
            <div className="flex items-center gap-4 pt-6 border-t border-stone-50">
              <button 
                onClick={() => toggleAmen(req.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${req.isAmen ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
              >
                <Heart size={18} fill={req.isAmen ? "currentColor" : "none"} />
                <span>Amém ({req.likes})</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CommunityView;
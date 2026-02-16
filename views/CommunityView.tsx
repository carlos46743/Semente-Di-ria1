
import React, { useState } from 'react';
import { Heart, MessageSquare, Plus, Search, User } from 'lucide-react';
import { PrayerRequest } from '../types';

const INITIAL_REQUESTS: PrayerRequest[] = [
  { id: '1', user: 'Maria S.', request: 'Peço oração pela saúde do meu filho que está com febre alta.', likes: 12, timestamp: Date.now() - 3600000 },
  { id: '2', user: 'João P.', request: 'Agradecimento por uma porta de emprego que se abriu hoje!', likes: 45, timestamp: Date.now() - 7200000 },
  { id: '3', user: 'Ana Paula', request: 'Orem pela restauração do meu casamento e sabedoria nas palavras.', likes: 28, timestamp: Date.now() - 10000000 },
];

const CommunityView: React.FC = () => {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [newRequest, setNewRequest] = useState("");

  const handlePost = () => {
    if (!newRequest.trim()) return;
    const item: PrayerRequest = {
      id: Date.now().toString(),
      user: 'Você',
      request: newRequest,
      likes: 0,
      timestamp: Date.now()
    };
    setRequests([item, ...requests]);
    setNewRequest("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-800">Círculo de Oração</h2>
        <p className="text-stone-500">Levando as cargas uns dos outros em amor.</p>
      </header>

      {/* Post Box */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 space-y-4">
        <textarea
          value={newRequest}
          onChange={(e) => setNewRequest(e.target.value)}
          placeholder="Compartilhe seu pedido ou agradecimento..."
          className="w-full p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all resize-none min-h-[100px]"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-stone-400 italic">Moderado por IA para segurança da comunidade</span>
          <button 
            onClick={handlePost}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md active:scale-95"
          >
            <Plus size={18} /> Publicar
          </button>
        </div>
      </section>

      {/* Wall */}
      <div className="space-y-4">
        {requests.map((req) => (
          <article key={req.id} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <User size={20} />
              </div>
              <div>
                <h4 className="font-bold text-stone-800 leading-none">{req.user}</h4>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                  {new Date(req.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <p className="text-stone-700 leading-relaxed mb-6">
              {req.request}
            </p>
            <div className="flex items-center gap-6 pt-4 border-t border-stone-50">
              <button className="flex items-center gap-2 text-stone-400 hover:text-rose-500 transition-colors">
                <Heart size={20} className={req.likes > 20 ? 'fill-rose-500 text-rose-500' : ''} />
                <span className="text-sm font-bold italic">Estou em oração ({req.likes})</span>
              </button>
              <button className="flex items-center gap-2 text-stone-400 hover:text-blue-500 transition-colors">
                <MessageSquare size={20} />
                <span className="text-sm font-bold">Amém</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CommunityView;

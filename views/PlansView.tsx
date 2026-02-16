
import React from 'react';
import { StudyPlan } from '../types';
import { Heart, Shield, Sparkles, Users, Zap, ArrowRight } from 'lucide-react';

const PLANS: StudyPlan[] = [
  { id: '1', title: 'Fé em Tempos Difíceis', description: 'Encontre força na Palavra durante as tempestades da vida.', durationDays: 7, category: 'faith' },
  { id: '2', title: 'O Propósito de Deus', description: 'Descubra a vontade do Pai para sua jornada terrena.', durationDays: 14, category: 'purpose' },
  { id: '3', title: 'Ansiedade e Paz Real', description: 'Como descansar na promessa de Jesus.', durationDays: 7, category: 'peace' },
  { id: '4', title: 'Família e Aliança', description: 'Fortalecendo os laços sagrados do lar.', durationDays: 10, category: 'family' },
  { id: '5', title: 'Crescimento Espiritual', description: 'Passos práticos para uma vida cristã madura.', durationDays: 30, category: 'growth' },
];

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'faith': return <Zap className="text-amber-500" />;
    case 'purpose': return <Sparkles className="text-purple-500" />;
    case 'peace': return <Heart className="text-rose-500" />;
    case 'family': return <Users className="text-blue-500" />;
    default: return <Shield className="text-emerald-500" />;
  }
};

const PlansView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-800">Planos de Leitura</h2>
        <p className="text-stone-500">Jornadas guiadas para aprofundar seu conhecimento.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLANS.map((plan) => (
          <div key={plan.id} className="group bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-stone-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                <CategoryIcon category={plan.category} />
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-stone-100 rounded-full text-stone-600">
                {plan.durationDays} dias
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">{plan.title}</h3>
            <p className="text-stone-500 text-sm mb-6">{plan.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img key={i} src={`https://picsum.photos/seed/${plan.id+i}/32/32`} alt="user" className="w-8 h-8 rounded-full border-2 border-white" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-500">
                  +1k
                </div>
              </div>
              <button className="flex items-center gap-2 text-emerald-600 font-bold group-hover:gap-3 transition-all">
                Iniciar Plano <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-emerald-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-serif font-bold">Personalizar meu estudo</h3>
          <p className="text-emerald-100/70">Deixe a IA criar um plano específico para seu momento.</p>
        </div>
        <button className="whitespace-nowrap bg-emerald-400 hover:bg-emerald-300 text-emerald-900 px-8 py-3 rounded-full font-bold transition-all transform active:scale-95">
          Criar Plano com IA
        </button>
      </section>
    </div>
  );
};

export default PlansView;

import React, { useState, useEffect } from 'react';
import { fetchDailyQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, Trophy, HelpCircle, RefreshCw } from 'lucide-react';

const QuizView: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setSelected(null);
    try {
      setQuiz(await fetchDailyQuiz());
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-stone-400 italic">Preparando desafio...</p>
  </div>;

  return (
    <div className="max-w-xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
      <header className="text-center space-y-4">
        <div className="bg-amber-100 text-amber-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Trophy size={32} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 leading-tight">
          {quiz?.question}
        </h2>
      </header>

      <div className="space-y-4">
        {quiz?.options.map((opt, idx) => {
          const isCorrect = idx === quiz.correctIndex;
          const isSelected = selected === idx;
          const revealed = selected !== null;

          let style = "bg-white border-stone-200 text-stone-700 hover:border-amber-300";
          if (revealed) {
            if (isCorrect) style = "bg-emerald-50 border-emerald-500 text-emerald-900";
            else if (isSelected) style = "bg-rose-50 border-rose-500 text-rose-900";
            else style = "bg-white border-stone-100 text-stone-300 opacity-50";
          }

          return (
            <button
              key={idx}
              disabled={revealed}
              onClick={() => setSelected(idx)}
              className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center justify-between text-left group ${style}`}
            >
              <span className="font-semibold text-lg">{opt}</span>
              {revealed && isCorrect && <CheckCircle2 className="text-emerald-600" size={24} />}
              {revealed && isSelected && !isCorrect && <XCircle className="text-rose-600" size={24} />}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="bg-stone-900 text-white rounded-[32px] p-8 space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-xs">
            <HelpCircle size={16} /> Por que?
          </div>
          <p className="text-stone-300 leading-relaxed italic">{quiz?.explanation}</p>
          <div className="pt-4">
            <button onClick={load} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
              <RefreshCw size={18} /> Próximo Desafio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
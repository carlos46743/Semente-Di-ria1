
import React, { useState, useEffect } from 'react';
import { fetchDailyQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Trophy, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

const QuizView: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    loadNewQuiz();
  }, []);

  const loadNewQuiz = async () => {
    setLoading(true);
    setSelected(null);
    setShowExplanation(false);
    try {
      const data = await fetchDailyQuiz();
      setQuiz(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-stone-500 font-medium italic">Consultando os pergaminhos...</p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
      <header className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <Trophy size={14} /> Quiz do Dia
        </div>
        <h2 className="text-2xl font-bold text-stone-800 leading-tight">
          {quiz?.question}
        </h2>
      </header>

      <div className="space-y-3">
        {quiz?.options.map((opt, idx) => {
          const isCorrect = idx === quiz.correctIndex;
          const isSelected = selected === idx;
          let variant = "bg-white border-stone-200 hover:border-amber-200 text-stone-700";
          
          if (showExplanation) {
            if (isCorrect) variant = "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20";
            else if (isSelected) variant = "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20";
            else variant = "bg-white border-stone-100 text-stone-300";
          }

          return (
            <button
              key={idx}
              disabled={showExplanation}
              onClick={() => handleSelect(idx)}
              className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between text-left group ${variant}`}
            >
              <span className="font-medium text-lg">{opt}</span>
              {showExplanation && isCorrect && <CheckCircle2 className="text-emerald-600" size={24} />}
              {showExplanation && isSelected && !isCorrect && <XCircle className="text-rose-600" size={24} />}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 animate-in slide-in-from-top-4">
          <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
            <HelpCircle size={18} className="text-amber-500" />
            Explicação
          </h4>
          <p className="text-stone-600 leading-relaxed italic">
            {quiz?.explanation}
          </p>
          <div className="pt-6 flex justify-center">
             <button 
              onClick={loadNewQuiz}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all transform active:scale-95"
             >
               Próxima Pergunta
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;

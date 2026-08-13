import React, { useState, useMemo } from 'react';
import { useStore, LEITNER_INTERVALS } from '../store/useStore';
import { MENU_ITEMS } from '../data/menuData';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { CONVERSATION_LINES } from '../data/conversationData';
import { speakText } from '../utils/speech';
import { 
  RotateCw, 
  Check, 
  X, 
  Volume2, 
  Award, 
  ArrowRight
} from 'lucide-react';

interface LearningItem {
  id: string;
  ro: string;
  en: string;
  category: string;
  typeLabel: string;
  ingredients?: string[];
}

export const FlashcardQuiz: React.FC = () => {
  const { knownIds, leitnerBoxes, markAsKnownAndPromote, markAsLearningAndReset, speechRate } = useStore();
  const [mode, setMode] = useState<'flashcards' | 'quiz'>('flashcards');

  // Flashcards state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Pool of items for review (prefer items marked as "still learning" or all items)
  const itemsPool: LearningItem[] = useMemo(() => {
    const list: LearningItem[] = [];

    MENU_ITEMS.forEach((m) => {
      list.push({
        id: m.id,
        ro: m.nameRo,
        en: m.nameEn,
        category: m.category,
        typeLabel: 'Preparat Meniu',
        ingredients: m.ingredientsRo,
      });
    });

    GLOSSARY_TERMS.forEach((g) => {
      list.push({
        id: g.id,
        ro: g.ro,
        en: g.en,
        category: g.category,
        typeLabel: g.type === 'ingredient' ? 'Ingredient' : 'Vocabular',
      });
    });

    CONVERSATION_LINES.forEach((c) => {
      list.push({
        id: c.id,
        ro: c.ro,
        en: c.en,
        category: c.scenario,
        typeLabel: 'Dialog',
      });
    });

    // Prioritize still-learning items
    const learningOnly = list.filter((i) => !knownIds[i.id]);
    return learningOnly.length >= 4 ? learningOnly : list;
  }, [knownIds]);

  const currentItem = itemsPool[currentIndex % itemsPool.length];

  // Generate 4 multiple choice options for Quiz mode
  const currentQuizOptions = useMemo(() => {
    if (!currentItem) return [];
    const correctEn = currentItem.en;
    const distractors = itemsPool
      .filter((i) => i.en !== correctEn)
      .map((i) => i.en);

    const shuffled = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [...shuffled, correctEn].sort(() => 0.5 - Math.random());
    return options;
  }, [quizIndex, currentItem, itemsPool]);

  const handleSpeak = (text: string) => {
    speakText(text, 'ro-RO', speechRate);
  };

  const handleKnewIt = () => {
    if (!currentItem) return;
    markAsKnownAndPromote(currentItem.id);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % itemsPool.length);
  };

  const handleStillLearning = () => {
    if (!currentItem) return;
    markAsLearningAndReset(currentItem.id);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % itemsPool.length);
  };

  const handleQuizSelect = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);

    if (option === currentItem.en) {
      setScore((prev) => prev + 1);
      markAsKnownAndPromote(currentItem.id);
    } else {
      markAsLearningAndReset(currentItem.id);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    if (quizIndex + 1 >= Math.min(10, itemsPool.length)) {
      setQuizFinished(true);
    } else {
      setQuizIndex((prev) => prev + 1);
      setCurrentIndex((prev) => (prev + 1) % itemsPool.length);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizFinished(false);
    setCurrentIndex(0);
  };

  if (!currentItem) {
    return <div className="p-4 text-center text-slate-400">Nu există elemente în listă.</div>;
  }

  const currentBoxLevel = leitnerBoxes[currentItem.id] || 1;
  const currentInterval = LEITNER_INTERVALS[currentBoxLevel] || LEITNER_INTERVALS[1];

  return (
    <div className="space-y-4 pb-10">
      {/* Header section & Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-ticket-paper">
            Sesiune Flashcard / Quiz
          </h2>
          <p className="text-xs text-slate-300">
            Repetiție spațiată Leitner (1-5) & test grilă cu 4 opțiuni.
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setMode('flashcards')}
          className={`py-2 px-3 text-xs font-mono rounded-lg transition-all text-center min-h-[40px] ${
            mode === 'flashcards'
              ? 'bg-paprika-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Comută la modul Flashcards Card Flip"
        >
          🎴 Flashcards (Card Flip)
        </button>
        <button
          onClick={() => {
            setMode('quiz');
            handleRestartQuiz();
          }}
          className={`py-2 px-3 text-xs font-mono rounded-lg transition-all text-center min-h-[40px] ${
            mode === 'quiz'
              ? 'bg-brass-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Comută la modul Quiz Grilă cu 4 opțiuni"
        >
          ⚡ Quiz Grilă (4 Opțiuni)
        </button>
      </div>

      {/* MODE 1: FLASHCARDS */}
      {mode === 'flashcards' && (
        <div className="space-y-4">
          {/* Card Progress Indicator & Leitner Box Level */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>
              Card {currentIndex + 1} din {itemsPool.length}
            </span>
            <span 
              className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-brass-400 font-bold"
              title={`Interval repetiție Leitner: ${currentInterval.label}`}
            >
              Box {currentBoxLevel}/5 • {currentInterval.label}
            </span>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] bg-ticket-paper text-ticket-text rounded-2xl p-6 shadow-xl border-2 border-ticket-line flex flex-col justify-between cursor-pointer transition-all hover:border-paprika-500 relative select-none"
            role="button"
            tabIndex={0}
            aria-label="Întoarce cardul pentru traducere"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsFlipped(!isFlipped);
              }
            }}
          >
            {/* Front / Back Label */}
            <div className="flex items-center justify-between text-xs font-mono text-ticket-muted border-b border-ticket-line pb-2">
              <span className="uppercase font-bold tracking-wider">{currentItem.typeLabel} • {currentItem.category}</span>
              <span className="flex items-center gap-1 text-paprika-600">
                <RotateCw className="w-3.5 h-3.5" /> Tap pentru a întoarce
              </span>
            </div>

            {/* Card Content */}
            <div className="py-6 text-center space-y-3 my-auto">
              {!isFlipped ? (
                /* FRONT (RO) */
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-paprika-600 font-bold tracking-widest">
                    ROMÂNĂ (RO)
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ticket-text">
                    {currentItem.ro}
                  </h3>
                  {currentItem.ingredients && (
                    <p className="text-xs text-slate-600 max-w-xs mx-auto">
                      ({currentItem.ingredients.join(', ')})
                    </p>
                  )}
                </div>
              ) : (
                /* BACK (EN Translation) */
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-brass-600 font-bold tracking-widest">
                    ENGLISH TRANSLATION (EN)
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold italic text-slate-900">
                    {currentItem.en}
                  </h3>
                </div>
              )}
            </div>

            {/* Bottom Audio Button */}
            <div className="pt-2 border-t border-ticket-line flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(currentItem.ro);
                }}
                className="px-4 py-2 bg-brass-500 text-slate-950 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 shadow hover:bg-brass-400 transition-transform active:scale-95"
                aria-label={`Ascultă pronunția pentru ${currentItem.ro}`}
              >
                <Volume2 className="w-4 h-4" /> Ascultă Pronunția
              </button>
            </div>
          </div>

          {/* Action Buttons: "Still Learning" vs "I Knew It!" */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleStillLearning}
              className="py-3.5 px-4 bg-slate-800 hover:bg-slate-750 border border-paprika-500/50 text-paprika-300 rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow min-h-[52px]"
              aria-label="Am greșit, resetează la Box 1"
            >
              <X className="w-5 h-5 text-paprika-400" /> Still Learning 🔄
            </button>

            <button
              onClick={handleKnewIt}
              className="py-3.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow min-h-[52px]"
              aria-label="Am știut, promovează la următorul nivel Leitner"
            >
              <Check className="w-5 h-5" /> I Knew It! 🎯
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: MULTIPLE CHOICE QUIZ */}
      {mode === 'quiz' && (
        <div>
          {quizFinished ? (
            /* Quiz Completed Screen */
            <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-6 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 bg-brass-500/20 border border-brass-500 rounded-full flex items-center justify-center mx-auto text-brass-400">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-ticket-paper">
                Sesiune Finalizată!
              </h3>
              <p className="text-sm text-slate-300">
                Scorul tău: <span className="font-mono font-extrabold text-brass-400 text-lg">{score} / {Math.min(10, itemsPool.length)}</span>
              </p>

              <button
                onClick={handleRestartQuiz}
                className="w-full py-3 bg-paprika-600 hover:bg-paprika-500 text-white font-mono font-bold rounded-xl shadow transition-all min-h-[48px]"
                aria-label="Reîncepe un nou test quiz grilă"
              >
                Încearcă un nou test
              </button>
            </div>
          ) : (
            /* Quiz Question */
            <div className="space-y-4">
              {/* Score header */}
              <div className="flex items-center justify-between font-mono text-xs text-slate-400">
                <span>Întrebarea {quizIndex + 1} / {Math.min(10, itemsPool.length)}</span>
                <span className="text-brass-400 font-bold">Scor: {score}</span>
              </div>

              {/* Target Prompt Box */}
              <div className="bg-slate-850 border border-slate-700/80 rounded-xl p-5 text-center space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Ce înseamnă în engleză:
                </span>
                <h3 className="font-display text-2xl font-bold text-ticket-paper">
                  {currentItem.ro}
                </h3>
                <button
                  onClick={() => handleSpeak(currentItem.ro)}
                  className="inline-flex items-center gap-1 text-xs text-brass-400 hover:underline font-mono"
                  aria-label={`Ascultă pronunția pentru ${currentItem.ro}`}
                >
                  <Volume2 className="w-3.5 h-3.5" /> Pronunție RO
                </button>
              </div>

              {/* 4 Multiple Choice Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuizOptions.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentItem.en;
                  let btnStyle = 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500';

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950 border-rose-600 text-rose-300 font-bold';
                    } else {
                      btnStyle = 'bg-slate-900 border-slate-850 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect(option)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-3.5 rounded-xl border text-left font-serif text-sm transition-all flex items-center justify-between min-h-[48px] ${btnStyle}`}
                      aria-label={`Opțiunea ${idx + 1}: ${option}`}
                    >
                      <span>{option}</span>
                      {selectedAnswer !== null && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Next Question Button */}
              {selectedAnswer !== null && (
                <button
                  onClick={handleNextQuiz}
                  className="w-full py-3 bg-paprika-600 hover:bg-paprika-500 text-white font-mono font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 min-h-[48px]"
                  aria-label="Treci la următoarea întrebare"
                >
                  <span>Următoarea întrebare</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { speakText } from '../utils/speech';
import { 
  Search, 
  Volume2, 
  Check, 
  Bookmark, 
  Utensils, 
  Wrench,
  X
} from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const { knownIds, toggleKnown, speechRate } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ingredient' | 'kitchen-vocab'>('all');
  const [onlyLearning, setOnlyLearning] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(GLOSSARY_TERMS.map((term) => term.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      // Type match
      if (typeFilter !== 'all' && term.type !== typeFilter) {
        return false;
      }
      // Category match
      if (selectedCategory !== 'All' && term.category !== selectedCategory) {
        return false;
      }
      // Learning filter match
      if (onlyLearning && knownIds[term.id]) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return term.ro.toLowerCase().includes(q) || term.en.toLowerCase().includes(q);
      }
      return true;
    });
  }, [typeFilter, selectedCategory, onlyLearning, searchQuery, knownIds]);

  const handleSpeak = (id: string, text: string) => {
    setActiveSpeakingId(id);
    speakText(text, 'ro-RO', speechRate, () => {
      setActiveSpeakingId(null);
    });
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header section */}
      <div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-ticket-paper flex items-center justify-between">
          <span>Glosar Bucătărie</span>
          <span className="text-xs font-mono font-normal text-paprika-400 border border-paprika-600/50 px-2 py-0.5 rounded">
            {filteredTerms.length} termeni
          </span>
        </h2>
        <p className="text-xs text-slate-300">
          Vocabular tehnic de bucătărie, ingrediente, echipamente & termeni de servire.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Caută termen... (e.g. Ceafă, polonic, drege, nota)"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-paprika-500 font-sans shadow-inner min-h-[44px]"
          aria-label="Caută termen în glosar"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 p-1"
            aria-label="Șterge căutarea"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Type Filter Buttons (Ingredients vs Kitchen Vocab) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setTypeFilter('all')}
          className={`py-2 px-2 text-xs font-mono rounded-lg transition-all text-center min-h-[40px] ${
            typeFilter === 'all'
              ? 'bg-paprika-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Filtrează toți termenii"
        >
          Toți Termenii
        </button>
        <button
          onClick={() => setTypeFilter('ingredient')}
          className={`py-2 px-2 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-1 min-h-[40px] ${
            typeFilter === 'ingredient'
              ? 'bg-brass-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Filtrează doar ingredientele"
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Ingrediente</span>
        </button>
        <button
          onClick={() => setTypeFilter('kitchen-vocab')}
          className={`py-2 px-2 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-1 min-h-[40px] ${
            typeFilter === 'kitchen-vocab'
              ? 'bg-blue-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Filtrează doar vocabularul de bucătărie"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Vocabular</span>
        </button>
      </div>

      {/* Category Scroll & Still Learning Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Categorie:</span>
          <button
            onClick={() => setOnlyLearning(!onlyLearning)}
            className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all min-h-[32px] ${
              onlyLearning
                ? 'bg-paprika-950/80 border-paprika-500 text-paprika-300 font-bold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            aria-label={onlyLearning ? 'Afișează toți termenii din glosar' : 'Afișează doar termenii de învățat'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyLearning ? 'fill-paprika-500 text-paprika-500' : ''}`} />
            <span>Doar "Still Learning"</span>
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all min-h-[36px] ${
                selectedCategory === cat
                  ? 'bg-paprika-500 text-white font-bold shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
              }`}
              aria-label={`Filtrează după categoria ${cat}`}
            >
              {cat === 'All' ? 'Toate' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Items List */}
      {filteredTerms.length === 0 ? (
        <div className="bg-slate-850 border border-slate-700/80 rounded-xl p-8 text-center space-y-2">
          <p className="text-slate-300 text-sm">Nu s-a găsit niciun termen pentru căutarea curentă.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setTypeFilter('all');
              setOnlyLearning(false);
            }}
            className="text-xs text-paprika-400 hover:underline font-mono"
            aria-label="Resetează toate filtrele"
          >
            Resetare filtre
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {filteredTerms.map((term) => {
            const isKnown = !!knownIds[term.id];
            const isSpeaking = activeSpeakingId === term.id;

            return (
              <div
                key={term.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isKnown
                    ? 'bg-slate-850 border-emerald-900/60 opacity-80'
                    : 'bg-slate-800 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Speech Button */}
                  <button
                    onClick={() => handleSpeak(term.id, term.ro)}
                    className={`p-2.5 rounded-lg shrink-0 transition-all active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center ${
                      isSpeaking
                        ? 'bg-paprika-500 text-white animate-pulse'
                        : 'bg-brass-500/20 border border-brass-500/40 text-brass-400 hover:bg-brass-500 hover:text-slate-950'
                    }`}
                    aria-label={`Ascultă pronunția pentru ${term.ro}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-bold text-base text-ticket-paper truncate">{term.ro}</h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {term.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic font-serif mt-0.5">{term.en}</p>
                  </div>
                </div>

                {/* Known Checkbox */}
                <button
                  onClick={() => toggleKnown(term.id)}
                  className={`p-2.5 rounded-lg border transition-all shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center ${
                    isKnown
                      ? 'bg-emerald-950 border-emerald-700 text-emerald-400'
                      : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label={isKnown ? `Marchează ${term.ro} ca de învățat` : `Marchează ${term.ro} ca știut`}
                >
                  <Check className={`w-4 h-4 ${isKnown ? 'stroke-[3]' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

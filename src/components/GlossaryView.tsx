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
  Globe,
  X
} from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const { knownIds, toggleKnown, speechRate } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ingredient' | 'kitchen-vocab'>('all');
  const [onlyLearning, setOnlyLearning] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Extract unique categories in exact order
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
    <div className="space-y-4 pb-12">
      {/* Header section */}
      <div>
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-wider text-ticket-paper flex items-center justify-between">
          <span>Glosar & Vocabular Română</span>
          <span className="text-xs font-mono font-bold text-copper-400 border border-copper-600/50 bg-copper-950/60 px-2.5 py-1 rounded-full shadow-sm">
            {filteredTerms.length} / {GLOSSARY_TERMS.length} termeni
          </span>
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Ingrediente, echipamente de bucătărie, vocabular de muncă, ture & limba română zi de zi.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Caută termen sau expresie... (e.g. tură, salariu, mulțumesc, ceafă, cuțit)"
          className="w-full bg-ember-850 border border-ember-700 rounded-2xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-copper-500 font-sans shadow-inner min-h-[48px]"
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

      {/* Type Filter Buttons (Ingredients vs Workplace/Daily Vocab) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-ember-950 border border-ember-800 rounded-2xl">
        <button
          onClick={() => setTypeFilter('all')}
          className={`py-2 px-2 text-xs font-mono rounded-xl transition-all text-center min-h-[42px] ${
            typeFilter === 'all'
              ? 'bg-copper-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Filtrează toți termenii"
        >
          Toți Termenii ({GLOSSARY_TERMS.length})
        </button>
        <button
          onClick={() => setTypeFilter('ingredient')}
          className={`py-2 px-2 text-xs font-mono rounded-xl transition-all flex items-center justify-center gap-1 min-h-[42px] ${
            typeFilter === 'ingredient'
              ? 'bg-champagne-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Filtrează doar ingredientele"
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Ingrediente</span>
        </button>
        <button
          onClick={() => setTypeFilter('kitchen-vocab')}
          className={`py-2 px-2 text-xs font-mono rounded-xl transition-all flex items-center justify-center gap-1 min-h-[42px] ${
            typeFilter === 'kitchen-vocab'
              ? 'bg-blue-600 text-white font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Filtrează doar vocabularul de muncă și zi de zi"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Muncă & Zi de zi</span>
        </button>
      </div>

      {/* Category Scroll & Still Learning Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Categorie ({categories.length - 1}):</span>
          <button
            onClick={() => setOnlyLearning(!onlyLearning)}
            className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all min-h-[34px] ${
              onlyLearning
                ? 'bg-copper-950/80 border-copper-500 text-copper-300 font-bold shadow'
                : 'bg-ember-800 border-ember-700 text-slate-400 hover:text-slate-200'
            }`}
            aria-label={onlyLearning ? 'Afișează toți termenii din glosar' : 'Afișează doar termenii de învățat'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyLearning ? 'fill-copper-500 text-copper-500' : ''}`} />
            <span>Doar "Still Learning"</span>
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all min-h-[38px] ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-copper-600 to-copper-500 text-white font-bold shadow-md'
                  : 'bg-ember-850 text-slate-300 hover:bg-ember-800 border border-ember-700'
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
        <div className="bg-ember-850 border border-ember-700/80 rounded-2xl p-8 text-center space-y-2">
          <p className="text-slate-300 text-sm">Nu s-a găsit niciun termen pentru căutarea curentă.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setTypeFilter('all');
              setOnlyLearning(false);
            }}
            className="text-xs text-copper-400 hover:underline font-mono"
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
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-sm ${
                  isKnown
                    ? 'bg-ember-850 border-emerald-900/60 opacity-80'
                    : 'bg-ember-800 border-ember-700/90 hover:border-ember-600'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Speech Button with Visual Soundwave Equalizer when playing */}
                  <button
                    onClick={() => handleSpeak(term.id, term.ro)}
                    className={`p-3 rounded-xl shrink-0 transition-all active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                      isSpeaking
                        ? 'bg-copper-500 text-white animate-pulse shadow-lg'
                        : 'bg-champagne-500/15 border border-champagne-500/40 text-champagne-400 hover:bg-champagne-500 hover:text-slate-950'
                    }`}
                    aria-label={`Ascultă pronunția pentru ${term.ro}`}
                  >
                    {isSpeaking ? (
                      <div className="flex items-center gap-0.5 h-4">
                        <span className="w-1 bg-white animate-soundwave-1 rounded-full" />
                        <span className="w-1 bg-white animate-soundwave-2 rounded-full" />
                        <span className="w-1 bg-white animate-soundwave-3 rounded-full" />
                      </div>
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-ticket-paper truncate">{term.ro}</h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase bg-ember-950 px-1.5 py-0.5 rounded border border-ember-800">
                        {term.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic font-serif mt-0.5 leading-relaxed">{term.en}</p>
                  </div>
                </div>

                {/* Known Checkbox */}
                <button
                  onClick={() => toggleKnown(term.id)}
                  className={`p-2.5 rounded-xl border transition-all shrink-0 min-w-[42px] min-h-[42px] flex items-center justify-center ${
                    isKnown
                      ? 'bg-emerald-950 border-emerald-700 text-emerald-400'
                      : 'bg-ember-900 border-ember-700 text-slate-500 hover:text-slate-300'
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

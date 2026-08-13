import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { MENU_ITEMS } from '../data/menuData';
import { EU_ALLERGENS } from '../data/allergensData';
import { speakText } from '../utils/speech';
import { 
  Search, 
  Volume2, 
  Check, 
  Bookmark, 
  Filter, 
  X
} from 'lucide-react';

interface MenuExplorerProps {
  onOpenAllergensModal: () => void;
}

export const MenuExplorer: React.FC<MenuExplorerProps> = ({ onOpenAllergensModal }) => {
  const { knownIds, toggleKnown, speechRate } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyLearning, setOnlyLearning] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(MENU_ITEMS.map((item) => item.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Learning filter match
      if (onlyLearning && knownIds[item.id]) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const roMatch = item.nameRo.toLowerCase().includes(q);
        const enMatch = item.nameEn.toLowerCase().includes(q);
        const ingRoMatch = item.ingredientsRo.some((ing) => ing.toLowerCase().includes(q));
        const ingEnMatch = item.ingredientsEn.some((ing) => ing.toLowerCase().includes(q));
        return roMatch || enMatch || ingRoMatch || ingEnMatch;
      }
      return true;
    });
  }, [selectedCategory, onlyLearning, searchQuery, knownIds]);

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
          <span>Meniu Preparate</span>
          <span className="text-xs font-mono font-normal text-brass-400 border border-brass-600/50 px-2 py-0.5 rounded">
            {filteredDishes.length} preparate
          </span>
        </h2>
        <p className="text-xs text-slate-300">
          Denumiri, traduceri, ingrediente (RO/EN), gramaj, preț & alergene.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Căutare preparat sau ingredient... (e.g. Ciorbă, usturoi, bacon)"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-paprika-500 font-sans shadow-inner min-h-[44px]"
          aria-label="Căutare preparat sau ingredient"
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

      {/* Filter Row: Category Pills & Toggle Learning Only */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-paprika-400" /> Categorie / Category:
          </span>

          <button
            onClick={() => setOnlyLearning(!onlyLearning)}
            className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all min-h-[32px] ${
              onlyLearning
                ? 'bg-paprika-950/80 border-paprika-500 text-paprika-300 font-bold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            aria-label={onlyLearning ? 'Afișează toate preparatele' : 'Afișează doar preparatele de învățat'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyLearning ? 'fill-paprika-500 text-paprika-500' : ''}`} />
            <span>Doar "Still Learning"</span>
          </button>
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all min-h-[36px] ${
                selectedCategory === cat
                  ? 'bg-brass-500 text-slate-950 font-extrabold shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
              }`}
              aria-label={`Filtrează după categoria ${cat}`}
            >
              {cat === 'All' ? 'Toate (All)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Ticket List */}
      {filteredDishes.length === 0 ? (
        <div className="bg-slate-850 border border-slate-700/80 rounded-xl p-8 text-center space-y-2">
          <p className="text-slate-300 text-sm">Nu s-a găsit niciun preparat după filtrul selectat.</p>

          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOnlyLearning(false);
            }}
            className="text-xs text-paprika-400 hover:underline font-mono"
            aria-label="Resetează toate filtrele"
          >
            Resetează filtrele (Reset filters)
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDishes.map((dish) => {
            const isKnown = !!knownIds[dish.id];
            const isSpeaking = activeSpeakingId === dish.id;

            return (
              <div
                key={dish.id}
                className={`relative rounded-xl border transition-all shadow-md overflow-hidden ${
                  isKnown
                    ? 'bg-slate-850 border-emerald-900/60 opacity-90'
                    : 'bg-ticket-paper text-ticket-text border-ticket-line'
                }`}
              >
                {/* Perforated Order Ticket Header Rail */}
                <div
                  className={`px-3 py-1.5 flex items-center justify-between text-[11px] font-mono border-b ${
                    isKnown
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
                      : 'bg-[#eee6d3] text-ticket-muted border-ticket-line'
                  }`}
                >
                  <span className="uppercase font-bold tracking-wider">{dish.category}</span>
                  <div className="flex items-center gap-2">
                    {dish.weight && <span className="font-mono">{dish.weight}</span>}
                    <span className="font-mono font-bold text-paprika-600 dark:text-paprika-400">
                      {dish.price} LEI
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Dish Title & Speech Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-display text-xl font-bold leading-tight ${
                            isKnown ? 'text-slate-200' : 'text-ticket-text'
                          }`}
                        >
                          {dish.nameRo}
                        </h3>

                        {/* Pronounce RO button */}
                        <button
                          onClick={() => handleSpeak(dish.id, dish.nameRo)}
                          className={`p-2 rounded-full transition-all active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center ${
                            isSpeaking
                              ? 'bg-paprika-500 text-white animate-pulse'
                              : isKnown
                              ? 'bg-slate-700 text-brass-400 hover:bg-slate-600'
                              : 'bg-brass-500 text-slate-950 hover:bg-brass-400 shadow-sm'
                          }`}
                          aria-label={`Ascultă pronunția pentru ${dish.nameRo}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* EN Translation */}
                      <p
                        className={`text-sm italic font-serif mt-0.5 ${
                          isKnown ? 'text-slate-400' : 'text-slate-700'
                        }`}
                      >
                        {dish.nameEn}
                      </p>
                    </div>

                    {/* Known / Learning Toggle Checkbox */}
                    <button
                      onClick={() => toggleKnown(dish.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all shrink-0 min-h-[40px] ${
                        isKnown
                          ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-paprika-500'
                      }`}
                      aria-label={isKnown ? `Marchează ${dish.nameRo} ca de învățat` : `Marchează ${dish.nameRo} ca știut`}
                    >
                      <Check className={`w-4 h-4 ${isKnown ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>{isKnown ? 'Știut' : 'Învăț'}</span>
                    </button>
                  </div>

                  {/* Ingredients RO & EN cloud */}
                  <div
                    className={`p-2.5 rounded-lg text-xs space-y-1.5 border ${
                      isKnown
                        ? 'bg-slate-900/80 border-slate-800'
                        : 'bg-[#f4efe1] border-[#e4dcc6]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[11px] uppercase text-paprika-600 dark:text-paprika-400 mr-1.5 font-mono">
                        Ingrediente (RO):
                      </span>
                      <span className={isKnown ? 'text-slate-300' : 'text-slate-800'}>
                        {dish.ingredientsRo.join(', ')}
                      </span>
                    </div>

                    <div className="border-t border-slate-700/20 dark:border-slate-800 pt-1">
                      <span className="font-bold text-[11px] uppercase text-brass-600 dark:text-brass-400 mr-1.5 font-mono">
                        Ingredients (EN):
                      </span>
                      <span className={`italic ${isKnown ? 'text-slate-400' : 'text-slate-600'}`}>
                        {dish.ingredientsEn.join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* EU Allergen Badges */}
                  {dish.allergens && dish.allergens.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">
                        Alergene:
                      </span>
                      {dish.allergens.map((code) => {
                        const allergen = EU_ALLERGENS[code];
                        return (
                          <button
                            key={code}
                            onClick={onOpenAllergensModal}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/50 border border-amber-800/60 text-amber-300 text-[11px] font-mono hover:bg-amber-900/60 transition-colors"
                            title={allergen ? `${allergen.nameRo} / ${allergen.nameEn}` : `Allergen Code ${code}`}
                            aria-label={`Informații allergen codul ${code}`}
                          >
                            <span>{allergen?.icon || '⚠️'}</span>
                            <span>Code {code}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Flame, 
  UtensilsCrossed, 
  BookOpen, 
  MessageSquareQuote, 
  BrainCircuit, 
  Info, 
  PlusCircle, 
  ArrowRight,
  RotateCcw,
  Volume2,
  Globe,
  Briefcase
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface HomeDashboardProps {
  onOpenAllergensModal: () => void;
  onOpenCustomModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onOpenAllergensModal,
  onOpenCustomModal,
}) => {
  const { streakDays, getOverallStats, setActiveView, resetAllProgress, speechRate, setSpeechRate } = useStore();
  const stats = getOverallStats();

  const handleTestAudio = () => {
    speakText('Bine ați venit la restaurantul Marissa! Cu ce vă pot ajuta?', 'ro-RO', speechRate);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Restaurant & Daily Romanian Hero Banner */}
      <div className="bg-gradient-to-br from-ember-900 via-ember-850 to-ember-950 border border-ember-700/90 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        {/* Top Paper Ticket Header Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-copper-500 via-champagne-400 to-copper-600" />

        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-champagne-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="inline-block w-2 h-2 rounded-full bg-champagne-400 animate-ping motion-reduce:animate-none" />
              Limba Română & Meniu Restaurant
            </div>
            <h2 className="font-display text-2xl font-extrabold text-ticket-paper tracking-wide uppercase">
              BINE AI VENIT! 👋
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
              Învățați meniul, ingredientele, vocabularul de muncă & expresiile uzuale din România.
            </p>
          </div>

          {/* Daily Streak Flame Counter */}
          <div className="bg-ember-950/80 border border-copper-500/50 p-3 rounded-xl text-center min-w-[76px] shadow-lg">
            <Flame className="w-6 h-6 text-copper-500 mx-auto fill-copper-500 animate-bounce motion-reduce:animate-none" />
            <span className="block font-mono font-extrabold text-xl text-copper-400 leading-none mt-1">{streakDays}</span>
            <span className="text-[10px] text-slate-400 uppercase font-mono">Zile / Days</span>
          </div>
        </div>

        {/* Total Content Metrics Breakdown */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center pt-3 border-t border-ember-800">
          <div className="bg-ember-950/60 p-2 rounded-lg border border-ember-800">
            <div className="font-mono text-base font-extrabold text-champagne-400">{stats.menuTotal}</div>
            <div className="text-[10px] text-slate-400 font-mono">Preparate Meniu</div>
          </div>
          <div className="bg-ember-950/60 p-2 rounded-lg border border-ember-800">
            <div className="font-mono text-base font-extrabold text-copper-400">{stats.glossaryTotal}</div>
            <div className="text-[10px] text-slate-400 font-mono">Glosar & Vocab</div>
          </div>
          <div className="bg-ember-950/60 p-2 rounded-lg border border-ember-800">
            <div className="font-mono text-base font-extrabold text-blue-400">{stats.conversationTotal}</div>
            <div className="text-[10px] text-slate-400 font-mono">Dialoguri</div>
          </div>
        </div>

        {/* Overall Mastery Progress Bar */}
        <div className="mt-3 pt-3 border-t border-ember-800">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300 font-semibold">Progres General / Mastery Progress:</span>
            <span className="text-champagne-400 font-extrabold">{stats.totalMastered} / {stats.totalItems} ({stats.percentMastered}%)</span>
          </div>
          <div className="w-full h-3.5 bg-ember-950 rounded-full overflow-hidden p-0.5 border border-ember-800">
            <div 
              className="h-full bg-gradient-to-r from-copper-600 via-copper-500 to-champagne-400 rounded-full transition-all duration-500 motion-reduce:transition-none shadow-sm"
              style={{ width: `${stats.percentMastered}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Action Button: Start Flashcard Session */}
      <button
        onClick={() => setActiveView('flashcards')}
        className="w-full bg-gradient-to-r from-copper-600 via-copper-500 to-copper-600 hover:from-copper-500 hover:to-copper-400 text-white p-4 rounded-2xl shadow-xl border border-copper-400/40 flex items-center justify-between group transition-all active:scale-[0.99] min-h-[60px]"
        aria-label="Pornește o sesiune rapidă de studiat Flashcards"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="p-3 bg-ember-950/50 rounded-xl border border-copper-400/30">
            <BrainCircuit className="w-6 h-6 text-champagne-300 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-tight uppercase tracking-wider text-white">
              Sesiune Rapidă Flashcards
            </div>
            <div className="text-xs text-copper-100 font-sans">
              Exersează termenii din "Still Learning" (Quick Review)
            </div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-champagne-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 transition-transform" />
      </button>

      {/* Module Overview Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {/* Menu Items Explorer Module */}
        <div 
          onClick={() => setActiveView('menu')}
          className="bg-ember-850 hover:bg-ember-800 border border-ember-700/80 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-md"
          role="button"
          tabIndex={0}
          aria-label="Deschide Meniul de 280 de Preparate"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setActiveView('menu');
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-champagne-950/90 border border-champagne-600/50 flex items-center justify-center text-champagne-400 shadow-sm">
              <UtensilsCrossed className="w-5 h-5 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-ticket-paper group-hover:text-champagne-300 transition-colors uppercase">
                Meniu 2025 Marissa ({stats.menuTotal} preparate)
              </h3>
              <p className="text-xs text-slate-400">Preparate, ingrediente (RO/EN), gramaj, preț & alergene</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full">
              {stats.menuKnown} / {stats.menuTotal}
            </span>
          </div>
        </div>

        {/* Vocabulary & Ingredient Glossary Module */}
        <div 
          onClick={() => setActiveView('glossary')}
          className="bg-ember-850 hover:bg-ember-800 border border-ember-700/80 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-md"
          role="button"
          tabIndex={0}
          aria-label="Deschide Glosarul de Ingrediente, Muncă și Limba Română"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setActiveView('glossary');
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-copper-950/90 border border-copper-600/50 flex items-center justify-center text-copper-400 shadow-sm">
              <BookOpen className="w-5 h-5 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-ticket-paper group-hover:text-copper-400 transition-colors uppercase flex items-center gap-1.5">
                <span>Glosar & Vocabular Română</span>
                <Globe className="w-3.5 h-3.5 text-copper-400" />
              </h3>
              <p className="text-xs text-slate-400">{stats.glossaryTotal} termeni: Bucătărie, Muncă, Program, Bani & Zi de zi</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full">
              {stats.glossaryKnown} / {stats.glossaryTotal}
            </span>
          </div>
        </div>

        {/* Conversation Practice Module */}
        <div 
          onClick={() => setActiveView('conversation')}
          className="bg-ember-850 hover:bg-ember-800 border border-ember-700/80 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-md"
          role="button"
          tabIndex={0}
          aria-label="Deschide Dialogurile de Serviciu și Bucătărie"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setActiveView('conversation');
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-950/90 border border-blue-600/50 flex items-center justify-center text-blue-400 shadow-sm">
              <MessageSquareQuote className="w-5 h-5 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-ticket-paper group-hover:text-blue-300 transition-colors uppercase flex items-center gap-1.5">
                <span>Dialoguri & Colegi</span>
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              </h3>
              <p className="text-xs text-slate-400">{stats.conversationTotal} conversații: Mese, Bucătărie, Ture & Colegi</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full">
              {stats.conversationKnown} / {stats.conversationTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Tools & Helper Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Allergen Codes Guide Modal Toggle */}
        <button
          onClick={onOpenAllergensModal}
          className="bg-ember-800 hover:bg-ember-750 border border-ember-700 p-3.5 rounded-2xl flex items-center gap-2.5 text-left transition-all min-h-[56px] shadow-sm"
          aria-label="Deschide ghidul codurilor de alergene EU 1-14"
        >
          <Info className="w-5 h-5 text-champagne-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-ticket-paper">Ghid Alergene EU</div>
            <div className="text-[10px] text-slate-400">Coduri 1-14 (EU Codes)</div>
          </div>
        </button>

        {/* Add Custom Term Modal Toggle */}
        <button
          onClick={onOpenCustomModal}
          className="bg-ember-800 hover:bg-ember-750 border border-ember-700 p-3.5 rounded-2xl flex items-center gap-2.5 text-left transition-all min-h-[56px] shadow-sm"
          aria-label="Adaugă un termen nou personalizat"
        >
          <PlusCircle className="w-5 h-5 text-copper-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-ticket-paper">Adaugă Termen</div>
            <div className="text-[10px] text-slate-400">Entry custom personalizat</div>
          </div>
        </button>
      </div>

      {/* Audio Pronunciation Settings & Test */}
      <div className="bg-ember-850 border border-ember-700/80 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-ticket-paper">
            <Volume2 className="w-4 h-4 text-copper-500" />
            Viteză Redare Pronunție (Speech Rate)
          </div>
          <button
            onClick={handleTestAudio}
            className="text-[11px] font-mono text-copper-400 hover:underline flex items-center gap-1"
            aria-label="Testează sunetul pronunției audio"
          >
            🔊 Test Audio
          </button>
        </div>

        <div className="flex gap-2">
          {[0.8, 0.9, 1.0, 1.1].map((rate) => (
            <button
              key={rate}
              onClick={() => setSpeechRate(rate)}
              className={`flex-1 py-2 rounded-xl text-xs font-mono transition-all ${
                speechRate === rate
                  ? 'bg-copper-600 text-white font-bold border border-copper-400 shadow'
                  : 'bg-ember-950 text-slate-400 hover:text-slate-200 border border-ember-800'
              }`}
              aria-label={`Setează viteza de redare la ${rate}`}
            >
              {rate}x {rate === 0.9 ? '(Default)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Progress Section */}
      <div className="pt-2 text-center">
        <button
          onClick={() => {
            if (confirm('Sigur doriți să resetați toate datele salvate local? (Reset all progress?)')) {
              resetAllProgress();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-copper-400 transition-colors py-2 px-3 rounded-lg hover:bg-ember-850"
          aria-label="Resetare progres salvat local"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Resetare Progres Salvat Local
        </button>
      </div>
    </div>
  );
};

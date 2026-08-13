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
  Volume2
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
    speakText('Bine ați venit la restaurant! Cu ce vă pot ajuta?', 'ro-RO', speechRate);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Kitchen Ticket Welcome Banner */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-4 shadow-lg relative overflow-hidden">
        {/* Ticket Perforated Header Effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-paprika-500 via-brass-500 to-paprika-500" />

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-brass-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-brass-400 animate-ping motion-reduce:animate-none" />
              Tura de învățare / Learning Shift
            </div>
            <h2 className="font-display text-2xl font-bold text-ticket-paper tracking-wide">
              BINE AI VENIT! 👋
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Exersați vocabularul de restaurant & bucătărie în pauze scurte.
            </p>
          </div>

          <div className="bg-slate-900 border border-paprika-500/40 p-2.5 rounded-lg text-center min-w-[70px]">
            <Flame className="w-6 h-6 text-paprika-500 mx-auto fill-paprika-500 animate-bounce motion-reduce:animate-none" />
            <span className="block font-mono font-extrabold text-lg text-paprika-400 leading-none mt-1">{streakDays}</span>
            <span className="text-[10px] text-slate-400 uppercase font-mono">Zile / Days</span>
          </div>
        </div>

        {/* Overall Mastery Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">Progres General / Overall Progress:</span>
            <span className="text-brass-400 font-bold">{stats.totalMastered} / {stats.totalItems} ({stats.percentMastered}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-paprika-600 via-paprika-500 to-brass-500 rounded-full transition-all duration-500 motion-reduce:transition-none"
              style={{ width: `${stats.percentMastered}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Action Button: Continue Learning / Quick Quiz */}
      <button
        onClick={() => setActiveView('flashcards')}
        className="w-full bg-gradient-to-r from-paprika-600 to-paprika-500 hover:from-paprika-500 hover:to-paprika-400 text-white p-4 rounded-xl shadow-lg border border-paprika-400/40 flex items-center justify-between group transition-all min-h-[56px] active:scale-[0.99]"
        aria-label="Pornește o sesiune rapidă de studiat Flashcards"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="p-2.5 bg-slate-950/40 rounded-lg border border-paprika-400/30">
            <BrainCircuit className="w-6 h-6 text-brass-300 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-tight uppercase tracking-wider text-white">
              Sesiune Rapidă Flashcards
            </div>
            <div className="text-xs text-paprika-100 font-sans">
              Exersează termenii din "Still Learning" (Quick Review)
            </div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-brass-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 transition-transform" />
      </button>

      {/* Module Overview Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {/* Menu Items Explorer Module */}
        <div 
          onClick={() => setActiveView('menu')}
          className="bg-slate-850 hover:bg-slate-800 border border-slate-700/80 p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
          role="button"
          tabIndex={0}
          aria-label="Deschide Meniul de Preparate"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setActiveView('menu');
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brass-950/80 border border-brass-600/40 flex items-center justify-center text-brass-400">
              <UtensilsCrossed className="w-5 h-5 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base text-ticket-paper group-hover:text-brass-300 transition-colors">
                Meniu Preparate / Menu Dishes
              </h3>
              <p className="text-xs text-slate-400">Ingrediente, prețuri, gramaje & alergene EU</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
              {stats.menuKnown} / {stats.menuTotal}
            </span>
          </div>
        </div>

        {/* Vocabulary & Ingredient Glossary Module */}
        <div 
          onClick={() => setActiveView('glossary')}
          className="bg-slate-850 hover:bg-slate-800 border border-slate-700/80 p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
          role="button"
          tabIndex={0}
          aria-label="Deschide Glosarul de Ingrediente și Bucătărie"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setActiveView('glossary');
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-paprika-950/80 border border-paprika-600/40 flex items-center justify-center text-paprika-400">
              <BookOpen className="w-5 h-5 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base text-ticket-paper group-hover:text-paprika-400 transition-colors">
                Glosar Ingrediente & Bucătărie
              </h3>
              <p className="text-xs text-slate-400">Echipamente, acțiuni, servire & siguranță</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
              {stats.glossaryKnown} / {stats.glossaryTotal}
            </span>
          </div>
        </div>

        {/* Conversation Practice Module */}
        <div 
          onClick={() => setActiveView('conversation')}
          className="bg-slate-850 hover:bg-slate-800 border border-slate-700/80 p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
          role="button"
          tabIndex={0}
          aria-label="Deschide Dialogurile de Serviciu și Bucătărie"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setActiveView('conversation');
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-600/40 flex items-center justify-center text-blue-400">
              <MessageSquareQuote className="w-5 h-5 group-hover:scale-110 motion-reduce:group-hover:scale-100 transition-transform" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base text-ticket-paper group-hover:text-blue-300 transition-colors">
                Dialoguri Serviciu & Bucătărie
              </h3>
              <p className="text-xs text-slate-400">Exersare vocală interactivă (Mic Practice)</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
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
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 p-3 rounded-xl flex items-center gap-2.5 text-left transition-all min-h-[52px]"
          aria-label="Deschide ghidul codurilor de alergene EU"
        >
          <Info className="w-5 h-5 text-brass-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-ticket-paper">Ghid Alergene EU</div>
            <div className="text-[10px] text-slate-400">Coduri 1-14 (EU Codes)</div>
          </div>
        </button>

        {/* Add Custom Term Modal Toggle */}
        <button
          onClick={onOpenCustomModal}
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 p-3 rounded-xl flex items-center gap-2.5 text-left transition-all min-h-[52px]"
          aria-label="Adaugă un termen nou personalizat"
        >
          <PlusCircle className="w-5 h-5 text-paprika-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-ticket-paper">Adaugă Termen</div>
            <div className="text-[10px] text-slate-400">Entry custom personalizat</div>
          </div>
        </button>
      </div>

      {/* Audio Pronunciation Settings & Test */}
      <div className="bg-slate-850 border border-slate-700/80 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-ticket-paper">
            <Volume2 className="w-4 h-4 text-paprika-500" />
            Viteză Pronunție TTS (Speech Rate)
          </div>
          <button
            onClick={handleTestAudio}
            className="text-[11px] font-mono text-paprika-400 hover:underline flex items-center gap-1"
            aria-label="Testează sunetul pronunției audio"
          >
            🔊 Test Pronunție
          </button>
        </div>

        <div className="flex gap-2">
          {[0.8, 0.9, 1.0, 1.1].map((rate) => (
            <button
              key={rate}
              onClick={() => setSpeechRate(rate)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all ${
                speechRate === rate
                  ? 'bg-paprika-600 text-white font-bold border border-paprika-400'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
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
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-paprika-400 transition-colors py-2 px-3 rounded-lg hover:bg-slate-850"
          aria-label="Resetare progres salvat local"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Resetare Progres Salvat Local
        </button>
      </div>
    </div>
  );
};

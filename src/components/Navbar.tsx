import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Flame, 
  UtensilsCrossed, 
  BookOpen, 
  MessageSquareQuote, 
  BrainCircuit, 
  Home,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, streakDays, getOverallStats } = useStore();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const stats = getOverallStats();

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Acasă', labelEn: 'Home', icon: Home },
    { id: 'menu', label: 'Meniu', labelEn: 'Menu', icon: UtensilsCrossed, count: stats.menuTotal },
    { id: 'glossary', label: 'Glosar & Vocab', labelEn: 'Glossary', icon: BookOpen, count: stats.glossaryTotal },
    { id: 'conversation', label: 'Dialog', labelEn: 'Practice', icon: MessageSquareQuote, count: stats.conversationTotal },
    { id: 'flashcards', label: 'Quiz', labelEn: 'Cards', icon: BrainCircuit },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-ember-950/90 backdrop-blur-md border-b border-ember-800/80 shadow-2xl">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button 
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 rounded-xl p-1 transition-transform active:scale-95"
          aria-label="Acasă - Marissa RO-EN"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-copper-500 via-champagne-500 to-copper-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-ember-950 rounded-[10px] flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-champagne-400" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-xl leading-none tracking-wider text-ticket-paper uppercase font-extrabold flex items-center gap-1">
              MARISSA <span className="text-copper-400 font-mono text-xs px-1.5 py-0.5 rounded bg-copper-950 border border-copper-700/50">RO⇄EN</span>
            </h1>
            <p className="text-[10px] text-ember-600 font-mono tracking-tight flex items-center gap-1 mt-0.5">
              <span>Restaurant & Romanian Vocab</span>
              <Sparkles className="w-2.5 h-2.5 text-champagne-400" />
            </p>
          </div>
        </button>

        {/* Right Badges: Offline & Streak */}
        <div className="flex items-center gap-2">
          {/* Offline indicator */}
          <div 
            className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full border shadow-sm ${
              isOnline 
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50' 
                : 'bg-amber-950/80 text-amber-400 border-amber-800/80 animate-pulse'
            }`}
            title={isOnline ? 'PWA Online Active' : 'Offline Mode Active'}
          >
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
            <span className="font-bold">{isOnline ? 'ON' : 'OFFLINE'}</span>
          </div>

          {/* Streak Badge */}
          <div 
            className="flex items-center gap-1 bg-gradient-to-r from-copper-950 to-ember-900 border border-copper-700/60 text-copper-400 px-2.5 py-1 rounded-full text-xs font-mono font-bold shadow-md"
            title={`${streakDays} days learning streak!`}
          >
            <Flame className="w-3.5 h-3.5 text-copper-500 fill-copper-500 animate-bounce motion-reduce:animate-none" />
            <span>{streakDays}d</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Navigation Pill Bar */}
      <nav className="max-w-md mx-auto px-2 flex justify-around border-t border-ember-800/70 bg-ember-950/95">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex-1 py-2 px-1 flex flex-col items-center gap-0.5 transition-all text-xs font-medium min-h-[50px] justify-center relative ${
                isActive
                  ? 'text-copper-400 bg-copper-950/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-ember-900/60'
              }`}
              aria-label={item.labelEn}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-copper-500 to-champagne-400 rounded-full" />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110 text-copper-500' : ''} transition-transform`} />
              <span className="font-sans text-[11px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

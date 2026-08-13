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
  WifiOff
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, streakDays } = useStore();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

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
    { id: 'menu', label: 'Meniu', labelEn: 'Menu', icon: UtensilsCrossed },
    { id: 'glossary', label: 'Glosar', labelEn: 'Glossary', icon: BookOpen },
    { id: 'conversation', label: 'Dialog', labelEn: 'Practice', icon: MessageSquareQuote },
    { id: 'flashcards', label: 'Quiz', labelEn: 'Cards', icon: BrainCircuit },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 shadow-md">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button 
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-paprika-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-paprika-500 to-brass-500 p-0.5 shadow-sm">
            <div className="w-full h-full bg-slate-900 rounded-[5px] flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-brass-400" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-lg leading-none tracking-wide text-ticket-paper uppercase font-bold">
              Marissa <span className="text-paprika-500">RO⇄EN</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">Staff Kitchen & Dining Vocab</p>
          </div>
        </button>

        {/* Right Status Badges: Streak & Offline */}
        <div className="flex items-center gap-2">
          {/* Offline indicator */}
          <div 
            className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border ${
              isOnline 
                ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40' 
                : 'bg-amber-950/60 text-amber-400 border-amber-800/60 animate-pulse'
            }`}
            title={isOnline ? 'Online mode active' : 'Offline PWA active'}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
            <span>{isOnline ? 'ON' : 'OFFLINE'}</span>
          </div>

          {/* Streak Badge */}
          <div 
            className="flex items-center gap-1 bg-paprika-950/70 border border-paprika-700/50 text-paprika-400 px-2.5 py-1 rounded-full text-xs font-mono font-bold shadow-sm"
            title={`${streakDays} days learning streak!`}
          >
            <Flame className="w-3.5 h-3.5 text-paprika-500 fill-paprika-500 animate-bounce" />
            <span>{streakDays}d</span>
          </div>
        </div>
      </div>

      {/* Bottom Mobile Tab Bar */}
      <nav className="max-w-md mx-auto px-2 flex justify-around border-t border-slate-800/70 bg-slate-900/90">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex-1 py-2 px-1 flex flex-col items-center gap-0.5 transition-all text-xs border-b-2 font-medium min-h-[48px] justify-center ${
                isActive
                  ? 'border-paprika-500 text-paprika-400 bg-paprika-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
              aria-label={item.labelEn}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110 text-paprika-500' : ''}`} />
              <span className="font-sans text-[11px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

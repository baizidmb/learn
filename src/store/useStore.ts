import { create } from 'zustand';
import { UserProgressState, CustomEntry } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { CONVERSATION_LINES } from '../data/conversationData';

const LOCAL_STORAGE_KEY = 'marissa_ro_en_user_progress_v2';

// Leitner Box Schedule intervals in days:
// Box 1 (new/failed): same session (0 days)
// Box 2: review next day (+1 day)
// Box 3: review after 3 days (+3 days)
// Box 4: review after 7 days (+7 days)
// Box 5 (mastered): review after 14 days (+14 days), marked known on dashboard
export const LEITNER_INTERVALS: Record<number, { days: number; label: string }> = {
  1: { days: 0, label: 'Același schimb (Same session)' },
  2: { days: 1, label: 'Mâine (Next day)' },
  3: { days: 3, label: 'Peste 3 zile (3 days)' },
  4: { days: 7, label: 'Peste 7 zile (1 week)' },
  5: { days: 14, label: 'Stăpânit! (Mastered - 14 days)' }
};

const getInitialState = (): UserProgressState => {
  const today = new Date().toISOString().split('T')[0];
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      let streak = parsed.streakDays || 1;
      const lastActive = parsed.lastActiveDate || today;

      const lastDate = new Date(lastActive);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1 && lastActive !== today) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1;
      }

      return {
        knownIds: parsed.knownIds || {},
        leitnerBoxes: parsed.leitnerBoxes || {},
        lastActiveDate: today,
        streakDays: streak,
        speechRate: parsed.speechRate || 0.9,
        customEntries: parsed.customEntries || [],
        activeView: 'home',
      };
    } catch (e) {
      console.error('Failed to parse saved user progress:', e);
    }
  }

  return {
    knownIds: {},
    leitnerBoxes: {},
    lastActiveDate: today,
    streakDays: 1,
    speechRate: 0.9,
    customEntries: [],
    activeView: 'home',
  };
};

interface StoreActions {
  setActiveView: (view: UserProgressState['activeView']) => void;
  toggleKnown: (id: string) => void;
  setLeitnerBox: (id: string, box: number) => void;
  markAsKnownAndPromote: (id: string) => void;
  markAsLearningAndReset: (id: string) => void;
  setSpeechRate: (rate: number) => void;
  addCustomEntry: (entry: Omit<CustomEntry, 'id' | 'createdAt'>) => void;
  deleteCustomEntry: (id: string) => void;
  resetAllProgress: () => void;
  getOverallStats: () => {
    menuTotal: number;
    menuKnown: number;
    glossaryTotal: number;
    glossaryKnown: number;
    conversationTotal: number;
    conversationKnown: number;
    totalMastered: number;
    totalItems: number;
    percentMastered: number;
  };
}

export const useStore = create<UserProgressState & StoreActions>((set, get) => {
  const initial = getInitialState();

  const persist = (newState: Partial<UserProgressState>) => {
    const current = get();
    const toSave = {
      knownIds: newState.knownIds ?? current.knownIds,
      leitnerBoxes: newState.leitnerBoxes ?? current.leitnerBoxes,
      lastActiveDate: newState.lastActiveDate ?? current.lastActiveDate,
      streakDays: newState.streakDays ?? current.streakDays,
      speechRate: newState.speechRate ?? current.speechRate,
      customEntries: newState.customEntries ?? current.customEntries,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
  };

  return {
    ...initial,

    setActiveView: (activeView) => set({ activeView }),

    toggleKnown: (id) => {
      set((state) => {
        const nextKnown = { ...state.knownIds, [id]: !state.knownIds[id] };
        const nextBox = nextKnown[id] ? 5 : 1;
        const nextBoxes = { ...state.leitnerBoxes, [id]: nextBox };
        persist({ knownIds: nextKnown, leitnerBoxes: nextBoxes });
        return { knownIds: nextKnown, leitnerBoxes: nextBoxes };
      });
    },

    setLeitnerBox: (id, box) => {
      set((state) => {
        const nextBox = Math.max(1, Math.min(5, box));
        const nextKnown = { ...state.knownIds, [id]: nextBox >= 5 };
        const nextBoxes = { ...state.leitnerBoxes, [id]: nextBox };
        persist({ knownIds: nextKnown, leitnerBoxes: nextBoxes });
        return { knownIds: nextKnown, leitnerBoxes: nextBoxes };
      });
    },

    markAsKnownAndPromote: (id) => {
      set((state) => {
        const currentBox = state.leitnerBoxes[id] || 1;
        const nextBox = Math.min(5, currentBox + 1);
        const nextKnown = { ...state.knownIds, [id]: nextBox >= 5 };
        const nextBoxes = { ...state.leitnerBoxes, [id]: nextBox };
        persist({ knownIds: nextKnown, leitnerBoxes: nextBoxes });
        return { knownIds: nextKnown, leitnerBoxes: nextBoxes };
      });
    },

    markAsLearningAndReset: (id) => {
      set((state) => {
        const nextKnown = { ...state.knownIds, [id]: false };
        const nextBoxes = { ...state.leitnerBoxes, [id]: 1 };
        persist({ knownIds: nextKnown, leitnerBoxes: nextBoxes });
        return { knownIds: nextKnown, leitnerBoxes: nextBoxes };
      });
    },

    setSpeechRate: (speechRate) => {
      set({ speechRate });
      persist({ speechRate });
    },

    addCustomEntry: (entryData) => {
      set((state) => {
        const newEntry: CustomEntry = {
          ...entryData,
          id: `custom-${Date.now()}`,
          createdAt: Date.now(),
        };
        const nextEntries = [newEntry, ...state.customEntries];
        persist({ customEntries: nextEntries });
        return { customEntries: nextEntries };
      });
    },

    deleteCustomEntry: (id) => {
      set((state) => {
        const nextEntries = state.customEntries.filter((e) => e.id !== id);
        persist({ customEntries: nextEntries });
        return { customEntries: nextEntries };
      });
    },

    resetAllProgress: () => {
      const reset = {
        knownIds: {},
        leitnerBoxes: {},
        lastActiveDate: new Date().toISOString().split('T')[0],
        streakDays: 1,
        customEntries: [],
      };
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      set(reset);
    },

    getOverallStats: () => {
      const state = get();

      const menuTotal = MENU_ITEMS.length;
      const menuKnown = MENU_ITEMS.filter((i) => state.knownIds[i.id] || (state.leitnerBoxes[i.id] || 1) >= 5).length;

      const glossaryTotal = GLOSSARY_TERMS.length;
      const glossaryKnown = GLOSSARY_TERMS.filter((g) => state.knownIds[g.id] || (state.leitnerBoxes[g.id] || 1) >= 5).length;

      const conversationTotal = CONVERSATION_LINES.length;
      const conversationKnown = CONVERSATION_LINES.filter((c) => state.knownIds[c.id] || (state.leitnerBoxes[c.id] || 1) >= 5).length;

      const totalMastered = menuKnown + glossaryKnown + conversationKnown;
      const totalItems = menuTotal + glossaryTotal + conversationTotal;
      const percentMastered = totalItems > 0 ? Math.round((totalMastered / totalItems) * 100) : 0;

      return {
        menuTotal,
        menuKnown,
        glossaryTotal,
        glossaryKnown,
        conversationTotal,
        conversationKnown,
        totalMastered,
        totalItems,
        percentMastered,
      };
    },
  };
});

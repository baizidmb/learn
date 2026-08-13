export interface MenuItem {
  id: string;
  category: string;        // e.g. "Preparate din pui"
  categoryEn: string;      // "Chicken"
  nameRo: string;
  nameEn: string;
  ingredientsRo: string[];
  ingredientsEn: string[];
  weight: string;          // e.g. "150g"
  price: number;           // lei
  allergens?: number[];    // 1-14 per EU allergen codes
}

export interface GlossaryTerm {
  id: string;
  category: string;        // e.g. "Legume"
  categoryEn: string;      // "Vegetables"
  ro: string;
  en: string;
  type: "ingredient" | "kitchen-vocab";
}

export interface ConversationLine {
  id: string;
  scenario: string;        // e.g. "Luarea comenzii"
  scenarioEn: string;      // "Taking the Order"
  speaker: "Chelner" | "Client" | "Bucătar";
  ro: string;
  en: string;
}

export interface CustomEntry {
  id: string;
  titleRo: string;
  titleEn: string;
  category: string;
  type: 'menu' | 'glossary' | 'conversation';
  createdAt: number;
}

export interface LeitnerItemMetadata {
  box: 1 | 2 | 3 | 4 | 5;
  lastReviewedDate: string; // YYYY-MM-DD
  nextReviewDueDate: string; // YYYY-MM-DD
}

export interface UserProgressState {
  knownIds: Record<string, boolean>; // itemId -> true (mastered) / false (learning)
  leitnerBoxes: Record<string, number>; // itemId -> 1..5 box level
  lastActiveDate: string; // YYYY-MM-DD
  streakDays: number;
  speechRate: number; // 0.8, 1.0, 1.2
  customEntries: CustomEntry[];
  activeView: 'home' | 'menu' | 'glossary' | 'conversation' | 'flashcards';
}

export interface EUAllergen {
  code: number;
  nameRo: string;
  nameEn: string;
  icon: string;
  descriptionRo: string;
  descriptionEn: string;
}

export interface SpeechEvalResult {
  transcript: string;
  score: number; // 0 to 100
  rating: 'perfect' | 'great' | 'close' | 'retry';
  feedbackMessage: string;
}

# Marissa RO⇄EN — Restaurant & Kitchen Staff Bilingual Training Web App

**Marissa RO⇄EN** is an offline-first, mobile-optimized Progressive Web Application (PWA) designed for food service staff (waiters, kitchen cooks, runners) to learn Romanian & English menu items, ingredient terminology, kitchen vocabulary, EU allergen codes, and real dining floor conversations.

## 🚀 Features

- **Menu Explorer**: Browse 25+ authentic Romanian restaurant dishes with RO/EN translations, ingredients, prices, weights, EU allergen badges (1-14), and tap-to-pronounce TTS audio.
- **Ingredient & Vocabulary Glossary**: 60+ technical kitchen & dining terms categorized by proteins, dairy, vegetables, equipment, cooking actions, front-of-house service, and safety.
- **Conversation Practice**: 6 real-world service scenarios (Greeting, Taking Orders, Allergies, Mid-Meal, Payment, Kitchen Communication) featuring interactive **Speech Practice Mode** using `SpeechRecognition` fuzzy matching + Levenshtein distance scoring.
- **Flashcard & Spaced Repetition Quiz**: Flip-card Leitner box spaced-repetition study mode + 4-option multiple choice quiz variant with score tracking.
- **Progress Dashboard**: Daily streak counter, overall percentage mastery tracking per section, and custom entry adder.
- **PWA & Offline Capability**: Installable to home screens, works completely offline without a server.

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. Build for production:
   ```bash
   npm run build
   ```

---

## 📂 Data Structure & How to Extend Content

All content is structured as typed data files in `src/data/`:

### 1. Menu Items (`src/data/menuData.ts`)
To add a new dish, append an object matching the `MenuItem` interface:
```ts
{
  id: "menu-26",
  category: "Deserturi",
  categoryEn: "Desserts",
  nameRo: "Tartă cu mere și vanilie",
  nameEn: "Apple Tart with Vanilla",
  ingredientsRo: ["mere", "făină", "unt", "scorțișoară"],
  ingredientsEn: ["apples", "flour", "butter", "cinnamon"],
  weight: "180g",
  price: 26,
  allergens: [1, 7] // EU Allergen Codes (1=Gluten, 7=Milk)
}
```

### 2. Glossary Terms (`src/data/glossaryData.ts`)
To add a new ingredient or kitchen term, append an object matching `GlossaryTerm`:
```ts
{
  id: "glo-58",
  category: "Echipamente Bucătărie",
  categoryEn: "Kitchen Equipment",
  ro: "Spatulă din silicon",
  en: "Silicon spatula",
  type: "kitchen-vocab" // "ingredient" or "kitchen-vocab"
}
```

### 3. Conversation Dialogue (`src/data/conversationData.ts`)
To add new dialogue lines, append an object matching `ConversationLine`:
```ts
{
  id: "conv-23",
  scenario: "Plata și nota",
  scenarioEn: "Payment & Bill",
  speaker: "Chelner", // "Chelner", "Client", or "Bucătar"
  ro: "Doriți chitanța fiscală?",
  en: "Would you like the tax receipt?"
}
```

---

## 📱 Tech Stack
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **State & Persistence**: Zustand + LocalStorage
- **Audio & Speech**: Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
- **PWA**: Service Worker (`public/sw.js`) + Manifest (`public/manifest.json`)

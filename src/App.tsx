import { useState } from 'react';
import { useStore } from './store/useStore';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { MenuExplorer } from './components/MenuExplorer';
import { GlossaryView } from './components/GlossaryView';
import { ConversationPractice } from './components/ConversationPractice';
import { FlashcardQuiz } from './components/FlashcardQuiz';
import { AllergenModal } from './components/AllergenModal';
import { CustomItemModal } from './components/CustomItemModal';

export function App() {
  const { activeView } = useStore();
  const [isAllergensOpen, setIsAllergensOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-paprika-500 selection:text-white">
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4">
        {activeView === 'home' && (
          <HomeDashboard
            onOpenAllergensModal={() => setIsAllergensOpen(true)}
            onOpenCustomModal={() => setIsCustomOpen(true)}
          />
        )}

        {activeView === 'menu' && (
          <MenuExplorer
            onOpenAllergensModal={() => setIsAllergensOpen(true)}
          />
        )}

        {activeView === 'glossary' && <GlossaryView />}

        {activeView === 'conversation' && <ConversationPractice />}

        {activeView === 'flashcards' && <FlashcardQuiz />}
      </main>

      {/* EU Allergen Reference Guide Modal */}
      <AllergenModal
        isOpen={isAllergensOpen}
        onClose={() => setIsAllergensOpen(false)}
      />

      {/* Add Custom Term Entry Modal */}
      <CustomItemModal
        isOpen={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
      />
    </div>
  );
}

export default App;

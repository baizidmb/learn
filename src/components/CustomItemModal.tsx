import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, PlusCircle } from 'lucide-react';

interface CustomItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomItemModal: React.FC<CustomItemModalProps> = ({ isOpen, onClose }) => {
  const { addCustomEntry } = useStore();
  const [titleRo, setTitleRo] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState('Personalizat');
  const [type, setType] = useState<'menu' | 'glossary' | 'conversation'>('menu');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleRo.trim() || !titleEn.trim()) return;

    addCustomEntry({
      titleRo: titleRo.trim(),
      titleEn: titleEn.trim(),
      category: category.trim() || 'Custom',
      type,
    });

    setTitleRo('');
    setTitleEn('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-paprika-400" />
            <h3 className="font-display font-bold text-lg text-ticket-paper uppercase">
              Adaugă Termen Nou
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-mono mb-1">Tip Element (Type):</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-sans"
            >
              <option value="menu">Preparat Meniu (Dish)</option>
              <option value="glossary">Glosar Vocabular (Glossary Term)</option>
              <option value="conversation">Dialog Serviciu (Dialogue Line)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Text Română (RO):</label>
            <input
              type="text"
              required
              value={titleRo}
              onChange={(e) => setTitleRo(e.target.value)}
              placeholder="e.g. Supă cremă de ciuperci"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Traducere Engleză (EN):</label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. Cream of mushroom soup"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Categorie (Category):</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Supe, Desert, Serviciu"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-sans"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-mono"
            >
              Anulează
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-paprika-600 hover:bg-paprika-500 text-white rounded-xl font-mono font-bold shadow"
            >
              Salvează Termen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { EU_ALLERGENS } from '../data/allergensData';
import { X, ShieldAlert } from 'lucide-react';

interface AllergenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AllergenModal: React.FC<AllergenModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-950 border border-amber-700/60 rounded-lg text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-ticket-paper uppercase tracking-wider">
                Ghid Alergene EU (1-14)
              </h3>
              <p className="text-[11px] font-mono text-slate-400">EU Regulatory Food Allergen Codes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Allergen list */}
        <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-slate-800/80">
          {Object.values(EU_ALLERGENS).map((allergen) => (
            <div key={allergen.code} className="pt-2.5 first:pt-0 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 font-mono text-lg">
                {allergen.icon}
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-bold text-amber-400 text-xs">
                    CODE {allergen.code}
                  </span>
                  <span className="font-bold text-sm text-ticket-paper">
                    {allergen.nameRo} / <span className="font-serif italic font-normal text-slate-300">{allergen.nameEn}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  {allergen.descriptionRo}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-xs rounded-xl font-bold border border-slate-700"
          >
            Închide (Close)
          </button>
        </div>
      </div>
    </div>
  );
};

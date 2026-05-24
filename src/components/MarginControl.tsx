import React from 'react';
import type { Language } from '../i18n/translations';

export type CVMargins = 'tight' | 'normal' | 'wide';

interface Props {
  selected: CVMargins;
  onChange: (m: CVMargins) => void;
  language: Language;
}

const options: { id: CVMargins; en: string; es: string; icon: string }[] = [
  { id: 'tight',  en: 'Tight',  es: 'Estrecho', icon: '▣' },
  { id: 'normal', en: 'Normal', es: 'Normal',    icon: '▢' },
  { id: 'wide',   en: 'Wide',   es: 'Amplio',    icon: '□' },
];

export const MarginControl: React.FC<Props> = ({ selected, onChange, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {isEs ? 'Márgenes' : 'Margins'}
      </p>
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 transition ${
              selected === o.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xs leading-none">{o.icon}</span>
            <span className="text-[9px] font-semibold">{isEs ? o.es : o.en}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

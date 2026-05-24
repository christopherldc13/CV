import React from 'react';
import type { LineSpacing } from '../types/cv.types';
import type { Language } from '../i18n/translations';

interface Props {
  selected: LineSpacing;
  onChange: (s: LineSpacing) => void;
  language: Language;
}

const options: { id: LineSpacing; en: string; es: string }[] = [
  { id: 'tight',   en: 'Tight',   es: 'Compacto' },
  { id: 'normal',  en: 'Normal',  es: 'Normal'   },
  { id: 'relaxed', en: 'Relaxed', es: 'Amplio'   },
];

export const SpacingControl: React.FC<Props> = ({ selected, onChange, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {isEs ? 'Espaciado de Línea' : 'Line Spacing'}
      </p>
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`flex-1 py-1.5 text-xs font-medium transition ${
              selected === o.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isEs ? o.es : o.en}
          </button>
        ))}
      </div>
    </div>
  );
};

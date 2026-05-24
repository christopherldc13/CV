import React from 'react';
import type { FontSize } from '../types/cv.types';
import type { Language } from '../i18n/translations';

interface Props {
  selected: FontSize;
  onChange: (s: FontSize) => void;
  language: Language;
}

const sizes: { id: FontSize; label: string; icon: string }[] = [
  { id: 'xs', label: 'XS', icon: 'text-[9px]' },
  { id: 'sm', label: 'S',  icon: 'text-[10px]' },
  { id: 'md', label: 'M',  icon: 'text-xs' },
  { id: 'lg', label: 'L',  icon: 'text-sm' },
];

export const FontSizeControl: React.FC<Props> = ({ selected, onChange, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {isEs ? 'Tamaño de Texto' : 'Text Size'}
      </p>
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {sizes.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 transition ${
              selected === s.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className={`font-bold leading-none ${s.icon}`}>A</span>
            <span className="text-[9px] font-semibold leading-none">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

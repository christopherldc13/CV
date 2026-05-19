import React from 'react';
import type { FontFamily } from '../types/cv.types';
import type { Language } from '../i18n/translations';
import { fontFamilyMap } from '../utils/colors';

interface Props {
  selected: FontFamily;
  onChange: (f: FontFamily) => void;
  language: Language;
}

const fonts: { id: FontFamily; label: string; sample: string }[] = [
  { id: 'inter',        label: 'Inter',       sample: 'Aa' },
  { id: 'roboto',       label: 'Roboto',      sample: 'Aa' },
  { id: 'georgia',      label: 'Georgia',     sample: 'Aa' },
  { id: 'playfair',     label: 'Playfair',    sample: 'Aa' },
  { id: 'merriweather', label: 'Merriweather',sample: 'Aa' },
];

export const FontPicker: React.FC<Props> = ({ selected, onChange, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {isEs ? 'Tipografía' : 'Font'}
      </p>
      <div className="grid grid-cols-5 gap-1.5">
        {fonts.map((f) => (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            title={f.label}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg border-2 transition-all ${
              selected === f.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span
              className={`text-base font-semibold leading-none ${selected === f.id ? 'text-blue-700' : 'text-gray-700'}`}
              style={{ fontFamily: fontFamilyMap[f.id] }}
            >
              {f.sample}
            </span>
            <span className={`text-[9px] font-medium leading-tight truncate w-full text-center ${selected === f.id ? 'text-blue-600' : 'text-gray-500'}`}>
              {f.label.length > 6 ? f.label.slice(0, 5) + '…' : f.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

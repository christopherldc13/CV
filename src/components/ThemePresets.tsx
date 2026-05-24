import React from 'react';
import type { AccentColor, FontFamily, TemplateType } from '../types/cv.types';
import type { Language } from '../i18n/translations';

interface PresetValues {
  accentColor: AccentColor;
  fontFamily: FontFamily;
  template?: TemplateType;
}

interface Props {
  onChange: (values: PresetValues) => void;
  language: Language;
}

const presets: { name: string; nameEs: string; color: string; values: PresetValues }[] = [
  { name: 'Ocean',    nameEs: 'Océano',    color: '#0d9488', values: { accentColor: 'teal',    fontFamily: 'inter',        template: 'modern'    } },
  { name: 'Classic',  nameEs: 'Clásico',   color: '#334155', values: { accentColor: 'slate',   fontFamily: 'georgia',      template: 'classic'   } },
  { name: 'Violet',   nameEs: 'Violeta',   color: '#7c3aed', values: { accentColor: 'violet',  fontFamily: 'inter',        template: 'minimal'   } },
  { name: 'Elegant',  nameEs: 'Elegante',  color: '#111827', values: { accentColor: 'dark',    fontFamily: 'playfair',     template: 'elegant'   } },
  { name: 'Warm',     nameEs: 'Cálido',    color: '#d97706', values: { accentColor: 'amber',   fontFamily: 'merriweather', template: 'executive' } },
  { name: 'Bold',     nameEs: 'Audaz',     color: '#e11d48', values: { accentColor: 'rose',    fontFamily: 'roboto',       template: 'bold'      } },
  { name: 'Tech',     nameEs: 'Tech',      color: '#2563eb', values: { accentColor: 'indigo',  fontFamily: 'roboto',       template: 'tech'      } },
  { name: 'Nature',   nameEs: 'Natural',   color: '#059669', values: { accentColor: 'emerald', fontFamily: 'inter',        template: 'timeline'  } },
];

export const ThemePresets: React.FC<Props> = ({ onChange, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {isEs ? 'Temas Rápidos' : 'Quick Themes'}
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => onChange(p.values)}
            title={isEs ? p.nameEs : p.name}
            className="flex flex-col items-center gap-1 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
          >
            <div className="w-5 h-5 rounded-full" style={{ background: p.color }} />
            <span className="text-[9px] font-semibold text-gray-500 leading-none">
              {isEs ? p.nameEs : p.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

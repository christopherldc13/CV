import React from 'react';
import type { TemplateType } from '../types/cv.types';
import type { Language } from '../i18n/translations';

interface Props {
  selected: TemplateType;
  onChange: (t: TemplateType) => void;
  language: Language;
}

const templates: { id: TemplateType; en: string; es: string }[] = [
  { id: 'classic',   en: 'Classic',   es: 'Clásico'   },
  { id: 'modern',    en: 'Modern',    es: 'Moderno'    },
  { id: 'minimal',   en: 'Minimal',   es: 'Mínimo'     },
  { id: 'executive', en: 'Executive', es: 'Ejecutivo'  },
  { id: 'creative',  en: 'Creative',  es: 'Creativo'   },
  { id: 'bold',      en: 'Bold',      es: 'Negrita'    },
  { id: 'academic',  en: 'Academic',  es: 'Académico'  },
  { id: 'tech',      en: 'Tech',      es: 'Tech'       },
  { id: 'compact',   en: 'Compact',   es: 'Compacto'   },
];

const TemplateThumbnail = ({ id, selected }: { id: TemplateType; selected: boolean }) => {
  const ac = selected ? '#3b82f6' : '#9ca3af';
  const lg = selected ? '#bfdbfe' : '#e5e7eb';
  const dk = selected ? '#1d4ed8' : '#6b7280';

  switch (id) {
    case 'classic':
      return (
        <div className="flex h-full">
          <div className="flex-1 p-0.5 space-y-0.5">
            <div className="h-1.5 rounded-sm" style={{ background: ac }} />
            <div className="h-0.5 bg-gray-200 rounded" />
            <div className="h-0.5 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="w-2.5" style={{ background: lg }} />
        </div>
      );
    case 'modern':
      return (
        <div className="flex h-full">
          <div className="w-3" style={{ background: ac }} />
          <div className="flex-1 p-0.5 space-y-0.5">
            <div className="h-0.5 bg-gray-200 rounded" />
            <div className="h-0.5 bg-gray-200 rounded w-3/4" />
            <div className="h-0.5 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      );
    case 'minimal':
      return (
        <div className="p-0.5 space-y-0.5">
          <div className="h-1 rounded-sm" style={{ background: lg }} />
          <div className="h-0.5 bg-gray-200 rounded" />
          <div className="h-0.5 bg-gray-200 rounded w-3/4" />
          <div className="h-0.5 bg-gray-200 rounded w-1/2" />
        </div>
      );
    case 'executive':
      return (
        <div className="h-full">
          <div className="h-2.5 w-full" style={{ background: dk }} />
          <div className="h-0.5 w-full mb-0.5" style={{ background: '#f59e0b' }} />
          <div className="flex flex-1 px-0.5 gap-0.5 pt-0.5">
            <div className="flex-1 space-y-0.5">
              <div className="h-0.5 bg-gray-200 rounded w-3/4" />
              <div className="h-0.5 bg-gray-200 rounded" />
            </div>
            <div className="w-2.5" style={{ background: lg }} />
          </div>
        </div>
      );
    case 'creative':
      return (
        <div className="flex h-full">
          <div className="w-4 flex flex-col items-center pt-1 gap-0.5" style={{ background: ac }}>
            <div className="w-2 h-2 rounded-full bg-white opacity-60" />
          </div>
          <div className="flex-1 p-0.5 space-y-0.5">
            <div className="h-0.5 bg-gray-200 rounded" />
            <div className="h-0.5 bg-gray-200 rounded w-3/4" />
            <div className="h-0.5 rounded w-1/2" style={{ background: lg }} />
          </div>
        </div>
      );
    case 'bold':
      return (
        <div className="h-full">
          <div className="h-3 w-full flex items-center px-0.5" style={{ background: ac }}>
            <div className="h-1 w-3/4 bg-white opacity-70 rounded-sm" />
          </div>
          <div className="flex flex-1 pt-0.5">
            <div className="w-1/3 px-0.5 space-y-0.5" style={{ background: lg }}>
              <div className="h-0.5 bg-gray-300 rounded" />
              <div className="h-0.5 bg-gray-300 rounded w-3/4" />
            </div>
            <div className="flex-1 px-0.5 space-y-0.5">
              <div className="h-0.5 bg-gray-200 rounded" />
              <div className="h-0.5 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      );
    case 'academic':
      return (
        <div className="p-0.5 space-y-0.5">
          <div className="h-1 rounded-sm mx-auto w-2/3" style={{ background: dk }} />
          <div className="h-px bg-gray-300 rounded" />
          <div className="h-0.5 bg-gray-200 rounded" />
          <div className="h-0.5 bg-gray-200 rounded w-3/4" />
          <div className="h-px bg-gray-300 rounded" />
          <div className="h-0.5 bg-gray-200 rounded w-1/2" />
        </div>
      );
    case 'tech':
      return (
        <div className="p-0.5 h-full" style={{ background: '#1f2937' }}>
          <div className="h-0.5 rounded mb-0.5" style={{ background: '#4ade80', width: '80%' }} />
          <div className="h-0.5 rounded mb-0.5" style={{ background: '#60a5fa', width: '60%' }} />
          <div className="h-0.5 rounded" style={{ background: '#f9a8d4', width: '70%' }} />
        </div>
      );
    case 'compact':
      return (
        <div className="p-0.5 space-y-px">
          <div className="h-1 rounded-sm w-2/3 mx-auto" style={{ background: ac }} />
          <div className="h-0.5 bg-gray-200 rounded" />
          <div className="h-0.5 bg-gray-200 rounded" />
          <div className="h-0.5 bg-gray-200 rounded w-3/4" />
          <div className="h-0.5 bg-gray-200 rounded w-1/2" />
        </div>
      );
    default:
      return null;
  }
};

export const TemplateSelector: React.FC<Props> = ({ selected, onChange, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {isEs ? 'Plantilla' : 'Template'}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border-2 transition-all text-center ${
              selected === t.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`w-10 h-7 rounded border overflow-hidden bg-white ${selected === t.id ? 'border-blue-300' : 'border-gray-200'}`}>
              <TemplateThumbnail id={t.id} selected={selected === t.id} />
            </div>
            <span className="text-xs font-semibold leading-tight">{isEs ? t.es : t.en}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

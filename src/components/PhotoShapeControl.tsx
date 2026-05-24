import React from 'react';
import type { PhotoShape } from '../types/cv.types';
import type { Language } from '../i18n/translations';

interface Props {
  selected: PhotoShape;
  onChange: (s: PhotoShape) => void;
  language: Language;
}

export const PhotoShapeControl: React.FC<Props> = ({ selected, onChange, language }) => {
  const isEs = language === 'es';

  const options: { id: PhotoShape; en: string; es: string; shape: string }[] = [
    { id: 'circle', en: 'Circle', es: 'Círculo',  shape: 'rounded-full' },
    { id: 'square', en: 'Square', es: 'Cuadrado', shape: 'rounded-md'   },
    { id: 'hidden', en: 'Hidden', es: 'Ocultar',  shape: 'rounded-none' },
  ];

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {isEs ? 'Forma de Foto' : 'Photo Shape'}
      </p>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg border-2 transition ${
              selected === o.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-5 h-5 ${selected === o.id ? 'bg-blue-400' : 'bg-gray-300'} ${
              o.id === 'hidden' ? 'opacity-20' : ''
            } ${o.shape}`} />
            <span className={`text-[9px] font-semibold ${selected === o.id ? 'text-blue-600' : 'text-gray-500'}`}>
              {isEs ? o.es : o.en}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

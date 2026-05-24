import React from 'react';
import type { Language } from '../i18n/translations';

interface Props {
  hidden: string[];
  onChange: (hidden: string[]) => void;
  language: Language;
}

const TOGGLEABLE = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'] as const;

const labels: Record<string, { en: string; es: string }> = {
  summary:       { en: 'Summary',       es: 'Resumen'       },
  experience:    { en: 'Experience',    es: 'Experiencia'   },
  education:     { en: 'Education',     es: 'Educación'     },
  skills:        { en: 'Skills',        es: 'Habilidades'   },
  projects:      { en: 'Projects',      es: 'Proyectos'     },
  certifications:{ en: 'Certifications',es: 'Certificaciones'},
};

export const SectionVisibility: React.FC<Props> = ({ hidden, onChange, language }) => {
  const isEs = language === 'es';

  const toggle = (section: string) => {
    if (hidden.includes(section)) {
      onChange(hidden.filter((s) => s !== section));
    } else {
      onChange([...hidden, section]);
    }
  };

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {isEs ? 'Secciones Visibles' : 'Visible Sections'}
      </p>
      <div className="space-y-1">
        {TOGGLEABLE.map((section) => {
          const visible = !hidden.includes(section);
          return (
            <button
              key={section}
              onClick={() => toggle(section)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition text-xs font-medium ${
                visible
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 text-gray-400'
              }`}
            >
              <span>{isEs ? labels[section].es : labels[section].en}</span>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                visible ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
              }`}>
                {visible && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

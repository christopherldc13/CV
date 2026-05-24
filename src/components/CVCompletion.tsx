import React from 'react';
import type { CVData } from '../types/cv.types';
import type { Language } from '../i18n/translations';

interface Props {
  data: CVData;
  language: Language;
}

function score(data: CVData): { pct: number; missing: string[] } {
  const missing: string[] = [];
  const pi = data.personalInfo;

  if (!pi.name)     missing.push('name');
  if (!pi.title)    missing.push('title');
  if (!pi.email)    missing.push('email');
  if (!pi.phone)    missing.push('phone');
  if (!pi.location) missing.push('location');
  if (!data.summary || data.summary.length < 30) missing.push('summary');
  if (!data.experience.length) missing.push('experience');
  if (!data.education.length)  missing.push('education');
  if (!data.skills.length)     missing.push('skills');

  const total = 9;
  const done = total - missing.length;
  return { pct: Math.round((done / total) * 100), missing };
}

const missingLabel: Record<string, { en: string; es: string }> = {
  name:       { en: 'Full name',   es: 'Nombre completo' },
  title:      { en: 'Job title',   es: 'Cargo'           },
  email:      { en: 'Email',       es: 'Correo'          },
  phone:      { en: 'Phone',       es: 'Teléfono'        },
  location:   { en: 'Location',    es: 'Ubicación'       },
  summary:    { en: 'Summary',     es: 'Resumen'         },
  experience: { en: 'Experience',  es: 'Experiencia'     },
  education:  { en: 'Education',   es: 'Educación'       },
  skills:     { en: 'Skills',      es: 'Habilidades'     },
};

export const CVCompletion: React.FC<Props> = ({ data, language }) => {
  const { pct, missing } = score(data);
  const isEs = language === 'es';

  const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {isEs ? 'Progreso del CV' : 'CV Completion'}
        </p>
        <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {missing.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {missing.slice(0, 4).map((key) => (
            <span key={key} className="text-[9px] px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200 font-medium">
              + {isEs ? missingLabel[key]?.es : missingLabel[key]?.en}
            </span>
          ))}
          {missing.length > 4 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
              +{missing.length - 4} {isEs ? 'más' : 'more'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

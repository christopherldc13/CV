import React from 'react';
import type { Language } from '../../i18n/translations';

interface Props {
  summary: string;
  onChange: (summary: string) => void;
  language: Language;
}

export const SummaryForm: React.FC<Props> = ({ summary, onChange, language }) => {
  const isEs = language === 'es';

  const tips = isEs
    ? [
        'Comienza con tus años de experiencia y especialidad principal',
        'Menciona 2-3 habilidades o tecnologías clave',
        'Incluye un logro notable o una métrica de impacto',
        'Adáptalo al puesto al que estás aplicando',
      ]
    : [
        'Lead with your years of experience and primary expertise',
        'Mention 2-3 key skills or technologies',
        'Include a notable achievement or impact metric',
        "Tailor it to the role you're applying for",
      ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {isEs ? 'Resumen Profesional' : 'Professional Summary'}
        </label>
        <textarea
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder={isEs
            ? 'Escribe un resumen convincente de 2-4 oraciones sobre tu trayectoria, habilidades clave y objetivos...'
            : 'Write a compelling 2-4 sentence summary of your professional background, key skills, and career goals...'}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white placeholder-gray-400 resize-none"
        />
        <p className="mt-1 text-xs text-gray-400">
          {summary.length} {isEs ? 'caracteres' : 'characters'}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <p className="text-xs font-semibold text-blue-700 mb-1">
          {isEs ? 'Consejos para un buen resumen:' : 'Tips for a strong summary:'}
        </p>
        <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
          {tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>
    </div>
  );
};

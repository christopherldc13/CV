import React, { useState } from 'react';
import type { WorkExperience } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';

interface Props {
  experiences: WorkExperience[];
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<WorkExperience>) => void;
  onRemove: (id: string) => void;
  language: Language;
}

interface EntryProps {
  exp: WorkExperience;
  index: number;
  onUpdate: (id: string, data: Partial<WorkExperience>) => void;
  onRemove: (id: string) => void;
  isEs: boolean;
}

const ExperienceEntry: React.FC<EntryProps> = ({ exp, index, onUpdate, onRemove, isEs }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const [highlightInput, setHighlightInput] = useState('');

  const highlights = exp.highlights ?? [];

  const addHighlight = () => {
    if (highlightInput.trim()) {
      onUpdate(exp.id, { highlights: [...highlights, highlightInput.trim()] });
      setHighlightInput('');
    }
  };

  const removeHighlight = (i: number) => {
    onUpdate(exp.id, { highlights: highlights.filter((_, idx) => idx !== i) });
  };

  const updateHighlight = (i: number, value: string) => {
    const updated = [...highlights];
    updated[i] = value;
    onUpdate(exp.id, { highlights: updated });
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {exp.position || (isEs ? 'Nuevo Puesto' : 'New Position')}{exp.company ? ` — ${exp.company}` : ''}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {exp.startDate || '—'} → {exp.current ? (isEs ? 'Presente' : 'Present') : exp.endDate || '—'}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button onClick={(e) => { e.stopPropagation(); onRemove(exp.id); }}
            className="text-gray-400 hover:text-red-500 transition p-1 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Empresa' : 'Company'}
              </label>
              <input value={exp.company} onChange={(e) => onUpdate(exp.id, { company: e.target.value })}
                placeholder={isEs ? 'Nombre de la empresa' : 'Company name'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Puesto / Título' : 'Position / Title'}
              </label>
              <input value={exp.position} onChange={(e) => onUpdate(exp.id, { position: e.target.value })}
                placeholder={isEs ? 'Título del puesto' : 'Job title'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {isEs ? 'Ubicación' : 'Location'}
            </label>
            <input value={exp.location} onChange={(e) => onUpdate(exp.id, { location: e.target.value })}
              placeholder={isEs ? 'Ciudad, País / Remoto' : 'City, State / Remote'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Fecha de Inicio' : 'Start Date'}
              </label>
              <input type="month" value={exp.startDate} onChange={(e) => onUpdate(exp.id, { startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Fecha de Fin' : 'End Date'}
              </label>
              <input type="month" value={exp.endDate} disabled={exp.current}
                onChange={(e) => onUpdate(exp.id, { endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400" />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={exp.current}
              onChange={(e) => onUpdate(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">
              {isEs ? 'Trabajo aquí actualmente' : 'I currently work here'}
            </span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {isEs ? 'Descripción' : 'Description'}
            </label>
            <textarea value={exp.description} onChange={(e) => onUpdate(exp.id, { description: e.target.value })}
              rows={2} placeholder={isEs ? 'Breve descripción del puesto...' : 'Brief description of the role...'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {isEs ? 'Logros Clave' : 'Key Achievements'}
            </label>
            <div className="space-y-1.5 mb-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={h} onChange={(e) => updateHighlight(i, e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  <button onClick={() => removeHighlight(i)} className="text-gray-400 hover:text-red-500 transition p-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                placeholder={isEs ? 'ej. Aumenté los ingresos un 30%...' : 'e.g. Increased revenue by 30%...'}
                className="flex-1 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              <button onClick={addHighlight}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 transition font-medium">
                {isEs ? 'Agregar' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ExperienceForm: React.FC<Props> = ({ experiences, onAdd, onUpdate, onRemove, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-3">
      {experiences.map((exp, i) => (
        <ExperienceEntry key={exp.id} exp={exp} index={i} onUpdate={onUpdate} onRemove={onRemove} isEs={isEs} />
      ))}
      <button onClick={onAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {isEs ? '+ Agregar Experiencia' : '+ Add Experience'}
      </button>
    </div>
  );
};

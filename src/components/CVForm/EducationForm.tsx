import React, { useState } from 'react';
import type { Education } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';

interface Props {
  education: Education[];
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onRemove: (id: string) => void;
  language: Language;
}

interface EntryProps {
  edu: Education;
  index: number;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onRemove: (id: string) => void;
  isEs: boolean;
}

const EducationEntry: React.FC<EntryProps> = ({ edu, index, onUpdate, onRemove, isEs }) => {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {edu.institution || (isEs ? 'Nueva Institución' : 'New Institution')}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {edu.degree} {edu.field ? `— ${edu.field}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button onClick={(e) => { e.stopPropagation(); onRemove(edu.id); }}
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
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {isEs ? 'Institución' : 'Institution'}
            </label>
            <input value={edu.institution} onChange={(e) => onUpdate(edu.id, { institution: e.target.value })}
              placeholder={isEs ? 'Universidad / Escuela' : 'University / School name'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Título / Grado' : 'Degree'}
              </label>
              <input value={edu.degree} onChange={(e) => onUpdate(edu.id, { degree: e.target.value })}
                placeholder={isEs ? 'ej. Licenciatura en Ciencias' : 'e.g. Bachelor of Science'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Campo de Estudio' : 'Field of Study'}
              </label>
              <input value={edu.field} onChange={(e) => onUpdate(edu.id, { field: e.target.value })}
                placeholder={isEs ? 'ej. Ingeniería en Sistemas' : 'e.g. Computer Science'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Ubicación' : 'Location'}
              </label>
              <input value={edu.location} onChange={(e) => onUpdate(edu.id, { location: e.target.value })}
                placeholder={isEs ? 'Ciudad, País' : 'City, State'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Promedio / GPA (opcional)' : 'GPA (optional)'}
              </label>
              <input value={edu.gpa} onChange={(e) => onUpdate(edu.id, { gpa: e.target.value })}
                placeholder={isEs ? 'ej. 9.2 / 10' : 'e.g. 3.8 / 4.0'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Fecha de Inicio' : 'Start Date'}
              </label>
              <input type="month" value={edu.startDate} onChange={(e) => onUpdate(edu.id, { startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Fecha de Fin' : 'End Date'}
              </label>
              <input type="month" value={edu.endDate} disabled={edu.current}
                onChange={(e) => onUpdate(edu.id, { endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400" />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={edu.current}
              onChange={(e) => onUpdate(edu.id, { current: e.target.checked, endDate: e.target.checked ? '' : edu.endDate })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">
              {isEs ? 'Estudio aquí actualmente' : 'Currently studying here'}
            </span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {isEs ? 'Información Adicional (opcional)' : 'Additional Info (optional)'}
            </label>
            <textarea value={edu.description} onChange={(e) => onUpdate(edu.id, { description: e.target.value })}
              rows={2}
              placeholder={isEs ? 'Honores, premios, materias relevantes, actividades...' : 'Honors, awards, relevant coursework, activities...'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" />
          </div>
        </div>
      )}
    </div>
  );
};

export const EducationForm: React.FC<Props> = ({ education, onAdd, onUpdate, onRemove, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-3">
      {education.map((edu, i) => (
        <EducationEntry key={edu.id} edu={edu} index={i} onUpdate={onUpdate} onRemove={onRemove} isEs={isEs} />
      ))}
      <button onClick={onAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {isEs ? '+ Agregar Educación' : '+ Add Education'}
      </button>
    </div>
  );
};

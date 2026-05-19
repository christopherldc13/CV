import React, { useState } from 'react';
import type { SkillCategory } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';

interface Props {
  skills: SkillCategory[];
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<SkillCategory>) => void;
  onRemove: (id: string) => void;
  language: Language;
}

interface CategoryProps {
  cat: SkillCategory;
  onUpdate: (id: string, data: Partial<SkillCategory>) => void;
  onRemove: (id: string) => void;
  isEs: boolean;
}

const SkillCategoryCard: React.FC<CategoryProps> = ({ cat, onUpdate, onRemove, isEs }) => {
  const [inputVal, setInputVal] = useState('');

  const skills = cat.skills ?? [];

  const addSkill = () => {
    const trimmed = inputVal.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onUpdate(cat.id, { skills: [...skills, trimmed] });
      setInputVal('');
    }
  };

  const removeSkill = (skill: string) => {
    onUpdate(cat.id, { skills: skills.filter((s) => s !== skill) });
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
      <div className="flex items-center gap-2">
        <input value={cat.name} onChange={(e) => onUpdate(cat.id, { name: e.target.value })}
          placeholder={isEs ? 'Nombre de categoría (ej. Habilidades Técnicas)' : 'Category name (e.g. Technical Skills)'}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        <button onClick={() => onRemove(cat.id)}
          className="text-gray-400 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
            {skill}
            <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition ml-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={inputVal} onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          placeholder={isEs ? 'Escribe una habilidad y presiona Enter...' : 'Type a skill and press Enter...'}
          className="flex-1 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        <button onClick={addSkill}
          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition font-medium">
          {isEs ? 'Agregar' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export const SkillsForm: React.FC<Props> = ({ skills, onAdd, onUpdate, onRemove, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-3">
      {skills.map((cat) => (
        <SkillCategoryCard key={cat.id} cat={cat} onUpdate={onUpdate} onRemove={onRemove} isEs={isEs} />
      ))}
      <button onClick={onAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {isEs ? '+ Agregar Categoría' : '+ Add Skill Category'}
      </button>
    </div>
  );
};

import React, { useState } from 'react';
import type { Project, Certification } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';

// ─── Projects ────────────────────────────────────────────────────────────────

interface ProjectsProps {
  projects: Project[];
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<Project>) => void;
  onRemove: (id: string) => void;
  language: Language;
}

interface ProjectEntryProps {
  project: Project;
  index: number;
  onUpdate: (id: string, data: Partial<Project>) => void;
  onRemove: (id: string) => void;
  isEs: boolean;
}

const ProjectEntry: React.FC<ProjectEntryProps> = ({ project, index, onUpdate, onRemove, isEs }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const [techInput, setTechInput] = useState('');

  const technologies = project.technologies ?? [];

  const addTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      onUpdate(project.id, { technologies: [...technologies, trimmed] });
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    onUpdate(project.id, { technologies: technologies.filter((t) => t !== tech) });
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {project.name || (isEs ? 'Nuevo Proyecto' : 'New Project')}
          </p>
          <p className="text-xs text-gray-500 truncate">{technologies.slice(0, 4).join(', ')}</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button onClick={(e) => { e.stopPropagation(); onRemove(project.id); }}
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
              {isEs ? 'Nombre del Proyecto' : 'Project Name'}
            </label>
            <input value={project.name} onChange={(e) => onUpdate(project.id, { name: e.target.value })}
              placeholder={isEs ? 'Nombre del proyecto' : 'Project name'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {isEs ? 'Descripción' : 'Description'}
            </label>
            <textarea value={project.description} onChange={(e) => onUpdate(project.id, { description: e.target.value })}
              rows={3}
              placeholder={isEs ? 'Describe el proyecto, tu rol y el impacto...' : 'Describe the project, your role, and impact...'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {isEs ? 'Tecnologías' : 'Technologies'}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {technologies.map((tech) => (
                <span key={tech} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {tech}
                  <button onClick={() => removeTech(tech)} className="hover:text-red-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                placeholder={isEs ? 'Agregar tecnología...' : 'Add technology...'}
                className="flex-1 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              <button onClick={addTech}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition font-medium">
                {isEs ? 'Agregar' : 'Add'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'URL del Proyecto' : 'Live URL'}
              </label>
              <input value={project.url} onChange={(e) => onUpdate(project.id, { url: e.target.value })}
                placeholder="proyecto.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'URL de GitHub' : 'GitHub URL'}
              </label>
              <input value={project.github} onChange={(e) => onUpdate(project.id, { github: e.target.value })}
                placeholder="github.com/..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Fecha de Inicio' : 'Start Date'}
              </label>
              <input type="month" value={project.startDate} onChange={(e) => onUpdate(project.id, { startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Fecha de Fin' : 'End Date'}
              </label>
              <input type="month" value={project.endDate} onChange={(e) => onUpdate(project.id, { endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProjectsForm: React.FC<ProjectsProps> = ({ projects, onAdd, onUpdate, onRemove, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-3">
      {projects.map((p, i) => (
        <ProjectEntry key={p.id} project={p} index={i} onUpdate={onUpdate} onRemove={onRemove} isEs={isEs} />
      ))}
      <button onClick={onAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {isEs ? '+ Agregar Proyecto' : '+ Add Project'}
      </button>
    </div>
  );
};

// ─── Certifications ───────────────────────────────────────────────────────────

interface CertsProps {
  certifications: Certification[];
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<Certification>) => void;
  onRemove: (id: string) => void;
  language: Language;
}

interface CertEntryProps {
  cert: Certification;
  index: number;
  onUpdate: (id: string, data: Partial<Certification>) => void;
  onRemove: (id: string) => void;
  isEs: boolean;
}

const CertEntry: React.FC<CertEntryProps> = ({ cert, index, onUpdate, onRemove, isEs }) => {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {cert.name || (isEs ? 'Nueva Certificación' : 'New Certification')}
          </p>
          <p className="text-xs text-gray-500 truncate">{cert.issuer}</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button onClick={(e) => { e.stopPropagation(); onRemove(cert.id); }}
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
              {isEs ? 'Nombre de la Certificación' : 'Certification Name'}
            </label>
            <input value={cert.name} onChange={(e) => onUpdate(cert.id, { name: e.target.value })}
              placeholder={isEs ? 'ej. AWS Solutions Architect' : 'e.g. AWS Solutions Architect'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {isEs ? 'Organización Emisora' : 'Issuing Organization'}
            </label>
            <input value={cert.issuer} onChange={(e) => onUpdate(cert.id, { issuer: e.target.value })}
              placeholder={isEs ? 'ej. Amazon Web Services' : 'e.g. Amazon Web Services'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Fecha de Emisión' : 'Issue Date'}
              </label>
              <input type="month" value={cert.date} onChange={(e) => onUpdate(cert.id, { date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'Fecha de Vencimiento' : 'Expiry Date'}
              </label>
              <input type="month" value={cert.expiryDate} onChange={(e) => onUpdate(cert.id, { expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'ID de Credencial' : 'Credential ID'}
              </label>
              <input value={cert.credentialId} onChange={(e) => onUpdate(cert.id, { credentialId: e.target.value })}
                placeholder="ABC-123456"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {isEs ? 'URL de Verificación' : 'Verification URL'}
              </label>
              <input value={cert.url} onChange={(e) => onUpdate(cert.id, { url: e.target.value })}
                placeholder={isEs ? 'verificar.ejemplo.com/...' : 'verify.example.com/...'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CertificationsForm: React.FC<CertsProps> = ({ certifications, onAdd, onUpdate, onRemove, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-3">
      {certifications.map((c, i) => (
        <CertEntry key={c.id} cert={c} index={i} onUpdate={onUpdate} onRemove={onRemove} isEs={isEs} />
      ))}
      <button onClick={onAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {isEs ? '+ Agregar Certificación' : '+ Add Certification'}
      </button>
    </div>
  );
};

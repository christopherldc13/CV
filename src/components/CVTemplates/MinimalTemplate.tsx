import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { colorMap, fontFamilyMap, formatDate } from '../../utils/colors';

interface Props {
  data: CVData;
  settings: CVSettings;
  language: Language;
}

export const MinimalTemplate: React.FC<Props> = ({ data, settings, language }) => {
  const colors = colorMap[settings.accentColor];
  const font = fontFamilyMap[settings.fontFamily ?? 'inter'];
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const compact = (settings.fontSize as string) === 'compact';
  const isEs = language === 'es';

  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-5">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">{title}</h2>
        <div className="flex-1 h-px bg-gray-100"></div>
      </div>
      {children}
    </section>
  );

  return (
    <div className={`bg-white px-10 py-8 ${compact ? 'text-xs' : 'text-sm'}`}
      style={{ fontFamily: font }}>

      {/* Header */}
      <header className="mb-7 pb-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`font-light text-gray-900 tracking-tight ${compact ? 'text-2xl' : 'text-3xl'}`}>
              {pi.name || (isEs ? 'Tu Nombre' : 'Your Name')}
            </h1>
            <p className={`mt-1 font-medium ${colors.text} ${compact ? 'text-sm' : 'text-base'}`}>{pi.title}</p>
          </div>
          {pi.photoUrl && settings.photoShape !== 'hidden' && (
            <img src={pi.photoUrl} alt={pi.name}
              className={`w-16 h-16 ${settings.photoShape === 'circle' ? 'rounded-full' : 'rounded-lg'} object-cover ml-4`}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3">
          {pi.email && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {pi.email}
            </span>
          )}
          {pi.phone && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {pi.phone}
            </span>
          )}
          {pi.location && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {pi.location}
            </span>
          )}
          {pi.linkedin && <span className={`text-xs ${colors.text} font-medium`}>{pi.linkedin}</span>}
          {pi.website && <span className={`text-xs ${colors.text} font-medium`}>{pi.website}</span>}
        </div>
      </header>

      {summary && (
        <Section title={isEs ? 'Perfil' : 'Profile'}>
          <p className="text-gray-600 leading-relaxed text-xs">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title={isEs ? 'Experiencia' : 'Experience'}>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between mb-0.5">
                  <div>
                    <span className={`font-semibold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{exp.position}</span>
                    <span className="text-gray-400 mx-2">·</span>
                    <span className={`font-medium ${colors.text} text-xs`}>{exp.company}</span>
                    {exp.location && <span className="text-gray-400 text-xs ml-1">({exp.location})</span>}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {fmt(exp.startDate)} – {exp.current ? present : fmt(exp.endDate)}
                  </span>
                </div>
                {exp.description && <p className="text-xs text-gray-500 mt-1">{exp.description}</p>}
                {(exp.highlights ?? []).length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {(exp.highlights ?? []).map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className={`w-1 h-1 rounded-full ${colors.bg} mt-1.5 flex-shrink-0`}></span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title={isEs ? 'Educación' : 'Education'}>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-start justify-between">
                <div>
                  <p className={`font-semibold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>
                  {edu.gpa && <p className="text-xs text-gray-400">GPA {edu.gpa}</p>}
                  {edu.description && <p className="text-xs text-gray-400 italic">{edu.description}</p>}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {fmt(edu.startDate)} – {edu.current ? present : fmt(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title={isEs ? 'Habilidades' : 'Skills'}>
          <div className="space-y-2">
            {skills.map((cat) => (
              <div key={cat.id} className="flex gap-3">
                <span className="text-xs font-semibold text-gray-500 w-28 flex-shrink-0 pt-0.5">{cat.name}</span>
                <span className="text-xs text-gray-700">{(cat.skills ?? []).join(' · ')}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title={isEs ? 'Proyectos' : 'Projects'}>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-gray-900 text-xs">{p.name}</span>
                  {(p.url || p.github) && (
                    <span className={`text-xs ${colors.text}`}>— {p.url || p.github}</span>
                  )}
                </div>
                {p.description && <p className="text-xs text-gray-500">{p.description}</p>}
                {(p.technologies ?? []).length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">{(p.technologies ?? []).join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title={isEs ? 'Certificaciones' : 'Certifications'}>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-xs">{cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.issuer}</p>
                </div>
                {cert.date && <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{fmt(cert.date)}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

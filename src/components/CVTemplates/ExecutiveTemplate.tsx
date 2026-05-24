import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { colorMap, fontFamilyMap, formatDate } from '../../utils/colors';

interface Props {
  data: CVData;
  settings: CVSettings;
  language: Language;
}

export const ExecutiveTemplate: React.FC<Props> = ({ data, settings, language }) => {
  const colors = colorMap[settings.accentColor];
  const font = fontFamilyMap[settings.fontFamily ?? 'georgia'];
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const compact = (settings.fontSize as string) === 'compact';
  const isEs = language === 'es';
  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const DiamondBullet = () => (
    <span
      className="inline-block w-2 h-2 flex-shrink-0 mt-1 mr-2"
      style={{
        background: colors.hex,
        transform: 'rotate(45deg)',
        display: 'inline-block',
      }}
    />
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <DiamondBullet />
      <h2
        className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}
        style={{ letterSpacing: '0.15em' }}
      >
        {title}
      </h2>
      <div className="flex-1 h-px bg-gray-200 ml-2" />
    </div>
  );

  return (
    <div
      className={`bg-white ${compact ? 'text-xs' : 'text-sm'}`}
      style={{ fontFamily: font }}
    >
      {/* Full-width dark navy header */}
      <div className="bg-gray-900 text-white px-8 py-8">
        <div className="flex items-center gap-6">
          {pi.photoUrl && (
            <img
              src={pi.photoUrl}
              alt={pi.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div className="flex-1">
            <h1
              className={`font-bold leading-tight ${compact ? 'text-2xl' : 'text-3xl'}`}
              style={{ letterSpacing: '-0.02em' }}
            >
              {pi.name}
            </h1>
            <p className={`mt-1 ${compact ? 'text-sm' : 'text-base'}`} style={{ color: '#f59e0b' }}>
              {pi.title}
            </p>
          </div>
        </div>

        {/* Gold accent line */}
        <div className="h-0.5 mt-5" style={{ background: 'linear-gradient(to right, #f59e0b, #d97706, transparent)' }} />

        {/* Contact info */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-xs text-gray-300">
          {pi.email && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {pi.email}
            </span>
          )}
          {pi.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {pi.phone}
            </span>
          )}
          {pi.location && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {pi.location}
            </span>
          )}
          {pi.linkedin && <span>LinkedIn: {pi.linkedin}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
      </div>

      {/* Two-column body: 70% main + 30% sidebar */}
      <div className="flex">
        {/* Main column — 70% */}
        <div className="flex-1 px-7 py-6 space-y-5" style={{ flexBasis: '70%' }}>
          {summary && (
            <div>
              <SectionTitle title={isEs ? 'Resumen Ejecutivo' : 'Executive Summary'} />
              <p className="text-gray-700 leading-relaxed text-xs pl-4">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Experiencia Profesional' : 'Professional Experience'} />
              <div className="space-y-4 pl-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-0.5">
                      <div>
                        <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>
                          {exp.position}
                        </p>
                        <p className={`font-semibold text-xs ${colors.text}`}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                      </div>
                      <p className="text-gray-400 text-xs whitespace-nowrap ml-3">
                        {fmt(exp.startDate)} – {exp.current ? present : fmt(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && <p className="text-gray-600 mt-1 text-xs">{exp.description}</p>}
                    {(exp.highlights ?? []).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {(exp.highlights ?? []).map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <span style={{ color: '#f59e0b', fontWeight: 700, marginTop: '2px' }}>◆</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Proyectos Destacados' : 'Key Projects'} />
              <div className="space-y-2 pl-4">
                {projects.map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between">
                      <p className="font-bold text-gray-900 text-xs">{p.name}</p>
                      {(p.startDate || p.endDate) && (
                        <p className="text-gray-400 text-xs">{fmt(p.startDate)}{p.endDate ? ` – ${fmt(p.endDate)}` : ''}</p>
                      )}
                    </div>
                    {p.description && <p className="text-gray-600 text-xs">{p.description}</p>}
                    {(p.technologies ?? []).length > 0 && (
                      <p className="text-xs text-gray-400 italic">{(p.technologies ?? []).join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — 30% */}
        <div className="px-5 py-6 space-y-5 border-l border-gray-200" style={{ flexBasis: '30%', minWidth: '180px', background: '#fafafa' }}>
          {education.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Educación' : 'Education'} />
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-gray-900 text-xs leading-tight">{edu.institution}</p>
                    <p className="text-gray-600 text-xs">{edu.degree}{edu.field ? ` en ${edu.field}` : ''}</p>
                    <p className="text-gray-400 text-xs">
                      {fmt(edu.startDate)} – {edu.current ? present : fmt(edu.endDate)}
                    </p>
                    {edu.gpa && <p className="text-gray-400 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Competencias' : 'Skills'} />
              <div className="space-y-2">
                {skills.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-xs font-bold text-gray-700 mb-1">{cat.name}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{(cat.skills ?? []).join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Certificaciones' : 'Certifications'} />
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{cert.name}</p>
                    <p className="text-xs text-gray-500">{cert.issuer}</p>
                    {cert.date && <p className="text-xs text-gray-400">{fmt(cert.date)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

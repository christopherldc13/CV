import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { colorMap, fontFamilyMap, formatDate } from '../../utils/colors';

interface Props {
  data: CVData;
  settings: CVSettings;
  language: Language;
}

export const CompactTemplate: React.FC<Props> = ({ data, settings, language }) => {
  const colors = colorMap[settings.accentColor];
  const font = fontFamilyMap[settings.fontFamily ?? 'georgia'];
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const compact = (settings.fontSize as string) === 'compact';
  const isEs = language === 'es';
  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const SectionTitle = ({ title }: { title: string }) => (
    <div className={`flex items-center gap-2 mb-1.5 mt-3 pb-0.5 border-b ${colors.border}`}>
      <h2 className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}>{title}</h2>
    </div>
  );

  return (
    <div
      className={`bg-white px-8 py-6 ${compact ? 'text-xs' : 'text-xs'}`}
      style={{ fontFamily: font, minHeight: '1123px', lineHeight: '1.4' }}
    >
      {/* Header — tight */}
      <div className="text-center pb-2 border-b-2" style={{ borderColor: colors.hex }}>
        <h1 className={`font-bold text-gray-900 ${compact ? 'text-xl' : 'text-2xl'}`}>{pi.name}</h1>
        {pi.title && <p className="text-gray-600 text-sm mt-0.5">{pi.title}</p>}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-gray-500">
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>| {pi.phone}</span>}
          {pi.location && <span>| {pi.location}</span>}
          {pi.linkedin && <span>| {pi.linkedin}</span>}
          {pi.website && <span>| {pi.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <>
          <SectionTitle title={isEs ? 'Resumen' : 'Summary'} />
          <p className="text-gray-700 text-xs leading-snug">{summary}</p>
        </>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <>
          <SectionTitle title={isEs ? 'Experiencia Laboral' : 'Work Experience'} />
          <div className="space-y-2">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-gray-900 text-xs">{exp.position}</span>
                    <span className="text-gray-600 text-xs">, </span>
                    <span className={`font-semibold text-xs ${colors.text}`}>{exp.company}</span>
                    {exp.location && <span className="text-gray-500 text-xs">, {exp.location}</span>}
                  </div>
                  <span className="text-gray-400 text-xs whitespace-nowrap ml-2">
                    {fmt(exp.startDate)} – {exp.current ? present : fmt(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-gray-600 text-xs mt-0.5 leading-snug">{exp.description}</p>
                )}
                {(exp.highlights ?? []).length > 0 && (
                  <ul className="mt-0.5 space-y-0">
                    {(exp.highlights ?? []).map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <span className={`${colors.text} font-bold flex-shrink-0`}>•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Education */}
      {education.length > 0 && (
        <>
          <SectionTitle title={isEs ? 'Educación' : 'Education'} />
          <div className="space-y-1">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-gray-900 text-xs">{edu.degree}</span>
                    {edu.field && <span className="text-gray-600 text-xs"> en {edu.field}</span>}
                    <span className="text-gray-600 text-xs">, </span>
                    <span className={`font-semibold text-xs ${colors.text}`}>{edu.institution}</span>
                  </div>
                  <span className="text-gray-400 text-xs whitespace-nowrap ml-2">
                    {fmt(edu.startDate)} – {edu.current ? present : fmt(edu.endDate)}
                  </span>
                </div>
                {(edu.gpa || edu.description) && (
                  <p className="text-gray-500 text-xs">
                    {edu.gpa && `GPA: ${edu.gpa}`}
                    {edu.gpa && edu.description && ' · '}
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <>
          <SectionTitle title={isEs ? 'Habilidades' : 'Skills'} />
          <div className="space-y-0.5">
            {skills.map((cat) => (
              <div key={cat.id} className="flex gap-1.5 text-xs">
                <span className="font-bold text-gray-800 flex-shrink-0">{cat.name}:</span>
                <span className="text-gray-600">{(cat.skills ?? []).join(', ')}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <>
          <SectionTitle title={isEs ? 'Proyectos' : 'Projects'} />
          <div className="space-y-1.5">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-xs">{p.name}</span>
                  {(p.startDate || p.endDate) && (
                    <span className="text-gray-400 text-xs whitespace-nowrap ml-2">
                      {fmt(p.startDate)}{p.endDate ? ` – ${fmt(p.endDate)}` : ''}
                    </span>
                  )}
                </div>
                {p.description && <p className="text-gray-600 text-xs">{p.description}</p>}
                {(p.technologies ?? []).length > 0 && (
                  <p className="text-gray-400 text-xs italic">{(p.technologies ?? []).join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <>
          <SectionTitle title={isEs ? 'Certificaciones' : 'Certifications'} />
          <div className="space-y-0.5">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-baseline gap-1.5 text-xs">
                <span className="font-bold text-gray-900">{cert.name}</span>
                <span className="text-gray-500">— {cert.issuer}</span>
                {cert.date && <span className="text-gray-400">({fmt(cert.date)})</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

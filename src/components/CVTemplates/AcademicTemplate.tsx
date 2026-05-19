import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { colorMap, fontFamilyMap, formatDate } from '../../utils/colors';

interface Props { data: CVData; settings: CVSettings; language: Language; }

export const AcademicTemplate: React.FC<Props> = ({ data, settings, language }) => {
  const colors = colorMap[settings.accentColor];
  const font = fontFamilyMap[settings.fontFamily ?? 'georgia'];
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const compact = settings.fontSize === 'compact';
  const isEs = language === 'es';
  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const Divider = () => <div className="border-t border-gray-300 my-3" />;

  const SectionTitle = ({ title }: { title: string }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-2.5 pb-0.5" style={{ color: colors.hex, borderBottom: `1.5px solid ${colors.hex}` }}>
      {title}
    </h2>
  );

  return (
    <div
      className={`bg-white px-10 py-8 ${compact ? 'text-xs' : 'text-sm'}`}
      style={{ fontFamily: font, minHeight: '1123px', lineHeight: '1.6', color: '#1a1a1a' }}
    >
      {/* ── Header ── */}
      <div className="text-center mb-4">
        <h1 className={`font-bold tracking-wide text-gray-900 ${compact ? 'text-xl' : 'text-2xl'}`}>{pi.name}</h1>
        {pi.title && <p className="text-gray-600 text-sm mt-0.5 italic">{pi.title}</p>}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0 mt-2 text-xs text-gray-500">
          {pi.email    && <span>{pi.email}</span>}
          {pi.phone    && <span>·  {pi.phone}</span>}
          {pi.location && <span>·  {pi.location}</span>}
          {pi.linkedin && <span>·  {pi.linkedin}</span>}
          {pi.website  && <span>·  {pi.website}</span>}
        </div>
        {pi.photoUrl && (
          <div className="flex justify-center mt-3">
            <img src={pi.photoUrl} alt={pi.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
      </div>
      <div className="border-t-2 border-gray-800 mb-4" />

      {/* ── Summary ── */}
      {summary && (
        <>
          <SectionTitle title={isEs ? 'Resumen Profesional' : 'Professional Summary'} />
          <p className="text-gray-700 text-xs leading-relaxed mb-3">{summary}</p>
          <Divider />
        </>
      )}

      {/* ── Experience ── */}
      {experience.length > 0 && (
        <>
          <SectionTitle title={isEs ? 'Experiencia Laboral' : 'Work Experience'} />
          <div className="space-y-3 mb-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{exp.position}</p>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {fmt(exp.startDate)} – {exp.current ? present : fmt(exp.endDate)}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-600 italic">
                  {exp.company}{exp.location ? `, ${exp.location}` : ''}
                </p>
                {exp.description && <p className="text-gray-600 text-xs mt-0.5">{exp.description}</p>}
                {(exp.highlights ?? []).length > 0 && (
                  <ul className="mt-1 space-y-0.5 list-disc list-outside pl-4">
                    {(exp.highlights ?? []).map((h, i) => (
                      <li key={i} className="text-xs text-gray-700">{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}

      {/* ── Education ── */}
      {education.length > 0 && (
        <>
          <SectionTitle title={isEs ? 'Educación' : 'Education'} />
          <div className="space-y-2 mb-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{edu.institution}</p>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {fmt(edu.startDate)} – {edu.current ? present : fmt(edu.endDate)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 italic">
                  {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
                </p>
                {edu.description && <p className="text-gray-500 text-xs">{edu.description}</p>}
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <>
          <SectionTitle title={isEs ? 'Habilidades' : 'Skills'} />
          <div className="space-y-1 mb-3">
            {skills.map((cat) => (
              <div key={cat.id} className="flex gap-1.5 text-xs">
                <span className="font-bold text-gray-800 flex-shrink-0">{cat.name}:</span>
                <span className="text-gray-600">{(cat.skills ?? []).join(', ')}</span>
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <>
          <SectionTitle title={isEs ? 'Proyectos' : 'Projects'} />
          <div className="space-y-2 mb-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{p.name}</p>
                  {(p.startDate || p.endDate) && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {fmt(p.startDate)}{p.endDate ? ` – ${fmt(p.endDate)}` : ''}
                    </span>
                  )}
                </div>
                {p.description && <p className="text-gray-600 text-xs">{p.description}</p>}
                {(p.technologies ?? []).length > 0 && (
                  <p className="text-gray-500 text-xs italic">{(p.technologies ?? []).join(', ')}</p>
                )}
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}

      {/* ── Certifications ── */}
      {certifications.length > 0 && (
        <>
          <SectionTitle title={isEs ? 'Certificaciones' : 'Certifications'} />
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-xs gap-2">
                <span>
                  <span className="font-semibold text-gray-900">{cert.name}</span>
                  <span className="text-gray-500 ml-1">— {cert.issuer}</span>
                </span>
                {cert.date && <span className="text-gray-400 whitespace-nowrap">{fmt(cert.date)}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

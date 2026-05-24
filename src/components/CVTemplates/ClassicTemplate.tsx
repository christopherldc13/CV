import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { colorMap, fontFamilyMap, formatDate } from '../../utils/colors';

interface Props { data: CVData; settings: CVSettings; language: Language; }

export const ClassicTemplate: React.FC<Props> = ({ data, settings, language }) => {
  const colors = colorMap[settings.accentColor];
  const font = fontFamilyMap[settings.fontFamily ?? 'georgia'];
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const compact = (settings.fontSize as string) === 'compact';
  const isEs = language === 'es';
  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const SectionTitle = ({ title }: { title: string }) => (
    <div className={`flex items-center gap-2 mb-3 pb-1.5 border-b-2 ${colors.border}`}>
      <h2 className={`text-xs font-extrabold uppercase tracking-widest ${colors.text}`}>{title}</h2>
    </div>
  );

  const DateBadge = ({ start, end, current }: { start: string; end: string; current?: boolean }) => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs whitespace-nowrap font-medium border border-gray-200">
      <svg className="w-2.5 h-2.5 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {fmt(start)} – {current ? <span className="font-semibold" style={{ color: colors.hex }}>{present}</span> : fmt(end)}
    </span>
  );

  const TechChip = ({ label }: { label: string }) => (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border"
      style={{ color: colors.hex, borderColor: colors.hex + '55', background: colors.hex + '0d' }}
    >
      {label}
    </span>
  );

  return (
    <div className={`bg-white ${compact ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: font, minHeight: '1123px' }}>

      {/* ── Header ── */}
      <div className="px-8 py-6 text-white" style={{ background: colors.hex }}>
        <div className="flex items-center gap-5">
          {pi.photoUrl && (
            <img src={pi.photoUrl} alt={pi.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white border-opacity-50 flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
          <div className="flex-1 min-w-0">
            <h1 className={`font-bold leading-tight ${compact ? 'text-xl' : 'text-2xl'}`}>{pi.name}</h1>
            {pi.title && <p className="opacity-85 mt-0.5 text-sm tracking-wide">{pi.title}</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {pi.email    && <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>{pi.email}</span>}
          {pi.phone    && <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>{pi.location}</span>}
          {pi.linkedin && <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>{pi.linkedin}</span>}
          {pi.website  && <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>{pi.website}</span>}
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div className="flex">

        {/* Left column */}
        <div className="flex-1 px-6 py-5 space-y-5 min-w-0">

          {summary && (
            <div>
              <SectionTitle title={isEs ? 'Resumen Profesional' : 'Professional Summary'} />
              <p className="text-gray-600 leading-relaxed text-xs">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Experiencia Laboral' : 'Work Experience'} />
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="pl-3 border-l-2" style={{ borderColor: colors.hex + '40' }}>
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div>
                        <p className={`font-bold text-gray-900 leading-tight ${compact ? 'text-xs' : 'text-sm'}`}>{exp.position}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: colors.hex }}>
                          {exp.company}{exp.location ? <span className="font-normal text-gray-500"> · {exp.location}</span> : ''}
                        </p>
                      </div>
                      <DateBadge start={exp.startDate} end={exp.endDate} current={exp.current} />
                    </div>
                    {exp.description && (
                      <p className="text-gray-500 text-xs mt-1.5 leading-relaxed italic">{exp.description}</p>
                    )}
                    {(exp.highlights ?? []).length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {(exp.highlights ?? []).map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors.hex }} />
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
              <SectionTitle title={isEs ? 'Proyectos' : 'Projects'} />
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-lg p-3 border border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{p.name}</p>
                      {(p.startDate || p.endDate) && (
                        <DateBadge start={p.startDate} end={p.endDate} />
                      )}
                    </div>
                    {p.description && <p className="text-gray-600 text-xs mt-1 leading-relaxed">{p.description}</p>}
                    {(p.technologies ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(p.technologies ?? []).map((t) => <TechChip key={t} label={t} />)}
                      </div>
                    )}
                    {(p.url || p.github) && (
                      <p className="text-xs mt-1.5" style={{ color: colors.hex }}>
                        {p.url && <span>🔗 {p.url}</span>}
                        {p.url && p.github && <span className="mx-2 text-gray-300">|</span>}
                        {p.github && <span>⌥ {p.github}</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div className="w-44 flex-shrink-0 px-4 py-5 border-l border-gray-100 space-y-5" style={{ background: colors.hex + '08', minWidth: '168px' }}>

          {education.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Educación' : 'Education'} />
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-gray-900 text-xs leading-tight">{edu.institution}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{edu.degree}</p>
                    {edu.field && <p className="text-gray-500 text-xs italic">{edu.field}</p>}
                    {edu.gpa && (
                      <span className="inline-block mt-0.5 text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: colors.hex + '15', color: colors.hex }}>
                        GPA {edu.gpa}
                      </span>
                    )}
                    <div className="mt-1">
                      <DateBadge start={edu.startDate} end={edu.endDate} current={edu.current} />
                    </div>
                    {edu.description && <p className="text-gray-500 text-xs mt-0.5 italic">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Habilidades' : 'Skills'} />
              <div className="space-y-2.5">
                {skills.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-xs font-bold text-gray-700 mb-1.5">{cat.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {(cat.skills ?? []).map((s) => (
                        <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-600 font-medium shadow-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Certificaciones' : 'Certifications'} />
              <div className="space-y-2.5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="rounded p-2 bg-white border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-800 leading-tight">{cert.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{cert.issuer}</p>
                    {cert.date && (
                      <span className="inline-block mt-1 text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: colors.hex + '15', color: colors.hex }}>
                        {fmt(cert.date)}
                      </span>
                    )}
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

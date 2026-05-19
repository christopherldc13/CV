import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { colorMap, fontFamilyMap, formatDate } from '../../utils/colors';

interface Props { data: CVData; settings: CVSettings; language: Language; }

export const BoldTemplate: React.FC<Props> = ({ data, settings, language }) => {
  const colors = colorMap[settings.accentColor];
  const font = fontFamilyMap[settings.fontFamily ?? 'inter'];
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const compact = settings.fontSize === 'compact';
  const isEs = language === 'es';
  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-0.5 h-4 rounded-full flex-shrink-0" style={{ background: colors.hex }} />
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700">{title}</h2>
    </div>
  );

  return (
    <div style={{ fontFamily: font, minHeight: '1123px' }} className="bg-white">
      {/* ── Header ── */}
      <div className="px-8 py-6 text-white" style={{ background: colors.hex }}>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className={`font-extrabold leading-tight tracking-tight ${compact ? 'text-2xl' : 'text-3xl'}`}>{pi.name}</h1>
            {pi.title && <p className="text-white text-opacity-85 mt-1 text-sm font-light">{pi.title}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-xs text-white text-opacity-80">
              {pi.email    && <span>{pi.email}</span>}
              {pi.phone    && <span>{pi.phone}</span>}
              {pi.location && <span>{pi.location}</span>}
              {pi.linkedin && <span>{pi.linkedin}</span>}
              {pi.website  && <span>{pi.website}</span>}
            </div>
          </div>
          {pi.photoUrl && (
            <img src={pi.photoUrl} alt={pi.name}
              className="w-16 h-16 rounded-full object-cover border-3 border-white border-opacity-50 flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
        </div>
      </div>

      {/* Gradient accent bar */}
      <div className="h-1" style={{ background: `linear-gradient(to right, ${colors.hex}cc, transparent)` }} />

      {/* ── Body: 33% left + 67% right ── */}
      <div className="flex" style={{ minHeight: '1060px' }}>

        {/* Left column */}
        <div className="w-1/3 px-5 py-5 space-y-5 bg-gray-50 border-r border-gray-100">
          {skills.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Habilidades' : 'Skills'} />
              <div className="space-y-3">
                {skills.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-xs font-bold text-gray-700 mb-1">{cat.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {(cat.skills ?? []).map((s) => (
                        <span key={s} className="text-xs px-1.5 py-0.5 rounded font-medium text-white"
                          style={{ background: colors.hex + 'cc' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Educación' : 'Education'} />
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-xs font-bold text-gray-800 leading-tight">{edu.institution}</p>
                    <p className="text-xs text-gray-600">{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {fmt(edu.startDate)} – {edu.current ? present : fmt(edu.endDate)}
                    </p>
                    {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
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

        {/* Right column */}
        <div className="flex-1 px-6 py-5 space-y-5">
          {summary && (
            <div>
              <SectionTitle title={isEs ? 'Sobre Mí' : 'About Me'} />
              <p className="text-gray-600 text-xs leading-relaxed">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <SectionTitle title={isEs ? 'Experiencia' : 'Experience'} />
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="pl-3 border-l-2" style={{ borderColor: colors.hex + '55' }}>
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div>
                        <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{exp.position}</p>
                        <p className="text-xs font-semibold" style={{ color: colors.hex }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {fmt(exp.startDate)} – {exp.current ? present : fmt(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && <p className="text-gray-500 text-xs mt-1">{exp.description}</p>}
                    {(exp.highlights ?? []).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {(exp.highlights ?? []).map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <span className="font-bold flex-shrink-0 mt-0.5" style={{ color: colors.hex }}>›</span>
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
                  <div key={p.id} className="rounded-lg p-3 bg-gray-50 border border-gray-100">
                    <div className="flex justify-between items-start gap-2">
                      <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{p.name}</p>
                      {(p.url || p.github) && (
                        <span className="text-xs ml-1" style={{ color: colors.hex }}>{p.url || p.github}</span>
                      )}
                    </div>
                    {p.description && <p className="text-gray-600 text-xs mt-0.5">{p.description}</p>}
                    {(p.technologies ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(p.technologies ?? []).map((t) => (
                          <span key={t} className="text-xs px-1.5 py-0.5 rounded font-medium text-white"
                            style={{ background: colors.hex }}>
                            {t}
                          </span>
                        ))}
                      </div>
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

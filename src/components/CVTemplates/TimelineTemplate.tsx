import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { fontFamilyMap, formatDate, resolveAccentHex } from '../../utils/colors';

interface Props {
  data: CVData;
  settings: CVSettings;
  language: Language;
}

export const TimelineTemplate: React.FC<Props> = ({ data, settings, language }) => {
  const font = fontFamilyMap[settings.fontFamily ?? 'inter'];
  const accent = resolveAccentHex(settings);
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const isEs = language === 'es';
  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const photoStyle: React.CSSProperties =
    settings.photoShape === 'square'
      ? { borderRadius: '6px' }
      : settings.photoShape === 'hidden'
      ? { display: 'none' }
      : { borderRadius: '50%' };

  const SectionHeading = ({ label }: { label: string }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
      <span className="flex-1 h-px" style={{ background: accent, opacity: 0.3 }} />
      {label}
      <span className="flex-1 h-px" style={{ background: accent, opacity: 0.3 }} />
    </h2>
  );

  const TimelineDot = () => (
    <div
      className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white z-10"
      style={{ background: accent }}
    />
  );

  return (
    <div className="bg-white flex text-sm" style={{ fontFamily: font, minHeight: '100%' }}>

      {/* Sidebar */}
      <div
        className="w-[220px] flex-shrink-0 text-white flex flex-col"
        style={{ background: accent }}
      >
        {/* Photo + identity */}
        <div className="px-5 pt-7 pb-5 text-center">
          {pi.photoUrl && settings.photoShape !== 'hidden' ? (
            <img
              src={pi.photoUrl}
              alt={pi.name}
              className="w-20 h-20 object-cover mx-auto mb-3 border-4 border-white border-opacity-30"
              style={photoStyle}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : settings.photoShape !== 'hidden' ? (
            <div
              className="w-20 h-20 mx-auto mb-3 border-4 border-white border-opacity-30 flex items-center justify-center bg-white bg-opacity-20"
              style={photoStyle}
            >
              <span className="text-2xl font-bold opacity-80">{pi.name?.charAt(0) || '?'}</span>
            </div>
          ) : null}
          <h1 className="font-bold text-lg leading-tight">{pi.name}</h1>
          <p className="text-xs opacity-80 mt-1 leading-snug">{pi.title}</p>
        </div>

        <div className="px-5 space-y-5 pb-7 flex-1">
          {/* Contact */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-60 border-b border-white border-opacity-20 pb-1 mb-2">
              {isEs ? 'Contacto' : 'Contact'}
            </p>
            <div className="space-y-1.5 text-xs">
              {pi.email && <p className="opacity-90 break-all">{pi.email}</p>}
              {pi.phone && <p className="opacity-90">{pi.phone}</p>}
              {pi.location && <p className="opacity-90">{pi.location}</p>}
              {pi.linkedin && <p className="opacity-80 break-all">{pi.linkedin}</p>}
              {pi.website && <p className="opacity-80 break-all">{pi.website}</p>}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-60 border-b border-white border-opacity-20 pb-1 mb-2">
                {isEs ? 'Habilidades' : 'Skills'}
              </p>
              <div className="space-y-2">
                {skills.map((cat) => (
                  <div key={cat.id}>
                    {cat.name && <p className="text-[9px] font-semibold opacity-60 uppercase mb-1">{cat.name}</p>}
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s) => (
                        <span key={s} className="text-[10px] bg-white bg-opacity-15 rounded px-1.5 py-0.5 opacity-90">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in sidebar */}
          {certifications.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-60 border-b border-white border-opacity-20 pb-1 mb-2">
                {isEs ? 'Certificaciones' : 'Certs'}
              </p>
              <div className="space-y-1.5">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-[10px] font-semibold opacity-90 leading-tight">{cert.name}</p>
                    <p className="text-[9px] opacity-60">{cert.issuer}{cert.date ? ` · ${fmt(cert.date)}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-7 py-7 space-y-6 overflow-hidden">

        {/* Summary */}
        {summary && (
          <div>
            <SectionHeading label={isEs ? 'Sobre Mí' : 'About Me'} />
            <p className="text-xs text-gray-600 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience — timeline */}
        {experience.length > 0 && (
          <div>
            <SectionHeading label={isEs ? 'Experiencia' : 'Experience'} />
            <div className="relative pl-4 border-l-2" style={{ borderColor: `${accent}30` }}>
              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    <TimelineDot />
                    <div className="flex items-start justify-between gap-3 mb-0.5">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{exp.position}</h3>
                        <p className="text-xs font-medium" style={{ color: accent }}>
                          {exp.company}
                          {exp.location && <span className="text-gray-400 font-normal"> · {exp.location}</span>}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {fmt(exp.startDate)}{exp.startDate ? ' – ' : ''}{exp.current ? present : fmt(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{exp.description}</p>
                    )}
                    {exp.highlights.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="flex gap-2 text-xs text-gray-600">
                            <span className="flex-shrink-0" style={{ color: accent }}>›</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Education — timeline */}
        {education.length > 0 && (
          <div>
            <SectionHeading label={isEs ? 'Educación' : 'Education'} />
            <div className="relative pl-4 border-l-2" style={{ borderColor: `${accent}30` }}>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="relative">
                    <TimelineDot />
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                          {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                        </h3>
                        <p className="text-xs font-medium" style={{ color: accent }}>
                          {edu.institution}
                          {edu.location && <span className="text-gray-400 font-normal"> · {edu.location}</span>}
                        </p>
                        {edu.gpa && <p className="text-xs text-gray-400">{isEs ? 'Promedio' : 'GPA'}: {edu.gpa}</p>}
                      </div>
                      <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {fmt(edu.startDate)}{edu.startDate ? ' – ' : ''}{edu.current ? present : fmt(edu.endDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <SectionHeading label={isEs ? 'Proyectos' : 'Projects'} />
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="flex gap-3">
                  <div
                    className="w-0.5 flex-shrink-0 rounded-full mt-1"
                    style={{ background: accent, minHeight: '32px' }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{proj.name}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{proj.description}</p>
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: `${accent}18`, color: accent }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

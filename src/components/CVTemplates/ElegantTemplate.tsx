import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { fontFamilyMap, formatDate, resolveAccentHex } from '../../utils/colors';

interface Props {
  data: CVData;
  settings: CVSettings;
  language: Language;
}

export const ElegantTemplate: React.FC<Props> = ({ data, settings, language }) => {
  const font = fontFamilyMap[settings.fontFamily ?? 'georgia'];
  const accent = resolveAccentHex(settings);
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const isEs = language === 'es';
  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const SectionTitle = ({ label }: { label: string }) => (
    <div className="mb-3">
      <h2
        className="text-xs font-bold uppercase tracking-[0.2em] pb-1.5"
        style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}
      >
        {label}
      </h2>
    </div>
  );

  const photoStyle: React.CSSProperties =
    settings.photoShape === 'square'
      ? { borderRadius: '4px' }
      : settings.photoShape === 'hidden'
      ? { display: 'none' }
      : { borderRadius: '50%' };

  return (
    <div
      className="bg-white text-gray-800 text-sm"
      style={{ fontFamily: font, minHeight: '100%' }}
    >
      {/* Top accent bar */}
      <div style={{ height: '4px', background: accent }} />

      {/* Header */}
      <div className="px-12 pt-8 pb-6 text-center">
        {pi.photoUrl && settings.photoShape !== 'hidden' && (
          <div className="flex justify-center mb-4">
            <img
              src={pi.photoUrl}
              alt={pi.name}
              className="w-20 h-20 object-cover border-2"
              style={{ ...photoStyle, borderColor: accent }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
        <h1
          className="font-bold tracking-wide"
          style={{ fontSize: '26px', color: '#1a1a1a', fontFamily: fontFamilyMap['playfair'] ?? font }}
        >
          {pi.name || 'Your Name'}
        </h1>
        {pi.title && (
          <p className="text-base italic mt-1" style={{ color: accent }}>
            {pi.title}
          </p>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-4 justify-center">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${accent})` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${accent})` }} />
        </div>

        {/* Contact row */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <><span className="text-gray-300">•</span><span>{pi.phone}</span></>}
          {pi.location && <><span className="text-gray-300">•</span><span>{pi.location}</span></>}
          {pi.linkedin && <><span className="text-gray-300">•</span><span>{pi.linkedin}</span></>}
          {pi.website && <><span className="text-gray-300">•</span><span>{pi.website}</span></>}
        </div>
      </div>

      {/* Body */}
      <div className="px-12 pb-10 space-y-6">
        {/* Summary */}
        {summary && (
          <div>
            <SectionTitle label={isEs ? 'Perfil Profesional' : 'Professional Profile'} />
            <p className="text-gray-600 leading-relaxed text-sm">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <SectionTitle label={isEs ? 'Experiencia Profesional' : 'Professional Experience'} />
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-sm" style={{ color: accent }}>{exp.company}
                        {exp.location && <span className="text-gray-400"> — {exp.location}</span>}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      {fmt(exp.startDate)} – {exp.current ? present : fmt(exp.endDate)}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-600">
                          <span style={{ color: accent }} className="flex-shrink-0 mt-0.5">◆</span>
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

        {/* Education */}
        {education.length > 0 && (
          <div>
            <SectionTitle label={isEs ? 'Educación' : 'Education'} />
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</h3>
                    <p className="text-sm" style={{ color: accent }}>{edu.institution}
                      {edu.location && <span className="text-gray-400"> — {edu.location}</span>}
                    </p>
                    {edu.gpa && <p className="text-xs text-gray-400">{isEs ? 'Promedio' : 'GPA'}: {edu.gpa}</p>}
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {fmt(edu.startDate)} – {edu.current ? present : fmt(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills + Projects in 2-col grid if both present */}
        {skills.length > 0 && projects.length > 0 ? (
          <div className="grid grid-cols-2 gap-8">
            <div>
              <SectionTitle label={isEs ? 'Habilidades' : 'Skills'} />
              <div className="space-y-2">
                {skills.map((cat) => (
                  <div key={cat.id}>
                    {cat.name && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{cat.name}</p>}
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: accent, color: accent }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionTitle label={isEs ? 'Proyectos' : 'Projects'} />
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <p className="font-semibold text-gray-900 text-sm">{proj.name}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{proj.description}</p>
                    {proj.technologies.length > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: accent }}>{proj.technologies.join(' · ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {skills.length > 0 && (
              <div>
                <SectionTitle label={isEs ? 'Habilidades' : 'Skills'} />
                <div className="space-y-2">
                  {skills.map((cat) => (
                    <div key={cat.id}>
                      {cat.name && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{cat.name}</p>}
                      <div className="flex flex-wrap gap-1">
                        {cat.skills.map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: accent, color: accent }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {projects.length > 0 && (
              <div>
                <SectionTitle label={isEs ? 'Proyectos' : 'Projects'} />
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <p className="font-semibold text-gray-900 text-sm">{proj.name}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{proj.description}</p>
                      {proj.technologies.length > 0 && (
                        <p className="text-xs mt-0.5" style={{ color: accent }}>{proj.technologies.join(' · ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <SectionTitle label={isEs ? 'Certificaciones' : 'Certifications'} />
            <div className="grid grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex gap-2">
                  <div className="w-1 flex-shrink-0 rounded-full mt-1" style={{ background: accent, alignSelf: 'stretch', maxHeight: '40px' }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{cert.name}</p>
                    <p className="text-xs text-gray-500">{cert.issuer}</p>
                    {cert.date && <p className="text-xs text-gray-400">{fmt(cert.date)}</p>}
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

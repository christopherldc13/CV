import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { colorMap, fontFamilyMap, formatDate } from '../../utils/colors';

interface Props {
  data: CVData;
  settings: CVSettings;
  language: Language;
}

export const ModernTemplate: React.FC<Props> = ({ data, settings, language }) => {
  const colors = colorMap[settings.accentColor];
  const font = fontFamilyMap[settings.fontFamily ?? 'inter'];
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const compact = settings.fontSize === 'compact';
  const isEs = language === 'es';

  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const SectionHeading = ({ label }: { label: string }) => (
    <h2 className="font-bold text-gray-900 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
      <span className={`inline-block w-3 h-0.5 ${colors.bg}`}></span>
      {label}
    </h2>
  );

  return (
    <div className={`bg-white flex ${compact ? 'text-xs' : 'text-sm'}`}
      style={{ fontFamily: font, minHeight: '100%' }}>

      {/* Sidebar */}
      <div className={`${colors.sidebar} text-white w-52 flex-shrink-0 px-5 py-6 space-y-5`} style={{ minWidth: '180px' }}>
        {/* Photo + Name */}
        <div className="text-center">
          {pi.photoUrl ? (
            <img src={pi.photoUrl} alt={pi.name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-white border-opacity-30"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-white bg-opacity-20 flex items-center justify-center">
              <span className="text-2xl font-bold opacity-80">{pi.name?.charAt(0) || '?'}</span>
            </div>
          )}
          <h1 className={`font-bold leading-tight ${compact ? 'text-base' : 'text-lg'}`}>{pi.name}</h1>
          <p className="opacity-80 mt-1 text-xs">{pi.title}</p>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 border-b border-white border-opacity-20 pb-1">
            {isEs ? 'Contacto' : 'Contact'}
          </h3>
          {pi.email && (
            <div className="flex items-start gap-2">
              <svg className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xs opacity-90 break-all">{pi.email}</span>
            </div>
          )}
          {pi.phone && (
            <div className="flex items-start gap-2">
              <svg className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs opacity-90">{pi.phone}</span>
            </div>
          )}
          {pi.location && (
            <div className="flex items-start gap-2">
              <svg className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs opacity-90">{pi.location}</span>
            </div>
          )}
          {pi.linkedin && (
            <div className="flex items-start gap-2">
              <svg className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-xs opacity-90 break-all">{pi.linkedin}</span>
            </div>
          )}
          {pi.website && (
            <div className="flex items-start gap-2">
              <svg className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="text-xs opacity-90 break-all">{pi.website}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 border-b border-white border-opacity-20 pb-1">
              {isEs ? 'Habilidades' : 'Skills'}
            </h3>
            {skills.map((cat) => (
              <div key={cat.id}>
                <p className="text-xs font-semibold opacity-80 mb-1">{cat.name}</p>
                <div className="flex flex-wrap gap-1">
                  {(cat.skills ?? []).map((s) => (
                    <span key={s} className="text-xs bg-white bg-opacity-15 rounded px-1.5 py-0.5 opacity-90">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 border-b border-white border-opacity-20 pb-1">
              {isEs ? 'Certificaciones' : 'Certifications'}
            </h3>
            {certifications.map((cert) => (
              <div key={cert.id}>
                <p className="text-xs font-semibold opacity-90 leading-tight">{cert.name}</p>
                <p className="text-xs opacity-60">{cert.issuer}</p>
                {cert.date && <p className="text-xs opacity-50">{fmt(cert.date)}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 py-6 space-y-5">
        {summary && (
          <div>
            <SectionHeading label={isEs ? 'Sobre Mí' : 'About Me'} />
            <p className="text-gray-600 leading-relaxed text-xs">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SectionHeading label={isEs ? 'Experiencia' : 'Experience'} />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-gray-100">
                  <div className={`absolute -left-1 top-0.5 w-2 h-2 rounded-full ${colors.bg}`}></div>
                  <div className="flex justify-between items-start mb-0.5">
                    <div>
                      <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{exp.position}</p>
                      <p className={`${colors.text} font-semibold text-xs`}>
                        {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                      {fmt(exp.startDate)} – {exp.current ? present : fmt(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && <p className="text-gray-500 text-xs mt-1">{exp.description}</p>}
                  {(exp.highlights ?? []).length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {(exp.highlights ?? []).map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className={`${colors.text} font-bold mt-0.5 flex-shrink-0`}>›</span>
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

        {education.length > 0 && (
          <div>
            <SectionHeading label={isEs ? 'Educación' : 'Education'} />
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l-2 border-gray-100">
                  <div className={`absolute -left-1 top-0.5 w-2 h-2 rounded-full ${colors.bg}`}></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{edu.institution}</p>
                      <p className="text-gray-600 text-xs">{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</p>
                      {edu.gpa && <p className="text-gray-400 text-xs">GPA: {edu.gpa}</p>}
                      {edu.description && <p className="text-gray-500 text-xs mt-0.5 italic">{edu.description}</p>}
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                      {fmt(edu.startDate)} – {edu.current ? present : fmt(edu.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <SectionHeading label={isEs ? 'Proyectos' : 'Projects'} />
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className={`rounded-lg p-3 ${colors.light}`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-gray-900 text-xs">{p.name}</p>
                    {(p.url || p.github) && (
                      <span className={`text-xs ${colors.text} ml-2`}>{p.url || p.github}</span>
                    )}
                  </div>
                  {p.description && <p className="text-gray-600 text-xs mb-1">{p.description}</p>}
                  {(p.technologies ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(p.technologies ?? []).map((t) => (
                        <span key={t} className={`text-xs px-1.5 py-0.5 rounded ${colors.bg} text-white`}>{t}</span>
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
  );
};

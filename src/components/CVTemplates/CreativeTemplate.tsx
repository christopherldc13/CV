import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { colorMap, fontFamilyMap, formatDate, resolveAccentHex } from '../../utils/colors';

interface Props {
  data: CVData;
  settings: CVSettings;
  language: Language;
}

export const CreativeTemplate: React.FC<Props> = ({ data, settings, language }) => {
  const colors = colorMap[settings.accentColor];
  const accentHex = resolveAccentHex(settings);
  const font = fontFamilyMap[settings.fontFamily ?? 'inter'];
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const compact = (settings.fontSize as string) === 'compact';
  const isEs = language === 'es';
  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const SectionBar = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-4 rounded-full" style={{ background: accentHex }} />
      <h2 className={`text-xs font-bold uppercase tracking-widest text-gray-800`}>
        {title}
      </h2>
    </div>
  );

  const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-white text-opacity-70 mb-2 pb-1 border-b border-white border-opacity-20">
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className={`bg-white flex ${compact ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: font, minHeight: '1123px' }}>
      {/* Left sidebar — 40% */}
      <div
        className="flex-shrink-0 flex flex-col"
        style={{
          width: '40%',
          background: `linear-gradient(160deg, ${accentHex} 0%, ${darken(accentHex)} 100%)`,
          minHeight: '100%',
        }}
      >
        {/* Photo + name */}
        <div className="px-6 pt-8 pb-6 text-white">
          {settings.photoShape !== 'hidden' && (pi.photoUrl ? (
            <div className="mb-5 flex justify-center">
              <img
                src={pi.photoUrl}
                alt={pi.name}
                className={`w-24 h-24 ${settings.photoShape === 'square' ? 'rounded-xl' : 'rounded-full'} object-cover border-4 border-white border-opacity-40`}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          ) : (
            <div className="mb-5 flex justify-center">
              <div className={`w-24 h-24 ${settings.photoShape === 'square' ? 'rounded-xl' : 'rounded-full'} bg-white bg-opacity-20 flex items-center justify-center`}>
                <span className="text-3xl font-bold text-white text-opacity-70">
                  {pi.name ? pi.name[0] : '?'}
                </span>
              </div>
            </div>
          ))}
          <h1 className={`font-bold text-center leading-tight ${compact ? 'text-lg' : 'text-xl'}`}>
            {pi.name}
          </h1>
          <p className="text-center mt-1 text-sm text-white text-opacity-80">{pi.title}</p>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-white bg-opacity-20" />

        {/* Sidebar sections */}
        <div className="px-6 py-5 space-y-5 flex-1">
          {/* Contact */}
          {(pi.email || pi.phone || pi.location || pi.linkedin || pi.website) && (
            <SidebarSection title={isEs ? 'Contacto' : 'Contact'}>
              <div className="space-y-1.5">
                {pi.email && (
                  <div className="flex items-center gap-2 text-xs text-white text-opacity-90">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="break-all">{pi.email}</span>
                  </div>
                )}
                {pi.phone && (
                  <div className="flex items-center gap-2 text-xs text-white text-opacity-90">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {pi.phone}
                  </div>
                )}
                {pi.location && (
                  <div className="flex items-center gap-2 text-xs text-white text-opacity-90">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {pi.location}
                  </div>
                )}
                {pi.linkedin && (
                  <div className="flex items-center gap-2 text-xs text-white text-opacity-90">
                    <span className="font-bold text-xs">in</span>
                    <span>{pi.linkedin}</span>
                  </div>
                )}
                {pi.website && (
                  <div className="flex items-center gap-2 text-xs text-white text-opacity-90">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    </svg>
                    {pi.website}
                  </div>
                )}
              </div>
            </SidebarSection>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <SidebarSection title={isEs ? 'Habilidades' : 'Skills'}>
              <div className="space-y-2">
                {skills.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-xs font-semibold text-white text-opacity-70 mb-1">{cat.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {(cat.skills ?? []).map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                          style={{ background: 'rgba(255,255,255,0.2)' }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Education */}
          {education.length > 0 && (
            <SidebarSection title={isEs ? 'Educación' : 'Education'}>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-xs font-bold text-white leading-tight">{edu.institution}</p>
                    <p className="text-xs text-white text-opacity-80">{edu.degree}</p>
                    {edu.field && <p className="text-xs text-white text-opacity-60">{edu.field}</p>}
                    <p className="text-xs text-white text-opacity-50">
                      {fmt(edu.startDate)} – {edu.current ? present : fmt(edu.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
        </div>
      </div>

      {/* Right main — 60% */}
      <div className="flex-1 px-7 py-8 space-y-6">
        {summary && (
          <div>
            <SectionBar title={isEs ? 'Sobre mí' : 'About Me'} />
            <p className="text-gray-600 leading-relaxed text-xs">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SectionBar title={isEs ? 'Experiencia' : 'Experience'} />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{exp.position}</p>
                      <p className={`font-semibold text-xs ${colors.text}`}>
                        {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs whitespace-nowrap ml-3 bg-gray-100 px-2 py-0.5 rounded-full">
                      {fmt(exp.startDate)} – {exp.current ? present : fmt(exp.endDate)}
                    </p>
                  </div>
                  {exp.description && <p className="text-gray-600 mt-1 text-xs">{exp.description}</p>}
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

        {projects.length > 0 && (
          <div>
            <SectionBar title={isEs ? 'Proyectos' : 'Projects'} />
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="border-l-2 pl-3" style={{ borderColor: accentHex }}>
                  <p className={`font-bold text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>{p.name}</p>
                  {p.description && <p className="text-gray-600 text-xs mt-0.5">{p.description}</p>}
                  {(p.technologies ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(p.technologies ?? []).map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: accentHex + '20', color: accentHex }}
                        >
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

        {certifications.length > 0 && (
          <div>
            <SectionBar title={isEs ? 'Certificaciones' : 'Certifications'} />
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: accentHex }} />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{cert.name}</p>
                    <p className="text-xs text-gray-500">{cert.issuer}{cert.date ? ` · ${fmt(cert.date)}` : ''}</p>
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

// Simple color darkening utility for gradient
function darken(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - 40);
  const g = Math.max(0, ((num >> 8) & 0xff) - 40);
  const b = Math.max(0, (num & 0xff) - 40);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

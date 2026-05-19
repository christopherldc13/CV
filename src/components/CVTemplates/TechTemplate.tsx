import React from 'react';
import type { CVData, CVSettings } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';
import { formatDate } from '../../utils/colors';

interface Props {
  data: CVData;
  settings: CVSettings;
  language: Language;
}

export const TechTemplate: React.FC<Props> = ({ data, settings: _settings, language }) => {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications } = data;
  const isEs = language === 'es';
  const present = isEs ? 'Presente' : 'Present';
  const fmt = (d: string) => formatDate(d, language);

  const CodeComment = ({ text }: { text: string }) => (
    <span className="text-green-400">{`/* ${text} */`}</span>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-3 mt-1">
      <p className="text-blue-400 font-bold text-sm">{`// ${title}`}</p>
      <div className="h-px bg-gray-700 mt-1" />
    </div>
  );

  return (
    <div
      className="bg-gray-900 text-gray-100 p-8"
      style={{ fontFamily: "'Courier New', Courier, monospace", minHeight: '1123px' }}
    >
      {/* Header — code comment style */}
      <div className="mb-8">
        <p className="text-gray-500 text-xs mb-1">{'/**'}</p>
        <p className="text-gray-500 text-xs mb-0.5">
          {' * '}<span className="text-yellow-300 font-bold">{pi.name || 'Your Name'}</span>
          {pi.title ? <span className="text-gray-400"> — {pi.title}</span> : null}
        </p>
        {pi.email && <p className="text-gray-500 text-xs mb-0.5">{' * @email '}<span className="text-cyan-400">{pi.email}</span></p>}
        {pi.phone && <p className="text-gray-500 text-xs mb-0.5">{' * @phone '}<span className="text-cyan-400">{pi.phone}</span></p>}
        {pi.location && <p className="text-gray-500 text-xs mb-0.5">{' * @location '}<span className="text-cyan-400">{pi.location}</span></p>}
        {pi.linkedin && <p className="text-gray-500 text-xs mb-0.5">{' * @linkedin '}<span className="text-cyan-400">{pi.linkedin}</span></p>}
        {pi.website && <p className="text-gray-500 text-xs mb-0.5">{' * @web '}<span className="text-cyan-400">{pi.website}</span></p>}
        <p className="text-gray-500 text-xs">{'*/'}</p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <SectionHeader title={isEs ? 'RESUMEN' : 'SUMMARY'} />
          <p className="text-xs text-gray-300 leading-relaxed pl-2">
            <CodeComment text={summary} />
          </p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <SectionHeader title={isEs ? 'HABILIDADES' : 'SKILLS'} />
          <div className="pl-2 space-y-1.5">
            {skills.map((cat) => (
              <div key={cat.id} className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-purple-400 font-bold">{cat.name}:</span>
                {(cat.skills ?? []).map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-0.5 rounded font-bold"
                    style={{ background: '#1f2937', color: '#34d399', border: '1px solid #374151' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <SectionHeader title={isEs ? 'EXPERIENCIA' : 'EXPERIENCE'} />
          <div className="space-y-4 pl-2">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-yellow-300 font-bold text-xs">{exp.position}</span>
                    <span className="text-gray-500 text-xs"> @ </span>
                    <span className="text-cyan-400 text-xs font-bold">{exp.company}</span>
                    {exp.location && <span className="text-gray-500 text-xs"> ({exp.location})</span>}
                  </div>
                  <span className="text-gray-500 text-xs whitespace-nowrap ml-3">
                    {fmt(exp.startDate)} → {exp.current ? present : fmt(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-gray-400 mt-0.5 pl-2">{`// ${exp.description}`}</p>
                )}
                {(exp.highlights ?? []).length > 0 && (
                  <ul className="mt-1 space-y-0.5 pl-2">
                    {(exp.highlights ?? []).map((h, i) => (
                      <li key={i} className="text-xs text-gray-300 flex gap-2">
                        <span className="text-green-500 flex-shrink-0">{'>'}</span>
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
        <div className="mb-6">
          <SectionHeader title={isEs ? 'EDUCACIÓN' : 'EDUCATION'} />
          <div className="space-y-2 pl-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <span className="text-yellow-300 text-xs font-bold">{edu.degree}</span>
                {edu.field && <span className="text-gray-400 text-xs"> in {edu.field}</span>}
                <span className="text-gray-500 text-xs"> @ </span>
                <span className="text-cyan-400 text-xs font-bold">{edu.institution}</span>
                <div className="text-gray-500 text-xs pl-2">
                  {fmt(edu.startDate)} → {edu.current ? present : fmt(edu.endDate)}
                  {edu.gpa && <span className="ml-3">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <SectionHeader title={isEs ? 'PROYECTOS' : 'PROJECTS'} />
          <div className="space-y-3 pl-2">
            {projects.map((p) => (
              <div key={p.id}>
                <span className="text-pink-400 font-bold text-xs">{`<${p.name} `}</span>
                {(p.technologies ?? []).length > 0 && (
                  <span className="text-gray-400 text-xs">
                    {`tech="${(p.technologies ?? []).join(', ')}"`}
                  </span>
                )}
                <span className="text-pink-400 font-bold text-xs">{' />'}</span>
                {p.description && (
                  <p className="text-gray-400 text-xs mt-0.5 pl-2">{`// ${p.description}`}</p>
                )}
                {(p.url || p.github) && (
                  <p className="text-cyan-500 text-xs mt-0.5 pl-2">
                    {p.url && `@link ${p.url}`}
                    {p.url && p.github && ' · '}
                    {p.github && `@github ${p.github}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <SectionHeader title={isEs ? 'CERTIFICACIONES' : 'CERTIFICATIONS'} />
          <div className="space-y-1.5 pl-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-xs">
                <span className="text-green-400 font-bold">[CERT] </span>
                <span className="text-yellow-300">{cert.name}</span>
                <span className="text-gray-500"> · {cert.issuer}</span>
                {cert.date && <span className="text-gray-600"> · {fmt(cert.date)}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-700">
        <p className="text-gray-600 text-xs">{`// EOF — Generated with CV Builder Pro`}</p>
      </div>
    </div>
  );
};

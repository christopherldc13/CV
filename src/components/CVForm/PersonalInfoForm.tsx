import React, { useRef } from 'react';
import type { PersonalInfo } from '../../types/cv.types';
import type { Language } from '../../i18n/translations';

interface Props {
  data: PersonalInfo;
  onChange: (info: Partial<PersonalInfo>) => void;
  language: Language;
}

const Field = ({ label, name, value, onChange, type = 'text', placeholder }: {
  label: string; name: keyof PersonalInfo; value: string;
  onChange: (name: keyof PersonalInfo, value: string) => void;
  type?: string; placeholder?: string;
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
    <input
      type={type} value={value}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white placeholder-gray-400"
    />
  </div>
);

export const PersonalInfoForm: React.FC<Props> = ({ data, onChange, language }) => {
  const isEs = language === 'es';
  const photoRef = useRef<HTMLInputElement>(null);
  const handle = (name: keyof PersonalInfo, value: string) => onChange({ [name]: value });

  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ photoUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Field label={isEs ? 'Nombre Completo' : 'Full Name'} name="name" value={data.name} onChange={handle}
          placeholder={isEs ? 'ej. Alexandra Mitchell' : 'e.g. Alexandra Mitchell'} />
        <Field label={isEs ? 'Título Profesional' : 'Professional Title'} name="title" value={data.title} onChange={handle}
          placeholder={isEs ? 'ej. Ingeniero de Software Senior' : 'e.g. Senior Software Engineer'} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label={isEs ? 'Correo Electrónico' : 'Email'} name="email" value={data.email} onChange={handle}
          type="email" placeholder="alex@email.com" />
        <Field label={isEs ? 'Teléfono' : 'Phone'} name="phone" value={data.phone} onChange={handle}
          placeholder="+1 (555) 000-0000" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label={isEs ? 'Ubicación' : 'Location'} name="location" value={data.location} onChange={handle}
          placeholder={isEs ? 'Ciudad, País' : 'City, State'} />
        <Field label="LinkedIn" name="linkedin" value={data.linkedin} onChange={handle}
          placeholder="linkedin.com/in/usuario" />
      </div>

      <Field label={isEs ? 'Sitio Web' : 'Website'} name="website" value={data.website} onChange={handle}
        placeholder="tusitio.com" />

      {/* Photo */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {isEs ? 'Foto de Perfil' : 'Profile Photo'}
        </label>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full border-2 border-gray-200 bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="preview" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <button onClick={() => photoRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {isEs ? 'Subir desde mi PC' : 'Upload from PC'}
            </button>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoFile} className="hidden" />
            <input
              type="text"
              value={data.photoUrl.startsWith('data:') ? '' : data.photoUrl}
              onChange={(e) => handle('photoUrl', e.target.value)}
              placeholder={isEs ? 'O pega una URL de imagen' : 'Or paste an image URL'}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          {data.photoUrl && (
            <button onClick={() => onChange({ photoUrl: '' })}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
              title={isEs ? 'Eliminar foto' : 'Remove photo'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import type { CVData, CVSettings } from '../types/cv.types';

interface CVRecord {
  _id: string;
  title: string;
  cvData: CVData;
  settings: CVSettings;
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardPageProps {
  language: 'es' | 'en';
  onEditCV: (cvId: string, cvData: CVData, settings: CVSettings, lang: string, title: string) => void;
}

const accentHexMap: Record<string, string> = {
  blue: '#2563eb', emerald: '#059669', violet: '#7c3aed', rose: '#e11d48',
  amber: '#d97706', slate: '#334155', teal: '#0d9488', indigo: '#4f46e5',
  orange: '#ea580c', dark: '#111827',
};

function cvCompletionPct(data: CVData): number {
  const pi = data.personalInfo;
  const checks = [
    !!pi?.name, !!pi?.title, !!pi?.email, !!pi?.phone, !!pi?.location,
    !!(data.summary && data.summary.length > 20),
    !!(data.experience?.length),
    !!(data.education?.length),
    !!(data.skills?.length),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

const TemplateMini = ({ template, accent }: { template: string; accent: string }) => {
  const bg = accent + '18';
  const line = (w: string, opacity = 1) => (
    <div className="h-1 rounded-full mb-1" style={{ width: w, background: opacity === 1 ? accent : '#e5e7eb' }} />
  );

  switch (template) {
    case 'modern':
    case 'creative':
    case 'timeline':
      return (
        <div className="flex gap-1.5 h-full">
          <div className="w-8 rounded flex-shrink-0" style={{ background: accent }} />
          <div className="flex-1 pt-1 space-y-1">
            {line('80%', 0.4)}{line('60%', 0.4)}{line('40%', 0.4)}
          </div>
        </div>
      );
    case 'classic':
    case 'bold':
      return (
        <div className="h-full flex flex-col">
          <div className="h-6 rounded-t mb-1" style={{ background: accent }} />
          <div className="flex-1 pt-0.5 space-y-1">
            {line('70%', 0.4)}{line('50%', 0.4)}{line('60%', 0.4)}
          </div>
        </div>
      );
    case 'elegant':
      return (
        <div className="h-full flex flex-col items-center pt-1">
          <div className="h-0.5 w-full rounded mb-1" style={{ background: accent }} />
          <div className="h-2 w-2/3 rounded mb-1" style={{ background: bg }} />
          <div className="space-y-1 w-full">
            {line('80%', 0.4)}{line('60%', 0.4)}{line('70%', 0.4)}
          </div>
        </div>
      );
    default:
      return (
        <div className="h-full pt-1 space-y-1">
          <div className="h-2 w-1/2 rounded mb-1.5" style={{ background: bg }} />
          {line('80%', 0.4)}{line('60%', 0.4)}{line('70%', 0.4)}
        </div>
      );
  }
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ language, onEditCV }) => {
  const { user, logout } = useAuth();
  const [cvs, setCvs] = useState<CVRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const isEs = language === 'es';

  const ui = {
    title: isEs ? 'Mis CVs' : 'My CVs',
    subtitle: isEs ? 'Gestiona y edita tus currículums' : 'Manage and edit your resumes',
    newCV: isEs ? 'Nuevo CV' : 'New CV',
    edit: isEs ? 'Editar' : 'Edit',
    delete: isEs ? 'Eliminar' : 'Delete',
    duplicate: isEs ? 'Duplicar' : 'Duplicate',
    confirmDelete: isEs ? '¿Eliminar este CV?' : 'Delete this CV?',
    lastUpdated: isEs ? 'Actualizado' : 'Updated',
    emptyTitle: isEs ? 'Empieza tu primer CV' : 'Create your first CV',
    emptySubtitle: isEs ? 'Diseña un currículum profesional en minutos con nuestras plantillas premium' : 'Build a professional resume in minutes with our premium templates',
    createFirst: isEs ? 'Crear CV ahora' : 'Create CV now',
    logout: isEs ? 'Cerrar sesión' : 'Logout',
    template: isEs ? 'Plantilla' : 'Template',
    loading: isEs ? 'Cargando...' : 'Loading...',
    creating: isEs ? 'Creando...' : 'Creating...',
    complete: isEs ? 'completo' : 'complete',
    totalCVs: isEs ? (n: number) => `${n} currículum${n !== 1 ? 's' : ''}` : (n: number) => `${n} resume${n !== 1 ? 's' : ''}`,
    greeting: isEs ? 'Bienvenido de vuelta' : 'Welcome back',
  };

  const loadCVs = useCallback(async () => {
    try {
      const res = await api.get('/cvs');
      setCvs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCVs(); }, [loadCVs]);

  const handleNewCV = async () => {
    setCreating(true);
    try {
      const defaultData: CVData = {
        personalInfo: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '', photoUrl: '' },
        summary: '', experience: [], education: [], skills: [], projects: [], certifications: [],
      };
      const defaultSettings: CVSettings = {
        template: 'modern', accentColor: 'blue', fontSize: 'md', fontFamily: 'inter',
        lineSpacing: 'normal', photoShape: 'circle', margins: 'normal', hiddenSections: [],
      };
      const res = await api.post('/cvs', { title: isEs ? 'Mi CV' : 'My CV', cvData: defaultData, settings: defaultSettings, language });
      onEditCV(res.data._id, res.data.cvData, res.data.settings, res.data.language, res.data.title);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (cv: CVRecord) => {
    setDuplicatingId(cv._id);
    try {
      const res = await api.post('/cvs', {
        title: `${cv.title} (${isEs ? 'copia' : 'copy'})`,
        cvData: cv.cvData, settings: cv.settings, language: cv.language,
      });
      setCvs((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(ui.confirmDelete)) return;
    setDeletingId(id);
    try {
      await api.delete(`/cvs/${id}`);
      setCvs((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (cv: CVRecord) => {
    onEditCV(cv._id, cv.cvData, cv.settings, cv.language, cv.title);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(isEs ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const templateLabel = (t: string) => {
    const map: Record<string, { es: string; en: string }> = {
      classic: { es: 'Clásico', en: 'Classic' }, modern: { es: 'Moderno', en: 'Modern' },
      minimal: { es: 'Mínimo', en: 'Minimal' }, executive: { es: 'Ejecutivo', en: 'Executive' },
      creative: { es: 'Creativo', en: 'Creative' }, tech: { es: 'Tech', en: 'Tech' },
      compact: { es: 'Compacto', en: 'Compact' }, bold: { es: 'Negrita', en: 'Bold' },
      academic: { es: 'Académico', en: 'Academic' }, elegant: { es: 'Elegante', en: 'Elegant' },
      timeline: { es: 'Cronología', en: 'Timeline' },
    };
    return isEs ? (map[t]?.es ?? t) : (map[t]?.en ?? t);
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 60%, #f0fdf4 100%)' }}>

      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-extrabold text-gray-900 tracking-tight text-base">CV Builder</span>
            <span className="text-[10px] font-bold bg-gradient-to-r from-blue-500 to-violet-500 text-white px-2 py-0.5 rounded-full">PRO</span>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">{getInitials(user?.name ?? '')}</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {ui.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Hero / Title row ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-blue-500 font-semibold mb-1">{ui.greeting}, {user?.name?.split(' ')[0]} 👋</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{ui.title}</h1>
            {!loading && cvs.length > 0 && (
              <p className="text-gray-400 text-sm mt-1">{ui.totalCVs(cvs.length)}</p>
            )}
          </div>
          <button
            onClick={handleNewCV}
            disabled={creating}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
          >
            {creating ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            )}
            {creating ? ui.creating : `+ ${ui.newCV}`}
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">{ui.loading}</p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && cvs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* Illustration */}
            <div className="relative mb-8">
              <div className="w-32 h-40 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden mx-auto">
                <div className="h-8 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  <div className="w-16 h-1.5 bg-white rounded opacity-70" />
                </div>
                <div className="flex-1 p-3 space-y-1.5">
                  <div className="h-1.5 bg-gray-100 rounded w-full" />
                  <div className="h-1.5 bg-gray-100 rounded w-3/4" />
                  <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                  <div className="h-1.5 bg-gray-100 rounded w-2/3 mt-2" />
                  <div className="h-1.5 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                {isEs ? 'Gratis' : 'Free'}
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{ui.emptyTitle}</h2>
            <p className="text-gray-500 mb-8 max-w-md leading-relaxed">{ui.emptySubtitle}</p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {(isEs
                ? ['11 Plantillas', 'Colores personalizados', 'Exportar PDF', 'Foto de perfil', 'Multiidioma']
                : ['11 Templates', 'Custom colors', 'PDF export', 'Profile photo', 'Multilingual']
              ).map((f) => (
                <span key={f} className="text-xs font-semibold px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full shadow-sm">
                  ✓ {f}
                </span>
              ))}
            </div>

            <button
              onClick={handleNewCV}
              disabled={creating}
              className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white rounded-2xl transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              {creating ? ui.creating : ui.createFirst}
            </button>
          </div>
        )}

        {/* ── CV Grid ── */}
        {!loading && cvs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* New CV card */}
            <button
              onClick={handleNewCV}
              disabled={creating}
              className="bg-white/60 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all group min-h-[220px] disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-500 group-hover:text-blue-600 transition">
                {creating ? ui.creating : `+ ${ui.newCV}`}
              </span>
            </button>

            {cvs.map((cv) => {
              const accent = (cv.settings?.customColor) || accentHexMap[cv.settings?.accentColor ?? 'blue'] || '#2563eb';
              const pct = cvCompletionPct(cv.cvData);
              const pctColor = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

              return (
                <div
                  key={cv._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden border border-gray-100 hover:-translate-y-0.5 group"
                >
                  {/* Colored top accent + mini preview */}
                  <div
                    className="h-2 flex-shrink-0"
                    style={{ background: `linear-gradient(to right, ${accent}, ${accent}99)` }}
                  />

                  {/* Mini preview area */}
                  <div
                    className="mx-4 mt-4 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ height: '72px', background: accent + '08', border: `1px solid ${accent}22`, padding: '10px' }}
                  >
                    <TemplateMini template={cv.settings?.template ?? 'modern'} accent={accent} />
                  </div>

                  {/* Info */}
                  <div className="px-4 pt-3 pb-2 flex-1">
                    <h3 className="font-bold text-gray-900 truncate text-base leading-tight">{cv.title}</h3>

                    <div className="flex items-center gap-2 mt-1.5">
                      {/* Template badge */}
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: accent + '15', color: accent }}
                      >
                        {templateLabel(cv.settings?.template ?? 'modern')}
                      </span>
                      {/* Language badge */}
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase">
                        {cv.language || 'es'}
                      </span>
                    </div>

                    {/* Completion bar */}
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400">{pct}% {ui.complete}</span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: pctColor }}
                        />
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-[11px] text-gray-400 mt-2">
                      {ui.lastUpdated} {formatDate(cv.updatedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(cv)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-white rounded-xl transition shadow-sm hover:shadow"
                      style={{ background: accent }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {ui.edit}
                    </button>
                    <button
                      onClick={() => handleDuplicate(cv)}
                      disabled={duplicatingId === cv._id}
                      title={ui.duplicate}
                      className="flex items-center justify-center w-9 h-9 text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 flex-shrink-0"
                    >
                      {duplicatingId === cv._id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(cv._id)}
                      disabled={deletingId === cv._id}
                      title={ui.delete}
                      className="flex items-center justify-center w-9 h-9 text-red-400 bg-red-50 rounded-xl hover:bg-red-100 transition disabled:opacity-50 flex-shrink-0"
                    >
                      {deletingId === cv._id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

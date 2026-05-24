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
  blue: '#3b82f6', emerald: '#10b981', violet: '#8b5cf6', rose: '#f43f5e',
  amber: '#f59e0b', slate: '#64748b', teal: '#14b8a6', indigo: '#6366f1',
  orange: '#f97316', dark: '#f8fafc', // Note: mapped dark to light for contrast in dark mode
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
  const bg = accent + '20';
  const line = (w: string, opacity = 1) => (
    <div className="h-1 rounded-full mb-1" style={{ width: w, background: opacity === 1 ? accent : '#475569' }} />
  );

  switch (template) {
    case 'modern':
    case 'creative':
    case 'timeline':
      return (
        <div className="flex gap-1.5 h-full">
          <div className="w-8 rounded flex-shrink-0" style={{ background: accent }} />
          <div className="flex-1 pt-1 space-y-1">
            {line('80%', 0.5)}{line('60%', 0.5)}{line('40%', 0.5)}
          </div>
        </div>
      );
    case 'classic':
    case 'bold':
      return (
        <div className="h-full flex flex-col">
          <div className="h-6 rounded-t mb-1" style={{ background: accent }} />
          <div className="flex-1 pt-0.5 space-y-1">
            {line('70%', 0.5)}{line('50%', 0.5)}{line('60%', 0.5)}
          </div>
        </div>
      );
    case 'elegant':
      return (
        <div className="h-full flex flex-col items-center pt-1">
          <div className="h-0.5 w-full rounded mb-1" style={{ background: accent }} />
          <div className="h-2 w-2/3 rounded mb-1" style={{ background: bg }} />
          <div className="space-y-1 w-full">
            {line('80%', 0.5)}{line('60%', 0.5)}{line('70%', 0.5)}
          </div>
        </div>
      );
    default:
      return (
        <div className="h-full pt-1 space-y-1">
          <div className="h-2 w-1/2 rounded mb-1.5" style={{ background: bg }} />
          {line('80%', 0.5)}{line('60%', 0.5)}{line('70%', 0.5)}
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
    <div className="min-h-screen bg-slate-900 text-slate-200 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

      {/* ── Header ── */}
      <header className="glass-panel border-b border-slate-700/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-extrabold text-white tracking-tight text-lg">CV Builder</span>
            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">PRO</span>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="text-slate-300 text-xs font-bold">{getInitials(user?.name ?? '')}</span>
              </div>
              <span className="text-sm text-slate-300 font-medium">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {ui.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">

        {/* ── Hero / Title row ── */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm text-blue-400 font-semibold mb-2 tracking-wide uppercase">{ui.greeting}, {user?.name?.split(' ')[0]} 👋</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{ui.title}</h1>
            {!loading && cvs.length > 0 && (
              <p className="text-slate-400 text-sm mt-2">{ui.totalCVs(cvs.length)}</p>
            )}
          </div>
          <button
            onClick={handleNewCV}
            disabled={creating}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
          >
            {creating ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            )}
            {creating ? ui.creating : `+ ${ui.newCV}`}
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex justify-center items-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-400 font-medium">{ui.loading}</p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && cvs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl border border-slate-700/50">
            {/* Illustration */}
            <div className="relative mb-10">
              <div className="w-40 h-52 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden mx-auto transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="h-10 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  <div className="w-20 h-2 bg-white/50 rounded-full" />
                </div>
                <div className="flex-1 p-4 space-y-2.5 bg-slate-800">
                  <div className="h-2 bg-slate-700 rounded-full w-full" />
                  <div className="h-2 bg-slate-700 rounded-full w-3/4" />
                  <div className="h-2 bg-slate-700 rounded-full w-5/6" />
                  <div className="h-2 bg-slate-700 rounded-full w-2/3 mt-4" />
                  <div className="h-2 bg-slate-700 rounded-full w-4/5" />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-6 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 transform rotate-12">
                {isEs ? 'Gratis' : 'Free'}
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-3">{ui.emptyTitle}</h2>
            <p className="text-slate-400 mb-10 max-w-md leading-relaxed text-lg">{ui.emptySubtitle}</p>

            <button
              onClick={handleNewCV}
              disabled={creating}
              className="flex items-center gap-2 px-8 py-4 text-base font-bold text-white rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              {creating ? ui.creating : ui.createFirst}
            </button>
          </div>
        )}

        {/* ── CV Grid ── */}
        {!loading && cvs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {/* New CV card */}
            <button
              onClick={handleNewCV}
              disabled={creating}
              className="glass-panel border-2 border-dashed border-slate-600 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-500 hover:bg-slate-800/80 transition-all duration-300 group min-h-[260px] disabled:opacity-50"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-800 group-hover:bg-blue-500/20 border border-slate-700 group-hover:border-blue-500/30 flex items-center justify-center transition-all duration-300">
                <svg className="w-7 h-7 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-400 group-hover:text-blue-400 transition-colors">
                {creating ? ui.creating : `+ ${ui.newCV}`}
              </span>
            </button>

            {cvs.map((cv) => {
              const accent = (cv.settings?.customColor) || accentHexMap[cv.settings?.accentColor ?? 'blue'] || '#3b82f6';
              const pct = cvCompletionPct(cv.cvData);
              const pctColor = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

              return (
                <div
                  key={cv._id}
                  className="glass-panel rounded-3xl transition-all duration-300 flex flex-col overflow-hidden border border-slate-700/50 hover:border-slate-600 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 group"
                >
                  {/* Colored top accent + mini preview */}
                  <div
                    className="h-2 flex-shrink-0"
                    style={{ background: `linear-gradient(to right, ${accent}, ${accent}88)` }}
                  />

                  {/* Mini preview area */}
                  <div
                    className="mx-5 mt-5 rounded-xl overflow-hidden flex-shrink-0 relative"
                    style={{ height: '80px', background: 'rgba(15, 23, 42, 0.6)', border: `1px solid ${accent}40`, padding: '12px' }}
                  >
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${accent}, transparent 70%)` }}></div>
                    <TemplateMini template={cv.settings?.template ?? 'modern'} accent={accent} />
                  </div>

                  {/* Info */}
                  <div className="px-5 pt-4 pb-3 flex-1">
                    <h3 className="font-bold text-white truncate text-lg leading-tight group-hover:text-blue-400 transition-colors">{cv.title}</h3>

                    <div className="flex items-center gap-2 mt-2">
                      {/* Template badge */}
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={{ background: accent + '20', color: accent, border: `1px solid ${accent}40` }}
                      >
                        {templateLabel(cv.settings?.template ?? 'modern')}
                      </span>
                      {/* Language badge */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                        {cv.language || 'es'}
                      </span>
                    </div>

                    {/* Completion bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{pct}% {ui.complete}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out relative"
                          style={{ width: `${pct}%`, background: pctColor }}
                        >
                          <div className="absolute inset-0 bg-white/20"></div>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-[11px] text-slate-500 mt-3 font-medium">
                      {ui.lastUpdated} {formatDate(cv.updatedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-5 flex gap-2">
                    <button
                      onClick={() => handleEdit(cv)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90 relative overflow-hidden"
                      style={{ background: accent }}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {ui.edit}
                    </button>
                    <button
                      onClick={() => handleDuplicate(cv)}
                      disabled={duplicatingId === cv._id}
                      title={ui.duplicate}
                      className="flex items-center justify-center w-10 h-10 text-slate-400 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-all duration-300 disabled:opacity-50 flex-shrink-0"
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
                      className="flex items-center justify-center w-10 h-10 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50 flex-shrink-0"
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

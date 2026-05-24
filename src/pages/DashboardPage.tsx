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

export const DashboardPage: React.FC<DashboardPageProps> = ({ language, onEditCV }) => {
  const { user, logout } = useAuth();
  const [cvs, setCvs] = useState<CVRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isEs = language === 'es';

  const ui = {
    title: isEs ? 'Mis CVs' : 'My CVs',
    subtitle: isEs ? 'Gestiona y edita tus currículums' : 'Manage and edit your resumes',
    newCV: isEs ? 'Nuevo CV' : 'New CV',
    edit: isEs ? 'Editar' : 'Edit',
    delete: isEs ? 'Eliminar' : 'Delete',
    confirmDelete: isEs ? '¿Eliminar este CV?' : 'Delete this CV?',
    lastUpdated: isEs ? 'Actualizado' : 'Updated',
    emptyTitle: isEs ? 'Aún no tienes CVs' : 'No CVs yet',
    emptySubtitle: isEs ? 'Crea tu primer CV y empieza a destacar' : 'Create your first CV and start standing out',
    createFirst: isEs ? 'Crea tu primer CV' : 'Create your first CV',
    logout: isEs ? 'Cerrar sesión' : 'Logout',
    template: isEs ? 'Plantilla' : 'Template',
    loading: isEs ? 'Cargando...' : 'Loading...',
    creating: isEs ? 'Creando...' : 'Creating...',
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

  useEffect(() => {
    loadCVs();
  }, [loadCVs]);

  const handleNewCV = async () => {
    setCreating(true);
    try {
      const defaultData: CVData = {
        personalInfo: {
          name: '', title: '', email: '', phone: '',
          location: '', linkedin: '', website: '', photoUrl: '',
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
      };
      const defaultSettings: CVSettings = {
        template: 'modern',
        accentColor: 'blue',
        fontSize: 'md',
        fontFamily: 'inter',
        lineSpacing: 'normal',
        photoShape: 'circle',
        hiddenSections: [],
      };
      const res = await api.post('/cvs', {
        title: isEs ? 'Mi CV' : 'My CV',
        cvData: defaultData,
        settings: defaultSettings,
        language,
      });
      onEditCV(res.data._id, res.data.cvData, res.data.settings, res.data.language, res.data.title);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (cv: CVRecord) => {
    onEditCV(cv._id, cv.cvData, cv.settings, cv.language, cv.title);
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(isEs ? 'es-ES' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const templateLabel = (t: string) => {
    const map: Record<string, { es: string; en: string }> = {
      classic: { es: 'Clásico', en: 'Classic' },
      modern: { es: 'Moderno', en: 'Modern' },
      minimal: { es: 'Mínimo', en: 'Minimal' },
      executive: { es: 'Ejecutivo', en: 'Executive' },
      creative: { es: 'Creativo', en: 'Creative' },
      tech: { es: 'Tech', en: 'Tech' },
      compact: { es: 'Compacto', en: 'Compact' },
    };
    return isEs ? (map[t]?.es ?? t) : (map[t]?.en ?? t);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-base font-bold text-gray-900 tracking-tight">CV Builder</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Pro</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {isEs ? 'Hola,' : 'Hello,'} <span className="font-semibold text-gray-900">{user?.name}</span>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {ui.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Page title + New CV button */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ui.title}</h1>
            <p className="text-gray-500 text-sm mt-1">{ui.subtitle}</p>
          </div>
          <button
            onClick={handleNewCV}
            disabled={creating}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {creating ? ui.creating : ui.newCV}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty state */}
        {!loading && cvs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{ui.emptyTitle}</h2>
            <p className="text-gray-500 mb-6 max-w-sm">{ui.emptySubtitle}</p>
            <button
              onClick={handleNewCV}
              disabled={creating}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {creating ? ui.creating : ui.createFirst}
            </button>
          </div>
        )}

        {/* CV grid */}
        {!loading && cvs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cvs.map((cv) => (
              <div
                key={cv._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                {/* CV icon + title */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{cv.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {ui.template}: {templateLabel(cv.settings?.template ?? 'modern')}
                    </p>
                  </div>
                </div>

                {/* Last updated */}
                <p className="text-xs text-gray-400">
                  {ui.lastUpdated}: {formatDate(cv.updatedAt)}
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleEdit(cv)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {ui.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(cv._id)}
                    disabled={deletingId === cv._id}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {ui.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

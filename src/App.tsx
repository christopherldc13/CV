import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { TemplateSelector } from './components/TemplateSelector';
import { ColorPicker } from './components/ColorPicker';
import { FontPicker } from './components/FontPicker';
import { FontSizeControl } from './components/FontSizeControl';
import { SpacingControl } from './components/SpacingControl';
import { SectionVisibility } from './components/SectionVisibility';
import { PhotoShapeControl } from './components/PhotoShapeControl';
import { MarginControl } from './components/MarginControl';
import { ThemePresets } from './components/ThemePresets';
import { CVCompletion } from './components/CVCompletion';
import { ExportButton } from './components/ExportButton';
import { PersonalInfoForm } from './components/CVForm/PersonalInfoForm';
import { SummaryForm } from './components/CVForm/SummaryForm';
import { ExperienceForm } from './components/CVForm/ExperienceForm';
import { EducationForm } from './components/CVForm/EducationForm';
import { SkillsForm } from './components/CVForm/SkillsForm';
import { ProjectsForm, CertificationsForm } from './components/CVForm/ProjectsForm';
import { ClassicTemplate } from './components/CVTemplates/ClassicTemplate';
import { ModernTemplate } from './components/CVTemplates/ModernTemplate';
import { MinimalTemplate } from './components/CVTemplates/MinimalTemplate';
import { ExecutiveTemplate } from './components/CVTemplates/ExecutiveTemplate';
import { CreativeTemplate } from './components/CVTemplates/CreativeTemplate';
import { TechTemplate } from './components/CVTemplates/TechTemplate';
import { CompactTemplate } from './components/CVTemplates/CompactTemplate';
import { BoldTemplate } from './components/CVTemplates/BoldTemplate';
import { AcademicTemplate } from './components/CVTemplates/AcademicTemplate';
import { ElegantTemplate } from './components/CVTemplates/ElegantTemplate';
import { TimelineTemplate } from './components/CVTemplates/TimelineTemplate';
import { useCVData } from './hooks/useCVData';
import { useLanguage } from './i18n/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import api from './services/api';
import { colorMap } from './utils/colors';
import type { FormSection, CVData, CVSettings, FontSize, LineSpacing, CVMargins } from './types/cv.types';

// Actual font-size pixel values per setting — injected as CSS overrides so
// html2canvas, print, and browser all render identical text sizes.
const fontSizePx: Record<FontSize, Record<string, number>> = {
  xs: { xs: 9,    sm: 10.5, base: 12,   lg: 13.5, xl: 15,   '2xl': 19,  '3xl': 23 },
  sm: { xs: 10.5, sm: 12,   base: 13.5, lg: 15,   xl: 17,   '2xl': 21,  '3xl': 26 },
  md: { xs: 12,   sm: 14,   base: 16,   lg: 18,   xl: 20,   '2xl': 24,  '3xl': 30 },
  lg: { xs: 13.5, sm: 16,   base: 18,   lg: 21,   xl: 23,   '2xl': 28,  '3xl': 35 },
};
const lineSpacingMap: Record<LineSpacing, string> = { tight: '1.3', normal: '1.55', relaxed: '1.75' };
const marginsMap: Record<CVMargins, string> = { tight: '8px', normal: '24px', wide: '48px' };

const SECTIONS: FormSection[] = [
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
];

type AppView = 'auth' | 'dashboard' | 'editor';

interface EditingCV {
  id: string;
  title: string;
  cvData: CVData;
  settings: CVSettings;
  language: string;
}

function EditorView({
  editingCV,
  onBack,
}: {
  editingCV: EditingCV;
  onBack: () => void;
}) {
  const [activeSection, setActiveSection] = useState<FormSection>('personal');
  const [cvTitle, setCvTitle] = useState(editingCV.title);
  const [editingTitle, setEditingTitle] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [mobilePanel, setMobilePanel] = useState<'form' | 'preview'>('form');
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [isPDFExporting, setIsPDFExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (editingCV.language === 'en' || editingCV.language === 'es') {
      setLanguage(editingCV.language as 'en' | 'es');
    }
  }, [editingCV.language, setLanguage]);

  // Scale the preview to fit the panel width dynamically
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width - 64;
      setPreviewScale(Math.min(1, Math.max(0.4, available / 794)));
    });
    const el = previewPanelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const {
    cvData,
    settings,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkillCategory,
    updateSkillCategory,
    removeSkillCategory,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification,
    updateSettings,
    exportJSON,
    importJSON,
  } = useCVData({ cvData: editingCV.cvData, settings: editingCV.settings });

  const isEs = language === 'es';

  // Inject real font-size + line-height CSS so browser, html2canvas, and print all agree
  useEffect(() => {
    const id = 'cv-dynamic-styles';
    let style = document.getElementById(id) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    const s = fontSizePx[settings.fontSize ?? 'md'];
    const lh = lineSpacingMap[settings.lineSpacing ?? 'normal'];
    style.textContent = `
      #cv-preview .text-xs   { font-size: ${s.xs}px !important; }
      #cv-preview .text-sm   { font-size: ${s.sm}px !important; }
      #cv-preview .text-base { font-size: ${s.base}px !important; }
      #cv-preview .text-lg   { font-size: ${s.lg}px !important; }
      #cv-preview .text-xl   { font-size: ${s.xl}px !important; }
      #cv-preview .text-2xl  { font-size: ${s['2xl']}px !important; }
      #cv-preview .text-3xl  { font-size: ${s['3xl']}px !important; }
      #cv-preview p, #cv-preview span, #cv-preview li,
      #cv-preview h1, #cv-preview h2, #cv-preview h3, #cv-preview a {
        line-height: ${lh} !important;
      }
    `;
    return () => { document.getElementById(id)?.remove(); };
  }, [settings.fontSize, settings.lineSpacing]);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      await api.put(`/cvs/${editingCV.id}`, {
        title: cvTitle,
        cvData,
        settings,
        language,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('idle');
    }
  }, [editingCV.id, cvTitle, cvData, settings, language]);

  const handleExportPDF = useCallback(async () => {
    const preview = document.getElementById('cv-preview');
    if (!preview) return;
    setIsPDFExporting(true);
    try {
      // Temporarily set zoom to 1 on the display wrapper so html2canvas
      // captures the natural 794px width, not the display-scaled version.
      const zoomWrapper = preview.parentElement as HTMLElement | null;
      const savedZoom = zoomWrapper?.style.zoom ?? '';
      const savedShadow = preview.style.boxShadow;
      if (zoomWrapper) zoomWrapper.style.zoom = '1';
      preview.style.boxShadow = 'none';
      await new Promise<void>((r) => setTimeout(r, 80));

      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(preview, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
      });

      // Restore display state
      if (zoomWrapper) zoomWrapper.style.zoom = savedZoom;
      preview.style.boxShadow = savedShadow;

      const imgData = canvas.toDataURL('image/jpeg', 0.97);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();   // 210 mm
      const pageH = pdf.internal.pageSize.getHeight();  // 297 mm
      const imgH = (canvas.height / canvas.width) * pageW;

      // Multi-page: slide the full-height image across each page
      let page = 0;
      while (page * pageH < imgH) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -(page * pageH), pageW, imgH);
        page++;
      }

      const name = (cvData.personalInfo.name || 'CV').replace(/\s+/g, '_');
      pdf.save(`${name}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsPDFExporting(false);
    }
  }, [cvData.personalInfo.name]);

  const sectionTitles: Record<FormSection, string> = {
    personal: isEs ? 'Información Personal' : 'Personal Info',
    summary: isEs ? 'Resumen Profesional' : 'Summary',
    experience: isEs ? 'Experiencia Laboral' : 'Experience',
    education: isEs ? 'Educación' : 'Education',
    skills: isEs ? 'Habilidades' : 'Skills',
    projects: isEs ? 'Proyectos' : 'Projects',
    certifications: isEs ? 'Certificaciones' : 'Certifications',
  };

  const sectionDescriptions: Record<FormSection, string> = {
    personal: isEs ? 'Tus datos de contacto e identidad básica' : 'Your basic contact details and identity',
    summary: isEs ? 'Una descripción general de tu trayectoria profesional' : 'A compelling overview of your professional background',
    experience: isEs ? 'Tu historial laboral, comenzando por el más reciente' : 'Your work history, starting with the most recent',
    education: isEs ? 'Títulos académicos y formación' : 'Academic qualifications and degrees',
    skills: isEs ? 'Habilidades técnicas, blandas e idiomas' : 'Technical abilities, soft skills, and languages',
    projects: isEs ? 'Proyectos notables que muestren tu trabajo' : 'Notable projects showcasing your work',
    certifications: isEs ? 'Certificaciones y credenciales profesionales' : 'Professional certifications and credentials',
  };

  const ui = {
    sections: isEs ? 'Secciones' : 'Sections',
    sectionOf: isEs ? 'Sección' : 'Section',
    of: isEs ? 'de' : 'of',
    previous: isEs ? 'Anterior' : 'Prev',
    next: isEs ? 'Siguiente' : 'Next',
    live: isEs ? 'En vivo' : 'Live',
    preview: isEs ? 'Vista Previa del CV' : 'CV Preview',
    myCVs: isEs ? 'Mis CVs' : 'My CVs',
    save: isEs ? 'Guardar' : 'Save',
    saving: isEs ? 'Guardando...' : 'Saving...',
    saved: isEs ? 'Guardado' : 'Saved',
    settings: isEs ? 'Configuración' : 'Settings',
    formTab: isEs ? 'Formulario' : 'Form',
    previewTab: isEs ? 'Vista Previa' : 'Preview',
  };

  const renderForm = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm data={cvData.personalInfo} onChange={updatePersonalInfo} language={language} />;
      case 'summary':
        return <SummaryForm summary={cvData.summary} onChange={updateSummary} language={language} />;
      case 'experience':
        return (
          <ExperienceForm
            experiences={cvData.experience}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={removeExperience}
            language={language}
          />
        );
      case 'education':
        return (
          <EducationForm
            education={cvData.education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={removeEducation}
            language={language}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            skills={cvData.skills}
            onAdd={addSkillCategory}
            onUpdate={updateSkillCategory}
            onRemove={removeSkillCategory}
            language={language}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            projects={cvData.projects}
            onAdd={addProject}
            onUpdate={updateProject}
            onRemove={removeProject}
            language={language}
          />
        );
      case 'certifications':
        return (
          <CertificationsForm
            certifications={cvData.certifications}
            onAdd={addCertification}
            onUpdate={updateCertification}
            onRemove={removeCertification}
            language={language}
          />
        );
      default:
        return null;
    }
  };

  const visibleData = useMemo(() => {
    const hs = settings.hiddenSections ?? [];
    return {
      ...cvData,
      summary:        hs.includes('summary')        ? '' : cvData.summary,
      experience:     hs.includes('experience')     ? [] : cvData.experience,
      education:      hs.includes('education')      ? [] : cvData.education,
      skills:         hs.includes('skills')         ? [] : cvData.skills,
      projects:       hs.includes('projects')       ? [] : cvData.projects,
      certifications: hs.includes('certifications') ? [] : cvData.certifications,
    };
  }, [cvData, settings.hiddenSections]);

  const renderTemplate = () => {
    const props = { data: visibleData, settings, language };
    switch (settings.template) {
      case 'classic':   return <ClassicTemplate {...props} />;
      case 'modern':    return <ModernTemplate {...props} />;
      case 'minimal':   return <MinimalTemplate {...props} />;
      case 'executive': return <ExecutiveTemplate {...props} />;
      case 'creative':  return <CreativeTemplate {...props} />;
      case 'tech':      return <TechTemplate {...props} />;
      case 'compact':   return <CompactTemplate {...props} />;
      case 'bold':      return <BoldTemplate {...props} />;
      case 'academic':  return <AcademicTemplate {...props} />;
      case 'elegant':   return <ElegantTemplate {...props} />;
      case 'timeline':  return <TimelineTemplate {...props} />;
      default:          return <ModernTemplate {...props} />;
    }
  };

  const currentIdx = SECTIONS.indexOf(activeSection);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden print:block print:h-auto print:overflow-visible print:bg-white">
      {/* ── Top navbar ── */}
      <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center px-3 sm:px-6 gap-2 sm:gap-4 z-10 shadow-sm print:hidden">
        {/* Back button — text hidden on xs */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">{ui.myCVs}</span>
        </button>

        {/* Logo + editable title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          {editingTitle ? (
            <input
              autoFocus
              value={cvTitle}
              onChange={(e) => setCvTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') setEditingTitle(false); }}
              className="text-sm font-bold text-gray-900 border-b border-blue-500 outline-none bg-transparent w-24 sm:w-40"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="text-sm font-bold text-gray-900 hover:text-blue-600 transition truncate max-w-[80px] sm:max-w-[200px]"
              title={cvTitle}
            >
              {cvTitle}
            </button>
          )}
        </div>

        <div className="flex-1" />

        {/* Progress dots — desktop only */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">
            {ui.sectionOf} {currentIdx + 1} {ui.of} {SECTIONS.length}
          </span>
          <div className="flex gap-1">
            {SECTIONS.map((s, i) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIdx ? 'w-6 bg-blue-500' : i < currentIdx ? 'w-1.5 bg-blue-300' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Language toggle */}
        <div className="flex items-center ml-1 sm:ml-4">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 sm:px-3 py-1.5 text-xs font-semibold transition ${
                language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-2 sm:px-3 py-1.5 text-xs font-semibold transition ${
                language === 'es' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              ES
            </button>
          </div>
        </div>

        {/* Settings gear — mobile only (opens drawer) */}
        <button
          onClick={() => setShowMobileSettings(true)}
          className="md:hidden flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition ml-1"
          title={ui.settings}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>

        {/* Save button — icon only on xs */}
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-sm font-semibold rounded-xl transition ml-1 flex-shrink-0 ${
            saveStatus === 'saved'
              ? 'bg-green-500 text-white'
              : saveStatus === 'saving'
              ? 'bg-green-400 text-white opacity-70'
              : 'bg-green-600 text-white hover:bg-green-700'
          } shadow-sm`}
        >
          {saveStatus === 'saving' ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="hidden sm:inline">{ui.saving}</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="hidden sm:inline">{ui.saved}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span className="hidden sm:inline">{ui.save}</span>
            </>
          )}
        </button>
      </header>

      {/* ── Mobile tab bar (Form / Preview) ── */}
      <div className="md:hidden flex-shrink-0 bg-white border-b border-gray-200 flex print:hidden">
        <button
          onClick={() => setMobilePanel('form')}
          className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition ${
            mobilePanel === 'form'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          {ui.formTab}
        </button>
        <button
          onClick={() => setMobilePanel('preview')}
          className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition ${
            mobilePanel === 'preview'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          {ui.previewTab}
        </button>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex overflow-hidden print:block print:overflow-visible">

        {/* ── Left panel: section nav + form ── */}
        {/* Mobile: full-width, only visible when mobilePanel=form */}
        {/* md+: always visible at 42% width */}
        <div
          className={`${
            mobilePanel === 'form' ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-[42%] flex-shrink-0 overflow-hidden border-r border-gray-200 print:hidden`}
        >
          {/* Section pills — horizontal scroll on mobile only */}
          <div className="md:hidden flex-shrink-0 bg-white border-b border-gray-100 overflow-x-auto scrollbar-none">
            <div className="flex gap-2 px-4 py-2.5" style={{ width: 'max-content' }}>
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSection(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    s === activeSection
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sectionTitles[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Inner row: sidebar (desktop) + form */}
          <div className="flex-1 flex overflow-hidden">
            {/* Navigation sidebar — desktop only */}
            <div className="hidden md:flex w-52 flex-shrink-0 bg-white border-r border-gray-100 flex-col overflow-y-auto">
              <div className="p-4 flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">{ui.sections}</p>
                <Sidebar activeSection={activeSection} onSelect={setActiveSection} language={language} />
              </div>
              <div className="p-4 border-t border-gray-100 space-y-4 bg-gray-50">
                <CVCompletion data={cvData} language={language} />
                <ThemePresets
                  onChange={(v) => updateSettings({ ...v, customColor: undefined })}
                  language={language}
                />
                <TemplateSelector
                  selected={settings.template}
                  onChange={(t) => updateSettings({ template: t })}
                  language={language}
                />
                <ColorPicker
                  selected={settings.accentColor}
                  onChange={(c) => updateSettings({ accentColor: c, customColor: undefined })}
                  customColor={settings.customColor}
                  onCustomColor={(hex) => updateSettings({ customColor: hex })}
                  language={language}
                />
                <FontPicker
                  selected={settings.fontFamily ?? 'inter'}
                  onChange={(f) => updateSettings({ fontFamily: f })}
                  language={language}
                />
                <FontSizeControl
                  selected={settings.fontSize ?? 'md'}
                  onChange={(s) => updateSettings({ fontSize: s })}
                  language={language}
                />
                <SpacingControl
                  selected={settings.lineSpacing ?? 'normal'}
                  onChange={(s) => updateSettings({ lineSpacing: s })}
                  language={language}
                />
                <MarginControl
                  selected={settings.margins ?? 'normal'}
                  onChange={(m) => updateSettings({ margins: m })}
                  language={language}
                />
                <PhotoShapeControl
                  selected={settings.photoShape ?? 'circle'}
                  onChange={(s) => updateSettings({ photoShape: s })}
                  language={language}
                />
                <SectionVisibility
                  hidden={settings.hiddenSections ?? []}
                  onChange={(h) => updateSettings({ hiddenSections: h })}
                  language={language}
                />
                <ExportButton onExportJSON={exportJSON} onImportJSON={importJSON} onExportPDF={handleExportPDF} isPDFExporting={isPDFExporting} language={language} />
              </div>
            </div>

            {/* Form area */}
            <div className="flex-1 overflow-y-auto bg-white">
              <ErrorBoundary>
              <div className="p-4 sm:p-6">
                <div className="mb-4 sm:mb-5">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{sectionTitles[activeSection]}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{sectionDescriptions[activeSection]}</p>
                </div>

                {renderForm()}

                <div className="flex justify-between mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setActiveSection(SECTIONS[currentIdx - 1])}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {ui.previous}
                  </button>
                  <button
                    disabled={currentIdx === SECTIONS.length - 1}
                    onClick={() => setActiveSection(SECTIONS[currentIdx + 1])}
                    className="flex items-center gap-1.5 px-4 sm:px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {ui.next}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* ── Right panel: live preview ── */}
        {/* Mobile: full-width, only visible when mobilePanel=preview */}
        {/* md+: always visible, takes remaining width */}
        <div
          className={`${
            mobilePanel === 'preview' ? 'flex flex-col' : 'hidden'
          } md:flex md:flex-col flex-1 overflow-hidden print:block print:overflow-visible`}
          style={{ backgroundColor: '#cbd5e1' }}
        >
          {/* Preview bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-5 py-2 bg-gray-700 border-b border-gray-600 print:hidden">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="ml-2 text-xs text-gray-300 font-medium">
                <span className="hidden sm:inline">{ui.preview} — </span>
                {settings.template.charAt(0).toUpperCase() + settings.template.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400">{ui.live}</span>
            </div>
          </div>

          {/* Scrollable CV panel — ref for ResizeObserver to compute display scale */}
          <div ref={previewPanelRef} className="flex-1 overflow-auto print:overflow-visible">
            <div
              className="print:block print:p-0"
              style={{
                padding: marginsMap[settings.margins ?? 'normal'],
                display: 'flex',
                justifyContent: 'center',
                minHeight: '100%',
                alignItems: 'flex-start',
              }}
            >
              {/*
                Zoom wrapper shrinks cv-preview visually to fit the panel.
                html2canvas only captures the element it's given — parent zoom
                is NOT inherited, so the PDF is always full-resolution 794px.
              */}
              <div style={{ zoom: previewScale } as React.CSSProperties}>
                <div
                  ref={previewRef}
                  id="cv-preview"
                  className="bg-white relative print:static print:mx-auto print:shadow-none"
                  style={{
                    width: '794px',
                    minHeight: '1123px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.08)',
                    '--cv-accent': settings.customColor ?? colorMap[settings.accentColor]?.hex ?? '#2563eb',
                  } as React.CSSProperties}
                >
                  <ErrorBoundary>{renderTemplate()}</ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile settings drawer ── */}
      {showMobileSettings && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileSettings(false)}
          />
          <div className="relative bg-white rounded-t-2xl shadow-xl z-10 max-h-[78vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-bold text-gray-900 text-sm">{ui.settings}</h3>
              <button
                onClick={() => setShowMobileSettings(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <CVCompletion data={cvData} language={language} />
              <ThemePresets onChange={(v) => updateSettings({ ...v, customColor: undefined })} language={language} />
              <TemplateSelector selected={settings.template} onChange={(t) => updateSettings({ template: t })} language={language} />
              <ColorPicker
                selected={settings.accentColor}
                onChange={(c) => updateSettings({ accentColor: c, customColor: undefined })}
                customColor={settings.customColor}
                onCustomColor={(hex) => updateSettings({ customColor: hex })}
                language={language}
              />
              <FontPicker selected={settings.fontFamily ?? 'inter'} onChange={(f) => updateSettings({ fontFamily: f })} language={language} />
              <FontSizeControl selected={settings.fontSize ?? 'md'} onChange={(s) => updateSettings({ fontSize: s })} language={language} />
              <SpacingControl selected={settings.lineSpacing ?? 'normal'} onChange={(s) => updateSettings({ lineSpacing: s })} language={language} />
              <MarginControl selected={settings.margins ?? 'normal'} onChange={(m) => updateSettings({ margins: m })} language={language} />
              <PhotoShapeControl selected={settings.photoShape ?? 'circle'} onChange={(s) => updateSettings({ photoShape: s })} language={language} />
              <SectionVisibility hidden={settings.hiddenSections ?? []} onChange={(h) => updateSettings({ hiddenSections: h })} language={language} />
              <ExportButton onExportJSON={exportJSON} onImportJSON={importJSON} onExportPDF={handleExportPDF} isPDFExporting={isPDFExporting} language={language} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const [view, setView] = useState<AppView>('auth');
  const [editingCV, setEditingCV] = useState<EditingCV | null>(null);

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (view === 'auth') setView('dashboard');
      } else {
        setView('auth');
        setEditingCV(null);
      }
    }
  }, [user, loading, view]);

  const handleEditCV = useCallback(
    (cvId: string, cvData: CVData, settings: CVSettings, lang: string, title: string) => {
      setEditingCV({ id: cvId, title, cvData, settings, language: lang });
      setView('editor');
    },
    []
  );

  const handleBackToDashboard = useCallback(() => {
    setEditingCV(null);
    setView('dashboard');
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">CV Builder...</p>
        </div>
      </div>
    );
  }

  if (!user || view === 'auth') {
    return <AuthPage language={language as 'es' | 'en'} />;
  }

  if (view === 'dashboard' || !editingCV) {
    return (
      <DashboardPage
        language={language as 'es' | 'en'}
        onEditCV={handleEditCV}
      />
    );
  }

  return <EditorView editingCV={editingCV} onBack={handleBackToDashboard} />;
}

export default App;

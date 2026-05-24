import type { AccentColor, CVSettings, FontFamily } from '../types/cv.types';

export const colorMap: Record<AccentColor, {
  bg: string;
  text: string;
  border: string;
  light: string;
  sidebar: string;
  sidebarText: string;
  hex: string;
}> = {
  blue:    { bg: 'bg-blue-600',    text: 'text-blue-600',    border: 'border-blue-600',    light: 'bg-blue-50',    sidebar: 'bg-blue-700',    sidebarText: 'text-blue-100',    hex: '#2563eb' },
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', light: 'bg-emerald-50', sidebar: 'bg-emerald-700', sidebarText: 'text-emerald-100', hex: '#059669' },
  violet:  { bg: 'bg-violet-600',  text: 'text-violet-600',  border: 'border-violet-600',  light: 'bg-violet-50',  sidebar: 'bg-violet-700',  sidebarText: 'text-violet-100',  hex: '#7c3aed' },
  rose:    { bg: 'bg-rose-600',    text: 'text-rose-600',    border: 'border-rose-600',    light: 'bg-rose-50',    sidebar: 'bg-rose-700',    sidebarText: 'text-rose-100',    hex: '#e11d48' },
  amber:   { bg: 'bg-amber-500',   text: 'text-amber-600',   border: 'border-amber-500',   light: 'bg-amber-50',   sidebar: 'bg-amber-600',   sidebarText: 'text-amber-100',   hex: '#d97706' },
  slate:   { bg: 'bg-slate-700',   text: 'text-slate-700',   border: 'border-slate-700',   light: 'bg-slate-100',  sidebar: 'bg-slate-800',   sidebarText: 'text-slate-200',   hex: '#334155' },
  teal:    { bg: 'bg-teal-600',    text: 'text-teal-600',    border: 'border-teal-600',    light: 'bg-teal-50',    sidebar: 'bg-teal-700',    sidebarText: 'text-teal-100',    hex: '#0d9488' },
  indigo:  { bg: 'bg-indigo-600',  text: 'text-indigo-600',  border: 'border-indigo-600',  light: 'bg-indigo-50',  sidebar: 'bg-indigo-700',  sidebarText: 'text-indigo-100',  hex: '#4f46e5' },
  orange:  { bg: 'bg-orange-600',  text: 'text-orange-600',  border: 'border-orange-600',  light: 'bg-orange-50',  sidebar: 'bg-orange-600',  sidebarText: 'text-orange-100',  hex: '#ea580c' },
  dark:    { bg: 'bg-gray-900',    text: 'text-gray-900',    border: 'border-gray-900',    light: 'bg-gray-100',   sidebar: 'bg-gray-900',    sidebarText: 'text-gray-200',    hex: '#111827' },
};

export const fontFamilyMap: Record<FontFamily, string> = {
  inter:       "'Inter', system-ui, 'Segoe UI', sans-serif",
  georgia:     "Georgia, 'Times New Roman', serif",
  playfair:    "'Playfair Display', Georgia, serif",
  roboto:      "'Roboto', system-ui, 'Helvetica Neue', sans-serif",
  merriweather:"'Merriweather', Georgia, 'Times New Roman', serif",
};

export function resolveAccentHex(settings: CVSettings): string {
  return settings.customColor ?? colorMap[settings.accentColor]?.hex ?? '#2563eb';
}

export function formatDate(dateStr: string, language: 'en' | 'es' = 'en'): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short', year: 'numeric' });
}

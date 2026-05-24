export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  photoUrl: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  gpa: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  github: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  credentialId: string;
  url: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
}

export type TemplateType =
  | 'classic' | 'modern' | 'minimal' | 'executive'
  | 'creative' | 'tech' | 'compact' | 'bold' | 'academic'
  | 'elegant' | 'timeline';

export type AccentColor =
  | 'blue' | 'emerald' | 'violet' | 'rose'
  | 'amber' | 'slate' | 'teal' | 'indigo' | 'orange' | 'dark';

export type FontFamily = 'inter' | 'georgia' | 'playfair' | 'roboto' | 'merriweather';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg';
export type LineSpacing = 'tight' | 'normal' | 'relaxed';
export type PhotoShape = 'circle' | 'square' | 'hidden';
export type CVMargins = 'tight' | 'normal' | 'wide';

export interface CVSettings {
  template: TemplateType;
  accentColor: AccentColor;
  customColor?: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineSpacing: LineSpacing;
  photoShape: PhotoShape;
  margins: CVMargins;
  hiddenSections: string[];
}

export type FormSection =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications';

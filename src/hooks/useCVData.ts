import { useState, useCallback } from 'react';
import type {
  CVData,
  CVSettings,
  FontSize,
  CVMargins,
  PersonalInfo,
  WorkExperience,
  Education,
  SkillCategory,
  Project,
  Certification,
} from '../types/cv.types';

const defaultData: CVData = {
  personalInfo: {
    name: 'Alexandra Mitchell',
    title: 'Senior Software Engineer',
    email: 'alex.mitchell@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmitchell',
    website: 'alexmitchell.dev',
    photoUrl: '',
  },
  summary:
    'Results-driven Senior Software Engineer with 7+ years of experience building scalable web applications and leading cross-functional teams. Proven track record of delivering high-impact products at companies ranging from early-stage startups to Fortune 500 enterprises. Passionate about clean architecture, developer experience, and mentoring junior engineers.',
  experience: [
    {
      id: '1',
      company: 'Stripe',
      position: 'Senior Software Engineer',
      startDate: '2021-03',
      endDate: '',
      current: true,
      location: 'San Francisco, CA',
      description: 'Leading development of payment infrastructure serving millions of transactions daily.',
      highlights: [
        'Architected a real-time fraud detection system that reduced chargebacks by 34%',
        'Led a team of 5 engineers to migrate legacy monolith to microservices, improving deploy frequency by 10x',
        'Designed and implemented GraphQL API layer consumed by 200+ internal teams',
        'Mentored 3 junior engineers, two of whom were promoted to mid-level within 12 months',
      ],
    },
    {
      id: '2',
      company: 'Airbnb',
      position: 'Software Engineer II',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      location: 'San Francisco, CA',
      description: 'Full-stack engineer on the Payments and Trust team.',
      highlights: [
        'Built end-to-end payment reconciliation pipeline processing $2B+ annually',
        'Reduced page load times by 60% through server-side rendering optimization',
        'Contributed to open-source React component library with 3k+ GitHub stars',
      ],
    },
    {
      id: '3',
      company: 'TechStart Inc.',
      position: 'Software Engineer',
      startDate: '2016-07',
      endDate: '2018-05',
      current: false,
      location: 'New York, NY',
      description: 'Early-stage startup building B2B SaaS analytics platform.',
      highlights: [
        'Built the core analytics dashboard from scratch using React and D3.js',
        'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
        'Grew engineering team from 3 to 12 engineers as first technical hire',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2012-08',
      endDate: '2016-05',
      current: false,
      location: 'Berkeley, CA',
      gpa: '3.8',
      description: 'Concentration in Systems and Artificial Intelligence. Dean\'s List all semesters.',
    },
  ],
  skills: [
    {
      id: '1',
      name: 'Technical Skills',
      skills: ['TypeScript', 'React', 'Node.js', 'Python', 'Go', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes'],
    },
    {
      id: '2',
      name: 'Soft Skills',
      skills: ['Technical Leadership', 'System Design', 'Mentoring', 'Cross-functional Collaboration', 'Agile/Scrum'],
    },
    {
      id: '3',
      name: 'Languages',
      skills: ['English (Native)', 'Spanish (Professional)', 'Mandarin (Basic)'],
    },
  ],
  projects: [
    {
      id: '1',
      name: 'OpenMetrics Dashboard',
      description: 'Open-source real-time metrics visualization platform with support for Prometheus, Grafana, and custom data sources. Used by 500+ teams worldwide.',
      technologies: ['React', 'TypeScript', 'WebSockets', 'Go', 'InfluxDB'],
      url: 'openmetrics.dev',
      github: 'github.com/alexm/openmetrics',
      startDate: '2020-01',
      endDate: '2022-12',
    },
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: '2022-08',
      expiryDate: '2025-08',
      credentialId: 'AWS-SAP-123456',
      url: 'aws.amazon.com/certification',
    },
    {
      id: '2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2021-04',
      expiryDate: '2024-04',
      credentialId: 'CKA-2021-04567',
      url: 'cncf.io/certification/cka',
    },
  ],
};

const defaultSettings: CVSettings = {
  template: 'modern',
  accentColor: 'blue',
  fontSize: 'md',
  fontFamily: 'inter',
  lineSpacing: 'normal',
  photoShape: 'circle',
  margins: 'normal',
  hiddenSections: [],
};

function normalizeSettings(raw: Partial<CVSettings>): CVSettings {
  const merged = { ...defaultSettings, ...raw };
  // backward compat: legacy fontSize values → new scale
  const fs = merged.fontSize as string;
  if (fs === 'normal') merged.fontSize = 'md';
  else if (fs === 'compact') merged.fontSize = 'sm';
  else if (!['xs', 'sm', 'md', 'lg'].includes(fs)) merged.fontSize = 'md' as FontSize;
  if (!Array.isArray(merged.hiddenSections)) merged.hiddenSections = [];
  if (!['tight', 'normal', 'wide'].includes(merged.margins as string)) merged.margins = 'normal' as CVMargins;
  return merged;
}

function normalizeCVData(raw: CVData): CVData {
  return {
    personalInfo: { ...defaultData.personalInfo, ...(raw.personalInfo ?? {}) },
    summary: raw.summary ?? '',
    experience: (Array.isArray(raw.experience) ? raw.experience : []).map((e) => ({
      ...e,
      highlights: Array.isArray(e.highlights) ? e.highlights : [],
    })),
    education: Array.isArray(raw.education) ? raw.education : [],
    skills: (Array.isArray(raw.skills) ? raw.skills : []).map((s) => ({
      ...s,
      skills: Array.isArray(s.skills) ? s.skills : [],
    })),
    projects: (Array.isArray(raw.projects) ? raw.projects : []).map((p) => ({
      ...p,
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
    })),
    certifications: Array.isArray(raw.certifications) ? raw.certifications : [],
  };
}

export function useCVData(initialData?: { cvData?: CVData; settings?: CVSettings }) {
  const [cvData, setCVData] = useState<CVData>(
    initialData?.cvData ? normalizeCVData(initialData.cvData) : defaultData
  );
  const [settings, setSettings] = useState<CVSettings>(
    initialData?.settings ? normalizeSettings(initialData.settings) : defaultSettings
  );

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setCVData((prev) => ({ ...prev, summary }));
  }, []);

  // Experience
  const addExperience = useCallback(() => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      description: '',
      highlights: [],
    };
    setCVData((prev) => ({ ...prev, experience: [...(prev.experience ?? []), newExp] }));
  }, []);

  const updateExperience = useCallback((id: string, data: Partial<WorkExperience>) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  }, []);

  const reorderExperience = useCallback((fromIndex: number, toIndex: number) => {
    setCVData((prev) => {
      const arr = [...prev.experience];
      const [item] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, item);
      return { ...prev, experience: arr };
    });
  }, []);

  // Education
  const addEducation = useCallback(() => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      gpa: '',
      description: '',
    };
    setCVData((prev) => ({ ...prev, education: [...(prev.education ?? []), newEdu] }));
  }, []);

  const updateEducation = useCallback((id: string, data: Partial<Education>) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  }, []);

  // Skills
  const addSkillCategory = useCallback(() => {
    const newCat: SkillCategory = {
      id: Date.now().toString(),
      name: '',
      skills: [],
    };
    setCVData((prev) => ({ ...prev, skills: [...(prev.skills ?? []), newCat] }));
  }, []);

  const updateSkillCategory = useCallback((id: string, data: Partial<SkillCategory>) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
  }, []);

  const removeSkillCategory = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  }, []);

  // Projects
  const addProject = useCallback(() => {
    const newProj: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
      startDate: '',
      endDate: '',
    };
    setCVData((prev) => ({ ...prev, projects: [...(prev.projects ?? []), newProj] }));
  }, []);

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setCVData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  // Certifications
  const addCertification = useCallback(() => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    };
    setCVData((prev) => ({ ...prev, certifications: [...(prev.certifications ?? []), newCert] }));
  }, []);

  const updateCertification = useCallback((id: string, data: Partial<Certification>) => {
    setCVData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  }, []);

  // Settings
  const updateSettings = useCallback((s: Partial<CVSettings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
  }, []);

  // Import / Export
  const exportJSON = useCallback(() => {
    const payload = JSON.stringify({ cvData, settings }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [cvData, settings]);

  const importJSON = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.cvData) setCVData(parsed.cvData);
        if (parsed.settings) setSettings(parsed.settings);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    cvData,
    settings,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperience,
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
  };
}

export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Navbar
    sizeLabel: 'Size',
    normal: 'Normal',
    compact: 'Compact',
    sectionOf: 'Section',
    of: 'of',

    // Sections nav
    sections: 'Sections',
    personal: 'Personal Info',
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',

    // Section descriptions
    personalDesc: 'Your basic contact details and identity',
    summaryDesc: 'A compelling overview of your professional background',
    experienceDesc: 'Your work history, starting with the most recent',
    educationDesc: 'Academic qualifications and degrees',
    skillsDesc: 'Technical abilities, soft skills, and languages',
    projectsDesc: 'Notable projects showcasing your work',
    certificationsDesc: 'Professional certifications and credentials',

    // Navigation buttons
    previous: 'Previous',
    next: 'Next',

    // Template selector
    templateLabel: 'Template',
    classic: 'Classic',
    classicDesc: 'Two-column, corporate',
    modern: 'Modern',
    modernDesc: 'Sidebar, contemporary',
    minimal: 'Minimal',
    minimalDesc: 'Single-column, clean',

    // Color picker
    colorLabel: 'Accent Color',

    // Export button
    exportLabel: 'Export',
    downloadPDF: 'Download PDF',
    preparing: 'Preparing...',
    saveJSON: 'Save JSON',
    loadJSON: 'Load JSON',

    // PersonalInfoForm
    fullName: 'Full Name',
    professionalTitle: 'Professional Title',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    linkedin: 'LinkedIn',
    website: 'Website',
    photoUrl: 'Photo URL',
    photoPreview: 'Photo preview',

    // SummaryForm
    professionalSummary: 'Professional Summary',
    summaryPlaceholder: 'Write a compelling 2-4 sentence summary of your professional background, key skills, and career goals...',
    characters: 'characters',
    tipsTitle: 'Tips for a strong summary:',
    tip1: 'Lead with your years of experience and primary expertise',
    tip2: 'Mention 2-3 key skills or technologies',
    tip3: 'Include a notable achievement or impact metric',
    tip4: "Tailor it to the role you're applying for",

    // ExperienceForm
    addExperience: '+ Add Experience',
    company: 'Company',
    companyPlaceholder: 'Company name',
    positionTitle: 'Position / Title',
    jobTitlePlaceholder: 'Job title',
    locationLabel: 'Location',
    locationPlaceholder: 'City, State / Remote',
    startDate: 'Start Date',
    endDate: 'End Date',
    currentlyWorking: 'I currently work here',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Brief description of the role...',
    highlights: 'Key Achievements',
    addHighlight: 'Add',
    highlightPlaceholder: 'e.g. Increased revenue by 30%...',
    highlightHint: 'Press Enter or click Add',
    newPosition: 'New Position',
    present: 'Present',
    noExperience: 'No experience entries yet.',

    // EducationForm
    addEducation: '+ Add Education',
    institution: 'Institution',
    institutionPlaceholder: 'University / School name',
    degree: 'Degree',
    degreePlaceholder: 'e.g. Bachelor of Science',
    fieldOfStudy: 'Field of Study',
    fieldPlaceholder: 'e.g. Computer Science',
    gpa: 'GPA (optional)',
    gpaPlaceholder: 'e.g. 3.8 / 4.0',
    currentlyStudying: 'Currently studying here',
    additionalInfo: 'Additional Info (optional)',
    additionalInfoPlaceholder: 'Honors, awards, relevant coursework, activities...',
    newInstitution: 'New Institution',
    noEducation: 'No education entries yet.',

    // SkillsForm
    addCategory: '+ Add Skill Category',
    categoryPlaceholder: 'Category name (e.g. Technical Skills)',
    addSkillBtn: 'Add',
    skillPlaceholder: 'Type a skill and press Enter...',
    noSkills: 'No skill categories yet.',

    // ProjectsForm
    addProject: '+ Add Project',
    projectName: 'Project Name',
    projectNamePlaceholder: 'Project name',
    technologiesLabel: 'Technologies',
    addTech: 'Add',
    techPlaceholder: 'Add technology...',
    liveUrl: 'Live URL',
    githubUrl: 'GitHub URL',
    newProject: 'New Project',
    noProjects: 'No projects yet.',

    // CertificationsForm
    addCertification: '+ Add Certification',
    certificationName: 'Certification Name',
    certNamePlaceholder: 'e.g. AWS Solutions Architect',
    issuingOrg: 'Issuing Organization',
    issuerPlaceholder: 'e.g. Amazon Web Services',
    issueDate: 'Issue Date',
    expiryDate: 'Expiry Date',
    credentialId: 'Credential ID',
    credentialIdPlaceholder: 'ABC-123456',
    verificationUrl: 'Verification URL',
    verificationPlaceholder: 'verify.example.com/...',
    newCertification: 'New Certification',
    noCertifications: 'No certifications yet.',

    // CV Template section titles
    cvSummary: 'Professional Summary',
    cvAboutMe: 'About Me',
    cvProfile: 'Profile',
    cvExperience: 'Work Experience',
    cvExperienceShort: 'Experience',
    cvEducation: 'Education',
    cvSkills: 'Skills',
    cvProjects: 'Projects',
    cvCertifications: 'Certifications',
    cvContact: 'Contact',
    cvPresent: 'Present',

    // Preview toolbar
    previewLabel: 'CV Preview',
    live: 'Live',
  },
  es: {
    // Navbar
    sizeLabel: 'Tamaño',
    normal: 'Normal',
    compact: 'Compacto',
    sectionOf: 'Sección',
    of: 'de',

    // Sections nav
    sections: 'Secciones',
    personal: 'Info Personal',
    summary: 'Resumen',
    experience: 'Experiencia',
    education: 'Educación',
    skills: 'Habilidades',
    projects: 'Proyectos',
    certifications: 'Certificaciones',

    // Section descriptions
    personalDesc: 'Tus datos de contacto e identidad básica',
    summaryDesc: 'Una descripción general de tu trayectoria profesional',
    experienceDesc: 'Tu historial laboral, comenzando por el más reciente',
    educationDesc: 'Títulos académicos y formación',
    skillsDesc: 'Habilidades técnicas, blandas e idiomas',
    projectsDesc: 'Proyectos notables que muestren tu trabajo',
    certificationsDesc: 'Certificaciones y credenciales profesionales',

    // Navigation buttons
    previous: 'Anterior',
    next: 'Siguiente',

    // Template selector
    templateLabel: 'Plantilla',
    classic: 'Clásico',
    classicDesc: 'Dos columnas, corporativo',
    modern: 'Moderno',
    modernDesc: 'Barra lateral, contemporáneo',
    minimal: 'Minimalista',
    minimalDesc: 'Una columna, limpio',

    // Color picker
    colorLabel: 'Color de Acento',

    // Export button
    exportLabel: 'Exportar',
    downloadPDF: 'Descargar PDF',
    preparing: 'Preparando...',
    saveJSON: 'Guardar JSON',
    loadJSON: 'Cargar JSON',

    // PersonalInfoForm
    fullName: 'Nombre Completo',
    professionalTitle: 'Título Profesional',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    location: 'Ubicación',
    linkedin: 'LinkedIn',
    website: 'Sitio Web',
    photoUrl: 'URL de Foto',
    photoPreview: 'Vista previa de foto',

    // SummaryForm
    professionalSummary: 'Resumen Profesional',
    summaryPlaceholder: 'Escribe un resumen convincente de 2-4 oraciones sobre tu trayectoria, habilidades clave y objetivos...',
    characters: 'caracteres',
    tipsTitle: 'Consejos para un buen resumen:',
    tip1: 'Comienza con tus años de experiencia y especialidad principal',
    tip2: 'Menciona 2-3 habilidades o tecnologías clave',
    tip3: 'Incluye un logro notable o métrica de impacto',
    tip4: 'Adáptalo al puesto al que aplicas',

    // ExperienceForm
    addExperience: '+ Agregar Experiencia',
    company: 'Empresa',
    companyPlaceholder: 'Nombre de la empresa',
    positionTitle: 'Puesto / Título',
    jobTitlePlaceholder: 'Título del puesto',
    locationLabel: 'Ubicación',
    locationPlaceholder: 'Ciudad, País / Remoto',
    startDate: 'Fecha de Inicio',
    endDate: 'Fecha de Fin',
    currentlyWorking: 'Trabajo aquí actualmente',
    descriptionLabel: 'Descripción',
    descriptionPlaceholder: 'Breve descripción del puesto...',
    highlights: 'Logros Clave',
    addHighlight: 'Agregar',
    highlightPlaceholder: 'ej. Aumenté los ingresos un 30%...',
    highlightHint: 'Presiona Enter o haz clic en Agregar',
    newPosition: 'Nuevo Puesto',
    present: 'Presente',
    noExperience: 'Aún no hay experiencias agregadas.',

    // EducationForm
    addEducation: '+ Agregar Educación',
    institution: 'Institución',
    institutionPlaceholder: 'Universidad / Escuela',
    degree: 'Título / Grado',
    degreePlaceholder: 'ej. Licenciatura en Ciencias',
    fieldOfStudy: 'Campo de Estudio',
    fieldPlaceholder: 'ej. Ingeniería en Sistemas',
    gpa: 'Promedio / GPA (opcional)',
    gpaPlaceholder: 'ej. 9.2 / 10',
    currentlyStudying: 'Estudio aquí actualmente',
    additionalInfo: 'Información Adicional (opcional)',
    additionalInfoPlaceholder: 'Honores, premios, materias relevantes, actividades...',
    newInstitution: 'Nueva Institución',
    noEducation: 'Aún no hay estudios registrados.',

    // SkillsForm
    addCategory: '+ Agregar Categoría',
    categoryPlaceholder: 'Nombre de categoría (ej. Habilidades Técnicas)',
    addSkillBtn: 'Agregar',
    skillPlaceholder: 'Escribe una habilidad y presiona Enter...',
    noSkills: 'Aún no hay categorías de habilidades.',

    // ProjectsForm
    addProject: '+ Agregar Proyecto',
    projectName: 'Nombre del Proyecto',
    projectNamePlaceholder: 'Nombre del proyecto',
    technologiesLabel: 'Tecnologías',
    addTech: 'Agregar',
    techPlaceholder: 'Agregar tecnología...',
    liveUrl: 'URL del Proyecto',
    githubUrl: 'URL de GitHub',
    newProject: 'Nuevo Proyecto',
    noProjects: 'Aún no hay proyectos.',

    // CertificationsForm
    addCertification: '+ Agregar Certificación',
    certificationName: 'Nombre de la Certificación',
    certNamePlaceholder: 'ej. AWS Solutions Architect',
    issuingOrg: 'Organización Emisora',
    issuerPlaceholder: 'ej. Amazon Web Services',
    issueDate: 'Fecha de Emisión',
    expiryDate: 'Fecha de Vencimiento',
    credentialId: 'ID de Credencial',
    credentialIdPlaceholder: 'ABC-123456',
    verificationUrl: 'URL de Verificación',
    verificationPlaceholder: 'verificar.ejemplo.com/...',
    newCertification: 'Nueva Certificación',
    noCertifications: 'Aún no hay certificaciones.',

    // CV Template section titles
    cvSummary: 'Resumen Profesional',
    cvAboutMe: 'Sobre Mí',
    cvProfile: 'Perfil',
    cvExperience: 'Experiencia Laboral',
    cvExperienceShort: 'Experiencia',
    cvEducation: 'Educación',
    cvSkills: 'Habilidades',
    cvProjects: 'Proyectos',
    cvCertifications: 'Certificaciones',
    cvContact: 'Contacto',
    cvPresent: 'Presente',

    // Preview toolbar
    previewLabel: 'Vista Previa del CV',
    live: 'En vivo',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

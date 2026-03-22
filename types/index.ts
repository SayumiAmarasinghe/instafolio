export interface Project {
  title: string;
  description: string;
  githubUrl?: string;
  technologies: string[];
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  achievements: string[];
}

// 1. Add the new ThemeColors interface
export interface ThemeColors {
  background: string;
  text: string;
  primary: string; // Used for accents, buttons, skill pills
  mutedText: string;
  cardBackground: string;
  cardBorder: string;
}

export interface ResumeData {
  name: string;
  email: string;
  linkedin?: string;
  github?: string;
  about: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  coverLetter: string;
  // 2. Replace the strict 'minimal' | 'cyber' string with our dynamic color object
  themeColors: ThemeColors; 
}
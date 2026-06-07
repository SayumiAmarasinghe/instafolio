import { ResumeData } from '@/types';
import { Github, Linkedin, Mail, Code, Briefcase, FileText, Sparkles } from 'lucide-react';

export default function PortfolioTemplate({ data }: { data: ResumeData }) {
  // 1. Safety Net: Fallback colors just in case the AI forgets to generate them!
  const themeColors = data.themeColors || {
    background: '#ffffff',
    text: '#0f172a',
    primary: '#9333ea', 
    mutedText: '#64748b',
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0'
  };

  return (
    <div 
      className="min-h-screen p-8 md:p-24 font-sans transition-colors duration-500"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">{data.name}</h1>
          <p className="text-xl max-w-2xl" style={{ color: themeColors.mutedText }}>
            {data.about}
          </p>
          
          <div className="flex gap-4 pt-4">
            {data.email && <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:opacity-70" style={{ color: themeColors.primary }}><Mail size={20} /> Email</a>}
            {data.github && <a href={data.github} target="_blank" className="flex items-center gap-2 hover:opacity-70" style={{ color: themeColors.primary }}><Github size={20} /> GitHub</a>}
            {data.linkedin && <a href={data.linkedin} target="_blank" className="flex items-center gap-2 hover:opacity-70" style={{ color: themeColors.primary }}><Linkedin size={20} /> LinkedIn</a>}
          </div>
        </header>

        {/* Skills Section - Only renders if there are skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: themeColors.primary }}><Code /> Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 text-sm rounded-full border shadow-sm"
                  style={{ 
                    backgroundColor: themeColors.cardBackground, 
                    borderColor: themeColors.cardBorder,
                    color: themeColors.text 
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience Section - Only renders if there is experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: themeColors.primary }}><Briefcase /> Work Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div 
                  key={i} 
                  className="p-6 rounded-xl border shadow-sm space-y-4 transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.cardBorder }}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <h3 className="text-xl font-bold">{exp.role}</h3>
                      <p className="text-lg font-medium" style={{ color: themeColors.primary }}>{exp.company}</p>
                    </div>
                    <span 
                      className="text-sm px-3 py-1 rounded-full border" 
                      style={{ borderColor: themeColors.cardBorder, color: themeColors.mutedText }}
                    >
                      {exp.duration}
                    </span>
                  </div>
                  
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-2">
                      {exp.achievements.map((achievement, j) => (
                        <li key={j} className="leading-relaxed" style={{ color: themeColors.mutedText }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section - Only renders if there are projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: themeColors.primary }}><Code /> Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((project, i) => (
                <div 
                  key={i} 
                  className="p-6 rounded-xl border shadow-sm space-y-4 transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.cardBorder }}
                >
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p style={{ color: themeColors.mutedText }}>{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.technologies.map((tech, j) => (
                        <span key={j} className="text-xs font-mono opacity-80 border-b pb-0.5" style={{ borderColor: themeColors.primary, color: themeColors.primary }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Dynamic Additional Sections (Awards, Certifications, Leadership, etc.) */}
        {data.additionalSections && data.additionalSections.length > 0 && (
          <div className="space-y-16 mt-16">
            {data.additionalSections.map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: themeColors.primary }}>
                  <Sparkles /> {section.sectionTitle}
                </h2>
                
                <div className="space-y-6">
                  {(section.items || []).map((item, j) => (
                    <div 
                      key={j} 
                      className="p-6 rounded-xl border shadow-sm space-y-3 transition-transform hover:-translate-y-1"
                      style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.cardBorder }}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                          {item.title && <h3 className="text-xl font-bold">{item.title}</h3>}
                          {item.subtitle && <p className="text-lg font-medium" style={{ color: themeColors.primary }}>{item.subtitle}</p>}
                        </div>
                      </div>
                      
                      {item.description && (
                        <p style={{ color: themeColors.mutedText }}>{item.description}</p>
                      )}
                      
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="list-disc list-inside space-y-2 mt-2">
                          {item.bullets.map((bullet, k) => (
                            <li key={k} className="leading-relaxed" style={{ color: themeColors.mutedText }}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
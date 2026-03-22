import { ResumeData } from '@/types';
import { Github, Linkedin, Mail, Code, Briefcase, FileText } from 'lucide-react';

export default function PortfolioTemplate({ data }: { data: ResumeData }) {
  // Destructure for cleaner code below
  const { themeColors } = data;

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

        {/* Skills Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: themeColors.primary }}><Code /> Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(data.skills || []).map((skill, i) => (
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

        {/* Projects Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: themeColors.primary }}><Code /> Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data.projects || []).map((project, i) => (
              <div 
                key={i} 
                className="p-6 rounded-xl border shadow-sm space-y-4 transition-transform hover:-translate-y-1"
                style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.cardBorder }}
              >
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p style={{ color: themeColors.mutedText }}>{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(project.technologies || []).map((tech, j) => (
                    <span key={j} className="text-xs font-mono opacity-80 border-b pb-0.5" style={{ borderColor: themeColors.primary, color: themeColors.primary }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cover Letter */}
        <section 
          className="p-8 rounded-xl border shadow-sm"
          style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.cardBorder }}
        >
           <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: themeColors.primary }}><FileText /> AI Generated Cover Letter</h2>
           <div className="whitespace-pre-wrap leading-relaxed" style={{ color: themeColors.mutedText }}>
             {data.coverLetter}
           </div>
        </section>

      </div>
    </div>
  );
}
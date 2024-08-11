'use client';

import { User, Profile, Experience, Education, Skill, Project } from '@prisma/client';

interface EuropassCVProps {
  user: User & {
    profile: Profile | null;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
  };
}

export function EuropassCV({ user }: EuropassCVProps) {
  return (
    <div className="p-8" id="cv-content">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <p className="text-xl">{user.profile?.bio}</p>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Informații Personale</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Telefon:</strong> {user.profile?.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Adresă:</strong> {user.profile?.location || 'N/A'}</p>
            <p><strong>Website:</strong> {user.profile?.websiteUrl || 'N/A'}</p>
          </div>
        </div>
      </section>

      {user.experiences.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Experiență Profesională</h2>
          {user.experiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <h3 className="text-xl font-medium">{exp.jobTitle}</h3>
              <p>{exp.company} - {exp.location}</p>
              <p>{new Date(exp.startDate).toLocaleDateString('ro-RO')} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('ro-RO') : 'Prezent'}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {user.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Educație</h2>
          {user.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <h3 className="text-xl font-medium">{edu.degree}</h3>
              <p>{edu.institution} - {edu.fieldOfStudy}</p>
              <p>{new Date(edu.startDate).toLocaleDateString('ro-RO')} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString('ro-RO') : 'Prezent'}</p>
              <p>{edu.description}</p>
            </div>
          ))}
        </section>
      )}

      {user.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Competențe</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span key={skill.id} className="rounded-full px-3 py-1 text-sm font-semibold">
                {skill.name} - {skill.level}
              </span>
            ))}
          </div>
        </section>
      )}

      {user.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Proiecte</h2>
          {user.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="text-xl font-medium">{project.title}</h3>
              <p>{new Date(project.startDate).toLocaleDateString('ro-RO')} - {project.endDate ? new Date(project.endDate).toLocaleDateString('ro-RO') : 'Prezent'}</p>
              <p>{project.description}</p>
              {project.url && <p><a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link proiect</a></p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
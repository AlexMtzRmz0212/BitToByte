import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const Projects = () => (
  <section id="projects" className="relative mx-auto max-w-7xl px-6 py-24">
    <SectionHeading
      eyebrow="Live Work"
      title="Projects, deployed & online"
      subtitle="A growing network of applications. Each one live, each one solving a real problem."
    />

    <div className="mt-14 grid auto-rows-[minmax(190px,1fr)] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <Reveal key={project.id} delay={i * 80} className={project.className}>
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </div>
  </section>
);

export default Projects;

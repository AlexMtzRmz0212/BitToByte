import { Reveal } from '@alex_mtz/bittobyte-ui';
import { ChevronDown } from 'lucide-react';
import Contact from '../components/Contact';
import ExperienceStrip from '../components/ExperienceStrip';
import { ArchiveList, ProjectGrid } from '../components/ProjectSections';
import { groupedProjects } from '../lib/projectGroups';
import { usePageMeta } from '../hooks/usePageMeta';

// Looping ribbon of the stack; duplicated inline for a seamless marquee.
const TECH = [
  'Python',
  'SQL',
  'TensorFlow',
  'PyTorch',
  'PLCs',
  'SCADA',
  'React',
  'Node.js',
  'Docker',
  'Pandas',
  'Git',
  'Linux',
];

// Headline capabilities shown as chips.
const SKILLS = [
  'SCADA Systems',
  'Machine Learning',
  'Industrial Automation',
  'Data Pipelines',
  'Full-Stack Apps',
];

// Engineer-flavored "about" card styled like a code editor.
const TerminalCard = () => (
  <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900/70 shadow-2xl shadow-black/40 backdrop-blur">
    <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-red-400/80" />
      <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
      <span className="h-3 w-3 rounded-full bg-green-400/80" />
      <span className="ml-3 font-mono text-xs text-gray-400">alex@bittobyte: ~/whoami</span>
    </div>
    <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-gray-300">
      <span className="text-purple-400">const</span> <span className="text-[#b5f53c]">alex</span>{' '}
      <span className="text-gray-400">=</span> {'{'}
      {'\n'} <span className="text-sky-300">role</span>:{' '}
      <span className="text-amber-300">&quot;AI &amp; Automation Engineer&quot;</span>,{'\n'}{' '}
      <span className="text-sky-300">stack</span>: [
      <span className="text-amber-300">&quot;Python&quot;</span>,{' '}
      <span className="text-amber-300">&quot;SQL&quot;</span>,{' '}
      <span className="text-amber-300">&quot;TensorFlow&quot;</span>,{' '}
      <span className="text-amber-300">&quot;PLCs&quot;</span>],
      {'\n'} <span className="text-sky-300">languages</span>: [
      <span className="text-amber-300">&quot;EN&quot;</span>,{' '}
      <span className="text-amber-300">&quot;ES&quot;</span>,{' '}
      <span className="text-amber-300">&quot;FR*&quot;</span>,{' '}
      <span className="text-amber-300">&quot;DE*&quot;</span>],{' '}
      <span className="text-gray-400">// *in progress</span>
      {'\n'} <span className="text-sky-300">superpower</span>:{' '}
      <span className="text-amber-300">&quot;efficiency&quot;</span>,{'\n'}{' '}
      <span className="text-sky-300">fuel</span>:{' '}
      <span className="text-amber-300">&quot;coffee&quot;</span>,{'\n'}
      {'}'};{'\n'}
      <span className="text-gray-400">{'>'}</span>{' '}
      <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[#b5f53c]" />
    </pre>
  </div>
);

const AboutMe = () => (
  <section id="about" className="mx-auto max-w-6xl px-6 pt-10 pb-24 md:pt-16">
    <Reveal>
      <h2 className="mb-3 text-center text-3xl font-bold">About Me</h2>
    </Reveal>
    <Reveal delay={80}>
      <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
        The short version: an engineer who turns &quot;this takes forever&quot; into &quot;done
        already?&quot;
      </p>
    </Reveal>

    {/* min-w-0 on both columns: a grid item's `min-width: auto` is its content-based
        minimum, and the terminal card's <pre> (white-space: pre) reports its longest
        line as that minimum. Without this the track is forced past the viewport on
        mobile and the whole page scrolls sideways; with it the <pre> scrolls itself. */}
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="min-w-0 space-y-4 leading-relaxed text-gray-400">
        <Reveal as="p">
          I&apos;m Alex. Engineer, coder, and genius (still working on the billionaire, playboy,
          philanthropist part). Basically the guy you call when your automation stops automating. I
          build <span className="text-[#b5f53c]">SCADA systems</span>, train my AIs like
          they&apos;re my pets, and design tools that make slow work fast. Python, SQL, TensorFlow,
          PLCs. Yeah, I speak fluent machine.
        </Reveal>
        <Reveal as="p" delay={80}>
          Human languages? English and Spanish are a given. French and German are the bonus DLC
          I&apos;m currently unlocking.
        </Reveal>
        <Reveal as="p" delay={160}>
          When I&apos;m not making machines smarter, I&apos;m automating my own life, playing
          baseball, or taking things apart just to prove I can put them back together better.
          Efficiency is my superpower, coffee just keeps it running at max RPM.
        </Reveal>
        <Reveal as="p" delay={240}>
          I also run{' '}
          <a href="https://bittobyte.qzz.io" className="text-[#b5f53c] hover:text-[#c9fa6b]">
            BitToByte
          </a>
          , the studio where my products live. Check out the projects below, and if you like what
          you see, hit me up in the contact section.
        </Reveal>

        <Reveal delay={120}>
          <div className="flex flex-wrap gap-3 pt-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b5f53c]/40 hover:text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={120} className="min-w-0">
        <TerminalCard />
      </Reveal>
    </div>

    {/* Seamless stack marquee (content duplicated so -50% loops cleanly) */}
    <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-3">
        {[...TECH, ...TECH].map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="whitespace-nowrap rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-sm text-gray-400"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  </section>
);

const Projects = () => {
  const { featured, more, archive } = groupedProjects();

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="mb-3 text-center text-3xl font-bold">Projects</h2>
      <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
        The full catalog: from live full-stack products to data experiments and finished builds that
        ship as writeups. The polished ones also power the{' '}
        <a href="https://bittobyte.qzz.io" className="text-[#b5f53c] hover:text-[#c9fa6b]">
          BitToByte
        </a>{' '}
        studio.
      </p>

      <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-200">
        Featured work
      </h3>
      <ProjectGrid projects={featured} />

      <h3 className="mb-6 mt-16 text-sm font-semibold uppercase tracking-widest text-gray-200">
        More projects
      </h3>
      <ProjectGrid projects={more} />

      <h3 className="mb-3 mt-16 text-sm font-semibold uppercase tracking-widest text-gray-200">
        Case studies
      </h3>
      <p className="mb-6 max-w-2xl text-sm text-gray-400">
        Hackathon, capstone, and coursework builds that were never meant to stay hosted. Each one is
        written up instead: what the problem was, how it was solved, and what came out of it.
      </p>
      <ArchiveList projects={archive} />
    </section>
  );
};

export default function Home() {
  usePageMeta(
    'Alejandro Martínez | AI & Automation Engineer',
    'Alejandro Martínez, AI & Automation Engineer. SCADA systems, machine learning, data pipelines, and full-stack apps.'
  );

  return (
    <>
      <section
        id="home"
        className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center px-6 text-center"
      >
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Hola, my name is Alejandro.
          </h1>
          <p className="text-xl italic text-gray-400">(but you can call me Alex)</p>
          <p className="max-w-xl text-gray-400">
            AI &amp; Automation Engineer | Software Developer | Data-Driven Problem Solver
          </p>
          <a
            href="#projects"
            className="rounded-full bg-[#b5f53c] px-8 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-[#b5f53c]/25 transition-transform hover:scale-105"
          >
            View My Work
          </a>
        </div>

        <a
          href="#about"
          aria-label="Scroll to About Me"
          className="absolute bottom-8 animate-float text-gray-400 transition-colors hover:text-[#b5f53c]"
        >
          <ChevronDown className="h-6 w-6" />
        </a>
      </section>

      <AboutMe />

      <ExperienceStrip />

      <Projects />

      <Contact />
    </>
  );
}

import { Link } from 'react-router-dom';
import { Reveal } from '@alex_mtz/bittobyte-ui';
import { ArrowRight, Briefcase, GraduationCap } from 'lucide-react';
import { experience, education } from '../data/resume';

const ACCENT = '#b5f53c';

// Condensed CV preview for the home page. The full record lives at /resume; this
// exists so a visitor can see the shape of the career without leaving the page,
// which is the difference between a portfolio and a CV site.
const ExperienceStrip = () => (
  <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
    <Reveal>
      <h2 className="mb-3 text-center text-3xl font-bold">Experience</h2>
    </Reveal>
    <Reveal delay={80}>
      <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
        Ten years across both sides of automation: control systems on the plant floor, and the data
        and AI work that sits on top of them.
      </p>
    </Reveal>

    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="min-w-0">
        <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-200">
          <Briefcase className="h-4 w-4" aria-hidden="true" />
          Roles
        </h3>

        {/* The rail is drawn on the list itself so it can never outrun the last item. */}
        <ol className="relative space-y-6 border-l border-white/10 pl-6">
          {experience.map((role, i) => (
            <Reveal as="li" key={role.id} delay={i * 70} className="relative">
              <span
                /* rail is the ol's left border, 1.5rem (pl-6) left of the li; back off
                   another half-dot so the marker sits centred on it */
                className="absolute -left-[1.8125rem] top-1.5 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: role.current ? ACCENT : '#4b5563' }}
                aria-hidden="true"
              />
              <p className="font-semibold text-gray-100">
                {role.role}
                {role.note && <span className="ml-2 text-sm text-gray-400">({role.note})</span>}
              </p>
              <p className="text-sm text-gray-400">
                {role.org} · {role.location}
              </p>
              <p className="mt-0.5 font-mono text-xs text-gray-400">
                {role.start} – {role.end}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="min-w-0">
        <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-200">
          <GraduationCap className="h-4 w-4" aria-hidden="true" />
          Education
        </h3>

        <ul className="space-y-5">
          {education.map((item, i) => (
            <Reveal as="li" key={item.credential} delay={i * 70}>
              <p className="font-semibold text-gray-100">{item.credential}</p>
              <p className="text-sm text-gray-400">{item.school}</p>
              <p className="mt-0.5 font-mono text-xs text-gray-400">{item.years}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={240}>
          <Link
            to="/resume"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-gray-300 transition-all hover:border-[#b5f53c]/40 hover:bg-white/10 hover:text-white"
          >
            Full resume
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </Reveal>
      </div>
    </div>
  </section>
);

export default ExperienceStrip;

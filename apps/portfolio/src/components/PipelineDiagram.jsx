import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';

// Architecture diagrams for the case studies, keyed by the `diagram` field in
// src/data/caseStudies.js.
//
// These are laid out as flowing stages rather than drawn as fixed-viewBox SVG,
// for two reasons: the content is real text so screen readers get the actual
// pipeline instead of an alt-text summary, and stages reflow to a vertical
// stack on a phone instead of forcing a horizontal scroll.
const PIPELINES = {
  expressEntry: {
    caption: 'Daily sync path, from the government feed to a notified subscriber.',
    stages: [
      { label: 'Source', items: ['IRCC JSON feed'] },
      { label: 'Detect', items: ['checker.py', 'set difference vs stored draw numbers'] },
      { label: 'Store', items: ['Supabase Postgres', 'draws + sync_runs'] },
      { label: 'Serve', items: ['FastAPI on Vercel', '/api/draws'] },
      { label: 'Render', items: ['React + Vite', 'regression, gaps, predictions'] },
    ],
    branch: {
      label: 'Only when new draws exist',
      items: ['notifier.py claims the draw', 'Resend batch send', 'confirm / unsubscribe'],
    },
  },

  mcu: {
    caption: 'One dataset, three orders, all derived rather than maintained by hand.',
    stages: [
      { label: 'Catalog', items: ['54 titles', '80 prerequisite edges, each with a note'] },
      { label: 'Validate on load', items: ['curated chronology asserted to be a valid topo sort'] },
      {
        label: 'Graph engine',
        items: ['Kahn topological sort', 'cycle detection', 'transitive closure, longest path'],
      },
      { label: 'Queries', items: ['release order', 'chronological order', 'prerequisite chain'] },
    ],
  },

  monorepo: {
    caption: 'How one component change reaches every property.',
    stages: [
      { label: 'Source', items: ['packages/ui', 'packages/content'] },
      { label: 'Link', items: ['pnpm workspace', 'Turborepo builds ui first'] },
      { label: 'Workspace apps', items: ['landing', 'portfolio'] },
      { label: 'External apps', items: ['Express Entry', 'Checklist', 'plain-CSS footer only'] },
    ],
  },

  provenance: {
    caption: 'One verification pass over a multi-tier supply chain.',
    stages: [
      { label: 'Issue', items: ['supplier signs an attestation', 'Ed25519, content-addressed'] },
      { label: 'Submit', items: ['DAG of attestations', 'parents referenced by content hash'] },
      {
        label: 'Verify',
        items: ['every signature against the key registry', 'parent links resolved'],
      },
      {
        label: 'Detect',
        items: ['deterministic checks first', 'statistical pass only on a clean chain'],
      },
      {
        label: 'Answer',
        items: ['Canadian content %', 'last substantial transformation', 'verdict + attribution'],
      },
    ],
  },

  hiretech: {
    caption: 'From a Teams meeting to a scored PDF report.',
    stages: [
      { label: 'Authenticate', items: ['MSAL OAuth', 'corporate tenant'] },
      { label: 'Fetch', items: ['Microsoft Graph', 'meetings and transcripts'] },
      {
        label: 'Extract',
        items: ['fuzzy match against the question bank', 'question / answer pairs'],
      },
      {
        label: 'Score',
        items: ['100-point rubric', 'Phi-4 · LLaMA 3.2 · Mistral', 'fixed output format'],
      },
      { label: 'Report', items: ['parsed scores + reasoning', 'PDF evaluation'] },
    ],
  },

  ragQa: {
    caption: 'Four pipelines that differ in exactly one place.',
    stages: [
      { label: 'Extract', items: ['PyMuPDF', 'grade 6 to 7 textbooks'] },
      {
        label: 'Chunk, four ways',
        items: ['sentence · 11,923', 'paragraph · 2,982', 'token · 1,708', 'hybrid · 622'],
      },
      { label: 'Embed', items: ['all-MiniLM-L6-v2', 'one FAISS IndexFlatL2 per strategy'] },
      { label: 'Retrieve', items: ['top 3 chunks', 'identical prompt across all four'] },
      {
        label: 'Answer & score',
        items: ['LLaMA 3.2 via Ollama', 'Streamlit, manual score to CSV'],
      },
    ],
  },

  notion: {
    caption: 'The loop that keeps Notion itself the source of truth.',
    stages: [
      { label: 'Fetch', items: ['Notion API', 'paginated, cached 5 minutes'] },
      { label: 'Build', items: ['parent-child tree', 'leaves are the real tasks'] },
      {
        label: 'Rank',
        items: ['LLM reads full task context', 'strict JSON: hierarchy + priority'],
      },
      { label: 'Write back', items: ['number columns in Notion', 'visible in the workspace'] },
    ],
    branch: {
      label: 'User signal, fed back in',
      items: ['Done today · Not today · To do today', 'counters, frequency, last-done date'],
    },
  },
};

const Chip = ({ children, accent }) => (
  <li
    className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-gray-300"
    style={{ borderLeftColor: accent, borderLeftWidth: '2px' }}
  >
    {children}
  </li>
);

const Stage = ({ label, items, accent }) => (
  <div /* basis only once the stages sit side by side: in the mobile column
        layout flex-basis is a height, and 11rem of it per stage is dead space */
    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:basis-44"
  >
    <p
      className="mb-3 text-[11px] font-semibold uppercase tracking-widest"
      style={{ color: accent }}
    >
      {label}
    </p>
    <ul className="space-y-1.5">
      {items.map((item) => (
        <Chip key={item} accent={accent}>
          {item}
        </Chip>
      ))}
    </ul>
  </div>
);

// Between stages horizontally on wide screens, and rotated to point downward
// once the stages stack. Decorative: the stage order is already conveyed by the
// document order of the list itself.
const Connector = ({ accent }) => (
  <ChevronRight
    aria-hidden="true"
    className="h-5 w-5 shrink-0 self-center rotate-90 text-gray-400 lg:rotate-0"
    style={{ color: accent, opacity: 0.55 }}
  />
);

const PipelineDiagram = ({ name, accent = '#b5f53c' }) => {
  const pipeline = PIPELINES[name];
  if (!pipeline) return null;

  const { stages, caption, branch } = pipeline;

  return (
    <figure className="m-0">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-1">
        {stages.map((stage, i) => (
          <Fragment key={stage.label}>
            {i > 0 && <Connector accent={accent} />}
            <Stage {...stage} accent={accent} />
          </Fragment>
        ))}
      </div>

      {branch && (
        <div className="mt-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {branch.label}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {branch.items.map((item) => (
              <Chip key={item} accent={accent}>
                {item}
              </Chip>
            ))}
          </ul>
        </div>
      )}

      <figcaption className="mt-3 text-sm text-gray-400">{caption}</figcaption>
    </figure>
  );
};

export default PipelineDiagram;

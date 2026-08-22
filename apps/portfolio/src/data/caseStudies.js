// Long-form writeups rendered at /work/<slug>.
//
// Keyed by the project `id` in @bittobyte/content. That package stays the shared
// projects list (the landing page reads it too); these writeups are portfolio-only,
// so they live here instead of being pushed into the shared package.
//
// Ground rule for this file: every number traces to the code, the repo, or
// Alejandro's own record of the project. Nothing is estimated to sound better.

export const caseStudies = {
  // ---------------------------------------------------------------- live work
  'express-entry': {
    headline: 'Turning an IRCC JSON feed into an answer people can act on',
    meta: { role: 'Solo build', dates: '2025 to present', status: 'Live and self-updating' },
    context:
      'Immigration, Refugees and Citizenship Canada publishes every Express Entry draw as a raw JSON feed. It is complete and it is useless: no trend, no context, no way to tell whether a CRS score of 491 is close or hopeless. Candidates end up scraping it into spreadsheets by hand.',
    problem:
      'The feed changes without warning, sometimes twice in a week and sometimes not for a month. Anything built on it has to notice a new draw on its own, work out that it is genuinely new rather than a reordered payload, and get the update in front of people without anyone remembering to press a button.',
    approach: [
      {
        title: 'Change detection instead of polling blindly',
        body: 'lib/checker.py takes a set difference between the draw numbers in the IRCC feed and the ones already in Postgres. Nothing downstream runs unless that difference is non-empty, so a refresh that finds nothing new costs one request and writes nothing.',
      },
      {
        title: 'A notification outbox, not a send loop',
        body: 'lib/notifier.py claims a draw before sending, so a retry or a second concurrent refresh cannot double-notify the same subscriber. The email client in lib/emailer.py is written to never raise: a failed send degrades the notification, it does not take down the sync.',
      },
      {
        title: 'Two schedulers, deliberately',
        body: 'The primary path is a scheduled refresh on Vercel. A GitHub Actions workflow pings /api/refresh every three hours between 09:00 and 21:00 UTC as a backup, so the dashboard stays current even if the platform scheduler is having a bad day.',
      },
      {
        title: 'Statistics on the client',
        body: 'src/utils/stats.js does the linear regression, gap computation, and CRS prediction in the browser against data already fetched, which keeps the serverless functions doing one job: moving data.',
      },
    ],
    stack: [
      { group: 'Frontend', items: ['React 18', 'Vite', 'Tailwind CSS'] },
      { group: 'Backend', items: ['Python 3.11', 'FastAPI', 'Mangum'] },
      { group: 'Data', items: ['Supabase (Postgres)', 'IRCC official JSON feed'] },
      { group: 'Platform', items: ['Vercel serverless', 'GitHub Actions', 'Resend'] },
    ],
    outcome: [
      'Live at EE.bittobyte.qzz.io, refreshing itself without manual intervention.',
      'Trend charts, CRS predictions, a score checker, and the full searchable draws table in one page.',
      'Email notifications carrying per-draw statistics, with confirm and unsubscribe flows.',
      'Started as a Python ETL script publishing to GitHub Pages, then migrated to FastAPI, Postgres, and Vercel once the data outgrew a static build.',
    ],
    diagram: 'expressEntry',
    links: [
      { label: 'Live site', href: 'https://EE.bittobyte.qzz.io' },
      { label: 'GitHub', href: 'https://github.com/AlexMtzRmz0212/ExpressEntryDrawsAnalysis' },
    ],
  },

  'daily-checklist': {
    headline: 'Letting a model do the part of task management nobody enjoys',
    meta: { role: 'Solo build', dates: '2025 to present', status: 'Live' },
    context:
      'Every task app can store a list. None of them will tell you which item to do next, because ranking is judgement, and judgement is exactly what a to-do list refuses to make on your behalf.',
    problem:
      'Prioritising by hand is the work you avoid by making the list in the first place. A useful sorter has to score each task against urgency and importance, then reorder the list visibly enough that the change is trusted rather than suspected.',
    approach: [
      {
        title: 'The model scores, the app sorts',
        body: 'An LLM evaluates each task and places it on the Eisenhower matrix. Scoring is the only thing the model is trusted with; ordering, persistence, and display are ordinary deterministic code, so a bad response degrades one score instead of scrambling the list.',
      },
      {
        title: 'Animate the reorder',
        body: 'Framer Motion moves each row from its old position to its new one instead of swapping the list out. Watching a task climb is what makes the ranking legible; a silent re-render just looks like a bug.',
      },
      {
        title: 'Provider-agnostic model access',
        body: 'Calls go through OpenRouter with the model named in configuration, so swapping models is an environment variable rather than a code change.',
      },
    ],
    stack: [
      { group: 'Frontend', items: ['React', 'Framer Motion', 'Vite'] },
      { group: 'Backend', items: ['FastAPI', 'httpx', 'Pydantic'] },
      { group: 'Data', items: ['Neon Postgres'] },
      { group: 'Model', items: ['OpenRouter'] },
    ],
    outcome: [
      'Live at checklist.bittobyte.qzz.io.',
      'Real-time scoring with animated re-ordering, so the reasoning is visible in the motion.',
      'One-command local start for both servers, which is what kept it in daily personal use.',
    ],
    diagram: null,
    links: [
      { label: 'Live site', href: 'https://checklist.bittobyte.qzz.io' },
      { label: 'GitHub', href: 'https://github.com/AlexMtzRmz0212/Daily-Checklist' },
    ],
  },

  'mcu-timeline': {
    headline: 'A watch order is a graph problem wearing a list costume',
    meta: { role: 'Solo build', dates: '2026', status: 'Live' },
    context:
      'Every Marvel viewing-order article is a numbered list, and every numbered list is one person’s opinion presented as fact. The interesting question is not "what is number 12", it is "if I want to watch this one tonight, what do I actually need to have seen first, and why".',
    problem:
      'Release order is derived from dates and chronological order is editorial, but prerequisites are a real structure: a directed acyclic graph. Hand-numbering any of the three orders guarantees they drift apart the moment a title is added.',
    approach: [
      {
        title: 'Edges are the source of truth',
        body: 'The catalog holds 54 titles and 80 hand-written prerequisite edges, each carrying a note explaining why the dependency exists. Array position is the chronological order and release order is derived from dates, so neither is hand-numbered and neither can drift.',
      },
      {
        title: 'A graph engine that knows nothing about the web',
        body: 'backend/app/core/graph.py does Kahn topological sort with deterministic tie-breaking, cycle detection, transitive closure with longest-path depth, and order validation. It imports nothing from SQLAlchemy or FastAPI, which is why its tests run in milliseconds with no fixtures.',
      },
      {
        title: 'Let the loader catch the authoring mistakes',
        body: 'On load, the curated chronology is asserted to be a valid topological sort of the edges. One check, and most bad edits fail at startup instead of shipping as a wrong answer.',
      },
      {
        title: 'Longest path, not shortest',
        body: 'Prerequisite depth is measured by longest path to the target. Shortest path would draw a title earlier than something it actually depends on, which is the one thing the diagram exists to prevent.',
      },
    ],
    stack: [
      { group: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS'] },
      { group: 'Backend', items: ['FastAPI', 'SQLAlchemy', 'PostgreSQL'] },
      { group: 'Auth', items: ['JWT'] },
      { group: 'Platform', items: ['Vercel'] },
    ],
    outcome: [
      'Live at marvel.bittobyte.qzz.io.',
      'Release, chronological, and custom orders all derived from one dataset rather than maintained separately.',
      'Pick any title and get its full prerequisite chain, with a stated reason on every edge.',
    ],
    diagram: 'mcu',
    links: [
      { label: 'Live site', href: 'https://marvel.bittobyte.qzz.io' },
      { label: 'GitHub', href: 'https://github.com/AlexMtzRmz0212/MARVEL' },
    ],
  },

  'bittobyte-hub': {
    headline: 'Four sites, one navbar, no version drift',
    meta: { role: 'Solo build', dates: '2026', status: 'Live' },
    context:
      'BitToByte runs as four separate properties on four subdomains: the studio landing page, this portfolio, the Express Entry dashboard, and the task sorter. They should read as one brand, and for a while they did not.',
    problem:
      'The shared component library was published to NPM and installed separately in each site, so the landing page and the portfolio ended up running different versions of the same navbar. Every brand change turned into a publish, version, reinstall cycle across repositories, and whichever site was updated last was the only one that looked right.',
    approach: [
      {
        title: 'Workspace links, not version numbers',
        body: 'The two React sites moved into one pnpm workspace and consume the library through a local link. A change to a component reaches both apps immediately, with no publish step in between.',
      },
      {
        title: 'Independent deploys inside one repo',
        body: 'Each app is its own Vercel project pointed at its own folder, with turbo-ignore as the ignored build step. Turborepo builds the library first, and a change to one app only redeploys that app.',
      },
      {
        title: 'One projects list feeding two sites',
        body: 'A shared content package holds every project once. The portfolio renders the full catalog; the landing page renders only the entries flagged as featured. Adding a project is one edit, and it cannot go missing from either site.',
      },
      {
        title: 'Knowing when the shared component does not fit',
        body: 'The Express Entry and Checklist apps could not take the library: it ships Tailwind 4 compiled CSS, and both are Tailwind 3 apps whose PostCSS pipeline errors on the v4 syntax. Rather than force a breaking migration on two working products, each got a small self-contained cross-link footer in plain inline styles. All four properties still cross-link; only two of them share code.',
      },
    ],
    stack: [
      { group: 'Library', items: ['React 19', 'Tailwind CSS 4', 'Vite library build'] },
      { group: 'Tooling', items: ['pnpm workspaces', 'Turborepo', 'ESLint', 'Prettier'] },
      { group: 'Platform', items: ['Vercel', 'NPM'] },
    ],
    outcome: [
      'Published as @alex_mtz/bittobyte-ui, consumed by the workspace apps through a link and by the external apps through NPM.',
      'Per-site accent props and CSS custom properties drive the theming, so each property keeps its own hue against shared chrome.',
      'Cookie consent, the cross-link footer, and the legal links ship once and apply everywhere.',
    ],
    diagram: 'monorepo',
    links: [
      { label: 'Live site', href: 'https://bittobyte.qzz.io' },
      { label: 'GitHub', href: 'https://github.com/AlexMtzRmz0212/BitToByte' },
    ],
  },

  // ------------------------------------------------------------------ archive
  'acra-provenance': {
    headline: 'Making "Made in Canada" something a buyer can check',
    meta: {
      role: 'Team build with ACRA',
      team: 'Verified Canadian Supply Chains Hackathon',
      org: 'Bayview Yards, Ottawa',
      dates: 'May 2026',
      status: 'Hackathon build, not hosted',
    },
    context:
      'The Red Team Hackathon Series stop in Ottawa set one challenge: cryptographic provenance for Buy Canadian procurement, with the Canadian drone sector as the case study. Ten teams, up to five people each, a 20,000 dollar prize pool. ACRA entered as a start-up team.',
    problem:
      'Today a "Product of Canada" label is a claim a company prints on a box. Nobody downstream can check it, because origin data is self-reported and lives in whichever spreadsheet each supplier keeps. The challenge asked for a supplier attestation flow, a purchaser lookup, cross-tier provenance linking, and detection of tampering, forgery, and replay, all while computing an actual Canadian-content percentage.',
    approach: [
      {
        title: 'Every supplier signs their own step',
        body: 'Each tier issues an attestation covering what it did, what inputs it consumed, and where the work happened, signed with its own Ed25519 key and content-addressed. Change one byte afterwards and the signature stops verifying.',
      },
      {
        title: 'Verification walks the graph, not a list',
        body: 'A submission is a multi-tier DAG of attestations. The backend indexes it, resolves parent references by content hash, and verifies every signature against a supplier key registry before any figure is computed.',
      },
      {
        title: 'Two tiers of anomaly detection',
        body: 'Deterministic detectors fire only on certain structural violations, so they never false-positive on a clean chain: signature_invalid, signature_unknown_supplier, parent_hash_mismatch, dangling_parent, unit_mismatch, timestamp_inversion, replay_within_chain, circular_reference, and mass_balance_violation. Statistical detectors for origin, timing, and labour rate run as a second pass only after the chain passes every deterministic check.',
      },
      {
        title: 'Attribution is part of the answer',
        body: 'Each anomaly points at a specific attestation, chosen by a rule per type: a parent hash mismatch is attributed to the consuming child, a mass balance violation to the parent whose budget was over-consumed, a circular reference to the product leaf. Saying the chain is broken is not useful; saying which supplier broke it is.',
      },
      {
        title: 'Content percentage against the real thresholds',
        body: 'Cost is rolled up by country across the chain, then the Competition Bureau thresholds decide the label: 98 percent for Product of Canada, 51 percent for Made in Canada, and both require that the last substantial transformation happened in Canada. The qualifying transformation closest to the leaf wins, measured by hop distance.',
      },
      {
        title: 'A demo built around one moment',
        body: 'The React frontend has an Issue tab where a supplier signs a record and a Verify tab where a buyer scans a QR code and gets a verdict. The demo tampers with one Canadian supplier attestation, re-verifies the same product, and the verdict flips to FLAGGED with the broken signature named. That flip is the whole argument.',
      },
    ],
    stack: [
      { group: 'Backend', items: ['Python', 'FastAPI', 'Pydantic'] },
      {
        group: 'Cryptography',
        items: ['Ed25519', 'content addressing', '@noble/ed25519', '@noble/hashes'],
      },
      { group: 'Frontend', items: ['React 18', 'Vite', 'html5-qrcode', 'qrcode.react'] },
      { group: 'Delivery', items: ['Docker', 'docker-compose'] },
    ],
    outcome: [
      'A working end-to-end system inside the hackathon window: supplier issuance, purchaser verification, cross-tier linking, anomaly classification, and a Canadian-content figure.',
      'Sample chains covering each failure mode the challenge named: tampered, unknown signer, quantity inconsistency, missing reference, cycle, and both designation outcomes.',
      'Bilingual interface, matching the procurement context it was built for.',
      'ACRA is listed as a participating team for the Ottawa event. No placement.',
    ],
    diagram: 'provenance',
    links: [],
    note: 'The build lives in a shared team repository rather than a personal one, so no repo link is published here.',
  },

  'hiretech-genius': {
    headline: 'Scoring interview answers without asking a human to re-read them',
    meta: {
      role: 'Team of 4: full-stack and prompt engineering',
      team: 'Applied Technology Project, client One.Six Digital Inc.',
      org: 'AISD, Algonquin College',
      dates: 'Sep 2024 to Apr 2025',
      status: 'Capstone, not hosted',
    },
    context:
      'A technical interview produces a transcript nobody wants to read twice. The client wanted the second read automated: pull the recording, work out what was asked and answered, and score the answers consistently enough that two reviewers would agree.',
    problem:
      'Consistency is the hard part. Ask a model to rate an answer and you get a different scale every run. The interviews also live inside a corporate Microsoft tenant, so the data path has to authenticate as the organisation rather than scrape anything.',
    approach: [
      {
        title: 'Go through Microsoft Graph, not around it',
        body: 'MSAL handles the OAuth flow against the tenant; the app then lists meetings and pulls transcripts through Graph. Authentication is the feature, not a detail: without it there is no legitimate route to the data.',
      },
      {
        title: 'A rubric with a fixed point budget',
        body: 'Answers are scored out of 100 across four weighted categories: completeness 30, accuracy 30, explanation quality 25, relevance 15. Each category breaks into named sub-criteria with their own point values, down to five points for whether the answer addresses edge cases. The model is not asked for an opinion, it is asked to fill in a scorecard.',
      },
      {
        title: 'Constrain the output format, then parse it',
        body: 'The prompt specifies the exact response shape and forbids commentary outside it, so reasoning and per-category scores can be parsed deterministically instead of coaxed out of prose.',
      },
      {
        title: 'Three models, run locally',
        body: 'Phi-4, LLaMA 3.2, and Mistral are all wired through LangChain against a self-hosted Ollama endpoint, so answers can be compared across models and no interview content leaves the client infrastructure.',
      },
      {
        title: 'Fuzzy matching for question extraction',
        body: 'Transcript text never matches the question bank exactly. Extraction uses fuzzy string matching against a curated question and answer set to pair each spoken answer with the question it belongs to.',
      },
    ],
    stack: [
      { group: 'Backend', items: ['Flask', 'SQLAlchemy', 'SQLite'] },
      { group: 'Identity', items: ['MSAL', 'Microsoft Graph API'] },
      { group: 'Models', items: ['LangChain', 'Ollama', 'Phi-4', 'LLaMA 3.2', 'Mistral'] },
      { group: 'Frontend', items: ['React'] },
      { group: 'Data', items: ['pandas', 'NLTK', 'fuzzywuzzy'] },
    ],
    outcome: [
      'End-to-end pipeline from Teams meeting to parsed transcript to scored evaluation to PDF report.',
      'Delivered with a team of four, covering full-stack development, prompt engineering, and stakeholder presentations.',
      'Every evaluation logged with its reasoning, so a score can be argued with rather than just accepted.',
    ],
    diagram: 'hiretech',
    links: [],
    note: 'Client capstone. The code is not published, so there is no repository link.',
  },

  'rag-qa-education': {
    headline: 'Four chunking strategies, one set of questions, one honest comparison',
    meta: {
      role: 'Solo build',
      org: 'AISD, Algonquin College',
      dates: 'Jan to Apr 2025',
      status: 'Coursework, not hosted',
    },
    context:
      'Retrieval-augmented generation is usually presented with one chunking strategy already chosen, as if the choice were obvious. It is not, and it moves answer quality more than the model does.',
    problem:
      'To compare chunking strategies fairly you have to hold everything else still: same source documents, same embedding model, same retrieval depth, same prompt, same judge. Anything less and you are comparing pipelines, not chunkers.',
    approach: [
      {
        title: 'One corpus, four ways of cutting it',
        body: 'Open-source grade 6 and 7 Geography and History textbooks are extracted with PyMuPDF, then chunked four ways from identical cleaned text: sentence windows of three with two-sentence overlap, 200-token windows with a 50-token stride using the BERT WordPiece tokenizer, paragraph splits, and a hybrid. The paragraph chunker falls back to six-sentence windows when a PDF has no real paragraph breaks, which most textbook exports do not.',
      },
      {
        title: 'The strategies produce very different corpora',
        body: 'From the same books: 11,923 sentence chunks, 2,982 paragraph chunks, 1,708 token chunks, and 622 hybrid chunks. An order of magnitude between the extremes, which is exactly why the comparison is worth running.',
      },
      {
        title: 'Four indexes, identical construction',
        body: 'Each chunk set is embedded with all-MiniLM-L6-v2 and written to its own FAISS IndexFlatL2, with chunk metadata pickled alongside so a retrieved vector traces back to its source PDF. Same model, same index type, same batch size across all four.',
      },
      {
        title: 'Same prompt, same k, same judge',
        body: 'Retrieval takes the top 3 chunks and builds an identical history-tutor prompt for LLaMA 3.2 running locally through Ollama. The Streamlit interface switches strategy on the same question and scores the answer by hand, logging every run to CSV.',
      },
    ],
    stack: [
      { group: 'Ingestion', items: ['PyMuPDF', 'NLTK', 'HuggingFace tokenizers'] },
      {
        group: 'Retrieval',
        items: ['SentenceTransformers (all-MiniLM-L6-v2)', 'FAISS IndexFlatL2'],
      },
      { group: 'Generation', items: ['LLaMA 3.2', 'Ollama'] },
      { group: 'Interface', items: ['Streamlit', 'pandas'] },
      { group: 'Compute', items: ['CUDA when available, CPU fallback'] },
    ],
    outcome: [
      'A working comparison rig where the chunking strategy is the only variable that moves.',
      'Average manual score of 10.5 out of 12 across the evaluated question set.',
      'Streamlit interface for real-time querying and manual scoring, with every run logged for later analysis.',
    ],
    diagram: 'ragQa',
    links: [],
    note: 'The repository is private. Happy to walk through the code directly.',
  },

  'resume-rag-chatbot': {
    headline: 'Grounding resume generation in real resumes',
    meta: {
      role: 'Solo build',
      org: 'AISD, Algonquin College',
      dates: 'Feb to Apr 2025',
      status: 'Coursework, not hosted',
    },
    context:
      'Ask a bare LLM for a resume and it invents a plausible person. The output reads well and describes nobody, because the model has no material to work from beyond the job description you pasted.',
    problem:
      'The fix is retrieval, but the corpus has to be built first: three separate public resume datasets, each with its own column names, formats, and idea of what a field means.',
    approach: [
      {
        title: 'Normalise before embedding',
        body: 'Resume records from multiple CSV sources are parsed into one schema, with metadata validation and alias resolution so the same field arriving under three different names collapses into one. The cleaned corpus is written to JSON for retrieval.',
      },
      {
        title: 'Retrieve, then prompt',
        body: 'The user supplies a job description. The system embeds it, pulls the relevant resume material as context, and builds a single prompt combining that input with the retrieved examples before sending it to the model.',
      },
      {
        title: 'Keep the model local',
        body: 'LangChain against LLaMA 3.2 in Ollama, so the whole pipeline runs on hardware you control and the resume data never leaves it.',
      },
      {
        title: 'Iteration and export in the loop',
        body: 'The response is editable and can be resent with a follow-up prompt. When it is good, the app renders it to PDF on demand.',
      },
    ],
    stack: [
      { group: 'Web', items: ['Django'] },
      { group: 'Retrieval', items: ['LangChain', 'LangChain Community'] },
      { group: 'Model', items: ['LLaMA 3.2', 'Ollama'] },
      { group: 'Data', items: ['3 public resume datasets', 'pandas'] },
    ],
    outcome: [
      'A working RAG chatbot that drafts a resume against a pasted job description and exports it as PDF.',
      'A unified resume schema built out of three inconsistent public datasets.',
      'Model, host, and port are configuration, so the pipeline is not tied to one local setup.',
    ],
    diagram: null,
    links: [
      { label: 'GitHub', href: 'https://github.com/AlexMtzRmz0212/RAG_Resume_Creator_Chatbot' },
    ],
  },

  'notion-automation': {
    headline: 'Two years of making a Notion workspace behave like a database',
    meta: {
      role: 'Personal project',
      dates: 'Jan 2023 to Sep 2024, extended since',
      status: 'Personal tooling, not hosted',
    },
    context:
      'Notion is a good place to keep things and a bad place to compute over them. Once a workspace holds a few hundred items across related databases, the useful questions all become queries the UI will not run.',
    problem:
      'A task tree where parents are categories and leaves are real tasks has no useful order. Sorting by due date ignores importance, sorting by status ignores urgency, and a manual priority column goes stale within a week of being filled in.',
    approach: [
      {
        title: 'Treat the API as the interface',
        body: 'Python against the Notion API, handling pagination, extracting the properties that matter (title, parent relation, status, due date, tags, description, done flag), and rebuilding the parent-child hierarchy in memory as a tree.',
      },
      {
        title: 'Let buttons in Notion feed the model',
        body: 'Buttons in the workspace write metadata the automation later reads. Done today increments a counter, stamps the last-done date, and pushes the next to-do date out by the task frequency. Not today pushes the date and increments the frequency. That history is what tells the model which items are habits, which are being avoided, and which the user has explicitly pulled forward.',
      },
      {
        title: 'Two numbers, written back',
        body: 'The model reads each leaf task with its full context and returns a hierarchy from 1 to 5 plus a priority rank within that level, as strict JSON. Both are written back into Notion as number columns, so the ranking is visible in Notion itself rather than trapped in the script.',
      },
      {
        title: 'Cache, and refresh on a timer',
        body: 'Workspace data is cached and refreshed every five minutes, so browsing the tree, filtering by status or tag, and searching do not each cost a round of API calls.',
      },
      {
        title: 'The same pattern, other datasets',
        body: 'The approach generalised. Separate automations sync an album catalog and a Letterboxd film history into their own Notion databases on the same fetch, normalise, and write-back loop.',
      },
    ],
    stack: [
      { group: 'Core', items: ['Python', 'Notion API', 'requests'] },
      { group: 'Interface', items: ['Streamlit'] },
      { group: 'Model', items: ['OpenAI GPT-3.5 / GPT-4'] },
      { group: 'Config', items: ['python-dotenv'] },
    ],
    outcome: [
      'A task tree that ranks itself and writes the ranking back where the work actually lives.',
      'Filtering by status, tag, and free text, plus status changes pushed straight back to Notion from the app.',
      'The same fetch, normalise, and write-back pattern reused across three separate workspaces.',
    ],
    diagram: 'notion',
    links: [{ label: 'GitHub', href: 'https://github.com/AlexMtzRmz0212/Notion_Albums' }],
    note: 'The task-tree repository is private; the album sync is public and shows the same pattern.',
  },
};

export const hasCaseStudy = (id) => Object.prototype.hasOwnProperty.call(caseStudies, id);

// CV content for /resume.
//
// Source of truth: Alejandro's own text resume. Two clean-ups were applied when
// transcribing it here, because the source repeats itself:
//   • Transom Group and Daikin Applied each listed the same work twice in two
//     near-identical passes; merged into one deduplicated set per role.
//   • The skills section carried two overlapping lists (a prose "competencies"
//     version and a categorized version). The categorized one is kept.
//
// Deliberately NOT in this file: the phone number from the resume. This is a
// public page; email / LinkedIn / GitHub are enough to reach him.

export const profile = {
  name: 'Alejandro Martínez',
  title: 'AI & Automation Engineer',
  location: 'Ottawa, ON, Canada',
  summary:
    'Mechatronics engineer turned applied AI developer. Ten years of moving between the two sides of automation: SCADA and control systems on the plant floor, and LLM, RAG, and data pipeline work on top of them. Comfortable owning a problem end to end, from wiring up the data source to explaining the result to people who do not write code.',
  links: [
    { label: 'Email', href: 'mailto:alejandro.martinez.rmz97@gmail.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/alejandro-mtz' },
    { label: 'GitHub', href: 'https://github.com/AlexMtzRmz0212' },
  ],
};

// Engineering and technical employment, newest first. `detail` is the long-form
// account of the role, shown when the entry is expanded.
export const experience = [
  {
    id: 'fedethics',
    role: 'Data Analytics Team Lead',
    note: 'Volunteer / Pro Bono',
    org: 'FedEthics Inc.',
    location: 'Ottawa, ON',
    start: 'Feb 2026',
    end: 'Present',
    current: true,
    bullets: [
      'Lead a cross-functional technical team building and maintaining the analytics and content architecture behind FedEthics Inc.’s web platform and newsletter.',
      'Architected the GA4/GTM implementation: a shared gtag/dataLayer layer across 10+ pages with a custom event taxonomy tracking CTA clicks, downloads, and form submissions through two book conversion funnels.',
      'Implemented Google Consent Mode v2 with default-denied analytics storage and a custom cookie-consent banner, so no tracking data is collected before opt-in.',
      'Designed an AI editorial pipeline that writes and sends the biweekly newsletter end to end, with no manual writing step, from ingestion to send.',
    ],
    detail: {
      intro:
        'I own the analytics and content architecture for FedEthics Inc.’s web platform: the tracking layer that measures it, and an AI editorial pipeline that runs its newsletter without anyone writing a word by hand.',
      sections: [
        {
          title: 'Analytics architecture',
          body: 'A shared gtag/dataLayer layer runs across 10+ pages with a custom event taxonomy (event_category/event_label) tracking CTA clicks, downloads, and form submissions through two book conversion funnels: nav to hero CTA to offer to Stripe checkout.',
        },
        {
          title: 'Consent-first tracking',
          body: 'Google Consent Mode v2 ships with analytics storage default-denied, paired with a custom cookie-consent banner, so nothing is tracked before a visitor opts in, in line with the site’s Privacy Policy.',
        },
        {
          title: 'Ingestion and scoring',
          body: 'A daily GitHub Actions job scrapes and ingests articles from pluggable RSS/web-scraper connectors, scores them against a weighted keyword taxonomy, deduplicates near-identical stories by title similarity and URL matching, and buffers the top candidates over a rolling 14-day window.',
        },
        {
          title: 'AI-written issue generation',
          body: 'On a biweekly cadence the pipeline hands the buffered articles to the Claude API (Claude Sonnet), which selects the 4-6 most editorially valuable stories, writes analytical copy (headline, body, key takeaways, "hot take") for each in a defined editorial voice, and assembles the full issue as structured JSON, with retry/backoff logic for rate limits and malformed output.',
        },
        {
          title: 'Rendering and delivery',
          body: 'The structured output renders to branded HTML through a Jinja2 template and goes out through the Resend API, fully automated via scheduled GitHub Actions workflows. No human touches an edition from ingestion to send.',
        },
        {
          title: 'Full-stack integration',
          body: 'I oversee the integration connecting the site’s newsletter signup form to the backend subscriber and analytics logs, and direct iterative refactors of the tracking and pipeline codebases across the team’s commit history.',
        },
      ],
    },
  },
  {
    id: 'epic-cycles',
    role: 'Electromechanic Technician, E-Bikes & Scooters',
    org: 'Epic Cycles',
    location: 'Ottawa, ON',
    start: 'Aug 2025',
    end: 'Present',
    current: true,
    bullets: [
      'Run advanced electrical and mechanical diagnostics, repair, and service on Class 3 e-bikes, performance e-scooters, and electric dirt bikes, including controller tuning, motor calibration, and firmware updates.',
      'Assemble new electric vehicles and run final quality control before customer delivery.',
      'Install and configure performance components (custom controllers, braking systems, batteries) and support sales with product demos and consultations.',
      'Keep service documentation accurate and communicate clearly with customers through the whole repair.',
    ],
    detail: {
      intro:
        'I own the complete service lifecycle for Class 3 e-bikes, performance e-scooters, and electric dirt bikes, from customer intake to final repair delivery.',
      sections: [
        {
          title: 'Customer intake and diagnosis',
          body: 'I welcome the customer, listen to their description of the issue, then corroborate it by inspecting the relevant area. I collect usage habits, maintenance history, battery condition, previous repairs, and intermittent symptoms, document the vehicle’s external mechanical and electrical condition, open a work order, and give an upfront assessment fee estimate.',
        },
        {
          title: 'Assessment and repair planning',
          body: 'I run a full system inspection: display error codes, battery charge, throttle response, motor hall sensors, pedal assist, and BMS function. Then I call the customer, explain the verdict, propose solutions with cost and time estimates, and respect their decision to proceed, partially repair, or cancel. Rush jobs get slotted against the existing urgent queue.',
        },
        {
          title: 'Mechanical and electrical repairs',
          body: 'Brake pad replacement, hydraulic brake flush and refill, flat tire fixes, controller replacement, speed gear adjustment, throttle testing and replacement, cable soldering, BMS diagnosis and replacement, pedal assist diagnosis and replacement. Tools: Allen keys, wrenches, drills, multimeters, throttle testers, and motor hall sensor testers.',
        },
        {
          title: 'Assembly and quality control',
          body: 'I assemble new e-bikes and e-dirt bikes from unboxing to ride-ready. The QC checklist covers screw torque, chain tension, gear operation, brake pressure and sensor function, battery charge, throttle response, tire pressure to spec, tire alignment, and caliper centering.',
        },
        {
          title: 'Customer education and documentation',
          body: 'After a repair I explain what was done and why, and give maintenance guidance on tire pressure, brake pad checks, and tune-up intervals. If a repair runs past the estimate or uncovers something new, I call for approval before continuing rather than after.',
        },
      ],
    },
  },
  {
    id: 'symoda',
    role: 'IT Infrastructure & Data Migration Consultant',
    note: 'Independent Contractor',
    org: 'Symoda (Client: AN Design Communications)',
    location: 'Ottawa, ON',
    start: 'May',
    end: '2026',
    bullets: [
      'Diagnosed silent data-drop failures caused by legacy Mac Mini/Rclone incompatibilities and a 10 Mbps office bandwidth bottleneck, then relocated 4-drive RAID hardware onto a 500 Mbps network to bypass the legacy setup.',
      'Wrote custom Bash automation to migrate roughly 3.6 TB of multi-terabyte RAID data into Google Workspace, filtering out system artifacts (.DS_Store, .Trashes, .fseventsd) and redundant local archives.',
      'Split the destination across 3 Google Shared Drives to work around Google’s 500,000 file/folder structural limit, managing overnight transfers around daily API upload throttling.',
      'Built validated transfer loops (rclone copy followed by rclone check across 16 threads) with central master logging to guarantee zero data corruption, and documented the new directory structure and permission mappings.',
    ],
    detail: {
      intro:
        'A client’s multi-terabyte RAID backup was silently dropping data. I diagnosed the cause, moved the hardware onto infrastructure that could actually carry the transfer, and rebuilt the migration to Google Workspace end to end with automated validation.',
      sections: [
        {
          title: 'Diagnosis and network fix',
          body: 'The failures traced to legacy Mac Mini/Rclone incompatibilities compounding a 10 Mbps office connection. I relocated the 4-drive RAID hardware to a 500 Mbps symmetric network environment, direct-attaching it to modern hardware and bypassing the legacy infrastructure entirely.',
        },
        {
          title: 'Migration automation',
          body: 'I engineered custom Bash scripts to migrate roughly 3.6 TB of RAID data to Google Workspace, with filtering logic that excluded system artifacts (.DS_Store, .Trashes, .fseventsd) and redundant local archives so nothing extraneous rode along.',
        },
        {
          title: 'Working around Google’s structural limits',
          body: 'Google enforces a 500,000 file/folder limit per Shared Drive. I identified the constraint and architected the destination by strategically splitting the massive source directories across 3 distinct Shared Drives, managing overnight transfers and actively throttling around daily Google API upload limits.',
        },
        {
          title: 'Validation and handover',
          body: 'Every transfer ran through automated validation loops (rclone copy followed by rclone check across 16 threads) with internal master logging to guarantee zero data corruption, and I delivered documentation of the new directory structures and user permission mappings.',
        },
      ],
    },
  },
  {
    id: 'transom',
    role: 'Automation Engineer',
    org: 'Transom Group',
    location: 'San Luis Potosi, Mexico',
    start: 'Jan 2023',
    end: 'Mar 2024',
    bullets: [
      'Designed and implemented SCADA systems: custom graphic displays, alarms, events, data logging, and reporting, plus troubleshooting of the automation systems behind them.',
      'Built automation solutions for manufacturing and automotive clients in Python, C#, JavaScript, XML, SQL, and C++.',
      'Wrote SQL queries and Python scripts to extract and transform data out of industrial control systems for trend analysis and downtime reduction.',
      'Built real-time HMI dashboards so production and maintenance teams could see operational metrics as they happened.',
    ],
    detail: {
      intro:
        'I worked on a pilot project for real-time electrical consumption monitoring for industrial clients, covering the data communication, storage, and visualization layers as well as the physical prototype of the electric meter.',
      sections: [
        {
          title: 'Device communication and data handling',
          body: 'I programmed the bidirectional link between the measurement device and the central system. The device reported consumption, voltage, current, and power in real time; I implemented both the upstream data path and the downstream configuration commands.',
        },
        {
          title: 'Database schema design',
          body: 'I designed and implemented the SQL schema holding the historical electrical data, shaped for time-based retrieval at daily, weekly, monthly, quarterly, and yearly granularity, and wrote the insert and range-extraction queries on top of it.',
        },
        {
          title: 'HMI dashboards in Ignition',
          body: 'I built the Ignition dashboards showing live voltage, current, and power alongside line charts and tables of historical trend, so operations could spot consumption anomalies instead of reading raw logs.',
        },
        {
          title: 'Cross-functional work',
          body: 'The team mixed electrical, automation, IT, and mechatronics engineers. When a blocker hit (device communication dropping, a broken pipeline) we rotated onto other tasks while the relevant specialist cleared it, which is normal for a pilot and needs the schedule to absorb it.',
        },
        {
          title: 'Technical documentation',
          body: 'I documented the whole data flow: how the device sent and received information, the SQL schema, database access procedures, and how to regenerate the visualizations, so the next person did not have to reverse-engineer it.',
        },
      ],
    },
  },
  {
    id: 'daikin',
    role: 'Design Engineer',
    org: 'Daikin Applied',
    location: 'San Luis Potosi, Mexico',
    start: 'Mar 2021',
    end: 'May 2022',
    bullets: [
      'Developed sheet metal parts and full HVAC assemblies in SolidWorks, producing 3D models and the 2D manufacturing drawings that went with them.',
      'Ran structural stress simulations on completed designs and iterated the geometry until it held up under load inside the space constraints.',
      'Collaborated daily with engineering and manufacturing teams across Mexico and the USA through Teams, Agile PLM, and shared trackers.',
      'Built an automated parts tracking tool that logged part status, project association, and drawing completion, cutting the manual check time for the whole team.',
    ],
    detail: {
      intro:
        'I sat in the Modular Central Plants team, focused on mechanical design, simulation, documentation, and cross-border coordination for HVAC systems and their sheet metal components.',
      sections: [
        {
          title: 'CAD modeling and sheet metal design',
          body: 'SolidWorks daily: sheet metal parts and full assemblies for HVAC units designed to be attached and detached across applications. Detailed 3D models, tube routing, structural component placement, and the 2D drawings and diagrams manufacturing worked from.',
        },
        {
          title: 'Structural stress simulation',
          body: 'After each design I ran stress simulations to confirm the material and geometry survived operational loads inside the space and measurement constraints, read the results for weak points, and iterated until the design met criteria.',
        },
        {
          title: 'Cross-border collaboration',
          body: 'Daily contact with teams in Mexico and the USA over Teams, shared Excel, email, and Agile PLM, tracking design changes and part status. Weekly advancement meetings meant screen-sharing my current work and stating plainly what was done and what was blocked.',
        },
        {
          title: 'Automated parts tracking',
          body: 'Nobody could tell quickly which parts belonged to which project, which had drawings, or which were checked in or out of Agile. I wrote a tracking program that logged all three, which removed a recurring manual check for the whole team.',
        },
      ],
    },
  },
];

export const education = [
  {
    credential: 'Graduate Certificate, Artificial Intelligence Software Development',
    school: 'Algonquin College',
    location: 'Ottawa, ON, Canada',
    years: '2024 – 2025',
  },
  {
    credential: 'BEng, Mechatronics Engineering',
    school: 'Autonomous University of San Luis Potosí',
    location: 'San Luis Potosí, México',
    years: '2015 – 2021',
  },
  {
    credential: 'BA, Management',
    school: 'City University of Seattle',
    location: 'Seattle, WA, USA',
    years: '2017 – 2022',
  },
];

// Non-engineering roles. They stay on the CV because they carry the leadership,
// teaching, and operations experience the technical roles do not.
export const additionalExperience = [
  {
    role: 'Counselling Director',
    org: 'Easter Seals Camp Merry-Wood',
    location: 'Perth, ON',
    dates: 'Jun – Sep 2024',
    note: 'Cabin Leader, summers 2022 and 2023',
    summary:
      'Built and ran a recreation program for 100+ campers with physical disabilities, and supervised 25 counsellors through staff training, day-to-day support, and team cohesion across the summer.',
  },
  {
    role: 'English Language Teacher',
    org: 'Dato Lingua / independent tutor',
    location: 'San Luis Potosí, México',
    dates: 'Aug 2020 – May 2023',
    summary:
      'Taught English from A1 to B2 to students aged 14 to 37, in person and online, on the Cambridge method. Designed the lessons, ran professional workshops, and assessed progress through tests and exams.',
  },
  {
    role: 'Restaurant Manager',
    org: '"El Castillo"',
    location: 'San Luis Potosí, México',
    dates: 'Apr 2019 – May 2023',
    summary:
      'Co-founded and ran a family fast-food restaurant: operations, inventory, budgeting, staff training, and payroll, while keeping food standards and a reputation worth returning for.',
  },
];

export const skills = [
  {
    group: 'Controls & Automation',
    items: [
      'PLC programming (Allen-Bradley, Siemens)',
      'HMI/SCADA (FactoryTalk View, Ignition)',
      'Robotics (Fanuc)',
      'CNC programming',
      'EtherNet/IP, Profinet, Modbus',
      'Electrical panel design',
    ],
  },
  {
    group: 'Programming & Data',
    items: ['Python', 'SQL', 'C#', 'JavaScript', 'C++'],
  },
  {
    group: 'AI/ML & Vision',
    items: [
      'TensorFlow',
      'PyTorch',
      'scikit-learn',
      'HuggingFace',
      'LLMs',
      'RAG systems',
      'Cognex/Matrox (familiarity)',
    ],
  },
  {
    group: 'Data Tools & Visualization',
    items: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'FAISS', 'Power BI', 'Tableau'],
  },
  {
    group: 'Professional',
    items: [
      'Agile/Scrum',
      'Git',
      'Project management',
      'Technical mentorship',
      'Continuous improvement',
    ],
  },
];

export const languages = [
  { name: 'Spanish', level: 'Native' },
  { name: 'English', level: 'Fluent' },
  { name: 'French', level: 'Conversational' },
  { name: 'German', level: 'Learning' },
];

// Academic work that is finished and not hosted, and for which the code is not
// currently in hand. Listed plainly rather than written up as case studies, so
// nothing here claims more than the record supports. Summaries are Alejandro's
// own wording from the resume.
export const coursework = [
  {
    title: 'Deep Learning Sentiment Analysis with GloVe and DistilBERT',
    org: 'AISD, Algonquin College',
    dates: 'Feb – Mar 2025',
    summary:
      'Trained two sentiment models on the Movie Review Polarity dataset: Keras with GloVe embeddings, and a fine-tuned DistilBERT. Preprocessing pruned the vocabulary from 44K to 26K terms before tokenization and padding. Evaluated with precision, recall, and F1.',
    tags: ['Keras', 'GloVe', 'DistilBERT'],
  },
  {
    title: 'Exploring Word Embeddings with Word2Vec, GloVe, and FastText',
    org: 'AISD, Algonquin College',
    dates: 'Feb 2025',
    summary:
      'Scored pre-trained Word2Vec and GloVe similarity against the human-annotated SimLex-999 benchmark, built word clouds from Stack Overflow question titles, and tested analogy handling and misspelling robustness using FastText subword modeling.',
    tags: ['Word2Vec', 'GloVe', 'FastText'],
  },
  {
    title: 'Amazon Review Classification with N-grams, TF-IDF, and Embeddings',
    org: 'AISD, Algonquin College',
    dates: 'Jan – Feb 2025',
    summary:
      'Multi-class classifiers predicting 1 to 5 star review scores across three feature representations, on 10K+ preprocessed review records, with two models trained per method and results compared through confusion matrices in a structured summary table.',
    tags: ['TF-IDF', 'N-grams', 'scikit-learn'],
  },
  {
    title: 'Machine Learning Analysis of Dallas Police Incidents',
    org: 'AISD, Algonquin College',
    dates: 'Oct – Dec 2024',
    summary:
      'CRISP-DM analysis of a real urban crime dataset: K-Means clustering, anomaly detection with LOF and Isolation Forest, and classification with k-NN, decision trees, and random forest.',
    tags: ['CRISP-DM', 'K-Means', 'Isolation Forest'],
  },
  {
    title: 'Robotic Arm and Mobile Robot',
    org: "Bachelor's final project, San Luis Potosí",
    dates: 'Jan – Dec 2019',
    summary:
      'Built a MATLAB interface driving a robotic arm across a 15x15 cm workspace on command, and implemented wireless control, sensor reading, and feedback for a 30 cm mobile robot in Python.',
    tags: ['MATLAB', 'Python', 'Robotics'],
  },
];

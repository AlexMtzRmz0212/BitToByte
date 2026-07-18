import { Brain, Workflow, LineChart, Cpu } from 'lucide-react';

// Capability pillars shown above the project grid.
export const capabilities = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI Engineering',
    description:
      'Designing and integrating machine-learning models and intelligent agents into real, shipping products.',
    accent: '#3b82f6',
  },
  {
    icon: <Workflow className="w-6 h-6" />,
    title: 'Automation',
    description:
      'Building pipelines and systems that turn repetitive, manual work into reliable, self-running processes.',
    accent: '#22c55e',
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Data Visualization',
    description:
      'Transforming raw datasets into interactive, decision-ready dashboards and visual stories.',
    accent: '#f97316',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Mechatronics',
    description:
      'Bridging hardware and software: embedded systems, control, and the physical world made programmable.',
    accent: '#a855f7',
  },
];

// Tech marquee: pure text pills (this lucide build ships no brand icons).
export const techStack = [
  'React', 'Vite', 'Tailwind CSS', 'Python', 'FastAPI', 'Node.js',
  'PostgreSQL', 'Docker', 'TensorFlow', 'Pandas', 'AWS', 'TypeScript',
  'Arduino', 'ROS', 'D3.js', 'Git',
];

// Animated headline stats.
export const stats = [
  { value: 5, suffix: '', label: 'Live Projects' },
  { value: 100, suffix: '%', label: 'Uptime' },
  { value: 4, suffix: '', label: 'Domains' },
  { value: 24, suffix: '/7', label: 'Always On' },
];

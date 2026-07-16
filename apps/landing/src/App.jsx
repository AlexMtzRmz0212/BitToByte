import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import Projects from './components/Projects';
import TechMarquee from './components/TechMarquee';
import CTA from './components/CTA';
import { Background, Navbar, Footer, GithubIcon, LinkedinIcon } from '@alex_mtz/bittobyte-ui'

// The landing page is the professional storefront — show professional profiles
// in the footer (GitHub / LinkedIn), not the personal socials.
const PROFESSIONAL_SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/AlexMtzRmz0212', Icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alejandro-mtz/', Icon: LinkedinIcon },
];

const App = () => (
  <div className="relative min-h-screen bg-gray-950 font-sans text-gray-100 selection:bg-blue-500/30">
    {/* blue cursor glow to match the BitToByte brand */}
    <Background glow="96, 162, 255" />
    <Navbar />
    <main>
      <Hero />
      <Capabilities />
      <Projects />
      <TechMarquee />
      <CTA />
    </main>
    <Footer socials={PROFESSIONAL_SOCIALS} />
  </div>
);

export default App;

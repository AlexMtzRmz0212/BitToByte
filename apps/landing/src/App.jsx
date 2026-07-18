import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import Projects from './components/Projects';
import TechMarquee from './components/TechMarquee';
import PortfolioCallout from './components/PortfolioCallout';
import CTA from './components/CTA';
import { Background, Navbar, Footer, GithubIcon, LinkedinIcon, BitToByteMark } from '@alex_mtz/bittobyte-ui'

// The landing page is the professional storefront: show professional profiles
// in the footer (GitHub / LinkedIn), not the personal socials.
const PROFESSIONAL_SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/AlexMtzRmz0212', Icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alejandro-mtz/', Icon: LinkedinIcon },
];

// Nav links, including a jump to the "meet the engineer" portfolio callout.
const NAV_LINKS = [
  { label: 'Work', href: '#projects' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Stack', href: '#stack' },
  { label: 'Portfolio', href: '#portfolio' },
];

const App = () => (
  <div className="relative min-h-screen bg-gray-950 font-sans text-gray-100 selection:bg-blue-500/30">
    {/* blue cursor glow to match the BitToByte brand */}
    <Background glow="96, 162, 255" />
    <Navbar links={NAV_LINKS} logoIcon={<BitToByteMark />} />
    <main>
      <Hero />
      <Capabilities />
      <Projects />
      <TechMarquee />
      <PortfolioCallout />
      <CTA />
    </main>
    <Footer socials={PROFESSIONAL_SOCIALS} />
  </div>
);

export default App;

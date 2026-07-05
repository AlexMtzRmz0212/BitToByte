import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import Projects from './components/Projects';
import TechMarquee from './components/TechMarquee';
import CTA from './components/CTA';
import { Background, Navbar, Footer } from '@alex_mtz/bittobyte-ui'

const App = () => (
  <div className="relative min-h-screen bg-gray-950 font-sans text-gray-100 selection:bg-blue-500/30">
    <Background />
    <Navbar />
    <main>
      <Hero />
      <Capabilities />
      <Projects />
      <TechMarquee />
      <CTA />
    </main>
    <Footer />
  </div>
);

export default App;

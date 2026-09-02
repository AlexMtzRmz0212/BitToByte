// src/App.jsx: site chrome + routing. Page bodies live in src/pages.
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import {
  Background,
  Navbar,
  Footer,
  CookieConsent,
  getStoredConsent,
  AlexMark,
} from '@alex_mtz/bittobyte-ui';
import ScrollToTop from './components/ScrollToTop';
import ThemeSlider from './components/ThemeSlider';
import CaseStudy from './pages/CaseStudy';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Resume from './pages/Resume';
import Work from './pages/Work';
import {
  getStoredThemeLevel,
  storeThemeLevel,
  levelToStrength,
  levelToSpread,
  DEFAULT_LEVEL,
} from './lib/theme';

// Absolute paths, not bare hashes: these have to resolve from a case-study page
// too, where "#about" would only scroll the case study nowhere. The shared Navbar
// renders plain anchors, so a cross-route click is a normal page load.
//
// No "Home" entry: the logo is already the link to /, and a fifth item crowds the
// bar at 768px, the width where the inline links first replace the burger.
const PROFILE_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Resume', href: '/resume' },
  { label: 'About', href: '/#about' },
  { label: 'BitToByte', href: 'https://bittobyte.qzz.io' },
];

export default function App() {
  // Vercel Analytics stays off until the visitor opts in via the consent banner.
  const [analyticsAllowed, setAnalyticsAllowed] = useState(() => getStoredConsent() === 'accepted');

  // Whether the consent banner is currently up. It occupies the same bottom-right corner
  // as the theme slider at one z-index higher, so the slider stands down until the
  // visitor has answered. CookieConsent passes null when consent is withdrawn and the
  // banner reopens, which is exactly when this has to flip back to true.
  const [consentPending, setConsentPending] = useState(() => getStoredConsent() === null);

  // The page stays dark; one 0-100 level controls only the lime pointer glow: it maps
  // to the Background spotlight's strength and size, which grow together until near
  // 100 the glow floods the whole page at a uniform brightness.
  const [level, setLevel] = useState(() => getStoredThemeLevel() ?? DEFAULT_LEVEL);

  useEffect(() => {
    storeThemeLevel(level);
  }, [level]);

  return (
    <div className="relative min-h-screen bg-gray-950 font-sans text-gray-100">
      <ScrollToTop />

      {/* lime cursor glow to match the portfolio accent (#b5f53c); strength + size
          track the slider, capped lower than landing since lime reads hot */}
      <Background
        glow="181, 245, 60"
        strength={levelToStrength(level)}
        spread={levelToSpread(level)}
      />
      <Navbar
        links={PROFILE_LINKS}
        logoText="Alex"
        logoTextTop="Alejandro"
        logoIcon={<AlexMark />}
        logoHref="/"
        contactHref="/#contact"
        contactLabel="Contact"
        markClassName="bg-[#b5f53c] shadow-lg shadow-[#b5f53c]/30"
        markIconClassName="text-gray-950"
      />

      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer
        logoText="Alex"
        tagline="AI &amp; Automation Engineer. Building things that work so you don't have to."
        copyrightName="Alejandro Martinez"
        showCookieSettings
        markClassName="bg-[#b5f53c]"
        markIconClassName="text-gray-950"
      />

      {analyticsAllowed && <Analytics />}
      <CookieConsent
        onConsentChange={(value) => {
          setAnalyticsAllowed(value === 'accepted');
          setConsentPending(value === null);
        }}
        privacyHref="https://bittobyte.qzz.io/privacy.html"
        acceptClassName="bg-[#b5f53c] text-gray-950 hover:brightness-105"
      />
      {!consentPending && <ThemeSlider level={level} onChange={setLevel} />}
    </div>
  );
}

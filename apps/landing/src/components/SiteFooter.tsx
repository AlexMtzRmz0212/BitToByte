import { Footer, GithubIcon, LinkedinIcon } from '@alex_mtz/bittobyte-ui';
import { site } from '../data/site';

// The shared BitToByte footer (network links, legal, socials). Used on the
// dark Nexus surfaces only; its colors are written for a dark page.
const SOCIALS = [
  { label: 'GitHub', href: site.contact.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: site.contact.linkedin, Icon: LinkedinIcon },
];

export default function SiteFooter() {
  return (
    <div className="mt-24">
      <Footer
        tagline="Intelligent systems, built and shipped by one engineer."
        socials={SOCIALS}
        copyrightName="BitToByte"
      />
    </div>
  );
}

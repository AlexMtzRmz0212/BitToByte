import { site } from '../data/site';

/**
 * Terms of Service and Privacy Policy as a quiet pair of links. The map and the
 * welcome have no footer, so this is how the legal pages stay reachable there.
 */
export default function LegalNav({ className = '' }: { className?: string }) {
  return (
    <nav aria-label="Legal" className={className}>
      {site.legal.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}

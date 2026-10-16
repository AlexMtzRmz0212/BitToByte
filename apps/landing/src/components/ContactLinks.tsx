import { GithubIcon, LinkedinIcon } from '@alex_mtz/bittobyte-ui';
import { MailIcon } from 'lucide-react';
import { mailto, site } from '../data/site';

const LINKS = [
  { label: 'LinkedIn', href: site.contact.linkedin, Icon: LinkedinIcon, emailOnly: false },
  { label: 'GitHub', href: site.contact.github, Icon: GithubIcon, emailOnly: false },
  { label: 'Email', href: mailto, Icon: MailIcon, emailOnly: true },
];

/** LinkedIn, GitHub and email as 44px icon links. */
export default function ContactLinks({
  className = '',
  hideEmailOnMobile = false,
}: {
  className?: string;
  hideEmailOnMobile?: boolean;
}) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {LINKS.map(({ label, href, Icon, emailOnly }) => (
        <li key={label} className={emailOnly && hideEmailOnMobile ? 'hidden sm:block' : undefined}>
          <a
            href={href}
            aria-label={label}
            title={label}
            {...(href.startsWith('mailto:') ? {} : { rel: 'me noopener' })}
            className="flex h-11 w-11 items-center justify-center rounded-control text-muted transition-colors hover:text-ink"
          >
            <Icon className="h-[18px] w-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}

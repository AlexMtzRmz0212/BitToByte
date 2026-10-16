// Types for the parts of the (untyped, JS) shared UI package the landing uses.
declare module '@alex_mtz/bittobyte-ui' {
  import type { ComponentType } from 'react';

  interface IconProps {
    className?: string;
  }

  interface FooterLink {
    label: string;
    href: string;
  }

  interface FooterSocial extends FooterLink {
    Icon: ComponentType<IconProps>;
  }

  interface FooterProps {
    logoText?: string;
    tagline?: string;
    socials?: FooterSocial[];
    copyrightName?: string;
    familyLinks?: FooterLink[];
    legalLinks?: FooterLink[];
    showCookieSettings?: boolean;
    markClassName?: string;
    markIconClassName?: string;
  }

  export const BitToByteMark: ComponentType<IconProps>;
  export const AlexMark: ComponentType<IconProps>;
  export const GithubIcon: ComponentType<IconProps>;
  export const LinkedinIcon: ComponentType<IconProps>;
  export const Footer: ComponentType<FooterProps>;
}

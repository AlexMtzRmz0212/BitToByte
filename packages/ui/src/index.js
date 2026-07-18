// src/index.js: public API of the bittobyte-ui package

// Stylesheet (consumers will import this once in their app)
import './index.css'

// Components (add each one here as you build them)
export { default as Background } from './components/Background'
export { default as Navbar } from './components/Navbar'
export { default as Footer } from './components/Footer'
export { default as SectionHeading } from './components/SectionHeading'
export { default as Reveal } from './components/Reveal'
export { default as CookieConsent } from './components/CookieConsent'
export { getStoredConsent } from './components/consent'
export { LinkedinIcon, GithubIcon, InstagramIcon, FacebookIcon, XIcon } from './components/BrandIcons'
export { AlexMark, BitToByteMark } from './components/BrandMark'
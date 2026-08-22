import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll handling for a client-rendered SPA, in two parts.
 *
 * No hash: browsers restore scroll position on history navigation, which is
 * right for Back but wrong for following a link. Without this, opening a case
 * study from halfway down the projects grid drops you halfway down the case
 * study. Jump instantly, since `smooth` from the global CSS would animate a
 * page the visitor has not seen yet.
 *
 * With a hash: the navbar links to "/#about" so they work from a case-study
 * page too, but that arrives as a fresh page load. The browser looks for
 * #about before React has rendered it, finds nothing, and stays at the top.
 * Resolving it here runs after the first paint, when the section exists.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

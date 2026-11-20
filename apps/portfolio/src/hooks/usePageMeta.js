import { useEffect } from 'react';
import { SITE_URL } from '../data/pageMeta';

/**
 * Keep the document head in step with the route while a visitor navigates.
 *
 * Each route is prerendered with its own head (scripts/prerender.mjs), so a
 * crawler or a pasted link gets the right title and tags from the HTML itself.
 * This hook covers the other case: client-side navigation, where the HTML on
 * screen is the one the visitor landed on. It updates the title, description,
 * canonical URL and the Open Graph / Twitter text, and restores every value on
 * unmount so leaving a route never leaves its metadata behind. A tag that is
 * not in the document (dev server, where only the static ones exist) is skipped.
 *
 * `path` is the route's canonical path ('/work'); omit it for pages that must
 * not claim a canonical URL, such as the 404.
 */
export function usePageMeta({ title, description, path } = {}) {
  useEffect(() => {
    const restores = [];

    const patch = (selector, attribute, value) => {
      if (value == null) return;
      const element = document.querySelector(selector);
      if (!element) return;
      const previous = element.getAttribute(attribute);
      element.setAttribute(attribute, value);
      restores.push(() => (previous == null ? element.removeAttribute(attribute) : element.setAttribute(attribute, previous)));
    };

    const previousTitle = document.title;
    if (title) document.title = title;
    restores.push(() => {
      document.title = previousTitle;
    });

    patch('meta[name="description"]', 'content', description);
    patch('meta[property="og:title"]', 'content', title);
    patch('meta[property="og:description"]', 'content', description);
    patch('meta[name="twitter:title"]', 'content', title);
    patch('meta[name="twitter:description"]', 'content', description);
    if (path != null) {
      const url = `${SITE_URL}${path}`;
      patch('link[rel="canonical"]', 'href', url);
      patch('meta[property="og:url"]', 'content', url);
    }

    return () => restores.forEach((restore) => restore());
  }, [title, description, path]);
}

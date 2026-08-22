import { useEffect } from 'react';

const DESCRIPTION_SELECTOR = 'meta[name="description"]';

/**
 * Set the document title and meta description for a route.
 *
 * The site is a client-rendered SPA, so index.html ships one static title for
 * every page. Without this, a case study shared as a link would preview as
 * "Alex | Portfolio" no matter which one it is. Both values are restored on
 * unmount so leaving a route never leaves its title behind.
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title;
    const tag = document.querySelector(DESCRIPTION_SELECTOR);
    const previousDescription = tag?.getAttribute('content');

    if (title) document.title = title;
    if (description && tag) tag.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      if (previousDescription != null && tag) tag.setAttribute('content', previousDescription);
    };
  }, [title, description]);
}

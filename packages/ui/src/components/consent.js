// Analytics-consent storage helpers, kept separate from the component file so the
// component module only exports a component (keeps React Fast Refresh happy).
//
// Tracking must NOT run until the user actively chooses "Accept", so the consuming
// app gates its analytics on the stored value.
export const STORAGE_KEY = 'bittobyte-analytics-consent';

// Read the persisted choice ('accepted' | 'declined' | null). Safe on any host.
export const getStoredConsent = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

// Fired on `window` when the visitor asks to revisit their choice. CookieConsent
// listens for it and shows itself again, so any part of the app (e.g. a "Cookie
// settings" footer link) can reopen the banner without prop-drilling.
export const CONSENT_REOPEN_EVENT = 'bittobyte:consent-reopen';

/**
 * Withdraw the stored choice and reopen the banner. Consent must be as easy to
 * take back as it was to give, so this drops the key first: from this moment the
 * visitor counts as undecided and the app unmounts its analytics.
 */
export const openConsentSettings = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage may be blocked; the banner still reopens for this session.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_REOPEN_EVENT));
};

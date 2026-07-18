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

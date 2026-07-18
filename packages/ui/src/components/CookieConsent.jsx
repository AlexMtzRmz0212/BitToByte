import { useEffect, useState } from 'react';

// Opt-in analytics consent. Tracking must NOT run until the user actively
// chooses "Accept", so the consuming app gates its analytics on the stored value.
const STORAGE_KEY = 'bittobyte-analytics-consent';

// Read the persisted choice ('accepted' | 'declined' | null). Safe on any host.
export const getStoredConsent = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

/**
 * Interactive cookie/analytics consent banner. Renders only until the visitor
 * makes a choice, then persists it. Call `onConsentChange` so the app can mount
 * or skip its analytics accordingly.
 *
 * @param {(value: 'accepted' | 'declined') => void} onConsentChange
 * @param {string} privacyHref                URL of the privacy policy.
 * @param {string} acceptClassName            Theme classes for the Accept button.
 */
const CookieConsent = ({
  onConsentChange,
  privacyHref = 'https://bittobyte.qzz.io/privacy.html',
  acceptClassName = 'bg-blue-600 text-white hover:brightness-110',
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only prompt visitors who haven't decided yet (avoids a flash for the rest).
    if (getStoredConsent() === null) setVisible(true);
  }, []);

  const choose = (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage may be blocked; still hide the banner for this session.
    }
    setVisible(false);
    onConsentChange?.(value);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/10 bg-gray-900/95 p-5 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-300">
          We use privacy-friendly analytics to understand site traffic. You choose
          whether to allow it. See our{' '}
          <a
            href={privacyHref}
            className="font-medium text-white underline underline-offset-2 hover:text-gray-200"
          >
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose('declined')}
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${acceptClassName}`}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

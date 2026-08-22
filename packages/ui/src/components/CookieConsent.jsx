import { useEffect, useRef, useState } from 'react';
import { STORAGE_KEY, getStoredConsent, CONSENT_REOPEN_EVENT } from './consent';

/**
 * Interactive cookie/analytics consent banner. Renders only until the visitor
 * makes a choice, then persists it. Call `onConsentChange` so the app can mount
 * or skip its analytics accordingly.
 *
 * @param {(value: 'accepted' | 'declined' | null) => void} onConsentChange
 *        Called with the new choice, or `null` when the visitor withdraws a
 *        previous one via "Cookie settings" (treat that as "not accepted").
 * @param {string} privacyHref                URL of the privacy policy.
 * @param {string} acceptClassName            Theme classes for the Accept button.
 */
const CookieConsent = ({
  onConsentChange,
  privacyHref = 'https://bittobyte.qzz.io/privacy.html',
  acceptClassName = 'bg-blue-600 text-white hover:brightness-110',
}) => {
  // Only prompt visitors who haven't decided yet. Computed lazily on mount so the
  // banner never flashes for those who already chose (no post-render toggle).
  const [visible, setVisible] = useState(() => getStoredConsent() === null);

  // Callers usually pass an inline arrow, so keep the latest one in a ref and
  // subscribe once instead of resubscribing on every parent render.
  const onChangeRef = useRef(onConsentChange);
  useEffect(() => {
    onChangeRef.current = onConsentChange;
  });

  // Reopen when the visitor withdraws consent from elsewhere (footer link). The
  // stored key is already cleared by then, so tell the app to stop tracking now
  // rather than waiting for the new answer.
  useEffect(() => {
    const onReopen = () => {
      setVisible(true);
      onChangeRef.current?.(null);
    };
    window.addEventListener(CONSENT_REOPEN_EVENT, onReopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, onReopen);
  }, []);

  const choose = (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage may be blocked; still hide the banner for this session.
    }
    setVisible(false);
    onChangeRef.current?.(value);
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
          We use privacy-friendly analytics to understand site traffic. You choose whether to allow
          it. See our{' '}
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

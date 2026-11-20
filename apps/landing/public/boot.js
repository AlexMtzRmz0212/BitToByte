// Before first paint: JS is on, and returning visitors skip the welcome (and the
// intro card). A query string (a deep link, or /?welcome) always shows its page.
// Kept as a file, not inline, so the site's CSP can forbid inline scripts.
document.documentElement.classList.add('js');
try {
  var saved = JSON.parse(localStorage.getItem('bittobyte-multiverse-v1') || '{}');
  if (saved.introSeen === true && !location.search) document.documentElement.classList.add('intro-seen');
} catch {
  // Storage blocked or unreadable: show the welcome as for a first visit.
}

// Shows the address that went nowhere, in the navigation readout. Kept as a file,
// not inline, so the site's CSP can forbid inline scripts. textContent only.
(function () {
  var el = document.getElementById('route');
  if (!el) return;
  var path = location.pathname;
  if (path.length > 30) path = path.slice(0, 29) + '…';
  el.textContent = path;
})();

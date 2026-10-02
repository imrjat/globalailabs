// Page transitions are handled natively by CSS cross-document View Transitions
// (see `@view-transition` in src/input.css). This module only makes navigation
// feel instant by prefetching internal pages before the user clicks.
export function initPageTransitions() {
  const supportsSpeculationRules =
    HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules');

  if (supportsSpeculationRules) {
    // Chromium: prerender same-site pages on hover / pointerdown (moderate eagerness)
    const rules = document.createElement('script');
    rules.type = 'speculationrules';
    rules.textContent = JSON.stringify({
      prerender: [{
        where: {
          and: [
            { href_matches: '/*' },
            { not: { href_matches: '*.pdf' } },
            { not: { selector_matches: '[target=_blank], [download], [rel~=nofollow]' } }
          ]
        },
        eagerness: 'moderate'
      }]
    });
    document.head.appendChild(rules);
    return;
  }

  // Fallback (Safari / Firefox): prefetch on hover or touch start
  const prefetched = new Set();
  const prefetch = (e) => {
    const link = e.target.closest && e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin || url.hash && url.pathname === window.location.pathname) return;
    if (prefetched.has(url.href)) return;
    prefetched.add(url.href);

    const hint = document.createElement('link');
    hint.rel = 'prefetch';
    hint.href = url.href;
    document.head.appendChild(hint);
  };

  document.addEventListener('mouseover', prefetch, { passive: true });
  document.addEventListener('touchstart', prefetch, { passive: true });
}

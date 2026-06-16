export function initPageTransitions() {
  const transitionOverlay = document.querySelector('.transition-overlay');
  const transitionText = document.querySelector('.transition-text');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Page Entrance Animation on Load
  if (transitionOverlay) {
    if (prefersReducedMotion) {
      if (window.gsap) {
        window.gsap.fromTo(transitionOverlay, 
          { opacity: 1, clipPath: 'none' }, 
          { opacity: 0, duration: 0.35, onComplete: () => {
            transitionOverlay.style.display = 'none';
          }}
        );
      } else {
        transitionOverlay.style.opacity = '0';
        setTimeout(() => transitionOverlay.style.display = 'none', 350);
      }
    } else {
      if (window.gsap) {
        // Set state to cover, then sweep away upward
        window.gsap.set(transitionOverlay, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
        });
        
        window.gsap.to(transitionOverlay, {
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          duration: 0.85,
          ease: 'power4.inOut',
          onComplete: () => {
            transitionOverlay.style.pointerEvents = 'none';
            // Hide the text
            if (transitionText) {
              window.gsap.set(transitionText, { opacity: 0 });
            }
          }
        });
      } else {
        transitionOverlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
      }
    }
  }

  // 2. Intercept Internal Link Clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Filter out anchors, external, mailto, tel, blank targets
    const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
    const isAnchor = href.startsWith('#');
    const isMailTo = href.startsWith('mailto:');
    const isTel = href.startsWith('tel:');
    const isBlank = link.getAttribute('target') === '_blank';

    if (isExternal || isAnchor || isMailTo || isTel || isBlank) {
      return; // Allow native navigation
    }

    e.preventDefault();

    // Deduce Page Name for Overlay Title
    let pageName = 'GLOBAL';
    if (href.includes('work.html')) pageName = 'WORK';
    else if (href.includes('team.html')) pageName = 'TEAM';
    else if (href.includes('careers.html')) pageName = 'CAREERS';
    else if (href.includes('connect.html')) pageName = 'CONNECT';
    else if (href.includes('index.html') || href === '/' || href === './') pageName = 'HOME';

    if (transitionText) {
      transitionText.textContent = pageName;
    }

    if (transitionOverlay) {
      transitionOverlay.style.pointerEvents = 'auto';

      if (prefersReducedMotion) {
        if (window.gsap) {
          window.gsap.fromTo(transitionOverlay, 
            { opacity: 0, clipPath: 'none', display: 'flex' },
            { opacity: 1, duration: 0.35, onComplete: () => {
              window.location.href = href;
            }}
          );
        } else {
          transitionOverlay.style.display = 'flex';
          transitionOverlay.style.opacity = '1';
          setTimeout(() => {
            window.location.href = href;
          }, 350);
        }
      } else {
        if (window.gsap) {
          // Reset clip-path to bottom edge
          window.gsap.set(transitionOverlay, {
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
          });

          const tl = window.gsap.timeline({
            onComplete: () => {
              window.location.href = href;
            }
          });

          // Sweep up to cover screen
          tl.to(transitionOverlay, {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 0.75,
            ease: 'power4.inOut'
          });

          // Slide text in
          tl.fromTo(transitionText, 
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
            '-=0.4'
          );
        } else {
          transitionOverlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
          setTimeout(() => {
            window.location.href = href;
          }, 750);
        }
      }
    } else {
      window.location.href = href;
    }
  });
}

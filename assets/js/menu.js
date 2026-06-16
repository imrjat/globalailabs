export function initMenu() {
  const menuTrigger = document.getElementById('menu-trigger');
  const menuOverlay = document.getElementById('menu-overlay');
  
  if (!menuTrigger || !menuOverlay) return;

  let isMenuOpen = false;

  // Select all focusable elements inside the menu for focus trapping
  const focusableSelectors = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
  const firstFocusable = menuTrigger; // Trigger can act as escape focus pivot

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    menuTrigger.setAttribute('aria-expanded', isMenuOpen.toString());
    menuOverlay.setAttribute('aria-hidden', (!isMenuOpen).toString());

    if (isMenuOpen) {
      openMenuAnimation();
    } else {
      closeMenuAnimation();
    }
  };

  const openMenuAnimation = () => {
    // Stop body scrolling (via Lenis & CSS overflow)
    if (window.lenisInstance) {
      window.lenisInstance.stop();
    }
    document.body.classList.add('lenis-stopped');
    menuOverlay.style.pointerEvents = 'auto';

    // GSAP clip-path reveal from top
    if (window.gsap) {
      const tl = window.gsap.timeline({ defaults: { ease: 'power4.inOut', duration: 0.85 } });
      
      tl.to(menuOverlay, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      });

      // Stagger main links
      const mainLinks = menuOverlay.querySelectorAll('.menu-main-link');
      tl.fromTo(mainLinks, 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        '-=0.45'
      );

      // Fade in secondary items
      const secondaryItems = menuOverlay.querySelectorAll('.menu-secondary-item');
      tl.fromTo(secondaryItems, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 },
        '-=0.3'
      );
    } else {
      menuOverlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    }

    // Change menu trigger text to CLOSE
    const triggerText = menuTrigger.querySelector('.menu-text');
    if (triggerText) triggerText.textContent = 'CLOSE';

    // Focus on first main link after open
    setTimeout(() => {
      const firstLink = menuOverlay.querySelector('.menu-main-link');
      if (firstLink) firstLink.focus();
    }, 100);
  };

  const closeMenuAnimation = () => {
    // Resume body scrolling
    if (window.lenisInstance) {
      window.lenisInstance.start();
    }
    document.body.classList.remove('lenis-stopped');
    menuOverlay.style.pointerEvents = 'none';

    // GSAP clip-path sweep up/out
    if (window.gsap) {
      const tl = window.gsap.timeline({ defaults: { ease: 'power4.inOut', duration: 0.8 } });
      
      tl.to(menuOverlay, {
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      });

      const triggerText = menuTrigger.querySelector('.menu-text');
      if (triggerText) triggerText.textContent = 'MENU';
    } else {
      menuOverlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
      const triggerText = menuTrigger.querySelector('.menu-text');
      if (triggerText) triggerText.textContent = 'MENU';
    }

    // Return focus to menu trigger button
    menuTrigger.focus();
  };

  menuTrigger.addEventListener('click', toggleMenu);

  // Close menu on link clicks
  const menuLinks = menuOverlay.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Allow page-transitions module to intercept first if it's an internal link
      if (isMenuOpen) {
        toggleMenu();
      }
    });
  });

  // Close menu on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      toggleMenu();
    }
  });

  // Focus trapping
  menuOverlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const focusables = menuOverlay.querySelectorAll(focusableSelectors);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
}

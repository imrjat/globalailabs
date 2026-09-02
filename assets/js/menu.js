export function initMenu() {
  const menuTrigger = document.getElementById('menu-trigger');
  const menuOverlay = document.getElementById('menu-overlay');
  
  if (!menuTrigger || !menuOverlay) {
    // Retry when dynamic components are mounted
    window.addEventListener('components:mounted', () => initMenu(), { once: true });
    return;
  }

  if (menuTrigger.dataset.menuBound === 'true' || menuTrigger.dataset.menuInitialized === 'true') {
    return;
  }
  menuTrigger.dataset.menuInitialized = 'true';
  menuTrigger.dataset.menuBound = 'true';

  let isMenuOpen = false;
  const menuCloseBtn = document.getElementById('menu-close-btn');

  // Select all focusable elements inside the menu for focus trapping
  const focusableSelectors = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

  const openMenuAnimation = () => {
    isMenuOpen = true;
    menuTrigger.setAttribute('aria-expanded', 'true');
    menuOverlay.setAttribute('aria-hidden', 'false');

    // Stop body scrolling (via Lenis & CSS overflow)
    if (window.lenisInstance) {
      window.lenisInstance.stop();
    }
    document.body.classList.add('lenis-stopped', 'menu-open');
    menuOverlay.style.pointerEvents = 'auto';
    menuOverlay.style.visibility = 'visible';

    // Change menu trigger text to CLOSE & highlight
    const triggerText = menuTrigger.querySelector('.menu-text');
    if (triggerText) triggerText.textContent = 'CLOSE';
    menuTrigger.classList.add('bg-[#ff2e93]', 'text-white');
    menuTrigger.classList.remove('bg-[#f0f6f8]', 'text-[#0c1016]');

    // GSAP clip-path reveal from top
    if (window.gsap) {
      const tl = window.gsap.timeline({ defaults: { ease: 'power4.inOut', duration: 0.65 } });
      
      tl.to(menuOverlay, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        opacity: 1
      });

      // Stagger main links
      const mainLinks = menuOverlay.querySelectorAll('.menu-main-link');
      tl.fromTo(mainLinks, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.07 },
        '-=0.35'
      );
    } else {
      menuOverlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
      menuOverlay.style.opacity = '1';
    }

    // Focus on first main link after open
    setTimeout(() => {
      const firstLink = menuOverlay.querySelector('.menu-main-link');
      if (firstLink) firstLink.focus();
    }, 150);
  };

  const closeMenuAnimation = () => {
    isMenuOpen = false;
    menuTrigger.setAttribute('aria-expanded', 'false');
    menuOverlay.setAttribute('aria-hidden', 'true');

    // Resume body scrolling
    if (window.lenisInstance) {
      window.lenisInstance.start();
    }
    document.body.classList.remove('lenis-stopped', 'menu-open');

    // Change menu trigger text back to MENU
    const triggerText = menuTrigger.querySelector('.menu-text');
    if (triggerText) triggerText.textContent = 'MENU';
    menuTrigger.classList.remove('bg-[#ff2e93]', 'text-white');
    menuTrigger.classList.add('bg-[#f0f6f8]', 'text-[#0c1016]');

    // GSAP clip-path sweep up/out
    if (window.gsap) {
      const tl = window.gsap.timeline({ 
        defaults: { ease: 'power4.inOut', duration: 0.55 },
        onComplete: () => {
          menuOverlay.style.pointerEvents = 'none';
          menuOverlay.style.visibility = 'hidden';
        }
      });
      
      tl.to(menuOverlay, {
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        opacity: 0
      });
    } else {
      menuOverlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
      menuOverlay.style.opacity = '0';
      menuOverlay.style.pointerEvents = 'none';
      menuOverlay.style.visibility = 'hidden';
    }

    // Return focus to menu trigger button
    menuTrigger.focus();
  };

  const toggleMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isMenuOpen) {
      closeMenuAnimation();
    } else {
      openMenuAnimation();
    }
  };

  menuTrigger.addEventListener('click', toggleMenu);

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMenuOpen) closeMenuAnimation();
    });
  }

  // Close menu on link clicks
  const menuLinks = menuOverlay.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) {
        closeMenuAnimation();
      }
    });
  });

  // Close menu on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenuAnimation();
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

/**
 * Global AI Labs - Dynamic Components & Navigation System
 * Loads unified Header, Menu Overlay, and Footer dynamically across all pages.
 */

(function () {
  const currentPath = window.location.pathname.toLowerCase();
  const isHome = currentPath.endsWith('/') || currentPath.endsWith('/index.html');
  const isTeam = currentPath.endsWith('/team.html');
  const isWork = currentPath.endsWith('/work.html');
  const isCareers = currentPath.endsWith('/careers.html');
  const isConnect = currentPath.endsWith('/connect.html');

  const headerHTML = `
    <header id="site-header" class="fixed top-0 left-0 w-full z-[1000] px-5 py-4 md:px-8 lg:px-12 flex justify-between items-center transition-all duration-300 bg-black border-b border-white/10">
      <a href="./index.html" class="focus:outline-none focus:ring-2 focus:ring-[#ff2e93] focus:ring-offset-2 flex items-center">
        <img src="./assets/img/globalailabs.png" alt="Global AI Labs" class="h-8 md:h-10 w-auto header-logo">
      </a>
      <div class="flex items-center gap-4">
        <a href="./connect.html" class="magnetic hidden md:inline-flex px-6 py-2 border border-[#ff2e93] bg-[#ff2e93]/10 text-white text-[11px] font-bold tracking-[0.08em] uppercase rounded-full hover:bg-[#ff2e93] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff2e93] header-btn">
          Connect
        </a>
        <button id="menu-trigger" aria-expanded="false" aria-controls="menu-overlay" class="magnetic px-6 py-2 bg-[#f0f6f8] text-[#0c1016] text-[11px] font-bold tracking-[0.08em] uppercase rounded-full hover:bg-[#ff2e93] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff2e93] header-menu-btn">
          <span class="menu-text">menu</span>
        </button>
      </div>
    </header>

    <nav id="menu-overlay" aria-hidden="true" role="dialog" aria-modal="true" class="fixed top-0 left-0 w-full h-screen bg-[#06080c] text-ice z-[998] flex flex-col justify-between p-8 md:p-12 lg:p-16 pointer-events-none" style="clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);">
      <div class="flex justify-between items-start w-full mt-12 md:mt-6">
        <div class="text-[11px] tracking-[0.08em] uppercase text-muted font-mono">navigation</div>
        <div class="text-[11px] tracking-[0.08em] uppercase text-muted font-mono">global ai labs</div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
        <div class="lg:col-span-8 flex flex-col gap-4">
          <a href="./index.html" class="menu-main-link group block text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2e93] w-fit font-outfit ${isHome ? 'text-[#ff2e93]' : 'hover:text-[#ff2e93]'}">
            home
          </a>
          <a href="./team.html" class="menu-main-link group block text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2e93] w-fit font-outfit ${isTeam ? 'text-[#ff2e93]' : 'hover:text-[#ff2e93]'}">
            founders
          </a>
          <a href="./work.html" class="menu-main-link group block text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2e93] w-fit font-outfit ${isWork ? 'text-[#ff2e93]' : 'hover:text-[#ff2e93]'}">
            work
          </a>
          <a href="./careers.html" class="menu-main-link group block text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2e93] w-fit font-outfit ${isCareers ? 'text-[#ff2e93]' : 'hover:text-[#ff2e93]'}">
            careers
          </a>
          <a href="./connect.html" class="menu-main-link group block text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff2e93] w-fit font-outfit ${isConnect ? 'text-[#ff2e93]' : 'hover:text-[#ff2e93]'}">
            contact us
          </a>
        </div>

        <div class="lg:col-span-4 flex flex-col gap-6 lg:border-l lg:border-line-dark lg:pl-12">
          <div>
            <div class="text-[11px] tracking-[0.08em] uppercase text-muted mb-3 font-mono">capabilities</div>
            <ul class="flex flex-col gap-2">
              <li class="menu-secondary-item text-md md:text-lg font-bold hover:text-[#ff2e93] transition-colors">CINEMATIC AI VIDEO</li>
              <li class="menu-secondary-item text-md md:text-lg font-bold hover:text-[#ff2e93] transition-colors">MULTI-MODAL CONTROL</li>
              <li class="menu-secondary-item text-md md:text-lg font-bold hover:text-[#ff2e93] transition-colors">STYLE CONSISTENCY</li>
              <li class="menu-secondary-item text-md md:text-lg font-bold hover:text-[#ff2e93] transition-colors">BEAT SYNC AUDIO</li>
            </ul>
          </div>
          <div>
            <div class="text-[11px] tracking-[0.08em] uppercase text-muted mb-2 font-mono">say hello</div>
            <a href="mailto:hello@globalailabs.ai" class="menu-secondary-item text-md md:text-lg hover:underline text-[#ff2e93] font-bold">hello@globalailabs.ai</a>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-end w-full">
        <div class="text-[11px] tracking-[0.08em] uppercase text-muted font-mono">© 2026</div>
        <div class="text-[11px] tracking-[0.08em] uppercase text-muted font-mono">mumbai, india</div>
      </div>
    </nav>
  `;

  const footerHTML = `
    <footer class="bg-[#06080c] text-ice py-16 px-5 md:px-8 lg:px-12 relative z-10 border-t border-white/5">
      <div class="max-w-7xl mx-auto flex flex-col gap-16">

        <!-- Top row -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div class="md:col-span-5 flex flex-col gap-4 text-left">
            <div class="text-[11px] tracking-[0.08em] uppercase text-muted font-mono">agency</div>
            <p class="text-sm text-muted max-w-sm leading-relaxed">
              Global AI Labs is a cinematic generation platform providing precise character, camera, and style reference controls.
            </p>
            <div class="text-[10px] text-muted mt-2">
              🛡️ CCPA/GDPR Compliant · Stripe Secure Payments
            </div>
          </div>

          <div class="md:col-span-3 text-left">
            <div class="text-[11px] tracking-[0.08em] uppercase text-muted mb-4 font-mono">pages</div>
            <ul class="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider">
              <li><a href="./index.html" class="hover:text-[#ff2e93] transition-colors">Home</a></li>
              <li><a href="./team.html" class="hover:text-[#ff2e93] transition-colors">Founders</a></li>
              <li><a href="./work.html" class="hover:text-[#ff2e93] transition-colors">Work</a></li>
              <li><a href="./careers.html" class="hover:text-[#ff2e93] transition-colors">Careers</a></li>
              <li><a href="./connect.html" class="hover:text-[#ff2e93] transition-colors">Connect Workspace</a></li>
            </ul>
          </div>

          <div class="md:col-span-4 flex flex-col gap-6 text-left">
            <div>
              <div class="text-[11px] tracking-[0.08em] uppercase text-muted mb-4 font-mono">support inquiries</div>
              <a href="mailto:hello@globalailabs.ai" class="text-md font-bold text-[#ff2e93] hover:underline block">hello@globalailabs.ai</a>
            </div>
            <div>
              <button id="go-up-btn" class="magnetic inline-flex items-center gap-2 px-6 py-2 border border-white/10 text-white text-[11px] font-bold tracking-[0.08em] uppercase rounded-full hover:bg-white hover:text-[#0c1016] transition-all duration-300">
                go up ↑
              </button>
            </div>
          </div>
        </div>

        <!-- Giant Wordmark Logo -->
        <div class="w-full border-t border-white/5 pt-12 overflow-hidden">
          <img src="./assets/img/globalailabs.png" alt="Global AI Labs" class="w-full opacity-100 select-none pointer-events-none" style="max-height: 18vw; object-fit: contain; object-position: left;">
        </div>

        <!-- Bottom row -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.08em] uppercase text-muted border-t border-white/5 pt-8">
          <div>© 2026 Global AI Labs. All rights reserved.</div>
          <div class="flex gap-4">
            <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
            <span>/</span>
            <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  function initDynamicComponents() {
    // 1. Inject Header & Nav Overlay
    let headerContainer = document.getElementById('site-header-container');
    if (!headerContainer) {
      const existingHeader = document.getElementById('site-header');
      const existingNav = document.getElementById('menu-overlay');
      if (existingHeader) existingHeader.remove();
      if (existingNav) existingNav.remove();
      headerContainer = document.createElement('div');
      headerContainer.id = 'site-header-container';
      document.body.prepend(headerContainer);
    }
    headerContainer.innerHTML = headerHTML;

    // 2. Inject Footer
    let footerContainer = document.getElementById('site-footer-container');
    if (!footerContainer) {
      const existingFooter = document.querySelector('footer');
      if (existingFooter) existingFooter.remove();
      footerContainer = document.createElement('div');
      footerContainer.id = 'site-footer-container';
      document.body.appendChild(footerContainer);
    }
    footerContainer.innerHTML = footerHTML;

    // 3. Attach Interactive Event Listeners
    setupMenuOverlay();
    setupGoUpButton();
  }

  function setupMenuOverlay() {
    const trigger = document.getElementById('menu-trigger');
    const overlay = document.getElementById('menu-overlay');
    if (!trigger || !overlay) return;

    let isOpen = false;

    trigger.addEventListener('click', () => {
      isOpen = !isOpen;
      trigger.setAttribute('aria-expanded', isOpen);
      overlay.setAttribute('aria-hidden', !isOpen);

      const menuText = trigger.querySelector('.menu-text');
      if (menuText) {
        menuText.textContent = isOpen ? 'close' : 'menu';
      }

      if (isOpen) {
        document.body.classList.add('menu-open');
        overlay.style.pointerEvents = 'auto';
        if (window.gsap) {
          window.gsap.to(overlay, {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 0.6,
            ease: 'power3.inOut'
          });
        } else {
          overlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
        }
      } else {
        document.body.classList.remove('menu-open');
        overlay.style.pointerEvents = 'none';
        if (window.gsap) {
          window.gsap.to(overlay, {
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            duration: 0.5,
            ease: 'power3.inOut'
          });
        } else {
          overlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
        }
      }
    });
  }

  function setupGoUpButton() {
    const goUpBtn = document.getElementById('go-up-btn');
    if (!goUpBtn) return;
    goUpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicComponents);
  } else {
    initDynamicComponents();
  }
})();

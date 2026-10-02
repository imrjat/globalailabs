/**
 * Global AI Labs - Dynamic Components & Navigation System
 * Loads unified responsive Header, Mobile Menu Overlay, and Footer dynamically across all pages.
 */

(function () {
    const currentPath = window.location.pathname.toLowerCase();
    const isHome = currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath.includes('index.html') || (!currentPath.includes('.html') && !currentPath.endsWith('.'));
    const isTeam = currentPath.endsWith('/team.html') || currentPath.includes('team.html');
    const isConnect = currentPath.endsWith('/connect.html') || currentPath.includes('connect.html');

    const headerHTML = `
    <header id="site-header" class="fixed top-0 left-0 w-full z-[100002] px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 flex justify-between items-center transition-all duration-300 bg-black/95 backdrop-blur-md border-b border-white/10">
      <a href="./index.html" class="focus:outline-none focus:ring-2 focus:ring-[#ff2e93] focus:ring-offset-2 flex items-center group py-1 flex-shrink-0" aria-label="Global AI Labs Home">
        <img src="./assets/img/logo.png" alt="Global AI Labs" class="h-7 sm:h-8 md:h-10 w-auto header-logo transition-transform duration-300 group-hover:scale-105 object-contain">
      </a>
      <div class="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-shrink-0">
        <a href="./connect.html" class="magnetic hidden md:inline-flex px-4 sm:px-6 py-2 border border-[#ff2e93] bg-[#ff2e93]/10 text-white text-[10px] sm:text-[11px] font-bold tracking-[0.08em] uppercase rounded-full hover:bg-[#ff2e93] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff2e93] header-connect-btn header-btn items-center justify-center">
          Connect
        </a>
        <button id="menu-trigger" type="button" aria-expanded="false" aria-controls="menu-overlay" aria-label="Toggle navigation menu" class="magnetic min-h-[38px] px-5 sm:px-6 py-2 bg-[#f0f6f8] text-[#0c1016] text-[10px] sm:text-[11px] font-bold tracking-[0.08em] uppercase rounded-full hover:bg-[#ff2e93] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff2e93] header-menu-btn flex items-center justify-center cursor-pointer select-none">
          <span class="menu-text">menu</span>
        </button>
      </div>
    </header>

    <nav id="menu-overlay" aria-hidden="true" role="dialog" aria-modal="true" class="fixed inset-0 w-full h-[100dvh] min-h-[100dvh] bg-[#06080c]/98 backdrop-blur-3xl text-ice flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16 pointer-events-none overflow-y-auto" style="clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); z-index: 100001;">
      <div class="flex justify-between items-center w-full pt-16 sm:pt-14 md:pt-16">
        <div class="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.1em] uppercase text-muted font-mono">
          <span class="w-2 h-2 rounded-full bg-[#b8ffda] animate-ping"></span>
          navigation
        </div>
        <div class="text-[10px] sm:text-[11px] tracking-[0.1em] uppercase text-muted font-mono">global ai labs</div>
      </div>

      <div class="flex flex-col gap-3 sm:gap-6 w-full my-auto py-8">
        <a href="./index.html" class="menu-main-link group block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff2e93] w-fit font-outfit ${isHome ? 'text-[#ff2e93]' : 'text-white hover:text-[#ff2e93]'}">
          home
        </a>
        <a href="./team.html" class="menu-main-link group block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff2e93] w-fit font-outfit ${isTeam ? 'text-[#ff2e93]' : 'text-white hover:text-[#ff2e93]'}">
          founders
        </a>
        <a href="./connect.html" class="menu-main-link group block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff2e93] w-fit font-outfit ${isConnect ? 'text-[#ff2e93]' : 'text-white hover:text-[#ff2e93]'}">
          contact us
        </a>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 w-full border-t border-white/10 pt-4 text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-muted font-mono">
        <div>© 2026 GLOBAL AI LABS</div>
        <div><a href="mailto:hello@globalailabs.ai" class="text-white/70 hover:text-[#ff2e93] transition-colors">hello@globalailabs.ai</a></div>
        <div>MUMBAI, INDIA</div>
      </div>
    </nav>
  `;

    const footerHTML = `
    <footer class="bg-[#06080c] text-ice py-12 sm:py-16 px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 border-t border-white/5">
      <div class="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">

        <!-- Top row -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div class="md:col-span-5 flex flex-col gap-4 text-left">
            <div class="text-[11px] tracking-[0.08em] uppercase text-muted font-mono">agency</div>
            <p class="text-sm text-white/70 max-w-sm leading-relaxed">
              We are building the operations layer for AI-era content—production workflow, post-production, and consent-verified IP, in one place.
            </p>
            <div class="flex flex-wrap items-center gap-3 mt-2">
              <a href="./connect.html" class="magnetic group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ff2e93] text-white text-[10px] sm:text-[11px] font-black tracking-[0.08em] uppercase rounded-full shadow-lg shadow-[#ff2e93]/20 hover:bg-white hover:text-[#0c1016] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2e93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080c]">
                Book a demo
                <span aria-hidden="true" class="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </a>
              <a href="./index.html" class="magnetic group inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/15 text-white text-[10px] sm:text-[11px] font-bold tracking-[0.08em] uppercase rounded-full hover:border-white hover:bg-white hover:text-[#0c1016] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080c]">
                See the platform
                <span aria-hidden="true" class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
            </div>
            <div class="text-[10px] text-muted mt-1 flex items-center gap-2">
              <span>🛡️ CCPA/GDPR Compliant</span>
              <span>·</span>
              <span>Stripe Secure</span>
            </div>
          </div>

          <div class="md:col-span-3 text-left">
            <div class="text-[11px] tracking-[0.08em] uppercase text-muted mb-4 font-mono">pages</div>
            <ul class="flex flex-col gap-2.5 text-xs font-bold uppercase tracking-wider">
              <li><a href="./index.html" class="text-white/80 hover:text-[#ff2e93] transition-colors">Home</a></li>
              <li><a href="./team.html" class="text-white/80 hover:text-[#ff2e93] transition-colors">Founders</a></li>
              <li><a href="./connect.html" class="text-white/80 hover:text-[#ff2e93] transition-colors">Connect Workspace</a></li>
            </ul>
          </div>

          <div class="md:col-span-4 flex flex-col gap-6 text-left">
            <div>
              <div class="text-[11px] tracking-[0.08em] uppercase text-muted mb-3 font-mono">support inquiries</div>
              <a href="mailto:hello@globalailabs.ai" class="text-base sm:text-lg font-bold text-[#ff2e93] hover:underline block break-all">hello@globalailabs.ai</a>
            </div>
            <div>
              <button id="go-up-btn" aria-label="Scroll to top of page" class="magnetic inline-flex items-center gap-2 px-6 py-2.5 border border-white/15 text-white text-[10px] sm:text-[11px] font-bold tracking-[0.08em] uppercase rounded-full hover:bg-white hover:text-[#0c1016] transition-all duration-300 cursor-pointer">
                go up ↑
              </button>
            </div>
          </div>
        </div>

        <!-- Giant Wordmark Logo -->
        <div class="w-full border-t border-white/5 pt-8 sm:pt-12 overflow-hidden">
          <img src="./assets/img/globalailabs.png" alt="Global AI Labs" class="w-full max-w-full opacity-100 select-none pointer-events-none" style="max-height: 22vw; object-fit: contain; object-position: left;">
        </div>

        <!-- Bottom row -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-muted border-t border-white/5 pt-6 sm:pt-8 text-center sm:text-left">
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

    function initHeaderMenu() {
        const menuTrigger = document.getElementById('menu-trigger');
        const menuOverlay = document.getElementById('menu-overlay');
        const menuCloseBtn = document.getElementById('menu-close-btn');

        if (!menuTrigger || !menuOverlay) return;
        if (menuTrigger.dataset.menuBound === 'true') return;
        menuTrigger.dataset.menuBound = 'true';

        let isMenuOpen = false;

        const openMenu = () => {
            isMenuOpen = true;
            menuTrigger.setAttribute('aria-expanded', 'true');
            menuOverlay.setAttribute('aria-hidden', 'false');

            if (window.lenisInstance) {
                window.lenisInstance.stop();
            }
            document.body.classList.add('lenis-stopped', 'menu-open');
            menuOverlay.style.pointerEvents = 'auto';
            menuOverlay.style.visibility = 'visible';

            const triggerText = menuTrigger.querySelector('.menu-text');
            if (triggerText) triggerText.textContent = 'CLOSE';
            menuTrigger.classList.add('bg-[#ff2e93]', 'text-white');
            menuTrigger.classList.remove('bg-[#f0f6f8]', 'text-[#0c1016]');

            if (window.gsap) {
                const tl = window.gsap.timeline({ defaults: { ease: 'power4.inOut', duration: 0.65 } });
                tl.to(menuOverlay, {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    opacity: 1
                });
                const mainLinks = menuOverlay.querySelectorAll('.menu-main-link');
                tl.fromTo(mainLinks,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.45, stagger: 0.07 },
                    '-=0.35'
                );
            } else {
                menuOverlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
                menuOverlay.style.opacity = '1';
            }
        };

        const closeMenu = () => {
            isMenuOpen = false;
            menuTrigger.setAttribute('aria-expanded', 'false');
            menuOverlay.setAttribute('aria-hidden', 'true');

            if (window.lenisInstance) {
                window.lenisInstance.start();
            }
            document.body.classList.remove('lenis-stopped', 'menu-open');

            const triggerText = menuTrigger.querySelector('.menu-text');
            if (triggerText) triggerText.textContent = 'MENU';
            menuTrigger.classList.remove('bg-[#ff2e93]', 'text-white');
            menuTrigger.classList.add('bg-[#f0f6f8]', 'text-[#0c1016]');

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
        };

        menuTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isMenuOpen) closeMenu();
            else openMenu();
        });

        if (menuCloseBtn) {
            menuCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isMenuOpen) closeMenu();
            });
        }

        const menuLinks = menuOverlay.querySelectorAll('a');
        menuLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (isMenuOpen) closeMenu();
            });
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) closeMenu();
        });
    }

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

        // 3. Immediately activate Header Menu behavior
        initHeaderMenu();

        // 4. Notify listeners that components have been mounted
        window.dispatchEvent(new CustomEvent('components:mounted'));
    }

    // Mount right away when the mount points are already parsed (script sits at end of <body>),
    // so the header is in the very first painted frame and page transitions don't flicker.
    if (document.readyState === 'loading' && !document.getElementById('site-header-container')) {
        document.addEventListener('DOMContentLoaded', initDynamicComponents);
    } else {
        initDynamicComponents();
    }
})();

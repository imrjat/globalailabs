import { initCursor } from './cursor.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initMenu } from './menu.js';
import { initPageTransitions } from './page-transition.js';
import { 
  initLoader, 
  initScrollReveals, 
  initMagneticButtons, 
  initHeroCanvas, 
  initServicesCanvas 
} from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Global Utilities
  initPageTransitions();
  initSmoothScroll();
  initMenu();
  initCursor();
  initMagneticButtons();
  initLoader();

  // Determine current page context
  const path = window.location.pathname;
  const isHome = path === '/' || path.includes('index.html') || path.endsWith('global/');
  const isWork = path.includes('work.html');
  const isTeam = path.includes('team.html');
  const isCareers = path.includes('careers.html');
  const isConnect = path.includes('connect.html');

  // Page specific initializations
  if (isHome) {
    initHomePage();
  } else if (isWork) {
    initWorkPage();
  }

  // Footer "GO UP" smooth scroll behavior
  const goUpBtn = document.getElementById('go-up-btn');
  if (goUpBtn) {
    goUpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Common animations on all sub-pages
  initScrollReveals();
});

// --- HOME PAGE LOGIC ---
function initHomePage() {
  // Canvases
  const cleanHeroCanvas = initHeroCanvas();
  const cleanServicesCanvas = initServicesCanvas();

  // Clean up canvas loops when leaving page
  window.addEventListener('beforeunload', () => {
    if (cleanHeroCanvas) cleanHeroCanvas();
    if (cleanServicesCanvas) cleanServicesCanvas();
  });

  // Services Accordion/Panels
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Deactivate others
      serviceCards.forEach(c => {
        if (c !== card) {
          c.classList.remove('active', 'flex-grow');
          c.classList.add('opacity-40');
        }
      });
      // Activate hovered
      card.classList.add('active', 'flex-grow');
      card.classList.remove('opacity-40');
    });

    card.addEventListener('mouseleave', () => {
      // Reset all back to original equal sizes
      serviceCards.forEach(c => {
        c.classList.remove('active', 'flex-grow', 'opacity-40');
      });
    });
  });

  // Work Hover Previews
  setupWorkHoverPreviews();
}

// --- WORK PAGE LOGIC ---
function initWorkPage() {
  const gridBtn = document.getElementById('view-grid-btn');
  const listBtn = document.getElementById('view-list-btn');
  const workGrid = document.getElementById('work-grid-container');
  const workList = document.getElementById('work-list-container');

  if (!gridBtn || !listBtn || !workGrid || !workList) return;

  const setViewMode = (mode) => {
    localStorage.setItem('work-view-mode', mode);

    if (mode === 'grid') {
      gridBtn.classList.add('bg-ink', 'text-ice');
      gridBtn.classList.remove('bg-transparent', 'text-ink');
      listBtn.classList.remove('bg-ink', 'text-ice');
      listBtn.classList.add('bg-transparent', 'text-ink');
      
      workGrid.classList.remove('hidden');
      workList.classList.add('hidden');
    } else {
      listBtn.classList.add('bg-ink', 'text-ice');
      listBtn.classList.remove('bg-transparent', 'text-ink');
      gridBtn.classList.remove('bg-ink', 'text-ice');
      gridBtn.classList.add('bg-transparent', 'text-ink');

      workList.classList.remove('hidden');
      workGrid.classList.add('hidden');
    }

    // Refresh ScrollTrigger to update positions
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  };

  // Click listeners
  gridBtn.addEventListener('click', () => setViewMode('grid'));
  listBtn.addEventListener('click', () => setViewMode('list'));

  // Load saved view from localStorage
  const savedMode = localStorage.getItem('work-view-mode') || 'grid';
  setViewMode(savedMode);

  // Setup list row hover previews
  setupWorkHoverPreviews();
}

// --- CASE STUDIES HOVER PREVIEW ---
function setupWorkHoverPreviews() {
  const projectRows = document.querySelectorAll('.project-row');
  const hoverContainer = document.querySelector('.work-preview-hover-container');

  if (!hoverContainer || projectRows.length === 0) return;

  projectRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const gradient = row.getAttribute('data-gradient');
      const accent = row.getAttribute('data-accent');

      // Update background gradient of hover element
      hoverContainer.style.background = gradient;
      hoverContainer.style.display = 'block';
      
      if (window.gsap) {
        window.gsap.to(hoverContainer, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power3.out'
        });
      } else {
        hoverContainer.style.opacity = '1';
        hoverContainer.style.transform = 'scale(1) translate(-50%, -50%)';
      }
    });

    row.addEventListener('mousemove', (e) => {
      // Smooth container following using GSAP
      if (window.gsap) {
        window.gsap.to(hoverContainer, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        hoverContainer.style.left = `${e.clientX}px`;
        hoverContainer.style.top = `${e.clientY}px`;
      }
    });

    row.addEventListener('mouseleave', () => {
      if (window.gsap) {
        window.gsap.to(hoverContainer, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power3.out',
          onComplete: () => {
            hoverContainer.style.display = 'none';
          }
        });
      } else {
        hoverContainer.style.opacity = '0';
        hoverContainer.style.transform = 'scale(0.8) translate(-50%, -50%)';
        hoverContainer.style.display = 'none';
      }
    });
  });
}

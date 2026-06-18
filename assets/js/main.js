import { initCursor } from './cursor.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initMenu } from './menu.js';
import { initPageTransitions } from './page-transition.js';
import { 
  initLoader, 
  initScrollReveals, 
  initMagneticButtons, 
  initHeroParallax, 
  initServicesCanvas,
  initStudioAnimations
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
  // Parallax Hero and lines connection
  const cleanHeroParallax = initHeroParallax();
  const cleanServicesCanvas = initServicesCanvas();
  
  // Initialize Studio Scroll Animations
  initStudioAnimations();

  // Clean up loops when leaving page
  window.addEventListener('beforeunload', () => {
    if (cleanHeroParallax) cleanHeroParallax();
    if (cleanServicesCanvas) cleanServicesCanvas();
  });

  // 1. Capabilities Showcase Tab Selector
  const tabs = document.querySelectorAll('.showcase-tab-btn');
  const contents = document.querySelectorAll('.showcase-tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-showcase');
      
      // Update active tab button style
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Toggle visibility of panels
      contents.forEach(content => {
        if (content.id === `showcase-${targetId}`) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });

  // 2. Pricing Subscription toggle (Monthly vs Yearly)
  const monthlyBtn = document.getElementById('toggle-monthly');
  const yearlyBtn = document.getElementById('toggle-yearly');
  const toggleBg = document.querySelector('.pricing-toggle-bg');
  const priceVals = document.querySelectorAll('.price-val');
  const priceNotes = document.querySelectorAll('.price-note');
  const creditsCounts = document.querySelectorAll('.credits-count');
  const vidsCounts = document.querySelectorAll('.vids-count');

  if (monthlyBtn && yearlyBtn && toggleBg) {
    const setBillingCycle = (cycle) => {
      if (cycle === 'yearly') {
        monthlyBtn.classList.remove('active');
        yearlyBtn.classList.add('active');
        toggleBg.style.transform = 'translateX(100%)';
        
        priceVals.forEach(val => {
          val.textContent = val.getAttribute('data-yearly');
        });
        priceNotes.forEach(note => {
          note.textContent = note.getAttribute('data-yearly');
        });
        creditsCounts.forEach(count => {
          count.textContent = count.getAttribute('data-yearly');
        });
        vidsCounts.forEach(count => {
          count.textContent = count.getAttribute('data-yearly');
        });
      } else {
        yearlyBtn.classList.remove('active');
        monthlyBtn.classList.add('active');
        toggleBg.style.transform = 'translateX(0)';
        
        priceVals.forEach(val => {
          val.textContent = val.getAttribute('data-monthly');
        });
        priceNotes.forEach(note => {
          note.textContent = note.getAttribute('data-monthly');
        });
        creditsCounts.forEach(count => {
          count.textContent = count.getAttribute('data-monthly');
        });
        vidsCounts.forEach(count => {
          count.textContent = count.getAttribute('data-monthly');
        });
      }
    };

    monthlyBtn.addEventListener('click', () => setBillingCycle('monthly'));
    yearlyBtn.addEventListener('click', () => setBillingCycle('yearly'));
  }

  // 3. FAQ Accordion Item expands/collapses
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Collapse all items
        faqItems.forEach(i => {
          i.classList.remove('active');
          const h = i.querySelector('.faq-header');
          if (h) h.setAttribute('aria-expanded', 'false');
        });

        // Expand clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // 4. Audio preview play indicator toggle
  const audioSyncBtn = document.getElementById('hero-audio-sync');
  if (audioSyncBtn) {
    let audioState = false;
    audioSyncBtn.addEventListener('click', () => {
      audioState = !audioState;
      const icon = audioSyncBtn.querySelector('.audio-icon');
      const text = audioSyncBtn.nextElementSibling?.querySelector('span:first-child');
      
      if (audioState) {
        icon.textContent = '🔊';
        icon.classList.add('animate-bounce');
        if (text) text.textContent = 'Beat Sync Preview Playing';
        audioSyncBtn.style.backgroundColor = 'var(--color-pink-neon)';
      } else {
        icon.textContent = '🔇';
        icon.classList.remove('animate-bounce');
        if (text) text.textContent = 'Beat Sync Preview Muted';
        audioSyncBtn.style.backgroundColor = 'rgba(255,255,255,0.05)';
      }
    });
  }
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

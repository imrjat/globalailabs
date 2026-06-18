// 1. First-Visit Loader Animation
export function initLoader() {
  const loader = document.getElementById('loader-overlay');
  if (!loader) return;

  const isPlayed = sessionStorage.getItem('loader-played');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isPlayed === 'true' || prefersReducedMotion) {
    loader.style.display = 'none';
    return;
  }

  // Set flag in sessionStorage
  sessionStorage.setItem('loader-played', 'true');

  const progressText = loader.querySelector('.loader-progress');
  const loaderTitle = loader.querySelector('.loader-title');

  // GSAP Timeline for Loader
  if (window.gsap) {
    const tl = window.gsap.timeline({
      onComplete: () => {
        // Slide loader up and out
        window.gsap.to(loader, {
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          duration: 1.0,
          ease: 'expo.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            // Trigger Hero animations
            animateHeroEntrance();
          }
        });
      }
    });

    // 1. Split title letters reveal
    if (loaderTitle) {
      const text = loaderTitle.textContent.trim();
      loaderTitle.innerHTML = text.split('').map(char => 
        char === ' ' ? '&nbsp;' : `<span class="inline-block loader-char">${char}</span>`
      ).join('');

      tl.fromTo('.loader-char', 
        { y: '120%', rotate: 8, opacity: 0 },
        { y: '0%', rotate: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: 'power4.out' }
      );
    }

    // 2. Count progress 00 to 100
    if (progressText) {
      const counter = { val: 0 };
      tl.to(counter, {
        val: 100,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          const num = Math.floor(counter.val);
          progressText.textContent = num < 10 ? `0${num}` : num;
        }
      }, '-=0.4');
    }
  } else {
    // CSS fallback if GSAP not loaded
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      if (progressText) progressText.textContent = progress < 10 ? `0${progress}` : progress;
      if (progress >= 100) {
        clearInterval(interval);
        loader.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
        setTimeout(() => {
          loader.style.display = 'none';
          animateHeroEntrance();
        }, 800);
      }
    }, 30);
  }
}

// 2. Hero entrance animations
export function animateHeroEntrance() {
  if (!window.gsap) return;

  const tl = window.gsap.timeline();

  // 1. Fade/Slide in the left side copy elements
  const versionTag = document.querySelector('section span.px-3');
  const h1 = document.querySelector('section h1');
  const listItems = document.querySelectorAll('section ul li');
  const descParagraph = document.querySelector('section p');
  const ctas = document.querySelector('section .flex-row');
  const bottomBar = document.querySelector('section .border-t');

  const targets = [];
  if (versionTag) targets.push(versionTag);
  if (h1) targets.push(h1);
  if (listItems.length > 0) listItems.forEach(item => targets.push(item));
  if (descParagraph) targets.push(descParagraph);
  if (ctas) targets.push(ctas);

  if (targets.length > 0) {
    tl.fromTo(targets,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }
    );
  }

  // 2. Scale up/fade in the right side parallax wrapper
  const parallaxWrap = document.querySelector('.parallax-wrap');
  if (parallaxWrap) {
    tl.fromTo(parallaxWrap,
      { scale: 0.96, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'power4.out' },
      '-=0.6'
    );
  }

  // 3. Fade in bottom bar
  if (bottomBar) {
    tl.fromTo(bottomBar,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    );
  }
}

// 3. ScrollTrigger Split-Text reveal (Color Highlight)
export function initScrollReveals() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const revealTexts = document.querySelectorAll('.text-reveal-scroll');
  revealTexts.forEach(el => {
    const text = el.textContent.trim();
    // Wrap each word in a span
    el.innerHTML = text.split(/\s+/).map(word => 
      `<span class="inline-block relative opacity-20 transition-all duration-300 mr-2 reveal-word">${word}</span>`
    ).join(' ');

    const words = el.querySelectorAll('.reveal-word');

    window.gsap.to(words, {
      opacity: 1,
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'bottom 50%',
        scrub: true,
      }
    });
  });

  // Staggered reveals for cards
  const staggerContainers = document.querySelectorAll('.stagger-container');
  staggerContainers.forEach(container => {
    const cards = container.querySelectorAll('.stagger-card');
    window.gsap.fromTo(cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
        }
      }
    );
  });
}

// 4. Magnetic Buttons Action
export function initMagneticButtons() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  const magneticElements = document.querySelectorAll('.magnetic');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const bound = el.getBoundingClientRect();
      const x = e.clientX - bound.left - bound.width / 2;
      const y = e.clientY - bound.top - bound.height / 2;

      // Pull element contents towards cursor (magnetic strength: 0.35)
      window.gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      // Reset position
      window.gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
}

// 5. Hero Parallax and Connection Lines
export function initHeroParallax() {
  const wrap = document.querySelector('.parallax-wrap');
  const mainVisual = document.getElementById('hero-main-visual');
  const w1 = document.getElementById('hero-widget-1');
  const w2 = document.getElementById('hero-widget-2');
  const w3 = document.getElementById('hero-widget-3');
  const svg = document.getElementById('hero-svg-connections');

  if (!wrap) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  const onMouseMove = (e) => {
    const rect = wrap.getBoundingClientRect();
    // Normalize coordinates relative to wrap center (-1 to 1)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX = (e.clientX - centerX) / (rect.width / 2);
    mouseY = (e.clientY - centerY) / (rect.height / 2);
  };

  window.addEventListener('mousemove', onMouseMove);

  // Connection Lines Update Loop
  const updateLines = () => {
    if (!wrap || !svg || !mainVisual || !w1 || !w2 || !w3) return;

    const wrapRect = wrap.getBoundingClientRect();
    const coreRect = mainVisual.getBoundingClientRect();

    const coreX = (coreRect.left + coreRect.width / 2) - wrapRect.left;
    const coreY = (coreRect.top + coreRect.height / 2) - wrapRect.top;

    const getRelativeCenter = (el) => {
      const r = el.getBoundingClientRect();
      return {
        x: (r.left + r.width / 2) - wrapRect.left,
        y: (r.top + r.height / 2) - wrapRect.top
      };
    };

    const c1 = getRelativeCenter(w1);
    const c2 = getRelativeCenter(w2);
    const c3 = getRelativeCenter(w3);

    const line1 = document.getElementById('line-widget-1');
    const line2 = document.getElementById('line-widget-2');
    const line3 = document.getElementById('line-widget-3');

    if (line1) {
      line1.setAttribute('x1', c1.x);
      line1.setAttribute('y1', c1.y);
      line1.setAttribute('x2', coreX);
      line1.setAttribute('y2', coreY);
    }
    if (line2) {
      line2.setAttribute('x1', c2.x);
      line2.setAttribute('y1', c2.y);
      line2.setAttribute('x2', coreX);
      line2.setAttribute('y2', coreY);
    }
    if (line3) {
      line3.setAttribute('x1', c3.x);
      line3.setAttribute('y1', c3.y);
      line3.setAttribute('x2', coreX);
      line3.setAttribute('y2', coreY);
    }
  };

  let animationId;
  const tick = () => {
    // Smooth interpolation (lag/damping)
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    // Apply parallax offset translations to different layers
    if (window.gsap) {
      window.gsap.set(mainVisual, {
        x: currentX * 25,
        y: currentY * 25,
        overwrite: 'auto'
      });
      window.gsap.set(w1, {
        x: currentX * 45,
        y: currentY * 45,
        overwrite: 'auto'
      });
      window.gsap.set(w2, {
        x: currentX * -35,
        y: currentY * -35,
        overwrite: 'auto'
      });
      window.gsap.set(w3, {
        x: currentX * 55,
        y: currentY * 55,
        overwrite: 'auto'
      });
    } else {
      mainVisual.style.transform = `translate(${currentX * 25}px, ${currentY * 25}px)`;
      w1.style.transform = `translate(${currentX * 45}px, ${currentY * 45}px)`;
      w2.style.transform = `translate(${currentX * -35}px, ${currentY * -35}px)`;
      w3.style.transform = `translate(${currentX * 55}px, ${currentY * 55}px)`;
    }

    updateLines();
    animationId = requestAnimationFrame(tick);
  };

  animationId = requestAnimationFrame(tick);
  window.addEventListener('resize', updateLines);

  // Initial call
  setTimeout(updateLines, 150);

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', updateLines);
  };
}

// 6. Canvas: Services Interactive Particles / Playground (Services Section)
export function initServicesCanvas() {
  const canvas = document.getElementById('services-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;

  const resize = () => {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const particleCount = 40;
  const colors = ['#b8ffda', '#9ff7ff', '#e5ffb8', '#ffd9f4'];

  const mouse = { x: -1000, y: -1000, active: false };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      baseRadius: Math.random() * 3 + 2
    });
  }

  const drawPlayground = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw interactive nodes & connections
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update particle positions
      p.x += p.vx;
      p.y += p.vy;

      // Bounce on edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Magnetism attraction to mouse
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
          p.radius = p.baseRadius * 1.8;
        } else {
          p.radius = p.baseRadius;
        }
      } else {
        p.radius = p.baseRadius;
      }

      // Draw particle dot
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Connecting lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 85) {
          ctx.strokeStyle = `rgba(12, 16, 22, ${0.12 * (1 - dist / 85)})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  };

  const loop = () => {
    drawPlayground();
    animationId = requestAnimationFrame(loop);
  };
  animationId = requestAnimationFrame(loop);

  // Expose clean-up handler
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
  };
}

// 7. Interactive Studio Scroll Animations (Stage 1, 2, and 3)
export function initStudioAnimations() {
  const section = document.getElementById('studio');
  const dashboard = document.getElementById('studio-dashboard');
  const leftPanel = document.getElementById('studio-panel-left');
  const centerPanel = document.getElementById('studio-panel-center');
  const rightPanel = document.getElementById('studio-panel-right');
  const floatCards = [
    document.getElementById('float-card-1'),
    document.getElementById('float-card-2'),
    document.getElementById('float-card-3'),
    document.getElementById('float-card-4'),
    document.getElementById('float-card-5'),
    document.getElementById('float-card-6')
  ];

  if (!section || !dashboard || !window.gsap || !window.ScrollTrigger) return;

  // Timeline 1: Entrance reveal of the whole section and panels
  const entranceTimeline = window.gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  });

  // Stage 1: Fade and scale section up, dashboard rises
  entranceTimeline.to(section, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out'
  });

  // Stage 2: Dashboard panels reveal
  if (leftPanel && rightPanel && centerPanel) {
    entranceTimeline.fromTo(leftPanel, 
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.4'
    );
    entranceTimeline.fromTo(rightPanel, 
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.7'
    );
    entranceTimeline.fromTo(centerPanel, 
      { scale: 0.96, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' },
      '-=0.5'
    );
  }

  // Stagger floating cards entrance
  const validCards = floatCards.filter(c => c !== null);
  if (validCards.length > 0) {
    entranceTimeline.fromTo(validCards, 
      { scale: 0.7, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.5)' },
      '-=0.4'
    );
  }

  // Timeline 2: Scroll scrubbing/parallax
  const scrubTimeline = window.gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1
    }
  });

  // Dashboard scale and ambient glow increase
  scrubTimeline.to(dashboard, {
    scale: 1.04,
    ease: 'none'
  }, 0);

  const glow = section.querySelector('.studio-glow');
  if (glow) {
    scrubTimeline.to(glow, {
      scale: 1.25,
      opacity: 0.7,
      ease: 'none'
    }, 0);
  }

  // Parallax offsets for floating cards
  const parallaxOffsets = [ -70, -35, 45, -45, 75, 50 ];
  validCards.forEach((card, index) => {
    const offset = parallaxOffsets[index] || 40;
    scrubTimeline.to(card, {
      y: offset,
      ease: 'none'
    }, 0);
  });
}


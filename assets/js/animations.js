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
  const heroWordmark = document.querySelector('.hero-wordmark');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroIntro = document.querySelector('.hero-intro');
  const heroCTAs = document.querySelector('.hero-ctas');

  if (!window.gsap) return;

  const tl = window.gsap.timeline();

  if (heroWordmark) {
    tl.fromTo(heroWordmark, 
      { y: 150, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: 'expo.out' }
    );
  }

  if (heroTagline || heroIntro || heroCTAs) {
    tl.fromTo([heroTagline, heroIntro, heroCTAs], 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, stagger: 0.15, ease: 'power3.out' },
      '-=0.8'
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

// 5. Canvas: Floating AI / Content Signal Device (Hero Section)
export function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;

  // Set canvas size
  const resizeCanvas = () => {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const device = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    baseY: canvas.height / 2,
    targetX: canvas.width / 2,
    targetY: canvas.height / 2,
    rotation1: 0,
    rotation2: 0,
    radius: Math.min(canvas.width, canvas.height) * 0.14,
    pulse: 0,
    mouseParallaxX: 0,
    mouseParallaxY: 0
  };

  // Tracking mouse for parallax
  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;
    
    device.mouseParallaxX = (mouseX - canvas.width / 2) * 0.08;
    device.mouseParallaxY = (mouseY - canvas.height / 2) * 0.08;
  });

  const drawDevice = (time) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply slow bobbing/floating motion
    const bob = Math.sin(time * 0.002) * 15;
    device.x += (canvas.width / 2 + device.mouseParallaxX - device.x) * 0.1;
    device.y += (device.baseY + bob + device.mouseParallaxY - device.y) * 0.1;

    device.pulse = Math.sin(time * 0.005) * 3 + 6;
    
    // Draw outer glow
    const glowGradient = ctx.createRadialGradient(
      device.x, device.y, device.radius * 0.1, 
      device.x, device.y, device.radius * 1.3
    );
    glowGradient.addColorStop(0, 'rgba(159, 247, 255, 0.07)');
    glowGradient.addColorStop(0.5, 'rgba(184, 255, 218, 0.02)');
    glowGradient.addColorStop(1, 'rgba(12, 16, 22, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(device.x, device.y, device.radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Draw grid rings (outer rotating circle)
    device.rotation1 += 0.0025;
    ctx.strokeStyle = 'rgba(12, 16, 22, 0.12)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(device.x, device.y, device.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Dot dashes ring
    ctx.save();
    ctx.translate(device.x, device.y);
    ctx.rotate(device.rotation1);
    ctx.strokeStyle = 'rgba(12, 16, 22, 0.25)';
    ctx.setLineDash([4, 12]);
    ctx.beginPath();
    ctx.arc(0, 0, device.radius * 0.85, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Inner reverse rotating ring
    device.rotation2 -= 0.004;
    ctx.save();
    ctx.translate(device.x, device.y);
    ctx.rotate(device.rotation2);
    ctx.strokeStyle = 'rgba(12, 16, 22, 0.35)';
    ctx.setLineDash([20, 30]);
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(0, 0, device.radius * 0.65, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Center Core Lens
    const coreGrad = ctx.createRadialGradient(
      device.x, device.y - 3, 1, 
      device.x, device.y, device.radius * 0.25
    );
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, 'rgba(159, 247, 255, 0.7)');
    coreGrad.addColorStop(0.8, 'rgba(184, 255, 218, 0.4)');
    coreGrad.addColorStop(1, 'rgba(12, 16, 22, 0)');

    ctx.fillStyle = coreGrad;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#9ff7ff';
    ctx.beginPath();
    ctx.arc(device.x, device.y, device.radius * 0.25 + (device.pulse * 0.1), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // reset shadow

    // Digital circular waveform
    ctx.strokeStyle = 'rgba(12, 16, 22, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const points = 45;
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const waveVal = Math.sin(angle * 12 + time * 0.008) * (2 + device.pulse * 0.3);
      const r = device.radius * 0.48 + waveVal;
      const px = device.x + Math.cos(angle) * r;
      const py = device.y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const loop = (time) => {
    drawDevice(time);
    animationId = requestAnimationFrame(loop);
  };
  animationId = requestAnimationFrame(loop);

  // Expose clean-up handler
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resizeCanvas);
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

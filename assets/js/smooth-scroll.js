export function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion || !window.Lenis) {
    console.log("Smooth scroll disabled due to user preference or missing Lenis library.");
    return null;
  }

  // Initialize Lenis
  const lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  // Update ScrollTrigger on scroll
  if (window.ScrollTrigger) {
    lenis.on('scroll', window.ScrollTrigger.update);
  }

  // Bind Lenis animation frame loop to GSAP ticker if GSAP is present
  if (window.gsap) {
    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    window.gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  window.lenisInstance = lenis;
  return lenis;
}

// Registers the ScrollTrigger plugin once GSAP and ScrollTrigger (deferred scripts above it) have loaded.
if (window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);
}

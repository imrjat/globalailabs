export function initCursor() {
  // Check for touch device or reduced motion
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice || prefersReducedMotion) {
    return;
  }

  // Create cursor elements if they don't exist
  let cursorDot = document.querySelector('.custom-cursor');
  let cursorFollower = document.querySelector('.custom-cursor-follower');

  if (!cursorDot) {
    cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor';
    document.body.appendChild(cursorDot);
  }

  if (!cursorFollower) {
    cursorFollower = document.createElement('div');
    cursorFollower.className = 'custom-cursor-follower';
    cursorFollower.innerHTML = '<span>VIEW</span>';
    document.body.appendChild(cursorFollower);
  }

  // Show cursors
  cursorDot.style.display = 'block';
  cursorFollower.style.display = 'flex';

  const mouse = { x: 0, y: 0 };
  const dotPos = { x: 0, y: 0 };
  const followerPos = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Smooth cursor follow using requestAnimationFrame
  function updateCursor() {
    // Dot positioning
    dotPos.x += (mouse.x - dotPos.x);
    dotPos.y += (mouse.y - dotPos.y);
    cursorDot.style.left = `${dotPos.x}px`;
    cursorDot.style.top = `${dotPos.y}px`;

    // Follower positioning (slower, for smooth delay)
    followerPos.x += (mouse.x - followerPos.x) * 0.15;
    followerPos.y += (mouse.y - followerPos.y) * 0.15;
    cursorFollower.style.left = `${followerPos.x}px`;
    cursorFollower.style.top = `${followerPos.y}px`;

    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Hover states
  const addHoverListeners = () => {
    // Buttons, links, menu items
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], .interactive-element, .magnetic');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
        cursorFollower.style.width = '80px';
        cursorFollower.style.height = '80px';
        cursorFollower.style.borderColor = 'var(--color-signal)';
        cursorFollower.style.backgroundColor = 'rgba(240, 246, 248, 0.05)';
      });

      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
        cursorFollower.style.borderColor = 'var(--color-ink)';
        cursorFollower.style.backgroundColor = 'transparent';
      });
    });

    // Special VIEW state on project rows
    const projectRows = document.querySelectorAll('.project-row, .project-card-interactive');
    projectRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
        cursorFollower.style.width = '100px';
        cursorFollower.style.height = '100px';
        cursorFollower.style.backgroundColor = 'var(--color-ink)';
        cursorFollower.style.borderColor = 'var(--color-signal)';
        const textSpan = cursorFollower.querySelector('span');
        if (textSpan) {
          textSpan.style.display = 'block';
          textSpan.style.color = 'var(--color-signal)';
        }
      });

      row.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
        cursorFollower.style.backgroundColor = 'transparent';
        cursorFollower.style.borderColor = 'var(--color-ink)';
        const textSpan = cursorFollower.querySelector('span');
        if (textSpan) {
          textSpan.style.display = 'none';
        }
      });
    });
  };

  addHoverListeners();

  // Expose function to re-initialize listeners for dynamically updated content
  window.refreshCursorListeners = addHoverListeners;
}

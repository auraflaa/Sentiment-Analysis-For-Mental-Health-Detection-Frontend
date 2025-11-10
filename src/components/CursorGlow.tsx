import React, { useEffect, useRef } from 'react';

// Soft, single cursor treatment with gentle motion and calm colors.
// Hidden automatically on touch devices and honours reduced-motion preferences.
const CursorGlow: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const interactiveRef = useRef(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const aura = auraRef.current;

    if (!dot || !ring || !aura) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouchDevice || prefersReduced) return;

    const baseRing = () => {
      ring.style.border = '1.5px solid rgba(148,163,184,0.35)';
      ring.style.boxShadow = '0 0 26px 10px rgba(148,163,184,0.12)';
      aura.style.opacity = '0.25';
      aura.style.transform = aura.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(1.1)';
    };

    const focusRing = () => {
      ring.style.border = '1.5px solid rgba(56,189,248,0.45)';
      ring.style.boxShadow = '0 0 30px 12px rgba(56,189,248,0.18)';
      aura.style.opacity = '0.35';
      aura.style.transform = aura.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(1.25)';
    };

    // Hide cursor but ensure inputs remain interactive
    document.body.style.cursor = 'none';
    // Ensure all interactive elements have proper cursor
    const style = document.createElement('style');
    style.setAttribute('data-cursor-style', 'true');
    style.textContent = `
      input, textarea, select {
        cursor: text !important;
      }
      input:focus, textarea:focus, select:focus {
        cursor: text !important;
      }
      button, a, [role="button"] {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);
    baseRing();

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;

    const interactiveSelectors = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      '[role="button"]',
      '.cursor-hover'
    ].join(',');

    const handleInteractiveState = (target: EventTarget | null) => {
      let element = target as HTMLElement | null;
      let isInteractive = false;

      while (element) {
        if (element.matches?.(interactiveSelectors)) {
          isInteractive = true;
          break;
        }
        element = element.parentElement;
      }

      if (isInteractive !== interactiveRef.current) {
        interactiveRef.current = isInteractive;
        if (interactiveRef.current) {
          focusRing();
        } else {
          baseRing();
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      handleInteractiveState(e.target);
    };

    const onDown = () => {
      ring.style.transform = ring.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(0.92)';
      aura.style.opacity = '0.45';
    };

    const onUp = () => {
      ring.style.transform = ring.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(1)';
      aura.style.opacity = interactiveRef.current ? '0.35' : '0.25';
    };

    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      aura.style.opacity = '0';
    };

    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      aura.style.opacity = interactiveRef.current ? '0.35' : '0.25';
    };

    const tick = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;

      const dotX = x - 5;
      const dotY = y - 5;
      const ringX = x - 16;
      const ringY = y - 16;
      const auraX = x - 30;
      const auraY = y - 30;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)` + (interactiveRef.current ? ' scale(1.25)' : ' scale(1.1)');

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('mouseover', onEnter);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('mouseover', onEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = 'auto';
      // Remove the style element
      const styleElement = document.head.querySelector('style[data-cursor-style]');
      if (styleElement) styleElement.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={auraRef}
        className="pointer-events-none fixed left-0 top-0 z-[55] hidden md:block"
        aria-hidden="true"
        style={{
          width: 60,
          height: 60,
          borderRadius: 9999,
          background: 'radial-gradient(closest-side, rgba(125,211,252,0.18), rgba(125,211,252,0))',
          opacity: 0,
          mixBlendMode: 'screen',
          transition: 'opacity 250ms ease, transform 250ms ease'
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
        aria-hidden="true"
        style={{
          width: 32,
          height: 32,
          borderRadius: 9999,
          transform: 'scale(1)',
          transition: 'opacity 200ms ease, transform 180ms ease'
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[61] hidden md:block"
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: 9999,
          background: 'linear-gradient(135deg, rgba(14,165,233,0.55), rgba(45,212,191,0.65))',
          boxShadow: '0 0 18px 10px rgba(56,189,248,0.22)',
          transition: 'opacity 180ms ease'
        }}
      />
    </>
  );
};

export default CursorGlow;


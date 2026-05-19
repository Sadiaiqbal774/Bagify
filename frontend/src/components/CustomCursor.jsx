import React, { useState, useEffect, useRef } from 'react';

const isInteractiveTarget = (target) => {
  if (!target || !target.closest) return false;
  return !!target.closest(
    'a, button, input, select, textarea, label, [role="button"], .product-card-premium, .action-btn, .btn, .nav-link, .filter-btn, .chatbot-launcher-modern, .chat-quick-chip'
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [ringPosition, setRingPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const ringRef = useRef({ x: -100, y: -100 });
  const frameRef = useRef(null);

  useEffect(() => {
    const touch =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 768px)').matches;
    setIsTouchDevice(touch);
    if (touch) return;

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        ringRef.current.x += (e.clientX - ringRef.current.x) * 0.22;
        ringRef.current.y += (e.clientY - ringRef.current.y) * 0.22;
        setRingPosition({ x: ringRef.current.x, y: ringRef.current.y });
      });
    };

    const onMouseOver = (e) => setIsHovering(isInteractiveTarget(e.target));
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  const hidden = !isVisible;

  return (
    <>
      <div
        className={`custom-cursor-dot ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''} ${hidden ? 'custom-cursor-hidden' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        aria-hidden
      />
      <div
        className={`custom-cursor-ring ${isHovering ? 'hover' : ''} ${hidden ? 'custom-cursor-hidden' : ''}`}
        style={{ left: `${ringPosition.x}px`, top: `${ringPosition.y}px` }}
        aria-hidden
      />
    </>
  );
};

export default CustomCursor;

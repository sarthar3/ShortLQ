import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [waterInteraction, setWaterInteraction] = useState(false);

  useEffect(() => {
    // Detect touch device
    const touchQuery = window.matchMedia('(pointer: coarse)');
    if (touchQuery.matches) {
      setIsTouchDevice(true);
      return;
    }

    setIsVisible(true);
    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Update dot position immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Add water interaction effect - subtle visual feedback
      setWaterInteraction(true);
      clearTimeout(window.waterInteractionTimeout);
      window.waterInteractionTimeout = setTimeout(() => {
        setWaterInteraction(false);
      }, 150);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    // Event delegation for hover states
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest('a, button, input, select, textarea, .btn, .copy-btn, [role="button"], .navbar-toggle');
      if (interactive) {
        setHovered(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest('a, button, input, select, textarea, .btn, .copy-btn, [role="button"], .navbar-toggle');
      if (interactive) {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    // Lerp loop for trailing ring
    let animationFrameId;
    const updateRing = () => {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      // Lerp logic: current = current + (target - current) * factor
      const lerpFactor = 0.16;
      ringPosRef.current.x += (targetX - ringPosRef.current.x) * lerpFactor;
      ringPosRef.current.y += (targetY - ringPosRef.current.y) * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(updateRing);
    };
    updateRing();

    // Cleanup
    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="custom-cursor">
      <div 
        ref={dotRef} 
        className={`cursor-dot ${hovered ? 'hovered' : ''}`} 
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${hovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''} ${waterInteraction ? 'water-interaction' : ''}`}
      />
    </div>
  );
};

export default CustomCursor;

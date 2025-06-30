// src/components/CustomCursor.jsx
import { useEffect, useRef, useState } from 'react';
import './CustomCursor.css'; // We'll create this next

export default function CustomCursor() {
  const cursorDot = useRef(null);
  const cursorOutline = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const requestRef = useRef();
  const previousTimeRef = useRef();

  // Animation smoothness (0.1 = smoother, 0.9 = faster)
  const dotSpeed = 0.15;
  const outlineSpeed = 0.08;

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);

    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], [data-cursor-hover] , h3 , h2 , img'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    const animateCursor = (time) => {
      if (previousTimeRef.current !== undefined) {
        if (cursorDot.current && cursorOutline.current) {
          // Smooth dot movement
          cursorDot.current.style.left = `${lerp(
            parseFloat(cursorDot.current.style.left || '2'),
            position.x,
            dotSpeed
          )}px`;
          
          cursorDot.current.style.top = `${lerp(
            parseFloat(cursorDot.current.style.top || '2'),
            position.y,
            dotSpeed
          )}px`;

          // Smoother outline movement
          cursorOutline.current.style.left = `${lerp(
            parseFloat(cursorOutline.current.style.left || '2'),
            position.x,
            outlineSpeed
          )}px`;
          
          cursorOutline.current.style.top = `${lerp(
            parseFloat(cursorOutline.current.style.top || '2'),
            position.y,
            outlineSpeed
          )}px`;
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animateCursor);
    };

    requestRef.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      cancelAnimationFrame(requestRef.current);
    };
  }, [position]);

  const lerp = (start, end, t) => {
    return start * (1 - t) + end * t;
  };

  return (
    <>
      <div 
        ref={cursorDot}
        className="cursor-dot"
        style={{ left: position.x, top: position.y }}
      />
      <div
        ref={cursorOutline}
        className={`cursor-outline ${isHovering ? 'cursor-hover' : ''}`}
        style={{ left: position.x, top: position.y }}
      />
    </>
  );
}
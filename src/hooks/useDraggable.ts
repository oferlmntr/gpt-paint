import { useEffect, useState, useRef, RefObject } from 'react';

interface Position {
  x: number;
  y: number;
}

export const useDraggable = (
  elementRef: RefObject<HTMLElement>,
  handleRef: RefObject<HTMLElement>
) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPositionRef = useRef<Position>({ x: 0, y: 0 });
  const elementPositionRef = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const element = elementRef.current;
    const handle = handleRef.current;
    
    if (!element || !handle) return;

    const onMouseDown = (e: MouseEvent) => {
      // Only start dragging when clicking on the handle
      if (!handle.contains(e.target as Node)) return;
      
      e.preventDefault();
      setIsDragging(true);
      
      // Store initial mouse position
      startPositionRef.current = { x: e.clientX, y: e.clientY };
      
      // Get current element position
      const transform = window.getComputedStyle(element).transform;
      const matrix = new DOMMatrix(transform);
      elementPositionRef.current = { x: matrix.e, y: matrix.f };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startPositionRef.current.x;
      const dy = e.clientY - startPositionRef.current.y;
      
      const newX = elementPositionRef.current.x + dx;
      const newY = elementPositionRef.current.y + dy;
      
      // Update element position
      element.style.transform = `translate(${newX}px, ${newY}px)`;
      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    // Add event listeners
    handle.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      // Clean up event listeners
      handle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [elementRef, handleRef, isDragging]);

  return { position, isDragging };
};
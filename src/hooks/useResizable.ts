import { useEffect, useState, useRef, RefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

export const useResizable = (
  elementRef: RefObject<HTMLElement>,
  resizeHandleRef: RefObject<HTMLElement>
) => {
  const [size, setSize] = useState<Size>({ width: 400, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const startPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startSizeRef = useRef<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;
    const resizeHandle = resizeHandleRef.current;
    
    if (!element || !resizeHandle) return;

    // Initialize size from element's current dimensions
    setSize({
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      setIsResizing(true);
      
      // Store initial mouse position
      startPositionRef.current = { x: e.clientX, y: e.clientY };
      
      // Store initial element size
      startSizeRef.current = {
        width: element.offsetWidth,
        height: element.offsetHeight,
      };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const dx = e.clientX - startPositionRef.current.x;
      const dy = e.clientY - startPositionRef.current.y;
      
      const newWidth = Math.max(200, startSizeRef.current.width + dx);
      const newHeight = Math.max(200, startSizeRef.current.height + dy);
      
      setSize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
      }
    };

    // Add event listeners
    resizeHandle.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      // Clean up event listeners
      resizeHandle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [elementRef, resizeHandleRef, isResizing]);

  return { size, isResizing };
};
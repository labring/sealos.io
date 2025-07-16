import { useEffect, useRef } from 'react';

interface LazyThirdPartyOptions {
  src: string;
  id?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  delay?: number;
  triggerEvents?: string[];
}

export function useLazyThirdParty({
  src,
  id,
  onLoad,
  onError,
  delay = 0,
  triggerEvents = ['scroll', 'mousedown', 'touchstart'],
}: LazyThirdPartyOptions) {
  const loadedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (loadedRef.current) return;

    const loadScript = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      // Remove all event listeners
      triggerEvents.forEach(event => {
        window.removeEventListener(event, handleTrigger);
      });

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Create and load script
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      
      if (id) {
        script.id = id;
      }

      script.onload = () => {
        onLoad?.();
      };

      script.onerror = () => {
        onError?.(new Error(`Failed to load script: ${src}`));
      };

      document.body.appendChild(script);
    };

    const handleTrigger = () => {
      if (delay > 0) {
        setTimeout(loadScript, delay);
      } else {
        loadScript();
      }
    };

    // Add event listeners for user interaction
    triggerEvents.forEach(event => {
      window.addEventListener(event, handleTrigger, { 
        passive: true, 
        once: true 
      });
    });

    // Fallback: load after 10 seconds
    timeoutRef.current = setTimeout(loadScript, 10000);

    return () => {
      triggerEvents.forEach(event => {
        window.removeEventListener(event, handleTrigger);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [src, id, onLoad, onError, delay, triggerEvents]);
}
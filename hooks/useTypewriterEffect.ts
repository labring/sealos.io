import { useState, useEffect, useRef } from 'react';

/**
 * Multi-language preset texts for cyclic typewriter effect
 * Each array contains texts that will be cycled through sequentially
 */
import { TYPEWRITER_TEXTS, DEFAULT_TYPEWRITER_CONFIG } from '@/app/[lang]/(home)/(new-home)/config/typewriter-texts';

// Typewriter animation timing constants (in milliseconds)
const { TYPING_SPEED, PAUSE_DURATION } = DEFAULT_TYPEWRITER_CONFIG;

/**
 * Custom hook for cyclic typewriter effect with multi-language support
 * @param isActive - Whether the typewriter effect should be active
 * @param language - Language code ('en' or 'zh-cn')
 * @returns Current typewriter text string
 */
export function useTypewriterEffect(
  isActive: boolean,
  language: string = 'en',
) {
  const [currentText, setCurrentText] = useState('');
  const textIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const texts = TYPEWRITER_TEXTS[language as keyof typeof TYPEWRITER_TEXTS];

  /**
   * Clear any pending timeout to prevent memory leaks
   */
  const clearAllTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTyping = () => {
    if (!isActive) return;

    textIndexRef.current = 0;
    charIndexRef.current = 0;
    typeNextChar();
  };

  const typeNextChar = () => {
    if (!isActive) return;

    const currentFullText = texts[textIndexRef.current];

    if (charIndexRef.current <= currentFullText.length) {
      setCurrentText(currentFullText.slice(0, charIndexRef.current));
      charIndexRef.current++;
      timeoutRef.current = setTimeout(typeNextChar, TYPING_SPEED);
    } else {
      // Text completed, start pause
      timeoutRef.current = setTimeout(() => {
        startNextText();
      }, PAUSE_DURATION);
    }
  };

  const startNextText = () => {
    if (!isActive) return;

    // Move to next text and reset character index
    textIndexRef.current = (textIndexRef.current + 1) % texts.length;
    charIndexRef.current = 0;

    // Clear current text and start typing next one
    setCurrentText('');
    timeoutRef.current = setTimeout(() => {
      typeNextChar();
    }, 300);
  };

  useEffect(() => {
    if (isActive) {
      startTyping();
    } else {
      clearAllTimeouts();
      setCurrentText('');
    }

    return () => {
      clearAllTimeouts();
    };
  }, [isActive, language]);

  return currentText;
}

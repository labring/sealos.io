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
 * @returns Object with current typewriter text and full text
 */
export function useTypewriterEffect(
  isActive: boolean,
  language: string = 'en',
) {
  const [currentText, setCurrentText] = useState('');
  const [fullText, setFullText] = useState('');
  const textIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const texts = TYPEWRITER_TEXTS[language as keyof typeof TYPEWRITER_TEXTS] || TYPEWRITER_TEXTS.en;

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
    if (!isActive || !texts || texts.length === 0) return;

    textIndexRef.current = 0;
    charIndexRef.current = 0;
    // Set the initial full text
    setFullText(texts[0]);
    typeNextChar();
  };

  const typeNextChar = () => {
    if (!isActive || !texts || texts.length === 0) return;

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
    if (!isActive || !texts || texts.length === 0) return;

    // Move to next text and reset character index
    textIndexRef.current = (textIndexRef.current + 1) % texts.length;
    charIndexRef.current = 0;

    // Set the new full text and clear current text
    const nextFullText = texts[textIndexRef.current];
    setFullText(nextFullText);
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
      setFullText('');
    }

    return () => {
      clearAllTimeouts();
    };
  }, [isActive, language]);

  return {
    currentText,
    fullText,
  };
}

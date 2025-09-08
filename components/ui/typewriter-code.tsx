'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface TypewriterCodeProps {
  className?: string;
  onProgress?: (lineIndex: number) => void;
}

const codeLines = [
  { text: '// 1. Create DevBox Project', color: 'text-gray-400' },
  { text: '// Choose: Next.js template', color: 'text-gray-400' },
  { text: '// Resources: 2 CPU cores, 4GB memory', color: 'text-gray-400' },
  { text: '', color: '' },
  { text: '// 2. Connect Local IDE', color: 'text-gray-400' },
  { text: '', color: '' },
  { text: '// 3. Develop in Cloud Environment', color: 'text-gray-400' },
  {
    text: 'import { NextRequest, NextResponse } from "next/server"',
    color: 'text-purple-400',
  },
  { text: '', color: '' },
  {
    text: 'export async function GET(request: NextRequest) {',
    color: 'text-blue-400',
  },
  { text: '  return NextResponse.json({', color: 'text-green-400' },
  { text: '    message: "Hello from DevBox!",', color: 'text-yellow-400' },
  { text: '    environment: "cloud-native"', color: 'text-yellow-400' },
  { text: '  })', color: 'text-green-400' },
  { text: '}', color: 'text-blue-400' },
  { text: '', color: '' },
  { text: '// 4. Release as OCI Image', color: 'text-gray-400' },
  { text: '// Version: v1.0.0', color: 'text-cyan-400' },
  { text: '// Description: "Initial release"', color: 'text-cyan-400' },
  { text: '', color: '' },
  { text: '// 5. Deploy to Production', color: 'text-gray-400' },
  { text: '// One-click deployment to Sealos Cloud', color: 'text-green-400' },
];

export default function TypewriterCode({
  className = '',
  onProgress,
}: TypewriterCodeProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLineIndex >= codeLines.length) {
      setIsComplete(true);
      return;
    }

    const currentLine = codeLines[currentLineIndex];
    const targetText = currentLine.text;

    if (currentCharIndex <= targetText.length) {
      const timer = setTimeout(
        () => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            newLines[currentLineIndex] = targetText.slice(0, currentCharIndex);
            return newLines;
          });

          if (currentCharIndex === targetText.length) {
            // Move to next line after a brief pause
            setTimeout(() => {
              const nextLineIndex = currentLineIndex + 1;
              setCurrentLineIndex(nextLineIndex);
              setCurrentCharIndex(0);
              // Notify progress
              if (onProgress) {
                onProgress(nextLineIndex);
              }
            }, 100);
          } else {
            setCurrentCharIndex((prev) => prev + 1);
          }
        },
        Math.random() * 20 + 20,
      ); // Faster typing speed to match terminal

      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex]);

  // Auto scroll to bottom when line changes
  useEffect(() => {
    if (containerRef.current && currentLineIndex > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentLineIndex]);

  // Reset animation after completion
  useEffect(() => {
    if (isComplete) {
      const resetTimer = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
        setIsComplete(false);
      }, 1500);

      return () => clearTimeout(resetTimer);
    }
  }, [isComplete]);

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-x-hidden overflow-y-auto font-mono text-sm ${className}`}
    >
      <div className="min-h-full space-y-0">
        {codeLines.map((line, index) => (
          <div
            key={index}
            className="flex min-h-[20px] items-start whitespace-nowrap"
          >
            <span className="mr-4 w-8 flex-shrink-0 text-right leading-5 text-gray-500 select-none">
              {index + 1}
            </span>
            <span className={`${line.color} overflow-hidden leading-5`}>
              {displayedLines[index] || ''}
              {index === currentLineIndex && !isComplete && (
                <motion.span
                  className="ml-1 inline-block h-4 w-2 bg-blue-400"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

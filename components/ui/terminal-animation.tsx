'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TerminalAnimationProps {
  className?: string;
}

const terminalCommands = [
  {
    command: '$ npm run dev',
    output: [
      '> next dev',
      '',
      '  ▲ Next.js 14.2.28',
      '  - Local:        http://localhost:3000',
      '  - Network:      http://0.0.0.0:3000',
      '',
      '✓ Ready in 1.2s',
    ],
    delay: 500,
  },
  {
    command: '$ curl https://my-project.usw.sealos.io',
    output: [
      '{"message": "Hello from DevBox!", "environment": "cloud-native"}',
    ],
    delay: 400,
  },
];

export default function TerminalAnimation({
  className = '',
}: TerminalAnimationProps) {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [displayedOutput, setDisplayedOutput] = useState<string[]>([]);
  const [isTypingCommand, setIsTypingCommand] = useState(true);
  const [currentOutputIndex, setCurrentOutputIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Reset animation
  const resetAnimation = () => {
    setCurrentCommandIndex(0);
    setDisplayedCommand('');
    setDisplayedOutput([]);
    setIsTypingCommand(true);
    setCurrentOutputIndex(0);
  };

  // Type command effect
  useEffect(() => {
    if (!isTypingCommand || currentCommandIndex >= terminalCommands.length)
      return;

    const currentCommand = terminalCommands[currentCommandIndex];
    const targetCommand = currentCommand.command;

    if (displayedCommand.length < targetCommand.length) {
      const timer = setTimeout(
        () => {
          setDisplayedCommand(
            targetCommand.slice(0, displayedCommand.length + 1),
          );
        },
        30 + Math.random() * 20,
      );

      return () => clearTimeout(timer);
    } else {
      // Command typing complete, start output
      setTimeout(() => {
        setIsTypingCommand(false);
      }, 150);
    }
  }, [displayedCommand, isTypingCommand, currentCommandIndex]);

  // Display output effect
  useEffect(() => {
    if (isTypingCommand || currentCommandIndex >= terminalCommands.length)
      return;

    const currentCommand = terminalCommands[currentCommandIndex];

    if (currentOutputIndex < currentCommand.output.length) {
      const timer = setTimeout(
        () => {
          setDisplayedOutput((prev) => [
            ...prev,
            currentCommand.output[currentOutputIndex],
          ]);
          setCurrentOutputIndex((prev) => prev + 1);
          // Auto scroll to bottom
          setTimeout(() => {
            if (outputRef.current) {
              outputRef.current.scrollTop = outputRef.current.scrollHeight;
            }
          }, 50);
        },
        200 + Math.random() * 100,
      );

      return () => clearTimeout(timer);
    } else {
      // Output complete, move to next command
      setTimeout(() => {
        if (currentCommandIndex < terminalCommands.length - 1) {
          setCurrentCommandIndex((prev) => prev + 1);
          setDisplayedCommand('');
          setDisplayedOutput([]);
          setIsTypingCommand(true);
          setCurrentOutputIndex(0);
        } else {
          // All commands complete, reset after delay
          setTimeout(resetAnimation, 1000);
        }
      }, currentCommand.delay);
    }
  }, [currentOutputIndex, isTypingCommand, currentCommandIndex]);

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-x-hidden overflow-y-auto font-mono text-green-400 ${className}`}
    >
      <div className="flex h-full flex-col space-y-1 text-xs sm:text-sm">
        {/* Current command */}
        <div className="flex flex-shrink-0 items-center overflow-hidden whitespace-nowrap">
          <span className="text-blue-400">devbox@cloud</span>
          <span className="mx-1 text-white">:</span>
          <span className="text-yellow-400">~/project</span>
          <span className="mx-1 text-white">$</span>
          <span className="text-green-400">
            {displayedCommand}
            {isTypingCommand && (
              <motion.span
                className="ml-1 inline-block h-3 w-2 bg-green-400"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </span>
        </div>

        {/* Output lines container with fixed height */}
        <div ref={outputRef} className="flex-1 space-y-1 overflow-y-auto">
          {displayedOutput.map((line, index) => (
            <motion.div
              key={`${currentCommandIndex}-${index}`}
              className="overflow-hidden pl-2 whitespace-nowrap text-gray-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* Loading indicator for current output */}
        {!isTypingCommand &&
          currentOutputIndex <
            terminalCommands[currentCommandIndex]?.output.length && (
            <motion.div
              className="flex items-center pl-2 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="flex space-x-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                <div className="h-1 w-1 rounded-full bg-gray-400"></div>
              </motion.div>
            </motion.div>
          )}
      </div>
    </div>
  );
}

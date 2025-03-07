'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Server, User, Cloud } from 'lucide-react';

export default function FeatureGrid() {
  // Reduced number of squares per column
  const squaresPerColumn = 4;
  // Duration for each square to fill or empty
  const squareAnimationDuration = 1;
  // Total cycle duration
  const totalCycleDuration = squareAnimationDuration * squaresPerColumn * 2;
  // Duration for the pause after column 2 finishes
  const pauseDuration = 1;
  // Duration for column 1 fade out
  const fadeOutDuration = 1;
  // Duration for initial fill up of column 1 (staggered)
  const col1FillDuration = 2;
  // Offset for column 3 to be ahead of column 2
  const column3Offset = 0.3; // Column 3 will be 0.3 seconds ahead

  // Total sequence duration including pause and fadeout
  const fullCycleDuration =
    totalCycleDuration + pauseDuration + fadeOutDuration;

  // Column 1 - Initial fill up one by one from bottom to top, flash when column 2 starts emptying, then fade out at the end
  const renderColumn1 = () => {
    return Array(squaresPerColumn)
      .fill(0)
      .map((_, index) => {
        // The actual square position from bottom (0 is bottom, 3 is top)
        const positionFromBottom = squaresPerColumn - index - 1;

        // Fill squares from bottom (position 0) to top (position 3)
        const fillDelay = positionFromBottom * 0.3;

        // When column 2 starts to empty
        const flashStartTime =
          (squaresPerColumn * squareAnimationDuration) / fullCycleDuration;
        // When column 2 finishes emptying
        const flashEndTime =
          (squaresPerColumn * squareAnimationDuration * 2) / fullCycleDuration;
        // When to start fading out (after column 2 is done + pause)
        const fadeOutStartTime =
          (totalCycleDuration + pauseDuration) / fullCycleDuration;

        return (
          <div
            key={`col1-${positionFromBottom}`}
            className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-gray-200 shadow-lg"
            style={{
              perspective: '1000px',
              transform: 'rotateX(5deg) rotateY(-5deg)',
              boxShadow:
                '2px 4px 8px rgba(0, 0, 0, 0.15), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
              background: 'linear-gradient(135deg, #f0f4f8 0%, #f3eff7 100%)',
            }}
          >
            <Server
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-white"
              size={20}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-full w-full"
              style={{
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(135deg, #cbd5e0 0%, #DBE2E9 100%)',
              }}
              animate={{
                opacity: [
                  0, // Start invisible
                  0, // Stay invisible until fill time
                  1, // Fill in
                  1, // Stay filled
                  1.3, // Flash start - slightly brighter
                  1.1, // Flash middle - slightly dimmer
                  1.3, // Flash brighter again
                  1.1, // Flash dimmer again
                  1.3, // Flash brighter once more
                  1, // Return to normal at end of column 2 emptying
                  1, // Stay visible
                  0, // Fade out at the end
                  0, // Stay invisible until next cycle
                ],
              }}
              transition={{
                duration: fullCycleDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [
                  0,
                  fillDelay / fullCycleDuration, // Wait before filling
                  (fillDelay + 0.2) / fullCycleDuration, // Fill time (short duration)
                  flashStartTime - 0.01, // Stay filled until flash
                  flashStartTime + 0.02, // First flash brighter
                  flashStartTime + (flashEndTime - flashStartTime) * 0.25, // First flash dimmer
                  flashStartTime + (flashEndTime - flashStartTime) * 0.5, // Second flash brighter
                  flashStartTime + (flashEndTime - flashStartTime) * 0.75, // Second flash dimmer
                  flashEndTime - 0.02, // Final flash brighter
                  flashEndTime, // End flashing
                  fadeOutStartTime, // Stay visible until fade out
                  fadeOutStartTime + fadeOutDuration / fullCycleDuration, // End fade out
                  1,
                ],
              }}
            />
          </div>
        );
      });
  };

  // Column 2 - Sequential filling from bottom to top, then unfilling from top to bottom
  const renderColumn2 = () => {
    return Array(squaresPerColumn)
      .fill(0)
      .map((_, index) => {
        // Reverse index to start from bottom
        const reverseIndex = squaresPerColumn - index - 1;

        // Calculate delay for this square (sequential filling)
        const fillStartDelay = reverseIndex * squareAnimationDuration;
        const fillEndDelay = fillStartDelay + squareAnimationDuration;

        // Calculate delay for emptying (sequential emptying from top)
        const emptyStartDelay =
          squaresPerColumn * squareAnimationDuration +
          index * squareAnimationDuration;
        const emptyEndDelay = emptyStartDelay + squareAnimationDuration;

        return (
          <div
            key={`col2-${reverseIndex}`}
            className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-gray-200 shadow-lg"
            style={{
              perspective: '1000px',
              transform: 'rotateX(5deg) rotateY(-5deg)',
              boxShadow:
                '2px 4px 8px rgba(0, 0, 0, 0.15), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
              background: 'linear-gradient(135deg, #f0f4f8 0%, #f3eff7 100%)',
            }}
          >
            <User
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-white"
              size={20}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                transformOrigin: 'bottom',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(135deg, #fdba74 0%, #FDCE9B 100%)',
              }}
              animate={{
                scaleY: [
                  0, // Start empty
                  0, // Stay empty until its turn
                  1, // Fill up
                  1, // Stay filled
                  0, // Empty out
                  0, // Stay empty for the rest of the cycle
                ],
              }}
              transition={{
                duration: fullCycleDuration,
                times: [
                  0,
                  fillStartDelay / fullCycleDuration, // Start filling
                  fillEndDelay / fullCycleDuration, // End filling
                  emptyStartDelay / fullCycleDuration, // Start emptying
                  emptyEndDelay / fullCycleDuration, // End emptying
                  1,
                ],
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        );
      });
  };

  // Column 3 - Same as column 2 but with different color and modified timing
  const renderColumn3 = () => {
    return Array(squaresPerColumn)
      .fill(0)
      .map((_, index) => {
        // Reverse index to start from bottom
        const reverseIndex = squaresPerColumn - index - 1;

        // Calculate delay for this square (sequential filling) with offset
        const fillStartDelay =
          reverseIndex * squareAnimationDuration - column3Offset;
        const fillEndDelay = fillStartDelay + squareAnimationDuration;

        // Calculate when column 2's first box starts emptying (top box)
        const column2FirstBoxEmptyStart =
          squaresPerColumn * squareAnimationDuration;

        // Column 3 emptying starts after column 2's first box starts emptying
        const emptyStartDelay =
          column2FirstBoxEmptyStart + index * squareAnimationDuration;
        const emptyEndDelay = emptyStartDelay + squareAnimationDuration;

        // Ensure timing values don't go negative
        const safeStartFill = Math.max(0, fillStartDelay / fullCycleDuration);
        const safeEndFill = Math.max(
          safeStartFill + 0.01,
          fillEndDelay / fullCycleDuration,
        );
        const safeStartEmpty = Math.max(
          safeEndFill + 0.01,
          emptyStartDelay / fullCycleDuration,
        );
        const safeEndEmpty = Math.max(
          safeStartEmpty + 0.01,
          emptyEndDelay / fullCycleDuration,
        );

        return (
          <div
            key={`col3-${reverseIndex}`}
            className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-gray-200 shadow-lg"
            style={{
              perspective: '1000px',
              transform: 'rotateX(5deg) rotateY(-5deg)',
              boxShadow:
                '2px 4px 8px rgba(0, 0, 0, 0.15), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
              background: 'linear-gradient(135deg, #f0f4f8 0%, #f3eff7 100%)',
            }}
          >
            <Cloud
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-white"
              size={20}
            />
            <motion.div
              className="absolute inset-0 bg-blue-300"
              style={{
                transformOrigin: 'bottom',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(135deg, #93c5fd 0%, #B0D4FD 100%)',
              }}
              animate={{
                scaleY: [
                  0, // Start empty
                  0, // Stay empty until its turn
                  1, // Fill up
                  1, // Stay filled until column 2 is completely empty
                  0, // Empty out
                  0, // Stay empty for the rest of the cycle
                ],
              }}
              transition={{
                duration: fullCycleDuration,
                times: [
                  0,
                  safeStartFill, // Start filling (slightly ahead of column 2)
                  safeEndFill, // End filling
                  safeStartEmpty, // Stay filled until column 2 is empty
                  safeEndEmpty, // End emptying
                  1,
                ],
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        );
      });
  };

  return (
    <div className="flex h-full items-center justify-center py-2 pb-8 pt-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-row gap-1.5">
          <div className="flex flex-col gap-1.5">{renderColumn1()}</div>
          <div className="flex flex-col gap-1.5">{renderColumn1()}</div>
        </div>
        <div className="pt-2">
          <span className="text-sm">Traditional Solutions</span>
        </div>
      </div>
      <div className="px-4"></div> {/* Padding between sets */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-row gap-1.5">
          <div className="flex flex-col gap-1.5">{renderColumn2()}</div>
          <div className="flex flex-col gap-1.5">{renderColumn2()}</div>
        </div>
        <div className="pt-2">
          <span className="text-sm">Usage</span>
        </div>
      </div>
      <div className="px-4"></div> {/* Padding between sets */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-row gap-1.5">
          <div className="flex flex-col gap-1.5">{renderColumn3()}</div>
          <div className="flex flex-col gap-1.5">{renderColumn3()}</div>
        </div>
        <div className="pt-2">
          <span className="text-sm">Sealos</span>
        </div>
      </div>
    </div>
  );
}

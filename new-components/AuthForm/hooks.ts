'use client';

import { useState, useEffect, useCallback } from 'react';

export function useCountdown(startTime: number, duration = 60000) {
  const getRemainingTime = useCallback(
    () => Math.max(0, duration - (new Date().getTime() - startTime)),
    [startTime, duration],
  );

  const [remainingTime, setRemainingTime] = useState(getRemainingTime());

  useEffect(() => {
    if (startTime > 0) {
      const interval = setInterval(() => {
        const newRemainingTime = getRemainingTime();
        if (newRemainingTime <= 0) {
          clearInterval(interval);
        }
        setRemainingTime(newRemainingTime);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, getRemainingTime]);

  return remainingTime;
}

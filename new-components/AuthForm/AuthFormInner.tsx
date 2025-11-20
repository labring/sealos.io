'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Dialog } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useAuthForm } from './AuthFormContext';
import { SelectMethodStep } from './SelectMethodStep';
import { VerifyCodeStep } from './VerifyCodeStep';
import { GodRays } from '../GodRays';

export interface AuthFormInnerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthFormInner({ open, onOpenChange }: AuthFormInnerProps) {
  const { step } = useAuthForm();
  const prevStepRef = useRef<string | null>(null);
  const isInitialOpenRef = useRef(true);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (open) {
      if (isInitialOpenRef.current) {
        prevStepRef.current = step;
        isInitialOpenRef.current = false;
        hasOpenedRef.current = true;
      } else if (hasOpenedRef.current && prevStepRef.current !== step) {
        prevStepRef.current = step;
      }
    } else {
      isInitialOpenRef.current = true;
      prevStepRef.current = null;
      hasOpenedRef.current = false;
    }
  }, [open, step]);

  const shouldAnimateStep = hasOpenedRef.current && prevStepRef.current !== null && prevStepRef.current !== step;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black/80"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="inset-shadow-bubble max-w-md overflow-hidden rounded-xl border bg-background p-0 shadow-lg fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%]"
              >
                <div className="pointer-events-none absolute inset-0 -z-10">
                  <GodRays
                    sources={[
                      {
                        x: 0.5,
                        y: -0.15,
                        angle: 60,
                        spread: 35,
                        count: 11,
                        color: '225, 225, 225',
                      },
                      {
                        x: -0.05,
                        y: -0.1,
                        angle: 60,
                        spread: 25,
                        count: 12,
                        color: '220, 220, 220',
                      },
                    ]}
                    speed={0.0018}
                    maxWidth={85}
                    minLength={1000}
                    maxLength={1800}
                    blur={18}
                  />
                </div>

                <div className="relative z-10 p-10">
                  <AnimatePresence mode="wait">
                    {step === 'select-method' ? (
                      <motion.div
                        key="select-method"
                        initial={shouldAnimateStep ? { opacity: 0, x: 20 } : undefined}
                        animate={{ opacity: 1, x: 0 }}
                        exit={shouldAnimateStep ? { opacity: 0, x: -20 } : undefined}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        <SelectMethodStep />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="verify-code"
                        initial={shouldAnimateStep ? { opacity: 0, x: 20 } : undefined}
                        animate={{ opacity: 1, x: 0 }}
                        exit={shouldAnimateStep ? { opacity: 0, x: -20 } : undefined}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        <VerifyCodeStep />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Dialog } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { useDeployModal } from './DeployModalContext';
import { TemplateForm } from './TemplateForm';
import { GodRays } from '../GodRays';

function ErrorStep() {
  const { error, closeDeployModal } = useDeployModal();

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <p className="text-muted-foreground text-center">{error}</p>
      <Button variant="outline" onClick={closeDeployModal}>
        Close
      </Button>
    </div>
  );
}

function FormStep() {
  const { templateData, submitDeploy, closeDeployModal, hasInputs } =
    useDeployModal();

  const templateTitle = templateData?.templateYaml?.spec?.title || 'App';
  const templateDescription = templateData?.templateYaml?.spec?.description;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with app info */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg leading-none font-semibold text-zinc-300">
          Configure {templateTitle}
        </h2>
        {templateDescription && (
          <p className="text-muted-foreground text-sm leading-5">
            {templateDescription}
          </p>
        )}
      </div>

      {/* Form */}
      {hasInputs && (
        <div className="max-h-[400px] overflow-y-auto px-1">
          <TemplateForm />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={closeDeployModal}
          className="h-10 rounded-full px-4 py-2"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="landing-primary"
          onClick={submitDeploy}
          className="h-10 cursor-pointer px-4 py-2 text-base"
        >
          Deploy App
        </Button>
      </div>
    </div>
  );
}

export function DeployModalInner() {
  const { open, step, closeDeployModal } = useDeployModal();

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && closeDeployModal()}
    >
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
                className="inset-shadow-bubble bg-background fixed top-[50%] left-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl border p-0 shadow-lg"
              >
                <div className="pointer-events-none absolute inset-0 -z-10">
                  <GodRays
                    sources={[
                      {
                        x: 0.46,
                        y: -0.15,
                        angle: 80,
                        spread: 35,
                        count: 2,
                        color: '225, 225, 225',
                      },
                      {
                        x: 0.5,
                        y: -0.15,
                        angle: 90,
                        spread: 35,
                        count: 2,
                        color: '225, 225, 225',
                      },
                      {
                        x: 0.54,
                        y: -0.15,
                        angle: 100,
                        spread: 35,
                        count: 2,
                        color: '225, 225, 225',
                      },
                    ]}
                    speed={0.0018}
                    maxWidth={85}
                    minLength={1000}
                    maxLength={1800}
                    blur={24}
                  />
                </div>

                {/* Close button */}
                <button
                  onClick={closeDeployModal}
                  className="focus:ring-ring absolute top-[19px] right-[19px] z-20 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative z-10 p-6">
                  <AnimatePresence mode="wait">
                    {step === 'form' && (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        <FormStep />
                      </motion.div>
                    )}

                    {step === 'error' && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ErrorStep />
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

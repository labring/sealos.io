'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Dialog } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Rocket, AlertCircle, ArrowLeft } from 'lucide-react';
import { useDeployModal } from './DeployModalContext';
import { TemplateForm } from './TemplateForm';
import { GodRays } from '../GodRays';
import { AppIcon } from '@/components/ui/app-icon';

function ErrorStep() {
  const { error, closeDeployModal } = useDeployModal();

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <p className="text-center text-muted-foreground">{error}</p>
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
  const templateIcon = templateData?.templateYaml?.spec?.icon;
  const templateDescription = templateData?.templateYaml?.spec?.description;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with app info */}
      <div className="flex items-start gap-4">
        {templateIcon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <AppIcon
              src={templateIcon}
              alt={`${templateTitle} icon`}
              className="h-8 w-8"
            />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">
            Deploy {templateTitle}
          </h2>
          {templateDescription && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {templateDescription}
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      {hasInputs && (
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <TemplateForm />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={closeDeployModal}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          variant="landing-primary"
          onClick={submitDeploy}
          className="flex-1"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Deploy Now
        </Button>
      </div>
    </div>
  );
}

export function DeployModalInner() {
  const { open, step, closeDeployModal } = useDeployModal();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDeployModal()}>
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
                className="inset-shadow-bubble bg-background fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl border p-0 shadow-lg"
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

                <div className="relative z-10 p-8">
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

'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as DialogPrimitive from '@radix-ui/react-dialog';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 当模态框打开时，自动播放视频
  useEffect(() => {
    if (isOpen && iframeRef.current && iframeRef.current.contentWindow) {
      // 使用 postMessage API 向 YouTube iframe 发送播放命令
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          '*',
        );
      }, 500);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <VisuallyHidden>
        <DialogPrimitive.Title>Video modal</DialogPrimitive.Title>
        <DialogPrimitive.Description>
          Introducing Sealos: Deploy Any Application in Minutes
        </DialogPrimitive.Description>
      </VisuallyHidden>

      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            {/* 自定义背景动画 */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
              />
            </DialogPrimitive.Overlay>

            {/* 自定义内容动画 */}
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1], // 自定义贝塞尔曲线，更流畅
                }}
                className="fixed top-1/2 left-1/2 z-50 w-full max-w-[95vw] -translate-x-1/2 -translate-y-1/2 sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw]"
              >
                <div className="relative w-full">
                  {/* 关闭按钮 */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    onClick={onClose}
                    className="absolute -top-14 right-0 z-50 flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20"
                    aria-label="Close video"
                  >
                    <X className="size-6 text-white" />
                  </motion.button>

                  {/* 视频容器 - 沉浸式无边框 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
                  >
                    <iframe
                      ref={iframeRef}
                      className="absolute inset-0 size-full"
                      src={`${videoUrl}&autoplay=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </motion.div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

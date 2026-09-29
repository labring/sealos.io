'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Play, X } from 'lucide-react';
import s from './detail.module.css';

export default function TemplateVideo({
  videoId,
  appName,
}: {
  videoId: string;
  appName: string;
}) {
  const loadFallbackThumbnail = (image: HTMLImageElement) => {
    if (image.src.endsWith('/maxresdefault.jpg')) {
      image.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={s.videoCover}
          aria-label={`Play ${appName} template video`}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            width={1280}
            height={720}
            ref={(image) => {
              // Catch image failures that happened before hydration.
              if (image?.complete && image.naturalWidth === 0) {
                loadFallbackThumbnail(image);
              }
            }}
            onError={(event) => loadFallbackThumbnail(event.currentTarget)}
          />
          <span className={s.videoPlay}>
            <Play size={24} fill="currentColor" aria-hidden="true" />
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={s.videoOverlay} />
        <Dialog.Content className={s.videoDialog} aria-describedby={undefined}>
          <Dialog.Title className="sr-only">
            {appName} template video
          </Dialog.Title>
          <Dialog.Close className={s.videoClose} aria-label="Close video">
            <X size={24} aria-hidden="true" />
          </Dialog.Close>
          <div className={s.videoModalFrame}>
            <iframe
              className={s.videoPlayer}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
              title={`${appName} template video`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

'use client';

import dynamic from 'next/dynamic';
import { AnimateElement } from './ui/animated-wrapper';
import { useState, useEffect } from 'react';

// Import ReactPlayer client-side only
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
});

export default function Video({ url }: { url: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative mt-20 w-full">
      <div className="relative z-20 mx-auto max-w-[1000px] px-4">
        <AnimateElement type="slideUp" delay={0.2} duration={0.6}>
          <div className="aspect-video w-full">
            {!isMounted ? (
              <div className="h-full w-full rounded-lg bg-gray-100/50 backdrop-blur-sm">
                <div className="flex h-full items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                </div>
              </div>
            ) : (
              <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                controls={true}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                    },
                  },
                }}
              />
            )}
          </div>
        </AnimateElement>
      </div>
    </div>
  );
}

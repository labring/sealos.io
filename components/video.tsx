'use client';

import ReactPlayer from 'react-player';
import { AnimateElement } from './ui/animated-wrapper';
import { useState, useRef, useEffect } from 'react';

export default function Video({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  return (
    <div className="relative mt-20 w-full">
      <div className="relative z-20 mx-auto max-w-[1000px] px-4">
        <AnimateElement type="slideUp" delay={0.2} duration={0.6}>
          <div className="aspect-video w-full">
            <ReactPlayer
              ref={playerRef}
              url={url}
              width="100%"
              height="100%"
              playing={isPlaying}
              controls={true}
              onReady={() => {
                console.log('Video is ready to play');
              }}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                  },
                },
              }}
            />
          </div>
        </AnimateElement>
      </div>
    </div>
  );
}

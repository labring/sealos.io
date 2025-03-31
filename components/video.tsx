'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { Play, LoaderCircle } from 'lucide-react';

// Import ReactPlayer client-side only
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
});

type VideoProps = {
  url: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
};

export default function Video({ url, image }: VideoProps) {
  const [isPlayerRequested, setIsPlayerRequested] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPreconnected, setIsPreconnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseOver = () => {
    if (!isPreconnected) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://www.youtube.com';
      document.head.appendChild(link);
      setIsPreconnected(true);
    }
  };

  const handleClick = () => {
    setIsPlayerRequested(true);
    setIsLoading(true);
  };

  return (
    <div className="relative mt-20 w-full">
      <div className="relative z-20 mx-auto max-w-[1000px] px-4">
        <div className="relative aspect-video w-full">
          {!isPlayerVisible && (
            <div
              className="absolute inset-0 z-10 opacity-100"
              onMouseOver={handleMouseOver}
              onClick={handleClick}
            >
              {videoPlaceholder({
                url,
                image,
                externalLink: isPlayerRequested,
                isLoading,
              })}
            </div>
          )}
          {isPlayerRequested && (
            <div className="absolute inset-0 z-0 opacity-100">
              <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                    },
                  },
                }}
                onReady={() => {
                  setIsPlayerVisible(true);
                  setIsLoading(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function videoPlaceholder({
  url,
  image,
  externalLink,
  isLoading,
}: VideoProps & { externalLink?: boolean; isLoading?: boolean }) {
  const content = (
    <div className="relative h-full w-full rounded-lg bg-gray-100/50 backdrop-blur-sm">
      <Image
        src={image.src}
        alt="Sealos DevBox Video Thumbnail"
        className="absolute inset-0 h-full w-full rounded-lg object-cover"
        width={image.width}
        height={image.height}
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isLoading ? (
          <LoaderCircle className="h-16 w-16 animate-spin text-white" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <Play className="text-black" />
          </div>
        )}
        {externalLink && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm text-blue-500 underline"
          >
            View on YouTube
          </a>
        )}
      </div>
    </div>
  );

  return externalLink ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}

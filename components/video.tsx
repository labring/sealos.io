'use client';

import dynamic from 'next/dynamic';
import Image, { StaticImageData } from 'next/image';
import { useState, memo, useCallback, useRef } from 'react';
import { Play, LoaderCircle } from 'lucide-react';
import ReactDOM from 'react-dom';

// Preconnect to YouTube domains for better performance
ReactDOM.preconnect('https://www.youtube.com');
ReactDOM.prefetchDNS('https://www.youtube.com');

// Import ReactPlayer client-side only with increased loading priority
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <LoaderCircle className="h-16 w-16 animate-spin text-gray-400" />
    </div>
  ),
});

type VideoProps = {
  url: string;
  placeholderImage: StaticImageData;
};

// Memoize the video placeholder to prevent unnecessary re-renders
const VideoPlaceholder = memo(({
  url,
  placeholderImage,
  externalLink,
  isLoading,
  onMouseOver,
  onClick,
}: VideoProps & {
  externalLink?: boolean;
  isLoading?: boolean;
  onMouseOver: () => void;
  onClick: () => void;
}) => {
  const content = (
    <div
      className="relative h-full w-full rounded-lg bg-gray-100/50 backdrop-blur-xs cursor-pointer"
      onMouseOver={onMouseOver}
      onClick={onClick}
    >
      <Image
        src={placeholderImage}
        alt="Video Thumbnail"
        className="absolute inset-0 h-full w-full rounded-lg object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 1000px"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isLoading ? (
          <LoaderCircle className="h-16 w-16 animate-spin text-white" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg hover:scale-105 transition-transform">
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
});

VideoPlaceholder.displayName = 'VideoPlaceholder';

const Video = memo(({ url, placeholderImage }: VideoProps) => {
  const [isPlayerRequested, setIsPlayerRequested] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Track if we've already preconnected to the image CDN
  const hasPreconnectedToImageCDN = useRef(false);

  const handleMouseOver = useCallback(() => {
    // Additional preconnect for YouTube image CDN
    if (!isPlayerRequested && !hasPreconnectedToImageCDN.current) {
      ReactDOM.preconnect('https://i.ytimg.com');
      hasPreconnectedToImageCDN.current = true;
    }
  }, [isPlayerRequested]);

  const handleClick = useCallback(() => {
    setIsPlayerRequested(true);
    setIsLoading(true);
  }, []);

  return (
    <div id="video-section" className="relative mt-20 w-full">
      <div className="relative z-20 mx-auto max-w-[1000px] px-4">
        <div className="relative aspect-video w-full">
          {!isPlayerVisible && (
            <div className="absolute inset-0 z-10 opacity-100">
              <VideoPlaceholder
                url={url}
                placeholderImage={placeholderImage}
                externalLink={isPlayerRequested}
                isLoading={isLoading}
                onMouseOver={handleMouseOver}
                onClick={handleClick}
              />
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
                      origin: typeof window !== 'undefined' ? window.location.origin : '',
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
});

Video.displayName = 'Video';

export default Video;

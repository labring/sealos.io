'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import s from './detail.module.css';

export default function TemplateVideo({
  videoId,
  appName,
}: {
  videoId: string;
  appName: string;
}) {
  const [playing, setPlaying] = useState(false);

  return playing ? (
    <iframe
      ref={(frame) => frame?.focus()}
      className={s.videoPlayer}
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
      title={`${appName} template video`}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  ) : (
    <button
      type="button"
      className={s.videoCover}
      aria-label={`Play ${appName} template video`}
      onClick={() => setPlaying(true)}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        width={480}
        height={360}
      />
      <span className={s.videoPlay}>
        <Play size={28} fill="currentColor" aria-hidden="true" />
        <span>{appName}</span>
        <span>Play video</span>
      </span>
    </button>
  );
}

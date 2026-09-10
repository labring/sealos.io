'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Moon, Sun } from 'lucide-react';
import DayWorld from '@/assets/app-previews/eaglercraft-world.webp';
import NightWorld from '@/assets/app-previews/eaglercraft-night.webp';
import s from './detail.module.css';

export default function WorldPreview() {
  const [night, setNight] = useState(true);

  return (
    <figure className={s.featureVisual}>
      <Image
        src={night ? NightWorld : DayWorld}
        alt={`Illustrated voxel village at ${night ? 'night' : 'daytime'}`}
        priority
        sizes="(max-width: 800px) 100vw, 660px"
        className={s.featureArt}
      />
      <figcaption
        className={s.sceneControls}
        role="group"
        aria-label="Illustration lighting"
      >
        <span>World illustration</span>
        <button
          type="button"
          aria-pressed={!night}
          onClick={() => setNight(false)}
        >
          <Sun size={16} /> Day
        </button>
        <button
          type="button"
          aria-pressed={night}
          onClick={() => setNight(true)}
        >
          <Moon size={16} /> Night
        </button>
      </figcaption>
    </figure>
  );
}

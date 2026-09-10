import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { AppIcon } from '@/components/ui/app-icon';
import type { AppDetailConfig } from './app-detail-utils';
import s from './detail.module.css';

export default function AppPreviewPanel({ app }: { app: AppDetailConfig }) {
  const screenshot = app.screenshots?.[0];
  return (
    <figure className={s.preview}>
      <div className={s.previewFrame}>
        {screenshot ? (
          <Image
            src={screenshot}
            alt={`${app.name} template preview`}
            width={1280}
            height={720}
            className={s.previewImage}
            sizes="(max-width: 1280px) 100vw, 1200px"
            priority
          />
        ) : (
          <div className={s.previewFallback}>
            <AppIcon
              src={app.icon}
              alt=""
              width={96}
              height={96}
              className={s.previewIcon}
            />
            <span>{app.name}</span>
            <p>{app.description}</p>
          </div>
        )}
      </div>
      <figcaption>
        <span>Template preview</span>
        {screenshot && (
          <a href={screenshot} target="_blank" rel="noopener noreferrer">
            Full screenshot <ArrowUpRight size={14} />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

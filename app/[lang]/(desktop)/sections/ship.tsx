import Image, { type StaticImageData } from 'next/image';
import awsIcon from '@/assets/platform-icons/aws.svg';
import azureIcon from '@/assets/platform-icons/azure.svg';
import digitaloceanIcon from '@/assets/platform-icons/digitalocean.svg';
import gcpIcon from '@/assets/platform-icons/gcp.svg';
import herokuIcon from '@/assets/platform-icons/heroku.svg';
import railwayIcon from '@/assets/platform-icons/railway.svg';
import renderIcon from '@/assets/platform-icons/render.svg';
import supabaseIcon from '@/assets/platform-icons/supabase.svg';
import vercelIcon from '@/assets/platform-icons/vercel.svg';
import { AsciiWatercolor } from '../components/ascii-watercolor';
import { SealosMark } from '../components/icons';
import type { HomeCopy } from '../content';
import { ShipCanvasShot } from '../faux/ship';

type Logo = { name: string; src: StaticImageData; tone?: 'invert' | 'dark' };

const REPLACES: Logo[][] = [
  [
    { name: 'Vercel', src: vercelIcon, tone: 'invert' },
    { name: 'Railway', src: railwayIcon, tone: 'invert' },
    { name: 'Render', src: renderIcon, tone: 'invert' },
    { name: 'Heroku', src: herokuIcon },
  ],
  [
    { name: 'Supabase', src: supabaseIcon },
    { name: 'DigitalOcean', src: digitaloceanIcon },
    { name: 'Google Cloud SQL', src: gcpIcon },
  ],
  [
    { name: 'AWS S3', src: awsIcon, tone: 'dark' },
    { name: 'Azure', src: azureIcon },
  ],
];

const CARD_ICONS = [
  <svg key="cloud" viewBox="0 0 20 20" aria-hidden>
    <path
      d="M14.6 15.8H7.5a5.8 5.8 0 1 1 5.6-7.5h1.5a3.75 3.75 0 1 1 0 7.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  <svg key="db" viewBox="0 0 20 20" aria-hidden>
    <path
      d="M16.25 4.6c0 1.3-2.8 2.4-6.25 2.4S3.75 5.9 3.75 4.6 6.55 2.2 10 2.2s6.25 1.1 6.25 2.4ZM16.25 4.6v10.8c0 1.3-2.8 2.4-6.25 2.4s-6.25-1.1-6.25-2.4V4.6M16.25 10c0 1.3-2.8 2.4-6.25 2.4S3.75 11.3 3.75 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  <svg key="chip" viewBox="0 0 20 20" aria-hidden>
    <path
      d="M6.25 4.4h7.5c1 0 1.85.85 1.85 1.85v7.5c0 1-.85 1.85-1.85 1.85h-7.5c-1 0-1.85-.85-1.85-1.85v-7.5c0-1 .85-1.85 1.85-1.85ZM8 8h4v4H8V8ZM8 1.7v2.7M12 1.7v2.7M8 15.6v2.7M12 15.6v2.7M1.7 8h2.7M1.7 12h2.7M15.6 8h2.7M15.6 12h2.7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
];

export function ShipSection({ copy }: { copy: HomeCopy }) {
  const words = copy.ship.headline;
  return (
    <section className="sx-section" id="workspace-overview">
      <div className="sx-container">
        <h2 className="sx-display sx-ship-headline">
          {words.map((word, index) => {
            const strong = index % 2 === 0;
            const isLast = index === words.length - 1;
            return (
              <span key={index} className={strong ? undefined : 'sx-muted'}>
                {isLast ? <SealosMark className="sx-inline-icon" /> : null}
                {word}
              </span>
            );
          })}
        </h2>
        <AsciiWatercolor image="b" className="sx-reveal">
          <div
            className="sx-scaler"
            style={{
              ['--w' as string]: 1296,
              ['--h' as string]: 764,
              ['--m-scale' as string]: 0.52,
              ['--m-shift' as string]: 470,
              ['--m-ar' as string]: '358 / 400',
            }}
          >
            <div className="sx-scaler-stage">
              <ShipCanvasShot />
            </div>
          </div>
        </AsciiWatercolor>
        <div className="sx-ship-cards">
          {copy.ship.cards.map((card, index) => (
            <div key={card.title} className="sx-card sx-ship-card">
              <div className="sx-ship-card-head">
                <h3 className="sx-card-title sx-ship-card-title">
                  {CARD_ICONS[index]}
                  {card.title}
                </h3>
                <p className="sx-card-body">{card.body}</p>
              </div>
              <div className="sx-replaces">
                <span>{copy.ship.replaces}</span>
                <span className="sx-replaces-logos">
                  {REPLACES[index].map((logo) => (
                    <span
                      key={logo.name}
                      className="sx-replaces-logo"
                      data-invert={logo.tone === 'invert' || undefined}
                      data-dark={logo.tone === 'dark' || undefined}
                      title={logo.name}
                    >
                      <Image
                        src={logo.src}
                        alt={logo.name}
                        width={13}
                        height={13}
                      />
                    </span>
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

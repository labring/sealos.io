import { cn } from '@/lib/utils';
import { Marquee } from '../marquee';

const cards = [
  {
    version: 'v1.2.3',
    released: '2 days ago',
    message: 'Add backup snapshot support and fix restore bug',
    tag: 'backup',
  },
  {
    version: 'v1.2.2',
    released: '1 week ago',
    message: 'Improve backup scheduling and add retention policy',
    tag: 'backup',
  },
  {
    version: 'v2.0.0a',
    released: '3 hours ago',
    message: 'Initial beta for new dev workflow',
    tag: 'development',
  },
  {
    version: 'v2.0.0b',
    released: '2 days ago',
    message: 'Alpha: refactor deployment pipeline',
    tag: 'development',
  },
  {
    version: 'v1.9.0',
    released: '5 days ago',
    message: 'Promote new features to staging, update env vars',
    tag: 'staging',
  },
  {
    version: 'v1.8.5',
    released: '1 week ago',
    message: 'Staging: add canary release and test hooks',
    tag: 'staging',
  },
  {
    version: 'v1.8.0',
    released: '1 day ago',
    message: 'Production: security patch and performance improvements',
    tag: 'production',
  },
  {
    version: 'v1.7.9',
    released: '6 days ago',
    message: 'Production: update dependencies and minor fixes',
    tag: 'production',
  },
];

const backupCards = cards.filter((c) => c.tag === 'backup');
const developmentCards = cards.filter((c) => c.tag === 'development');
const stagingCards = cards.filter((c) => c.tag === 'staging');
const productionCards = cards.filter((c) => c.tag === 'production');

const tagColors: Record<string, string> = {
  backup: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  development: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  staging:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  production:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const ReleaseCard = ({
  version,
  released,
  message,
  tag,
}: {
  version: string;
  released: string;
  message: string;
  tag: string;
}) => {
  return (
    <figure
      className={cn(
        'relative h-full w-fit cursor-pointer overflow-hidden rounded-xl border p-4 sm:w-44',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
      )}
    >
      <div className="mb-1 flex flex-row items-center gap-2">
        <span
          className={cn(
            'rounded px-2 py-0.5 text-xs font-semibold',
            tagColors[tag] ||
              'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
          )}
        >
          {tag.charAt(0).toUpperCase() + tag.slice(1)}
        </span>
      </div>
      <figcaption className="flex flex-row items-center gap-2 text-sm font-bold dark:text-white">
        <span>{version}</span>
        <span className="text-xs font-normal text-gray-500">{released}</span>
      </figcaption>
      <blockquote className="mt-1 text-sm text-gray-700 dark:text-gray-300">
        {message}
      </blockquote>
    </figure>
  );
};

export function ReleaseAnimation() {
  return (
    <div className="relative flex h-96 w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
        }}
      >
        <Marquee pauseOnHover vertical className="[--duration:8s]">
          {backupCards.map((card, i) => (
            <ReleaseCard key={card.version + i} {...card} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:10s]" vertical>
          {developmentCards.map((card, i) => (
            <ReleaseCard key={card.version + i} {...card} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:25s]" vertical>
          {stagingCards.map((card, i) => (
            <ReleaseCard key={card.version + i} {...card} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="[--duration:40s]" vertical>
          {productionCards.map((card, i) => (
            <ReleaseCard key={card.version + i} {...card} />
          ))}
        </Marquee>
      </div>

      <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b"></div>
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  );
}

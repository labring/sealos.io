import { AppConfig } from '@/config/apps';
import { AppIcon } from '@/components/ui/app-icon';

interface CategoryShowcaseProps {
  apps: AppConfig[];
}

const collections = [
  {
    title: 'AI Innovation Lab',
    description:
      'Start AI products faster with LLM apps, agents, model tools, and workflow platforms ready for one-click deployment.',
    categories: ['AI'],
  },
  {
    title: 'Developer Efficiency',
    description:
      'Run private tools for automation, operations, documents, and internal workflows without managing servers by hand.',
    categories: ['Tools', 'Low-Code', 'DevOps'],
  },
  {
    title: 'Data Visualization',
    description:
      'Turn databases and telemetry into dashboards with analytics, monitoring, and data platforms deployed on demand.',
    categories: ['Monitoring', 'Database'],
  },
  {
    title: 'Open SaaS Alternatives',
    description:
      'Keep ownership of your stack with open-source replacements for popular SaaS products, hosted on your cloud.',
    categories: ['Blog', 'Storage', 'Low-Code'],
  },
];

function pickCollectionApps(apps: AppConfig[], categories: string[]) {
  return apps
    .filter((app) => categories.includes(app.category))
    .slice(0, 3);
}

export default function CategoryShowcase({ apps }: CategoryShowcaseProps) {
  return (
    <section className="pb-24">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div
          data-testid="category-showcase-fade"
          className="pointer-events-none absolute inset-y-0 left-6 z-20 w-12 bg-gradient-to-r from-background to-transparent lg:left-8"
          aria-hidden="true"
        />
        <div
          data-testid="category-showcase-fade"
          className="pointer-events-none absolute inset-y-0 right-6 z-20 w-28 bg-gradient-to-l from-background to-transparent md:w-[230px] lg:right-8"
          aria-hidden="true"
        />
        <div
          data-testid="category-showcase-scroll"
          className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-5 pr-28 md:pr-[230px]">
            {collections.map((collection) => {
              const collectionApps = pickCollectionApps(
                apps,
                collection.categories,
              );

              return (
                <article
                  key={collection.title}
                  className="group relative h-[191px] w-[82vw] max-w-[469px] min-w-[310px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:border-white/20 hover:bg-white/[0.06] md:w-[469px]"
                >
                  <div className="relative z-10 max-w-[360px]">
                    <h2 className="text-xl font-medium text-zinc-100">
                      {collection.title}
                    </h2>
                    <p className="mt-3 text-sm leading-5 text-zinc-400">
                      {collection.description}
                    </p>
                  </div>

                  <div className="absolute right-0 bottom-[-18px] h-28 w-48">
                    {collectionApps.map((app, index) => (
                      <div
                        key={app.slug}
                        className="absolute flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/85 shadow-xl shadow-black/30 transition duration-300 group-hover:-translate-y-1"
                        style={{
                          right: `${index * 44}px`,
                          bottom: `${index % 2 === 0 ? 0 : 16}px`,
                          transform: `rotate(${[-18, 13, -28][index] ?? 0}deg)`,
                        }}
                      >
                        <AppIcon
                          src={app.icon}
                          alt={`${app.name} icon`}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-lg object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

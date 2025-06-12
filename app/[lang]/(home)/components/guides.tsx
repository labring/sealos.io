import { AnimateElement } from '@/components/ui/animated-wrapper';
import { StarIcon } from '@/components/ui/star-icon';
import { CallToActionSection } from '@/components/ui/call-to-action-section';

const data = [
  {
    title: 'Create, develop, and deploy a Next.js app using Sealos DevBox',
    url: '/docs/quick-start',
  },
  {
    title: 'Build an AI-powered Discord bot using Sealos DevBox',
    url: '/docs/examples/build-your-own-discord-bot',
  },
  {
    title: 'Connect to PostgreSQL databases in Sealos DevBox using Node.js',
    url: '/docs/guides/databases/postgresql/nodejs',
  },
  {
    title: 'Connect to PostgreSQL databases in Sealos DevBox using Python',
    url: '/docs/guides/databases/postgresql/python',
  },
  {
    title: 'Connect to PostgreSQL databases in Sealos DevBox using Go',
    url: '/docs/guides/databases/postgresql/go',
  },
  {
    title: 'Connect to PostgreSQL databases in Sealos DevBox using Java',
    url: '/docs/guides/databases/postgresql/java',
  },
];

export default function Example() {
  return (
    <div className="mt-[140px]">
      <AnimateElement type="slideUp">
        <div className="text-center text-base font-bold text-black sm:text-4xl">
          Quick Start Guides
        </div>
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map((item, index) => (
            <div key={index}>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="h-full"
              >
                <div className="shadow-example-card flex h-full flex-1 cursor-pointer items-center gap-3 rounded-lg bg-white/80 p-6 text-sm font-medium text-black hover:text-[#005B9C] md:text-base">
                  <StarIcon />
                  {item.title}
                </div>
              </a>
            </div>
          ))}
        </div>

        <CallToActionSection
          title="Start a New Development Environment in Seconds"
          buttonText="New Project"
        />
      </AnimateElement>
    </div>
  );
}

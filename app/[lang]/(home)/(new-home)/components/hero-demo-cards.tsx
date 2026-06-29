import {
  ContainerIcon,
  DatabaseIcon,
  GithubIcon,
  PanelsTopLeftIcon,
} from 'lucide-react';

const demoCards = [
  {
    title: 'GitHub',
    description: 'Import repository from URL or GitHub authorization.',
    Icon: GithubIcon,
    href: '#github-import-section',
  },
  {
    title: 'Templates',
    description: 'Quickly import from commonly used application templates.',
    Icon: PanelsTopLeftIcon,
  },
  {
    title: 'Docker Image',
    description: 'Create and run a project directly using an existing image.',
    Icon: ContainerIcon,
    href: '#docker-image-section',
  },
  {
    title: 'Database',
    description: 'Set up a database project or data service first.',
    Icon: DatabaseIcon,
  },
];

export function HeroDemoCards() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {demoCards.map(({ title, description, Icon, href }) => {
        const content = (
          <>
            <div className="mb-1.5 flex items-center gap-2 text-base font-medium text-white">
              <Icon
                className="text-zinc-300 transition-colors group-hover:text-blue-500"
                size={16}
                aria-hidden="true"
              />
              {title}
            </div>
            <p className="text-sm leading-5 text-zinc-400">{description}</p>
          </>
        );

        if (href) {
          return (
            <a
              key={title}
              className="group block rounded-xl border border-transparent bg-transparent p-5 text-left transition hover:border-white/10 hover:bg-white/10"
              href={href}
            >
              {content}
            </a>
          );
        }

        return (
          <article
            key={title}
            className="group rounded-xl border border-transparent bg-transparent p-5 text-left transition hover:border-white/10 hover:bg-white/10"
          >
            {content}
          </article>
        );
      })}
    </div>
  );
}

import { AppConfig } from '@/config/apps';
import { AppIcon } from '@/components/ui/app-icon';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DeployButton } from './DeployButton';

interface AppHeaderProps {
  app: AppConfig;
  translations: {
    deployNow: string;
    website: string;
    sourceCode: string;
  };
}

export default function AppHeader({ app, translations }: AppHeaderProps) {
  const secondaryCtaClassName = cn(
    buttonVariants({ variant: 'outline' }),
    'h-10 gap-2 rounded-full border-white/10 bg-white/5 px-4 text-sm text-zinc-200 hover:bg-white/10 hover:text-white',
  );
  return (
    <div
      className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${app.gradient} opacity-15`}
      ></div>
      <div className="relative z-10 flex items-start gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg">
          <AppIcon
            src={app.icon}
            alt={`${app.name} icon`}
            className="h-12 w-12"
          />
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{app.name}</h1>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-medium text-zinc-200">
              {app.category}
            </span>
          </div>
          <p className="mb-4 text-lg text-muted-foreground">
            {app.description}
          </p>
          {/* Links and Deploy Button */}
          <div className="flex flex-wrap items-center gap-4">
            <DeployButton
              templateName={app.slug}
              appName={app.name}
              category={app.category}
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {translations.deployNow}
            </DeployButton>

            {/* Links */}
            {app.website && (
              <a
                href={app.website}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryCtaClassName}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                {translations.website}
              </a>
            )}

            {app.github && (
              <a
                href={app.github}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryCtaClassName}
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {translations.sourceCode}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

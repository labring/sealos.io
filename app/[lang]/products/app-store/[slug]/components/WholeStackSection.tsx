import {
  CircleCheck,
  Database,
  FileText,
  Globe,
  HardDrive,
  KeyRound,
  LayoutGrid,
} from 'lucide-react';
import { GradientLucideIcon } from '@/new-components/GradientLucideIcon';
import { cn } from '@/lib/utils';
import SectionHeading from './SectionHeading';

const stackItems = [
  {
    title: 'App Service',
    description: 'Your application is running and ready to serve requests.',
    icon: LayoutGrid,
  },
  {
    title: 'Public HTTPS URL',
    description: 'Secure, global endpoint to access your application.',
    icon: Globe,
  },
  {
    title: 'Database',
    description: 'Managed database instance for your application.',
    icon: Database,
  },
  {
    title: 'Persistent Volume',
    description: 'Durable storage for uploads and application data.',
    icon: HardDrive,
  },
  {
    title: 'Environment Variables',
    description: 'Configuration and secrets injected securely into your app.',
    icon: KeyRound,
  },
  {
    title: 'Logs & Metrics',
    description: 'Centralized logs and basic metrics are enabled.',
    icon: FileText,
  },
];

export default function WholeStackSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:px-8 lg:pt-14 lg:pb-24">
      <SectionHeading
        title="You Get the Whole Stack"
        description="Sealos provisions and connects every resource your application needs. Everything is ready to use."
      />

      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-500">
        {['One-click, fully provisioned', 'Secure by default', 'Production ready'].map(
          (item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <GradientLucideIcon Icon={CircleCheck} className="h-4 w-4 shrink-0" />
              {item}
            </span>
          ),
        )}
      </div>

      <div className="mt-20 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {stackItems.map((item, index) => (
          <article
            key={item.title}
            className={cn(
              'group min-h-[236px] border-white/10 bg-white/[0.025] p-7 transition hover:bg-white/[0.045]',
              index < stackItems.length - 1 && 'border-b',
              index % 2 === 0 ? 'sm:border-r' : 'sm:border-r-0',
              index < stackItems.length - 2 ? 'sm:border-b' : 'sm:border-b-0',
              index % 3 !== 2 ? 'lg:border-r' : 'lg:border-r-0',
              index < stackItems.length - 3 ? 'lg:border-b' : 'lg:border-b-0',
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/[0.055] text-white transition-colors group-hover:text-[#69a3ff]">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-14 text-base font-semibold text-zinc-100">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

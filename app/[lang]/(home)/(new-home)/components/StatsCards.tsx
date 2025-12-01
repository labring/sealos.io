'use client';

import { Users, GitBranch, GithubIcon, EarthIcon } from 'lucide-react';
import { memo } from 'react';
import CountUp from './CountUp';
import { useInView } from 'react-intersection-observer';

const StatCard = memo(function StatCard({
  icon,
  title,
  description,
  value,
  suffix,
  inView,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: number;
  suffix: string;
  inView: boolean;
}) {
  return (
    <div
      className="flex flex-col items-end gap-7 overflow-hidden rounded-[1.25rem] border border-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-black/30"
      style={{
        boxShadow: inView
          ? 'inset 0px -48px 56.1px -25px rgba(255, 255, 255, 0.25)'
          : 'inset 0px 48px 56.1px -25px rgba(255, 255, 255, 0.25)',
        animation: inView
          ? 'shadowRiseOnce 1400ms ease-out 0s 1 forwards'
          : 'none',
      }}
      aria-label={`Statistics card: ${title}: ${value}${suffix}. ${description}`}
      role="region"
    >
      <div className="w-full" aria-hidden="true">
        <div className="flex items-center gap-2">
          {/* icon container sizing */}
          <div className="h-4 w-4 shrink-0">{icon}</div>
          <span className="text-lg font-medium text-zinc-200">{title}</span>
        </div>
        <div className="mt-1">
          <span className="text-sm leading-5 font-normal text-zinc-400">
            {description}
          </span>
        </div>
      </div>

      <div
        className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-right text-[3.5rem] leading-none font-medium text-transparent"
        aria-hidden="true"
      >
        <CountUp to={value} duration={2} className="count-up-text" />
        {suffix}
      </div>
    </div>
  );
});

export function StatsCards() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const stats = [
    {
      // first card custom icon per spec
      icon: (
        <GithubIcon className="size-4 text-neutral-400" strokeWidth={1.33} />
      ),
      title: 'GitHub Stars',
      description: 'Developers trust our code',
      value: 16.5,
      suffix: 'k+',
    },
    {
      icon: <Users className="size-4 text-neutral-400" strokeWidth={1.33} />,
      title: 'Contributors',
      description: 'Global community builders',
      value: 150,
      suffix: '+',
    },
    {
      icon: (
        <GitBranch className="size-4 text-neutral-400" strokeWidth={1.33} />
      ),
      title: 'Commits',
      description: 'Lines of transparent code',
      value: 4,
      suffix: 'k+',
    },
    {
      // replace with provided 4th icon
      icon: (
        <EarthIcon className="size-4 text-neutral-400" strokeWidth={1.33} />
      ),
      title: 'Countries',
      description: 'Worldwide adoption',
      value: 10,
      suffix: '+',
    },
  ];

  return (
    <div
      ref={ref}
      className="grid w-full grid-cols-1 gap-6 px-0 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          description={stat.description}
          value={stat.value}
          suffix={stat.suffix}
          inView={inView}
        />
      ))}
      <style jsx>{`
        @keyframes shadowRiseOnce {
          0% {
            box-shadow: inset 0px 48px 56.1px -25px rgba(255, 255, 255, 0.25);
          }
          100% {
            box-shadow: inset 0px -48px 56.1px -25px rgba(255, 255, 255, 0.25);
          }
        }
      `}</style>
    </div>
  );
}

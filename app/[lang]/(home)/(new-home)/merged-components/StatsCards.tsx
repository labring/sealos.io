'use client';

import { Users, GitBranch } from 'lucide-react';
import { memo } from 'react';
import CountUp from './CountUp';
import { useInView } from 'react-intersection-observer';

// Memo 化单个统计卡片，避免其他卡片数字变化时重新渲染
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
      className={`flex h-[196px] flex-col items-end gap-7 overflow-hidden rounded-[20px] border border-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-black/30`}
      style={{
        boxShadow: inView
          ? 'inset 0px -48px 56.1px -25px rgba(255, 255, 255, 0.25)'
          : 'inset 0px 48px 56.1px -25px rgba(255, 255, 255, 0.25)',
        animation: inView
          ? 'shadowRiseOnce 1400ms ease-out 0s 1 forwards'
          : 'none',
      }}
    >
      <div className="w-full">
        <div className="flex items-center gap-2">
          {/* icon container sizing */}
          <div className="h-4 w-4 shrink-0">{icon}</div>
          <span className="text-[17.5px] leading-[25px] font-medium text-zinc-200">
            {title}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-sm leading-5 font-normal text-zinc-400">
            {description}
          </span>
        </div>
      </div>

      <div className="h-14 w-[138px] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-right text-[56px] leading-none font-medium text-transparent">
        <CountUp to={value} duration={2} className="count-up-text" />
        {suffix}
      </div>
    </div>
  );
});

export default function StatsCards() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const stats = [
    {
      // first card custom icon per spec
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="19"
          viewBox="0 0 17 19"
          fill="none"
        >
          <path
            d="M11.5001 17.3522V14.0189C11.616 12.975 11.3167 11.9273 10.6668 11.1022C13.1668 11.1022 15.6668 9.43555 15.6668 6.51888C15.7334 5.47721 15.4418 4.45221 14.8334 3.60221C15.0668 2.64388 15.0668 1.64388 14.8334 0.685547C14.8334 0.685547 14.0001 0.685547 12.3334 1.93555C10.1334 1.51888 7.86678 1.51888 5.66678 1.93555C4.00011 0.685547 3.16678 0.685547 3.16678 0.685547C2.91678 1.64388 2.91678 2.64388 3.16678 3.60221C2.56001 4.44878 2.26551 5.47954 2.33345 6.51888C2.33345 9.43555 4.83345 11.1022 7.33345 11.1022C7.00845 11.5105 6.76678 11.9772 6.62511 12.4772C6.48345 12.9772 6.44178 13.5022 6.50011 14.0189M6.50011 14.0189V17.3522M6.50011 14.0189C2.74178 15.6855 2.33341 12.3522 0.666748 12.3522"
            stroke="#A1A1AA"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: 'GitHub Stars',
      description: 'Developers trust our code',
      value: 23,
      suffix: 'k+',
    },
    {
      icon: (
        <Users
          className="h-[16.667px] w-[16.667px] flex-shrink-0"
          color="#A1A1AA"
          strokeWidth={1.33}
        />
      ),
      title: 'Contributors',
      description: 'Global community builders',
      value: 500,
      suffix: '+',
    },
    {
      icon: (
        <GitBranch
          className="h-[16.667px] w-[16.667px] flex-shrink-0"
          color="#A1A1AA"
          strokeWidth={1.33}
        />
      ),
      title: 'Commits',
      description: 'Lines of transparent code',
      value: 15,
      suffix: 'k+',
    },
    {
      // replace with provided 4th icon
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16.667"
          height="16.667"
          viewBox="0 0 19 19"
          fill="none"
        >
          <path
            d="M17.6998 11.5189H13.9165C13.4745 11.5189 13.0506 11.6945 12.738 12.007C12.4254 12.3196 12.2498 12.7435 12.2498 13.1855V16.9689M5.58317 1.80229V3.18562C5.58317 3.84866 5.84656 4.48455 6.3154 4.95339C6.78424 5.42223 7.42013 5.68562 8.08317 5.68562C8.5252 5.68562 8.94912 5.86122 9.26168 6.17378C9.57424 6.48634 9.74984 6.91026 9.74984 7.35229C9.74984 8.26895 10.4998 9.01895 11.4165 9.01895C11.8585 9.01895 12.2825 8.84336 12.595 8.5308C12.9076 8.21824 13.0832 7.79431 13.0832 7.35229C13.0832 6.43562 13.8332 5.68562 14.7498 5.68562H17.3915M8.91634 17.3105V14.0189C8.91634 13.5769 8.74075 13.1529 8.42819 12.8404C8.11563 12.5278 7.6917 12.3522 7.24967 12.3522C6.80765 12.3522 6.38372 12.1766 6.07116 11.8641C5.7586 11.5515 5.58301 11.1276 5.58301 10.6855V9.85221C5.58301 9.41019 5.40741 8.98626 5.09485 8.6737C4.78229 8.36114 4.35837 8.18555 3.91634 8.18555H1.45801M18.0832 9.01888C18.0832 13.6213 14.3522 17.3522 9.74984 17.3522C5.14746 17.3522 1.4165 13.6213 1.4165 9.01888C1.4165 4.41651 5.14746 0.685547 9.74984 0.685547C14.3522 0.685547 18.0832 4.41651 18.0832 9.01888Z"
            stroke="#A1A1AA"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: 'Countries',
      description: 'Worldwide adoption',
      value: 80,
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

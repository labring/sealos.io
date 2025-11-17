'use client';

import { useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { AiRuntimeCard } from '../components/caps-image/AiRuntimeCard';
import { DBCard } from '../components/caps-image/DBCard';
import { DeploymentCard } from '../components/caps-image/DeploymentCard';
import { StacksCard } from '../components/caps-image/StacksCard';
import {
  GradientBot,
  GradientAppWindowMac,
  GradientRocket,
  GradientDatabase,
} from '../components/GradientIcon';
import { GradientText } from '@/new-components/GradientText';
import { GodRays } from '@/new-components/GodRays';
import { BorderBeam } from '../components/BorderBeam';

interface CardData {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  title: string;
  description: string;
  tags: string[];
  image: React.ReactNode;
}

const firstRowCards: CardData[] = [
  {
    icon: GradientBot,
    label: 'AI & Agent Runtimes',
    title: 'Ship from Anywhere, Run Anything',
    description:
      'Your workflow is our workflow. Deploy instantly from a GitHub repo, run any public or private image from Docker Hub, or integrate Sealos into your existing CI/CD pipeline with GitHub Actions.',
    tags: ['GPU-Ready', 'AI Proxy', 'Auto Scale'],
    image: <AiRuntimeCard />,
  },
  {
    icon: GradientAppWindowMac,
    label: 'Full-Stack Web Apps',
    title: 'Deploy a Full-Stack Powerhouse',
    description:
      'Go beyond static sites. Seamlessly deploy both your React/Vue frontend and your Node.js/Go backend in a unified environment. We automate the build, containerization, and networking for you.',
    tags: ['Frontend + Backend', 'Auto Build', 'Unified Deploy'],
    image: <StacksCard />,
  },
];

const secondRowCards: CardData[] = [
  {
    icon: GradientRocket,
    label: 'Ultimate Deployment Flexibility',
    title: 'Ship from Anywhere, Run Anything',
    description:
      'Your workflow is our workflow. Deploy instantly from a GitHub repo, run any public or private image from Docker Hub, or integrate Sealos into your existing CI/CD pipeline with GitHub Actions.',
    tags: ['GitHub Deploy', 'Docker Images', 'CI/CD Ready'],
    image: <DeploymentCard />,
  },
  {
    icon: GradientDatabase,
    label: 'One-Click Backend Services',
    title: 'Get Production-Ready Backends, Instantly',
    description:
      'Stop wasting time on database ops. Launch a high-availability PostgreSQL or MySQL cluster with a single click. Need a mobile backend API or a Redis cache? Deploy it as a container in seconds.',
    tags: ['One-Click DB', 'High Availability', 'Instant Deploy'],
    image: <DBCard />,
  },
];

function CardWithBeam({
  children,
  colSpanClasses,
}: {
  children: React.ReactNode;
  colSpanClasses: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`col-span-1 -mt-px -mb-px ${colSpanClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex h-full flex-col overflow-hidden border border-white/10 p-6">
        {children}

        {/* BorderBeam Effect - 只在悬浮时显示流光 */}
        {isHovered && (
          <BorderBeam
            duration={8}
            size={150}
            borderWidth={1}
            colorFrom="#777777"
            colorTo="#ffffff"
          />
        )}
      </div>
    </div>
  );
}

export function CapsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="relative w-screen overflow-x-clip pt-28 pb-32"
    >
      {/* 顶部渐变遮罩 - 灰到黑，覆盖整个屏幕宽度 */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-5 h-96 w-screen -translate-x-1/2"
        style={{
          background:
            'linear-gradient(to bottom, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 40%, transparent 100%)',
        }}
      />

      {/* GodRays 效果 - only render when in view */}
      {isInView && (
        <GodRays
          sources={[
            {
              x: -0.05,
              y: -0.1,
              angle: 60,
              spread: 25,
              count: 12,
              color: '220, 220, 220',
            },
            {
              x: 0.5,
              y: -0.15,
              angle: 60,
              spread: 35,
              count: 11,
              color: '225, 225, 225',
            },
          ]}
          speed={0.0018}
          maxWidth={85}
          minLength={1000}
          maxLength={1800}
          blur={18}
        />
      )}

      <div className="container">
        <div className="flex flex-col pb-8 lg:pb-16">
          <h2
            className="text-2xl leading-tight sm:text-4xl md:text-[2.5rem]"
            aria-label="Built for the Modern Application."
          >
            <span>Built for the</span>&nbsp;
            <GradientText>Modern Application.</GradientText>
          </h2>
          <p className="mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            Whether you're building next-gen AI agents or battle-tested web
            apps, our unified platform is designed to amplify your workflow.
          </p>
        </div>

        {/* 第一行: 4/6 分布 */}
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-20 lg:border-y 2xl:grid-cols-10">
          {firstRowCards.map((card, index) => {
            const Icon = card.icon;
            const colSpanClasses =
              index === 0
                ? 'lg:col-span-9 2xl:col-span-4'
                : 'lg:col-span-11 2xl:col-span-6';
            return (
              <CardWithBeam key={index} colSpanClasses={colSpanClasses}>
                {/* Section Tag */}
                <div className="flex w-fit items-center rounded-full border border-white/5 bg-white/5 px-3 py-2 text-zinc-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),_0_2px_4px_-1px_rgba(0,0,0,0.02)]">
                  <Icon className="mr-2 size-5" aria-hidden="true" />
                  <span>{card.label}</span>
                </div>

                <h3 className="mt-6 text-xl text-zinc-200">{card.title}</h3>

                {/* Description */}
                <p className="mt-2 text-sm text-zinc-400">{card.description}</p>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {card.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="flex items-center rounded-lg border border-dashed border-white/15 px-2 py-1 text-sm whitespace-nowrap text-zinc-400 sm:text-base"
                    >
                      <div className="mr-2 size-2 rounded-full bg-blue-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                {/* Card Image */}
                <div className="mt-4 h-[16rem] grow" aria-hidden="true">
                  {card.image}
                </div>
              </CardWithBeam>
            );
          })}
        </div>

        {/* 第二行: 6/4 分布 (9/11) */}
        <div className="mt-9 grid grid-cols-1 gap-9 lg:mt-0 lg:grid-cols-20 lg:border-b 2xl:grid-cols-10">
          {secondRowCards.map((card, index) => {
            const Icon = card.icon;
            const colSpanClasses =
              index === 0
                ? 'lg:col-span-11 2xl:col-span-6'
                : 'lg:col-span-9 2xl:col-span-4';
            return (
              <CardWithBeam key={index} colSpanClasses={colSpanClasses}>
                {/* Section Tag */}
                <div className="flex w-fit items-center rounded-full border border-white/5 bg-white/5 px-3 py-2 text-zinc-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),_0_2px_4px_-1px_rgba(0,0,0,0.02)]">
                  <Icon className="mr-2 size-5" aria-hidden="true" />
                  <span>{card.label}</span>
                </div>

                <h3 className="mt-6 text-xl text-zinc-200">{card.title}</h3>

                {/* Description */}
                <p className="mt-2 text-sm text-zinc-400">{card.description}</p>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {card.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="flex items-center rounded-lg border border-dashed border-white/15 px-2 py-1 text-sm whitespace-nowrap text-zinc-400 sm:text-base"
                    >
                      <div className="mr-2 size-2 rounded-full bg-blue-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                {/* Card Image */}
                <div className="mt-4 h-[16rem] grow" aria-hidden="true">
                  {card.image}
                </div>
              </CardWithBeam>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { TextComponent } from '@/components/featurefour';
import { cn } from '@/lib/utils';

const data = [
  {
    title: 'Launch your dev environment in just one-click',
    content:
      'Choose from a wide-range of templates, or create your own, to create a fully configured cloud environment. Eliminate time wasted on setup and spend more time developing.',
    srcImage: '/images/devbox/launch.png',
  },
  {
    title: 'Code and build in your favorite code editor',
    content:
      'Write, build and test your code remotely with persistent environments, seamlessly continuing where you left off all from within your favorite code editor.',
    srcImage: '/images/devbox/code-editors.png',
  },
  {
    title: 'Publish your release with snapshot-based versioning',
    content:
      'Eliminate inconsistencies from traditional CI/CD pipelines might introduce when rebuilding from scratch with snapshots that include system configurations, dependencies, and code.',
    srcImage: '/images/devbox/release.png',
  },
  {
    title: 'Deploy to production seamlessly with auto-scaling',
    content:
      'Deploy to production and benefit from auto-scaling without the hassle. And thanks to our proprietary load balancer you can enjoy 3x faster response times than traditional solutions.',
    srcImage: '/images/devbox/deploy.png',
  },
];

export default function FeatureFourImages() {
  const [featureOpen, setFeatureOpen] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 10);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer > 10000) {
      setFeatureOpen((prev) => (prev + 1) % data.length);
      setTimer(0);
    }
  }, [timer]);

  return (
    <div className="container">
      <div className="mb-20 text-center">
        <p className=" mb-2 text-sm font-medium uppercase text-neutral-500">
          How does it work?
        </p>

        <h2 className="mb-4 text-4xl font-semibold tracking-tighter text-neutral-800">
          How to use the Easiest Cloud Dev Environment: DevBox
        </h2>
      </div>

      {/* Mobile view (single column layout with images below texts) */}
      <div className="block lg:hidden">
        {data.map((item, index) => (
          <div key={item.title} className="mb-8">
            <button
              className="w-full"
              onClick={() => {
                setFeatureOpen(index);
                setTimer(0);
              }}
              type="button"
            >
              <TextComponent
                content={item.content}
                isOpen={featureOpen === index}
                loadingWidthPercent={featureOpen === index ? timer / 100 : 0}
                number={index + 1}
                title={item.title}
              />
            </button>

            {/* Image below each text section - only visible when selected */}
            <div
              className={cn(
                'mt-4 h-96 w-full overflow-hidden rounded-lg transition-all duration-500',
                featureOpen === index ? 'opacity-100' : 'h-0 opacity-0',
              )}
            >
              <img
                alt={item.title}
                className="h-full w-full object-contain"
                src={item.srcImage}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view (grid layout) */}
      <div className="hidden grid-cols-2 gap-4 lg:grid">
        <div className="space-y-6">
          {data.map((item, index) => (
            <button
              className="w-full"
              key={item.title}
              onClick={() => {
                setFeatureOpen(index);
                setTimer(0);
              }}
              type="button"
            >
              <TextComponent
                content={item.content}
                isOpen={featureOpen === index}
                loadingWidthPercent={featureOpen === index ? timer / 100 : 0}
                number={index + 1}
                title={item.title}
              />
            </button>
          ))}
        </div>

        {/* Image container for desktop view */}
        <div className="relative h-96 w-full overflow-hidden rounded-lg md:h-[500px]">
          {data.map((item, index) => (
            <img
              alt={item.title}
              className={cn(
                'absolute inset-0 h-full w-full transform-gpu rounded-lg object-contain object-center transition-all duration-500',
                featureOpen === index ? 'opacity-100' : 'opacity-0',
              )}
              key={item.title}
              src={item.srcImage}
              style={{ zIndex: featureOpen === index ? 10 : 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

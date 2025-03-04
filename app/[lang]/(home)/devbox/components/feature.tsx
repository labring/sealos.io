import { cn } from '@/lib/utils';
import {
  DatabaseIcon,
  SealosIcon,
  ObjectStorageIcon,
} from '@/components/ui/icons';
import Image from 'next/image';
import { MagicCard } from '@/components/ui/magic-card';
import { AnimateElement } from '@/components/ui/animated-wrapper';

const features = [
  {
    title: 'Effortless Dev Environments',
    description:
      'Eliminate setup friction with pre-configured development environments in just one-click with seamless integration with your favorite IDE.',
    icon: <SealosIcon />,
  },
  {
    title: 'Integrated Databases',
    description:
      'Instantly provision development databases with automated backups, snapshots, and scaling. Connect effortlessly to MySQL, PostgreSQL, MongoDB, and Redis.',
    icon: <DatabaseIcon />,
  },
  {
    title: 'Cloud-Native Storage',
    description:
      'Persistent, scalable object storage for your development needs. Seamlessly store and manage assets, logs, and data with S3 compatibility and built-in security.',
    icon: <ObjectStorageIcon />,
  },
];

const features2 = [
  {
    title: 'Enterprise-Grade Isolation',
    description:
      'Work in fully isolated environments with consistent, reproducible workspaces - no more dependency conflicts. Stay focused on what matters.',
    icon: '🛡️',
    image: '/images/foundation-2-1.svg',
  },
  {
    title: 'Hyperscale Performance',
    description:
      'Auto-scale up to 10,000 nodes with industry-leading speed. Our proprietary load balancer delivers 3x faster response times than traditional solutions.',
    icon: '🚀',
    image: '/images/foundation-2-2.svg',
  },
  {
    title: 'Universal Access & Security',
    description:
      'Secure, flexible access from any network with automatic TLS. With full support for your own custom domain. Develop anywhere, without limitations.',
    icon: '🌐',
    image: '/images/foundation-2-3.svg',
  },
];

const performanceStats = [
  {
    icon: '/images/efficient-1.svg',
    percentage: '90%',
    description: 'Cost Reduction',
  },
  {
    icon: '/images/efficient-2.svg',
    percentage: '10x',
    description: 'Faster Development',
  },
  {
    icon: '/images/efficient-3.svg',
    percentage: '99.99%',
    description: 'Availability',
  },
  {
    icon: '/images/efficient-4.svg',
    percentage: '100%',
    description: 'Safety Protection',
  },
];

export default function Feature() {
  return (
    <div className="mt-52">
      <AnimateElement type="slideUp">
        <div className="text-center text-base font-bold text-black sm:text-4xl">
          Cloud-Native Development
        </div>
      </AnimateElement>

      <AnimateElement type="slideUp">
        <div className="mt-16 flex flex-col justify-center gap-6 lg:flex-row">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative flex h-[424px] flex-1 flex-col justify-between rounded-lg bg-white"
              style={{
                boxShadow:
                  '0px 12px 40px -25px rgba(6, 26, 65, 0.20), 0px 0px 1px 0px rgba(19, 51, 107, 0.20)',
              }}
            >
              <AnimateElement type="slideUp">
                <div className="flex  gap-4 p-6 pb-0">
                  <div className="text-5xl">{feature.icon}</div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold sm:text-[20px]">
                      {feature.title}
                    </h3>
                    <p className="mb-4 text-sm text-custom-secondary-text ">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimateElement>
              <div className="relative z-10 flex-1 overflow-hidden rounded-lg">
                <AnimateElement
                  type="slideUp"
                  delay={0.4}
                  className="mt-auto h-full"
                >
                  <Image
                    src={`/images/foundation-${index + 1}.svg`}
                    alt={feature.title}
                    width={411}
                    height={285}
                    className="z-10 mt-auto h-full w-full object-cover"
                  />
                </AnimateElement>
              </div>
              {index === 1 && (
                <div className="absolute left-1/2 top-2/3 z-0 h-[75px] w-[250px] -translate-x-1/2 -translate-y-1/2 bg-[#3DA7FF66] blur-[100px]"></div>
              )}
            </div>
          ))}
        </div>
      </AnimateElement>

      <div className="mt-[140px] flex flex-col gap-16">
        {features2.map((feature, index) => (
          <AnimateElement
            key={index}
            className={cn(
              'flex flex-col-reverse gap-16 text-center lg:flex-row lg:text-right',
              index === 1 && 'lg:flex-row-reverse lg:text-left',
            )}
            type="slideUp"
            delay={[0.2, 0.3, 0.4][index]}
          >
            <MagicCard
              gradientColor="#9ADFFF66"
              gradientSize={300}
              className="relative basis-1/2 rounded border border-dashed border-[#9DCBE6] bg-transparent"
            >
              <Image src={feature.image} alt={feature.title} fill />
            </MagicCard>
            <div className="flex basis-1/2 flex-col justify-center">
              <h3 className="mb-5 text-base font-bold sm:text-[28px]">
                {feature.title}
              </h3>
              <p className="text-xs font-medium text-custom-secondary-text sm:text-base">
                {feature.description}
              </p>
            </div>
          </AnimateElement>
        ))}
      </div>

      <AnimateElement type="slideUp">
        <div className="mt-[200px] text-center text-base font-bold text-black sm:text-4xl">
          Enterprise-Grade Development Platform
        </div>
        <div className="mt-16 grid grid-cols-2 flex-wrap items-center gap-10 rounded border border-dashed border-[#9DCBE6] px-2 py-9 lg:px-20 2xl:grid-cols-4">
          {performanceStats.map((stat, index) => (
            <div key={index} className="flex flex-1 items-center gap-4">
              <div className="h-[37px] w-[37px] flex-shrink-0 lg:h-[80px] lg:w-[80px]">
                <Image
                  src={stat.icon}
                  alt={stat.description}
                  width={80}
                  height={80}
                />
              </div>
              <div className="flex flex-col">
                <div className="text-[24px] font-bold text-black lg:text-[28px]">
                  {stat.percentage}
                </div>
                <div className="text-nowrap text-[12px] font-medium text-custom-secondary-text lg:text-sm">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimateElement>
    </div>
  );
}

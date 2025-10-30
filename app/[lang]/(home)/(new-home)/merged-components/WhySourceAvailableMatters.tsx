'use client';

import Image from 'next/image';
import { memo } from 'react';
import ltAvatar from '../assets/lt.png';
import rtAvatar from '../assets/rt.png';
import lbAvatar from '../assets/lb.png';
import rbAvatar from '../assets/rb.png';

interface TestimonialProps {
  avatar: any;
  name: string;
  quote: string;
}

const Testimonial = memo(function Testimonial({
  avatar,
  name,
  quote,
}: TestimonialProps) {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex items-center gap-3">
        <Image
          src={avatar}
          alt={name}
          width={36}
          height={36}
          className="aspect-square rounded-full object-cover"
        />
        <h5 className="m-0 self-stretch text-lg leading-7 font-medium text-zinc-200">
          {name}
        </h5>
      </div>
      <p className="m-0 self-stretch text-sm leading-5 font-normal text-zinc-400">
        {`"${quote}"`}
      </p>
    </div>
  );
});

interface FeatureProps {
  title: string;
  description: string;
}

const Feature = memo(function Feature({ title, description }: FeatureProps) {
  return (
    <div className="mb-12">
      <div className="flex w-full flex-col items-start gap-2 lg:flex-row lg:gap-12">
        <h4 className="m-0 w-auto shrink-0 text-[17.5px] leading-[25px] font-medium text-zinc-200 lg:w-[166px]">
          {title}
        </h4>
        <p
          className="m-0 block text-sm leading-5 font-normal text-zinc-400"
          style={{ width: '166px', height: '80px' }}
        >
          {description}
        </p>
      </div>
    </div>
  );
});

export default memo(function WhySourceAvailableMatters() {
  const features = [
    {
      title: 'Transparency',
      description:
        'Audit our code, understand our architecture, and verify our security practices.',
    },
    {
      title: 'Community',
      description:
        'Contribute features, report bugs, and shape the future of cloud development.',
    },
    {
      title: 'Trust',
      description:
        'No vendor lock-in, no hidden agendas. Just reliable software you can depend on.',
    },
  ];

  const testimonials = [
    {
      avatar: ltAvatar,
      name: 'Tom Dörr',
      quote:
        'Sealos is a game-changer. It eliminates the steep learning curve of complicated cloud services, allowing me to focus on what truly matters: deploying projects safely and quickly.',
    },
    {
      avatar: rtAvatar,
      name: 'Fakhr',
      quote:
        'Sealos is a user-friendly cloud OS that simplifies cloud-native infrastructure management. Ideal for developers and teams, it streamlines app deployment, self-hosted services, and SaaS platform building—no deep DevOps or Kubernetes knowledge needed.',
    },
    {
      avatar: lbAvatar,
      name: 'David Kuro',
      quote:
        "For new coders like me, Sealos is a great alternative to the complicated cloud. It saves a ton of learning time and gets things deployed safely and quickly. I'm happy to pay for it.",
    },
    {
      avatar: rbAvatar,
      name: 'Alamin',
      quote: 'RIP complexity. Sealos just replaced it all.',
    },
  ];

  return (
    <div className="mt-[104px] pt-0 pb-0">
      <div className="w-full px-0">
        {/* Two-column wrapper */}
        <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row">
          {/* Left Column */}
          <div className="w-full lg:w-[40%]">
            <h3 className="mb-16 text-left text-3xl leading-none font-medium text-white">
              Why Source Available Matters
            </h3>

            <div className="grid grid-cols-3 gap-8 lg:grid-cols-1 lg:gap-0">
              <Feature
                title="Transparency"
                description="Audit our code, understand our architecture, and verify our security practices."
              />
              <Feature
                title="Community"
                description="Contribute features, report bugs, and shape the future of cloud development."
              />
              <Feature
                title="Trust"
                description="No vendor lock-in, no hidden agendas. Just reliable software you can depend on."
              />
            </div>
          </div>

          {/* Right Column - Testimonials */}
          <div className="relative h-auto w-full overflow-hidden rounded-tl-3xl sm:h-[780px] md:h-[700px] lg:h-[612px] lg:w-[60%] lg:shrink-0">
            {/* >=640: 原绝对定位布局 */}
            <div className="relative hidden h-full w-full sm:block">
              {/* Border */}
              <div className="pointer-events-none absolute inset-0 z-[3] rounded-tl-3xl border-t border-l border-white/30" />
              {/* Hide right/bottom borders */}
              <div className="pointer-events-none absolute top-0 right-0 z-[4] h-full w-px bg-black" />
              <div className="pointer-events-none absolute bottom-0 left-0 z-[4] h-px w-full" />

              {/* Inner dividers */}
              <div className="absolute top-[45.588%] left-0 z-[2] h-0 w-1/2 border-t border-white/20" />
              <div className="absolute top-[63.398%] left-1/2 z-[2] h-0 w-1/2 border-t border-white/15" />
              <div
                className="absolute top-0 left-1/2 z-[2] h-full w-0 border-l"
                style={{
                  borderImage:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%)',
                  borderImageSlice: 1,
                }}
              />

              {/* Testimonial 1 - Top Left */}
              <div
                className="absolute z-[1]"
                style={{
                  top: '62.7px',
                  left: 'calc((50% - calc(50% * 0.7)) / 2)',
                  width: 'calc(50% * 0.7)',
                }}
              >
                <Testimonial {...testimonials[0]} />
              </div>

              {/* Testimonial 2 - Top Right */}
              <div
                className="absolute z-[1] -translate-y-1/2"
                style={{
                  left: 'calc(50% + (50% - calc(50% * 0.7)) / 2)',
                  top: 'calc((63.398% - 0%) / 2)',
                  width: 'calc(50% * 0.7)',
                }}
              >
                <Testimonial {...testimonials[1]} />
              </div>

              {/* Testimonial 3 - Bottom Left */}
              <div
                className="absolute z-[1] -translate-y-1/2"
                style={{
                  left: 'calc((50% - calc(50% * 0.7)) / 2)',
                  top: 'calc(45.588% + (100% - 45.588%) / 2)',
                  width: 'calc(50% * 0.7)',
                }}
              >
                <Testimonial {...testimonials[2]} />
              </div>

              {/* Testimonial 4 - Bottom Right */}
              <div
                className="absolute z-[1] -translate-y-1/2"
                style={{
                  left: 'calc(50% + (50% - calc(50% * 0.7)) / 2)',
                  top: 'calc(63.398% + (100% - 63.398%) / 2)',
                  width: 'calc(50% * 0.7)',
                }}
              >
                <Testimonial {...testimonials[3]} />
              </div>
            </div>

            {/* <640: 纵向列表，条目之间分隔线；保留上/左边框与左上圆角 */}
            <div className="relative rounded-tl-3xl border-t border-l border-white/30 sm:hidden">
              <div className="w-full divide-y divide-white/10">
                {testimonials.map((t, i) => (
                  <div key={i} className="px-5 py-6">
                    <Testimonial {...t} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

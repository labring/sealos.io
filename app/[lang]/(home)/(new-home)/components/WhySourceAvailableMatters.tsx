import Image from 'next/image';
import ltAvatar from '@/assets/lt.png';
import rtAvatar from '@/assets/rt.png';
import lbAvatar from '@/assets/lb.png';
import rbAvatar from '@/assets/rb.png';

interface TestimonialProps {
  avatar: any;
  name: string;
  quote: string;
}

const Testimonial = ({ avatar, name, quote }: TestimonialProps) => (
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

interface FeatureProps {
  title: string;
  description: string;
}

const Feature = ({ title, description }: FeatureProps) => (
  <div className="mb-12">
    <div className="flex w-full flex-col items-start gap-2 lg:flex-row lg:gap-12">
      <h4 className="m-0 shrink-0 text-lg leading-6 font-medium text-zinc-200 lg:w-40">
        {title}
      </h4>
      <p className="m-0 flex-1 text-sm leading-5 font-normal text-zinc-400">
        {description}
      </p>
    </div>
  </div>
);

export function WhySourceAvailableMatters() {
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
    <div className="mt-24 pt-2 pb-0">
      <div className="w-full px-0">
        {/* Two-column wrapper */}
        <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row">
          {/* Left Column */}
          <div className="w-full flex-shrink-0 lg:w-2/5">
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
          <div className="w-full flex-shrink-0 lg:w-3/5">
            {/* >=640: Grid layout for testimonials */}
            <div className="hidden sm:block">
              <div className="relative rounded-tl-3xl border-t border-l border-white/30">
                {/* Grid container: 2 columns with asymmetric row distribution */}
                <div className="grid grid-cols-2 gap-0">
                  {/* Left column - flex column layout */}
                  <div className="flex flex-col border-r border-white/20">
                    {/* Top Left - starts at top */}
                    <div className="flex flex-1 items-start justify-start border-b border-white/20 p-6">
                      <div className="max-w-full flex-1">
                        <Testimonial {...testimonials[0]} />
                      </div>
                    </div>
                    {/* Bottom Left - centered in remaining space */}
                    <div className="flex flex-1 items-center justify-start p-6">
                      <div className="max-w-full flex-1">
                        <Testimonial {...testimonials[2]} />
                      </div>
                    </div>
                  </div>

                  {/* Right column - flex column layout */}
                  <div className="flex flex-col">
                    {/* Top Right - centered in first half */}
                    <div className="flex flex-1 items-center justify-start border-b border-white/15 p-6">
                      <div className="max-w-full flex-1">
                        <Testimonial {...testimonials[1]} />
                      </div>
                    </div>
                    {/* Bottom Right - centered in second half */}
                    <div className="flex flex-1 items-center justify-start p-6">
                      <div className="max-w-full flex-1">
                        <Testimonial {...testimonials[3]} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <640: 纵向列表，条目之间分隔线；保留上/左边框与左上圆角 */}
            <div className="relative rounded-3xl border border-white/30 sm:hidden">
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
}

import { Marquee } from './marquee';
import Image from 'next/image';

const companies = [
  {
    name: 'TikTok',
    url: '/images/logos/tiktok.svg',
    widht: 97,
    height: 22,
  },
  {
    name: 'GitHub',
    url: '/images/logos/github.svg',
    widht: 135,
    height: 48,
  },
  {
    name: 'FastGPT',
    url: '/images/logos/fastgpt.svg',
    widht: 2000,
    height: 491,
  },
  {
    name: 'Nvidia',
    url: '/images/logos/nvidia.svg',
    widht: 731,
    height: 137,
  },
  {
    name: 'JetBrains',
    url: '/images/logos/jetbrains.svg',
    widht: 298,
    height: 64,
  },
  {
    name: 'Microsoft',
    url: '/images/logos/microsoft.svg',
    widht: 300,
    height: 64,
  },
  {
    name: 'Stripe',
    url: '/images/logos/stripe.svg',
    widht: 300,
    height: 125,
  },
  {
    name: 'Open Source Initiative',
    url: '/images/logos/open-source.webp',
    widht: 640,
    height: 229,
  },
];

export default function Logos() {
  return (
    <section id="logos">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center text-base font-bold text-black sm:text-2xl">
          Trusted by leading teams and individuals
        </div>
        <div className="relative mt-6">
          <Marquee className="max-w-full [--duration:40s]">
            {companies.map((company, idx) => (
              <Image
                key={idx}
                width={112}
                height={40}
                src={company.url}
                className="h-10 w-28 opacity-30 grayscale dark:brightness-0 dark:invert"
                alt={company.name}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

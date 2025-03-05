import { Marquee } from './marquee';
import Image from 'next/image';

const companies = [
  {
    name: 'Google',
    url: '/images/logos/google.svg',
  },
  {
    name: 'GitHub',
    url: '/images/logos/github.svg',
  },
  {
    name: 'Amazon',
    url: '/images/logos/amazon.svg',
  },
  {
    name: 'Meta',
    url: '/images/logos/meta.svg',
  },
  {
    name: 'Netflix',
    url: '/images/logos/netflix.svg',
  },
  {
    name: 'Microsoft',
    url: '/images/logos/microsoft.svg',
  },
  {
    name: 'MIT',
    url: '/images/logos/mit.svg',
  },
  {
    name: 'Caltech',
    url: '/images/logos/caltech.svg',
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

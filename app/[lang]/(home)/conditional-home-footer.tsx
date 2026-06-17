'use client';

import BottomLightImage from '@/assets/bottom-light.svg';
import { Footer } from '@/new-components/Footer';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function ConditionalHomeFooter({ lang }: { lang: string }) {
  const pathname = usePathname();

  if (pathname === '/' || pathname === `/${lang}` || pathname === `/${lang}/`) {
    return null;
  }

  return (
    <div className="relative mt-[80px] mb-[400px] h-[800px]">
      <div className="w-full">
        <Image
          src={BottomLightImage}
          alt=""
          className="h-auto w-full object-cover select-none"
          priority
          fill
        />
      </div>

      <Footer lang={lang} />
    </div>
  );
}

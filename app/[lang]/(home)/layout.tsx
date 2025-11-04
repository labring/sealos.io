import { Header } from '@/new-components/Header';
import Image from 'next/image';
import { Footer } from '@/new-components/Footer';
import BottomLightImage from '@/assets/bottom-light.svg';
export default function NewLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="sticky top-0 z-50 container pt-8">
        <Header />
      </div>

      {children}

      {/* 第七屏与页脚之间的光照背景 */}
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

        <Footer lang={'en'} />
      </div>
    </>
  );
}

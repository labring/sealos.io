'use client';

import SourceAvailSection from './merged-components/SourceAvailSection';
import FAQSection from './merged-components/FAQSection';
import Footer from './merged-components/Footer';
import Image from 'next/image';
import light4 from './assets/liht4.png';

export default function TestMergedPage() {
  return (
    <div className="h-full bg-black">
      {/* 第六屏、七屏与页脚 - 整体统一黑色背景 */}
      <div className="bg-black">
        <div
          style={{
            paddingTop: '114px',
            paddingBottom: 0,
            paddingLeft: '64px',
            paddingRight: '64px',
          }}
        >
          <SourceAvailSection lang="en" />
        </div>
        <FAQSection />
        {/* 第七屏与页脚之间的光照背景 */}
        <div className="relative mt-[140px] bg-black">
          <div
            className="pointer-events-none absolute left-1/2 z-10 w-screen -translate-x-1/2"
            style={{ top: '-140px' }}
          >
            <Image
              src={light4}
              alt=""
              className="h-auto w-full select-none"
              priority
            />
          </div>
          {/* 间距容器，确保光照有展示空间 */}
          <div className="h-[330px]"></div>
        </div>
        <Footer lang="en" />
      </div>
    </div>
  );
}

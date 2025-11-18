import type { ReactNode, JSX } from 'react';
import { AppDeploymentBg } from './bgs/AppDeploymentBg';
import { AppStoreChoicesBg } from './bgs/AppStoreChoicesBg';
import { BestPracticesBg } from './bgs/BestPracticesBg';
import { TechComparedBg } from './bgs/TechComparedBg';
import { WhatIsBg } from './bgs/WhatIsBg';

export type BlogThumbnailTemplateProps = {
  title: string;
  category?: string;
};

type ScaledThumbnailProps = {
  width: number;
  height: number;
  dpr: number;
  children: ReactNode;
};

export function BlogThumbnailTemplate({
  title,
  category,
}: BlogThumbnailTemplateProps) {
  const bgMap: Record<string, JSX.Element> = {
    'app-store-choices': <AppStoreChoicesBg />, 
    'app-deployment': <AppDeploymentBg />,
    'best-practices': <BestPracticesBg />,
    'tech-compared': <TechComparedBg />,
    'what-is': <WhatIsBg />,
  };

  const formatTitle = (value: string) =>
    decodeURIComponent(value)
      .split(/[-\s]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const categoryText = category ? formatTitle(category) : 'BLOG';
  const titleText = title.toUpperCase();
  const normalizedCategory = category?.toLowerCase() ?? '';
  const background = bgMap[normalizedCategory] ?? <WhatIsBg />;

  return (
    <div tw="flex bg-black w-full h-full relative">
      {background}
      <div tw="absolute flex flex-col left-4 top-8">
        <div tw="flex items-center">
          <div tw="bg-blue-400 w-1.5 h-1.5 rounded-full mr-2" />
          <div tw="text-white text-xs">{categoryText}</div>
        </div>
        <div tw="mt-3 text-white font-bold text-base max-w-[80%]">
          {titleText}
        </div>
      </div>

      <div tw="absolute flex bottom-5 right-5 text-white text-xs font-medium items-center">
        {/* @ts-expect-error `tw` is accepted by satori. */}
        <svg tw="mr-1" fill="none" viewBox="0 0 16 16">
          <path
            stroke="#FAFAFA"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.33"
            d="M2.67 7.33a6 6 0 0 1 6 6m-6-10.66a10.67 10.67 0 0 1 10.66 10.66M4 12.67a.67.67 0 1 1-1.33 0 .67.67 0 0 1 1.33 0Z"
          />
        </svg>
        <span> Sealos Blog </span>
      </div>
    </div>
  );
}

export function renderScaledThumbnail({
  width,
  height,
  dpr,
  children,
}: ScaledThumbnailProps) {
  return (
    <div
      style={{
        display: 'flex',
        width,
        height,
        transform: `scale(${dpr})`,
        transformOrigin: 'top left',
      }}
    >
      {children}
    </div>
  );
}

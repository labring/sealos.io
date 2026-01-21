import type { ReactNode } from 'react';

type SiteBannerProps = {
  text: ReactNode;
  action?: ReactNode;
};

export function SiteBanner({ text, action }: SiteBannerProps) {
  return (
    <div className="sticky top-0 z-50 flex h-auto w-full flex-col items-center justify-center bg-gradient-to-r from-white to-[#609CFF] px-4 py-2 text-zinc-900 sm:flex-row lg:h-12">
      <div className="flex flex-1 flex-col text-center text-xs sm:text-start sm:text-sm lg:w-fit lg:flex-none lg:flex-row lg:text-base">
        {text}
      </div>
      {action ? <div className="mt-2 sm:mt-0 sm:ml-3">{action}</div> : null}
    </div>
  );
}


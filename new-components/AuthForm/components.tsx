'use client';

import Image from 'next/image';

// Sealos Logo
export const SealosLogo = () => (
  <div className="border-gradient gradient-to flex size-14 items-center justify-center rounded-xl bg-gradient-to-b from-[#2e2e2e] to-[#1a1a1a] [--border-gradient-from:var(--color-neutral-500)] [--border-gradient-position:to_bottom_in_oklab] [--border-gradient-to:transparent]">
    <Image
      src="/logo.svg"
      alt="Sealos Logo"
      width={32}
      height={32}
      className="size-10"
    />
  </div>
);

export { GoogleIcon, GithubIcon } from '@/components/ui/icons';

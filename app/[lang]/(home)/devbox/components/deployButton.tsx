'use client';

import { Package } from 'lucide-react';

export function DeployButton() {
  return (
    <div className="group relative flex h-9 w-full max-w-52 items-center justify-center gap-2 overflow-hidden whitespace-pre rounded-md bg-custom-bg px-4 py-2 text-sm font-medium text-custom-primary-text shadow transition-all duration-300 ease-out hover:bg-[#97D9FF] hover:ring-2 hover:ring-custom-bg hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 md:flex">
      <div className="flex items-center">
        <Package className="h-4 w-4 fill-none" />
        <span className="ml-2">Deploy on DevBox</span>
      </div>
    </div>
  );
}

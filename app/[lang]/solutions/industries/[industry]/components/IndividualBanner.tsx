'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, User, ArrowRight } from 'lucide-react';

interface IndividualBannerProps {
  industrySlug: string;
  industryName: string;
}

export default function IndividualBanner({
  industrySlug,
  industryName,
}: IndividualBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                Are you an individual {industryName.toLowerCase()} professional?
              </p>
              <p className="hidden text-xs opacity-90 sm:inline">
                Discover solutions tailored specifically for you
              </p>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center space-x-2">
            <Link
              href={`/solutions/industries/${industrySlug}/individual`}
              className="inline-flex items-center rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-white/30"
            >
              <span className="hidden sm:inline">
                View Individual Solutions
              </span>
              <span className="sm:hidden">Individual</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>

            <button
              onClick={() => setIsVisible(false)}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/20"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

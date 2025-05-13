'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { languagesType } from '@/lib/i18n';

const translations = {
  'en': {
    trusted: 'Trusted by',
    developers: 'developers',
    companies: 'companies',
    users: 'users',
    projects: 'projects',
  },
  'zh-cn': {
    trusted: '受到信赖',
    developers: '开发者',
    companies: '企业',
    users: '用户',
    projects: '项目',
  }
};

interface TestimonialBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  count: string;
  lang?: languagesType;
}

export const TestimonialBadge = React.forwardRef<HTMLDivElement, TestimonialBadgeProps>(
  ({ className, count, lang = 'en', ...props }, ref) => {
    const t = translations[lang];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border border-[#DDE7F7] bg-white px-3 py-2 shadow-sm",
          className
        )}
        {...props}
      >
        <div className="flex -space-x-1.5">
          <img
            className="h-5 w-5 rounded-full ring-1 ring-white"
            src="https://randomuser.me/api/portraits/thumb/men/75.jpg"
            alt="Avatar 01"
          />
          <img
            className="h-5 w-5 rounded-full ring-1 ring-white"
            src="https://randomuser.me/api/portraits/thumb/women/42.jpg"
            alt="Avatar 02"
          />
          <img
            className="h-5 w-5 rounded-full ring-1 ring-white"
            src="https://randomuser.me/api/portraits/thumb/men/33.jpg"
            alt="Avatar 03"
          />
          <img
            className="h-5 w-5 rounded-full ring-1 ring-white"
            src="https://randomuser.me/api/portraits/thumb/women/24.jpg"
            alt="Avatar 04"
          />
        </div>
        <p className="ml-2 text-xs text-gray-600">
          {t.trusted} <strong className="font-medium text-black">{count}</strong> {t.developers}
        </p>
      </div>
    );
  }
);

TestimonialBadge.displayName = "TestimonialBadge";

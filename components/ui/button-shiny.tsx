'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useButtonHandler } from '@/hooks/use-button-handler';
import { ButtonLink } from './button-link';

interface ShinyButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  location?: string;
  title?: string;
}

const ShinyButton = ({
  children,
  className,
  href,
  location,
  title,
  ...props
}: ShinyButtonProps) => {
  const { handleClick } = useButtonHandler({
    title: title || 'ShinyButton',
    location: location || '',
    href,
    actionType: 'url',
  });

  const buttonContent = (
    <>
      <span
        className="relative block size-full text-sm tracking-wide text-[rgb(0,0,0,65%)] uppercase dark:font-light dark:text-[rgb(255,255,255,90%)]"
        style={{
          maskImage:
            'linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))',
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: 'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
          maskComposite: 'exclude',
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),hsl(var(--primary)/10%)_calc(var(--x)+100%))] p-px"
      />
    </>
  );

  // If href is provided, render as a link for better SEO and consistent behavior
  if (href) {
    return (
      <ButtonLink
        href={href}
        title={title || 'ShinyButton'}
        className={cn(
          'relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow-sm dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]',
          className,
        )}
        style={
          {
            '--x': '100%',
          } as React.CSSProperties
        }
        onClick={handleClick}
      >
        {buttonContent}
      </ButtonLink>
    );
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      className={cn(
        'animate-shiny-button relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow-sm dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]',
        className,
      )}
    >
      {buttonContent}
    </button>
  );
};

export const GetStartedButton = ({
  title,
  className,
  link,
  location,
  ...props
}: {
  title?: string;
  className?: string;
  link: string;
  location: string;
}) => {
  const { handleClick } = useButtonHandler({
    title: title || 'Get Started',
    location,
    href: link,
    actionType: 'url',
  });

  const buttonContent = (
    <>
      <div className="z-10">{title ? title : 'Get Started'}</div>
      <ArrowRight className="relative h-4 w-4" />
      <div className="animate-shine-effect absolute -top-1/2 left-0 h-full w-full">
        <div className="h-[200%] w-[40px] bg-white/60" />
      </div>
    </>
  );

  // Render as a link for better SEO
  return (
    <ButtonLink
      href={link}
      title={title || 'Get Started'}
      className={cn(
        'bg-custom-bg text-custom-primary-text shadow-button relative flex cursor-pointer items-center justify-center gap-[6px] overflow-hidden rounded-md py-2 pr-3 pl-4 hover:bg-[#97D9FF] sm:pr-4 sm:pl-5',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {buttonContent}
    </ButtonLink>
  );
};

export default ShinyButton;

'use client';

import React from 'react';
import { motion, type AnimationProps } from 'framer-motion';

import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const animationProps = {
  initial: { '--x': '100%', scale: 0.8 },
  animate: { '--x': '-100%', scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 1,
    type: 'spring',
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: 'spring',
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps;
interface ShinyButtonProps {
  children: React.ReactNode;
  className?: string;
}
const ShinyButton = ({ children, className, ...props }: ShinyButtonProps) => {
  return (
    <motion.button
      {...animationProps}
      {...props}
      className={cn(
        'relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow-sm dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]',
        className,
      )}
    >
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
      ></span>
    </motion.button>
  );
};

export const GetStartedButton = ({
  title,
  className,
  link,
  ...props
}: {
  title?: string;
  className?: string;
  link?: string;
}) => {
  const handleClick = () => {
    window.rybbit.event('Get Started Button Clicked');
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div
      className={cn(
        'bg-custom-bg text-custom-primary-text shadow-button relative flex cursor-pointer items-center justify-center gap-[6px] overflow-hidden rounded-md py-2 pr-3 pl-4 hover:bg-[#97D9FF] sm:pr-4 sm:pl-5',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <div className="z-10">{title ? title : 'Get Started'}</div>
      <ArrowRight className="relative h-4 w-4" />
      <motion.div
        className="absolute -top-1/2 left-0 h-[200%] w-[40px] bg-white/60"
        initial={{ x: '-50px', skew: '-20deg' }}
        animate={{ x: '150px' }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: 'easeInOut',
          repeatDelay: 1,
        }}
        style={{
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
};

export default ShinyButton;

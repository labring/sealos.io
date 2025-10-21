import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        'landing-primary':
          'border border-white hover:border-neutral-200 rounded-full bg-gradient-to-b from-white from-10% to-gray-300 to-90% shadow-[0_10px_15px_-3px_rgba(255,255,255,0.16),0_4px_6px_-2px_rgba(255,255,255,0.05)] hover:from-[#eaeaea] hover:to-[#9e9e9e] text-zinc-900',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

export function DeployButton({
  imageUrl = '/Deploy-on-Sealos.svg',
  deployUrl,
  alt,
}: {
  deployUrl: string;
  imageUrl?: string;
  alt?: string;
}) {
  return (
    <a
      href={deployUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block transition-opacity hover:opacity-90"
    >
      <div className="relative h-[60px] w-[200px]">
        <Image
          src={imageUrl}
          alt={alt || 'Deploy on Sealos'}
          width={200}
          height={60}
          className="mt-1 mb-1 rounded-xl"
          loading="lazy"
          sizes="200px"
          priority={false}
        />
      </div>
    </a>
  );
}

import { cva } from 'class-variance-authority';

/**
 * Common container variants used across components
 */
export const containerVariants = cva('mx-auto', {
  variants: {
    size: {
      sm: 'max-w-4xl',
      md: 'max-w-6xl',
      lg: 'max-w-7xl',
      full: 'max-w-full',
    },
    padding: {
      none: '',
      sm: 'px-4',
      md: 'px-8',
      lg: 'px-8 md:px-[15%]',
    },
  },
  defaultVariants: {
    size: 'lg',
    padding: 'lg',
  },
});

/**
 * Common section spacing variants
 */
export const sectionVariants = cva('', {
  variants: {
    spacing: {
      none: '',
      sm: 'py-8',
      md: 'py-16',
      lg: 'py-20',
      xl: 'space-y-20',
    },
    background: {
      none: '',
      light: 'bg-[#EBF2FF]',
      gradient: 'bg-gradient-to-b from-[#EBF2FF] via-[#F0F7FF] to-[#FFF8F0]',
    },
  },
  defaultVariants: {
    spacing: 'md',
    background: 'none',
  },
});

/**
 * Common card variants
 */
export const cardVariants = cva(
  'rounded-lg border border-gray-100 bg-white shadow-lg transition-shadow',
  {
    variants: {
      hover: {
        none: '',
        lift: 'hover:shadow-xl',
      },
      padding: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      size: {
        auto: 'h-auto',
        full: 'h-full',
      },
    },
    defaultVariants: {
      hover: 'lift',
      padding: 'md',
      size: 'auto',
    },
  }
);

/**
 * Common text variants
 */
export const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    color: 'primary',
    align: 'left',
  },
});

/**
 * Common grid variants
 */
export const gridVariants = cva('grid gap-8', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
    gap: {
      sm: 'gap-4',
      md: 'gap-8',
      lg: 'gap-12',
    },
  },
  defaultVariants: {
    cols: 2,
    gap: 'md',
  },
});

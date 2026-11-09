import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Watercolor backdrops; the image itself is set per value in home.css. */
export type WatercolorImage = 'hero' | 'a' | 'b';

interface WatercolorProps {
  image: WatercolorImage;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** A rounded panel painted with a static, tinted watercolor image. */
export function Watercolor({
  image,
  className,
  style,
  children,
}: WatercolorProps) {
  return (
    <div
      className={cn('sx-watercolor', className)}
      data-image={image}
      style={style}
    >
      {children}
    </div>
  );
}

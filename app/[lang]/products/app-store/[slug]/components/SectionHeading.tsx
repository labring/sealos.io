import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  earlyBlue?: boolean;
  wideLayer?: boolean;
}

export function figmaDetailHeadingClassName({
  earlyBlue = false,
  wideLayer = false,
}: { earlyBlue?: boolean; wideLayer?: boolean } = {}) {
  return cn(
    'max-w-full bg-gradient-to-r from-white to-[#146DFF] bg-clip-text text-3xl leading-none font-semibold text-transparent sm:text-4xl',
    wideLayer ? 'block w-full lg:max-w-[1208px]' : 'inline-block w-fit',
    earlyBlue && 'to-[12.624%]',
  );
}

export default function SectionHeading({
  title,
  description,
  className,
  earlyBlue = false,
  wideLayer = false,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <h2 className={figmaDetailHeadingClassName({ earlyBlue, wideLayer })}>
        {title}
      </h2>
      {description && (
        <p className="mt-5 max-w-[620px] text-sm leading-6 text-zinc-400">
          {description}
        </p>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';
import { GradientText } from '@/new-components/GradientText';

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
    'max-w-full text-3xl leading-none font-semibold sm:text-4xl',
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
      <GradientText
        as="h2"
        className={cn(
          'to-[#146DFF]',
          figmaDetailHeadingClassName({ earlyBlue, wideLayer }),
        )}
      >
        {title}
      </GradientText>
      {description && (
        <p className="mt-5 max-w-[620px] text-sm leading-6 text-zinc-400">
          {description}
        </p>
      )}
    </div>
  );
}

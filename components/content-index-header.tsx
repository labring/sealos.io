import { GradientText } from '@/new-components/GradientText';
import type { ReactNode } from 'react';

type ContentIndexHeaderProps = {
  prefix: string;
  accent: string;
  description: string;
  action?: ReactNode;
};

export function ContentIndexHeader({
  prefix,
  accent,
  description,
  action,
}: ContentIndexHeaderProps) {
  return (
    <div>
      <h1
        aria-label={`${prefix} ${accent}`}
        className="mb-4 text-center text-4xl font-medium"
      >
        <span>{prefix} </span>
        <GradientText>{accent}</GradientText>
      </h1>
      <p className="text-center text-zinc-400">{description}</p>

      {action && (
        <div className="mt-10 flex w-full justify-center">{action}</div>
      )}
    </div>
  );
}

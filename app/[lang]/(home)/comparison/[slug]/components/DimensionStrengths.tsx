import { ComparisonConfig, DimensionId } from '../../config/platforms';

interface DimensionStrengthsProps {
  dimensionId: DimensionId;
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function DimensionStrengths({
  dimensionId,
  firstPlatform,
  secondPlatform,
}: DimensionStrengthsProps) {
  const firstData = firstPlatform.content.dimensions[dimensionId];
  const secondData = secondPlatform.content.dimensions[dimensionId];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          {firstPlatform.name} Strengths
        </h3>
        <ul className="space-y-3">
          {firstData.strengths.strengths.map((strength, index) => (
            <li key={index} className="text-sm text-zinc-300">
              <div
                dangerouslySetInnerHTML={{
                  __html: strength.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong>$1</strong>',
                  ),
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-xl font-semibold">
          {secondPlatform.name} Strengths
        </h3>
        <ul className="space-y-3">
          {secondData.strengths.strengths.map((strength, index) => (
            <li key={index} className="text-sm text-zinc-300">
              <div
                dangerouslySetInnerHTML={{
                  __html: strength.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong>$1</strong>',
                  ),
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

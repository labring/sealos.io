import { ComparisonConfig, DimensionId } from '../../config/platforms';

interface KeyDifferencesProps {
  dimensionId: DimensionId;
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function KeyDifferences({
  dimensionId,
  firstPlatform,
  secondPlatform,
}: KeyDifferencesProps) {
  const firstData = firstPlatform.content.dimensions[dimensionId];
  const secondData = secondPlatform.content.dimensions[dimensionId];

  // Skip overview dimension
  if (dimensionId === 'overview') {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {firstData.keyDifference && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-2 text-sm font-semibold">
            {firstData.keyDifference.title}
          </h3>
          <p className="text-sm text-zinc-300">
            {firstData.keyDifference.content}
          </p>
        </div>
      )}
      {secondData.keyDifference && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-2 text-sm font-semibold">
            {secondData.keyDifference.title}
          </h3>
          <p className="text-sm text-zinc-300">
            {secondData.keyDifference.content}
          </p>
        </div>
      )}
    </div>
  );
}

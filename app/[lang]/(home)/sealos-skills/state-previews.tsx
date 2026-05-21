import { GitHubLogoIcon } from '@radix-ui/react-icons';

export function SkeletonPreview() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {[72, 100, 84].map((width, index) => (
        <div
          key={width}
          className="h-3 overflow-hidden rounded-full bg-white/[0.06]"
        >
          <div
            className="h-full w-2/5 animate-[pulse_1.45s_ease-in-out_infinite] rounded-full bg-[#4CAFE1]/25"
            style={{
              marginLeft: `${100 - width}%`,
              animationDelay: `${index * 130}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function EmptyPreview() {
  return (
    <div className="flex h-[52px] items-center justify-center rounded-2xl border border-dashed border-white/14 bg-white/[0.02]">
      <GitHubLogoIcon className="size-5 text-zinc-500" />
    </div>
  );
}

export function ErrorPreview() {
  return (
    <div className="rounded-2xl border border-[#D8B25D]/25 bg-[#D8B25D]/8 p-3 font-mono text-xs leading-5 text-[#D8B25D]">
      docker info failed
    </div>
  );
}

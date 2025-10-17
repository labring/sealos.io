import { ChevronDown } from 'lucide-react';

export function StackCard({
  icon,
  version,
  name,
}: {
  version: string;
  name: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border bg-neutral-900">
      <div className="flex flex-col items-center border-b border-gray-900 p-3">
        <div className="flex w-full items-center gap-2">
          <div className="size-8">{icon}</div>
          <div className="text-lg">{name}</div>
        </div>
        <div className="mt-4 w-full">
          <div className="h-3 w-full rounded-full border border-white/50 bg-white/5" />
          <div className="mt-2 h-3 w-1/3 rounded-full border border-white/50 bg-white/5" />
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-md">{version}</div>
        <div>
          <ChevronDown className="text-zinc-400" />
        </div>
      </div>
    </div>
  );
}

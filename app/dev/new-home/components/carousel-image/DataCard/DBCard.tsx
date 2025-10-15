import { ChevronDown } from 'lucide-react';

export function DBCard({
  icon,
  version,
  name,
}: {
  version: string;
  name: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-xl border bg-neutral-900">
      <div className="flex items-center justify-between border-b border-gray-900 p-5">
        <div className="text-xl">{name}</div>
        <div className="size-12">{icon}</div>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="text-lg">{version}</div>
        <div>
          <ChevronDown className="text-zinc-400" />
        </div>
      </div>
    </div>
  );
}

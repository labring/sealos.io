import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, ChevronRight } from 'lucide-react';
import { Glare } from './Glare';

export function PromptInput() {
  return (
    <div className="border-gradient-glass relative flex flex-col rounded-2xl px-3 py-4 inset-shadow-[0_0_8px_0_rgba(255,255,255,0.25)]">
      <Glare className="absolute -top-[4.25rem] -left-[4.25rem] size-36" />
      {/* Textarea */}
      <div className="relative rounded-lg bg-white/[0.07]">
        <Textarea
          placeholder="Describe what you want to ship. e.g., I want to deploy N8N from app store."
          rows={5}
          className="w-full resize-none border-none bg-transparent shadow-none placeholder:text-zinc-400 focus-visible:ring-0"
        />

        <Button
          className="absolute right-3 bottom-3 z-10 size-10 rounded-lg bg-zinc-600 p-0 text-white disabled:opacity-40"
          disabled
        >
          <ArrowUp size={20} />
        </Button>
      </div>

      <div className="flex flex-col gap-2 p-2">
        <div className="text-sm text-zinc-500">Some ideas to get started:</div>

        <div className="flex gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/[0.07] px-2 py-1 text-sm text-zinc-400">
            <ChevronRight size={14} />
            <span>AI Agent</span>
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/[0.07] px-2 py-1 text-sm text-zinc-400">
            <ChevronRight size={14} />
            <span>Database</span>
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/[0.07] px-2 py-1 text-sm text-zinc-400">
            <ChevronRight size={14} />
            <span>Dev Runtime</span>
          </span>
        </div>
      </div>
    </div>
  );
}

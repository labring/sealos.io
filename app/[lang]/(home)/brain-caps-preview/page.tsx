'use client';

import { type ReactNode } from 'react';

import {
  DBDeployDemo,
  DBStudioDemo,
  DeployCanvasDemo,
} from '../(new-home)/components/brain-caps-demos';

export default function BrainCapsPreviewPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <div className="container pt-10 pb-6">
        <p className="text-sm text-white/50">Temporary preview canvas</p>
        <h1 className="mt-2 text-3xl font-medium">
          Brain caps animation preview
        </h1>
      </div>

      <div className="container space-y-10 pb-20">
        <PreviewBlock
          description="Handle drag, env injection, update, and toast."
          title="DeployCanvasDemo"
        >
          <DeployCanvasDemo />
        </PreviewBlock>

        <PreviewBlock
          description="Database deploy, card expand, configure, metrics, terminal, and logs."
          title="DBDeployDemo"
        >
          <DBDeployDemo />
        </PreviewBlock>

        <PreviewBlock
          description="Database tree navigation and table sorting."
          title="DBStudioDemo"
        >
          <DBStudioDemo />
        </PreviewBlock>
      </div>
    </main>
  );
}

function PreviewBlock({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-medium text-zinc-100">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

import {
  ContainerIcon,
  DatabaseIcon,
  GithubIcon,
  PanelsTopLeftIcon,
} from 'lucide-react';

export const demoNavigationItems = [
  {
    id: 'github-import-section',
    title: 'GitHub',
    description: 'Import repository from URL or GitHub authorization.',
    Icon: GithubIcon,
  },
  {
    id: 'template-section',
    title: 'Templates',
    description: 'Quickly import from commonly used application templates.',
    Icon: PanelsTopLeftIcon,
  },
  {
    id: 'docker-image-section',
    title: 'Docker Image',
    description: 'Create and run a project directly using an existing image.',
    Icon: ContainerIcon,
  },
  {
    id: 'database-section',
    title: 'Database',
    description: 'Set up a database project or data service first.',
    Icon: DatabaseIcon,
  },
] as const;

export type DemoIndex = 0 | 1 | 2 | 3;

export const demoActiveEventName = 'sealos-demo-active';
export const demoHandoffEventName = 'sealos-demo-handoff';
export const demoJumpEventName = 'sealos-demo-jump';

export function getDemoIndex(progressPx: number, viewportHeight: number) {
  if (viewportHeight <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      demoNavigationItems.length - 1,
      Math.floor(progressPx / viewportHeight),
    ),
  );
}

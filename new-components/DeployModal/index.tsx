'use client';

import dynamic from 'next/dynamic';
import { useDeployModal } from './DeployModalContext';

const LazyDeployModalInner = dynamic(
  () => import('./DeployModalInner').then((mod) => mod.DeployModalInner),
  {
    ssr: false,
    loading: () => null,
  },
);

export function DeployModal() {
  const { open } = useDeployModal();

  if (!open) {
    return null;
  }

  return <LazyDeployModalInner />;
}

export { DeployModalProvider, useDeployModal, useOpenDeployModal } from './DeployModalContext';
export type { DeployStep, DeployFormData, DeployModalState } from './types';

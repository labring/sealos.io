'use client';

import { DeployModalInner } from './DeployModalInner';

export function DeployModal() {
  return <DeployModalInner />;
}

export { DeployModalProvider, useDeployModal, useOpenDeployModal } from './DeployModalContext';
export type { DeployStep, DeployFormData, DeployModalState } from './types';

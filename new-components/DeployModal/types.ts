import { TemplateInput, TemplateSourceData } from '@/hooks/use-template-source';

export type DeployStep = 'loading' | 'form' | 'deploying' | 'success' | 'error';

export interface DeployFormData {
  [key: string]: string | boolean;
}

export interface DeployModalState {
  open: boolean;
  step: DeployStep;
  templateName: string;
  templateData: TemplateSourceData | null;
  formData: DeployFormData;
  error: string | null;
  isLoggedIn: boolean;
}

export interface DeployModalContextType extends DeployModalState {
  // Actions
  openDeployModal: (templateName: string) => void;
  closeDeployModal: () => void;
  setFormValue: (key: string, value: string | boolean) => void;
  setStep: (step: DeployStep) => void;
  setError: (error: string | null) => void;
  submitDeploy: () => Promise<void>;

  // Computed
  inputs: TemplateInput[];
  hasInputs: boolean;
  isLoading: boolean;
}

'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { useTemplateSource, TemplateInput } from '@/hooks/use-template-source';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';
import { getSharedAuthToken } from '@/lib/utils/shared-auth';
import { siteConfig } from '@/config/site';
import {
  DeployStep,
  DeployFormData,
  DeployModalContextType,
  DeployModalState,
} from './types';

const DeployModalContext = createContext<DeployModalContextType | undefined>(
  undefined
);

export function DeployModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DeployModalState>({
    open: false,
    step: 'loading',
    templateName: '',
    templateData: null,
    formData: {},
    error: null,
    isLoggedIn: false,
  });

  const { fetchTemplateSource } = useTemplateSource();
  const openAuthForm = useOpenAuthForm();

  // Initialize form data with default values
  const initializeFormData = useCallback((inputs: TemplateInput[]) => {
    const initialData: DeployFormData = {};
    inputs.forEach((input) => {
      if (input.type === 'boolean') {
        initialData[input.key] = input.default === 'true';
      } else {
        initialData[input.key] = input.default || '';
      }
    });
    return initialData;
  }, []);

  // Open deploy modal and fetch template data
  const openDeployModal = useCallback(
    async (templateName: string) => {
      setState((prev) => ({
        ...prev,
        open: true,
        step: 'loading',
        templateName,
        templateData: null,
        formData: {},
        error: null,
        isLoggedIn: false,
      }));

      try {
        const data = await fetchTemplateSource(templateName);
        console.log('data', data);
        if (data) {
          const inputs = data.source?.inputs || [];
          const initialFormData = initializeFormData(inputs);

          setState((prev) => ({
            ...prev,
            step: inputs.length > 0 ? 'form' : 'form', // Always go to form step (even if empty)
            templateData: data,
            formData: initialFormData,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            step: 'error',
            error: 'Failed to load template configuration',
          }));
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          step: 'error',
          error:
            err instanceof Error ? err.message : 'Failed to load template',
        }));
      }
    },
    [fetchTemplateSource, initializeFormData]
  );

  // Close deploy modal
  const closeDeployModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      open: false,
      step: 'loading',
      templateName: '',
      templateData: null,
      formData: {},
      error: null,
    }));
  }, []);

  // Set form value
  const setFormValue = useCallback((key: string, value: string | boolean) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [key]: value,
      },
    }));
  }, []);

  // Set step
  const setStep = useCallback((step: DeployStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  // Set error
  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  // Submit deploy - open auth form with template parameters
  // After login, handleVerifySuccess will redirect to switchRegion with openapp parameter
  // Desktop will handle login + deployment
  const submitDeploy = useCallback(async () => {
    // Build openapp parameter with template name and form data
    // Format: system-template?templateName=n8n&key1=value1&key2=value2
    const formParams = Object.entries(state.formData)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join('&');

    const openappValue = `system-template?templateName=${encodeURIComponent(state.templateName)}${formParams ? `&${formParams}` : ''}`;

    // Check if user is logged in
    const token = getSharedAuthToken();

    if (!token) {
      // Not logged in: open auth modal
      // After login success, will redirect to: switchRegion?token=xxx&openapp=system-template?templateName=n8n&...
      closeDeployModal();
      openAuthForm({ openapp: openappValue });
      return;
    }

    // Already logged in: directly jump to switchRegion with token and openapp
    // Desktop will handle the login and deployment
    const switchRegionUrl = new URL(siteConfig.signinSwitchRegionUrl);
    switchRegionUrl.searchParams.append('token', token);
    switchRegionUrl.searchParams.append('openapp', openappValue);

    window.open(switchRegionUrl.toString(), '_blank');
    closeDeployModal();
  }, [state.templateName, state.formData, closeDeployModal, openAuthForm]);

  // Computed values
  const inputs = useMemo(
    () => state.templateData?.source?.inputs || [],
    [state.templateData]
  );
  const hasInputs = inputs.length > 0;
  const isLoading = state.step === 'loading';

  const contextValue: DeployModalContextType = {
    ...state,
    openDeployModal,
    closeDeployModal,
    setFormValue,
    setStep,
    setError,
    submitDeploy,
    inputs,
    hasInputs,
    isLoading,
  };

  return (
    <DeployModalContext.Provider value={contextValue}>
      {children}
    </DeployModalContext.Provider>
  );
}

export function useDeployModal() {
  const context = useContext(DeployModalContext);
  if (context === undefined) {
    throw new Error('useDeployModal must be used within a DeployModalProvider');
  }
  return context;
}

export function useOpenDeployModal() {
  const context = useContext(DeployModalContext);
  if (context === undefined) {
    throw new Error(
      'useOpenDeployModal must be used within a DeployModalProvider'
    );
  }
  return context.openDeployModal;
}

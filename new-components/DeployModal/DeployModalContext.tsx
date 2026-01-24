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
  undefined,
);

export function DeployModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DeployModalState>({
    open: false,
    step: 'form',
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

  // Helper: Build OAuth2 URL with token and deploy params
  const buildOAuth2Url = useCallback(
    (token: string, deployParams: Record<string, string>) => {
      const oauth2Url = new URL(siteConfig.oauth2Url);
      oauth2Url.searchParams.append('token', token);
      Object.entries(deployParams).forEach(([key, value]) => {
        oauth2Url.searchParams.append(key, value);
      });
      return oauth2Url.toString();
    },
    [],
  );

  // Helper: Execute deployment redirect
  const redirectToDeploy = useCallback(
    (token: string, deployParams: Record<string, string>) => {
      const urlString = buildOAuth2Url(token, deployParams);
      // Copy URL to clipboard (optional)
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(urlString)
          .then(() => console.log('已复制 URL 到剪贴板'))
          .catch(() => {});
      }
      window.open(urlString, '_blank');
    },
    [buildOAuth2Url],
  );

  // Open deploy modal and fetch template data
  const openDeployModal = useCallback(
    async (templateName: string) => {
      try {
        // 1. Fetch template data first (without opening modal)
        const data = await fetchTemplateSource(templateName);
        console.log('data', data);

        if (!data) {
          // Show error in modal if fetch fails
          setState((prev) => ({
            ...prev,
            open: true,
            step: 'error',
            templateName,
            templateData: null,
            formData: {},
            error: 'Failed to load template configuration',
            isLoggedIn: false,
          }));
          return;
        }

        // 2. Check if template has input fields
        const inputs = data.source?.inputs || [];
        const hasInputs = inputs.length > 0;

        if (hasInputs) {
          // Has form: Show modal with form step
          const initialFormData = initializeFormData(inputs);
          setState((prev) => ({
            ...prev,
            open: true,
            step: 'form',
            templateName,
            templateData: data,
            formData: initialFormData,
            error: null,
            isLoggedIn: false,
          }));
        } else {
          // No form: Execute deployment directly
          const deployParams = {
            openapp: 'system-template',
            templateName,
            templateForm: JSON.stringify({}),
          };

          const token = getSharedAuthToken();
          if (!token) {
            // Not logged in: Open auth modal
            openAuthForm(deployParams);
          } else {
            // Logged in: Redirect to deploy
            redirectToDeploy(token, deployParams);
          }
        }
      } catch (err) {
        // Show error in modal
        setState((prev) => ({
          ...prev,
          open: true,
          step: 'error',
          templateName,
          templateData: null,
          formData: {},
          error: err instanceof Error ? err.message : 'Failed to load template',
          isLoggedIn: false,
        }));
      }
    },
    [fetchTemplateSource, initializeFormData, openAuthForm, redirectToDeploy],
  );

  // Close deploy modal
  const closeDeployModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      open: false,
      step: 'form',
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

  const submitDeploy = useCallback(async () => {
    const templateFormJson = JSON.stringify(state.formData);
    const deployParams = {
      openapp: 'system-template',
      templateName: state.templateName,
      templateForm: templateFormJson,
    };
    console.log('deployParams', deployParams);

    const token = getSharedAuthToken();

    if (!token) {
      closeDeployModal();
      openAuthForm(deployParams);
      return;
    }

    // Reuse helper function
    redirectToDeploy(token, deployParams);
    closeDeployModal();
  }, [
    state.templateName,
    state.formData,
    closeDeployModal,
    openAuthForm,
    redirectToDeploy,
  ]);

  // Computed values
  const inputs = useMemo(
    () => state.templateData?.source?.inputs || [],
    [state.templateData],
  );
  const hasInputs = inputs.length > 0;
  const isLoading = false; // No loading step anymore

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
      'useOpenDeployModal must be used within a DeployModalProvider',
    );
  }
  return context.openDeployModal;
}

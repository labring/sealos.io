'use client';

import { useState, useCallback } from 'react';
import { siteConfig } from '@/config/site';
import templateSourcesData from '@/config/template-sources.json';

/**
 * Template input field definition
 */
export interface TemplateInput {
  key: string;
  label: string;
  description: string;
  type: 'string' | 'boolean' | 'number' | 'choice';
  default?: string;
  required: boolean;
  options?: string[];
}

/**
 * Template default value definition
 */
export interface TemplateDefault {
  type: string;
  value: string;
}

/**
 * Template source data from API
 */
export interface TemplateSource {
  defaults: Record<string, TemplateDefault>;
  inputs: TemplateInput[];
  SEALOS_CLOUD_DOMAIN: string;
  SEALOS_NAMESPACE: string;
  [key: string]: unknown;
}

/**
 * Template data structure (inside API response data field)
 */
export interface TemplateSourceData {
  source: TemplateSource;
  appYaml?: string;
  templateYaml?: {
    apiVersion: string;
    kind: string;
    metadata: {
      name: string;
    };
    spec: {
      title: string;
      description: string;
      icon: string;
      url?: string;
      gitRepo?: string;
      author?: string;
      readme?: string;
      templateType?: string;
      locale?: string;
      categories?: string[];
      defaults?: Record<string, TemplateDefault>;
      inputs?: Record<string, unknown>;
      deployCount?: number;
      [key: string]: unknown;
    };
  };
  readmeContent?: string;
  readUrl?: string;
  requirements?: {
    cpu: { min: number; max: number };
    memory: { min: number; max: number };
    storage: { min: number; max: number };
    nodeport?: number;
  };
}

/**
 * API response structure
 */
export interface TemplateSourceResponse {
  code: number;
  message: string;
  data: TemplateSourceData;
}

/**
 * Hook return type
 */
export interface UseTemplateSourceResult {
  data: TemplateSourceData | null;
  isLoading: boolean;
  error: string | null;
  hasInputs: boolean;
  inputs: TemplateInput[];
  fetchTemplateSource: (templateName: string) => Promise<TemplateSourceData | null>;
}

/**
 * Hook to fetch template source data
 */
export function useTemplateSource(): UseTemplateSourceResult {
  const [data, setData] = useState<TemplateSourceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplateSource = useCallback(
    async (templateName: string): Promise<TemplateSourceData | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to get from pre-built template sources JSON first
        const sources = templateSourcesData as Record<string, TemplateInput[]>;
        const inputs = sources[templateName];

        if (inputs !== undefined) {
          // Found in local JSON, construct minimal TemplateSourceData with only inputs
          const templateData: TemplateSourceData = {
            source: {
              inputs: inputs,
            } as TemplateSource,
          };
          setData(templateData);
          return templateData;
        }

        console.warn(
          `Template source not found in local data for ${templateName}, falling back to API`
        );

        // Fallback to API if not found in local data
        const response = await fetch(
          `${siteConfig.templateApiEndpoint}/api/getTemplateSource?templateName=${encodeURIComponent(templateName)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch template: ${response.status}`);
        }

        const result: TemplateSourceResponse = await response.json();

        // Check API response code
        if (result.code !== 200) {
          throw new Error(result.message || 'API returned an error');
        }

        const templateData = result.data;
        setData(templateData);
        return templateData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch template source';
        setError(errorMessage);
        console.error('Failed to fetch template source:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const inputs = data?.source?.inputs || [];
  const hasInputs = inputs.length > 0;

  return {
    data,
    isLoading,
    error,
    hasInputs,
    inputs,
    fetchTemplateSource,
  };
}

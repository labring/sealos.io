'use client';

import type { MermaidConfig } from 'mermaid';
import { useEffect, useId, useRef, useState } from 'react';

type MermaidProps = {
  chart: string;
};

function detectDarkTheme(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

function sanitizeMermaidId(value: string): string {
  return value.replaceAll(':', '');
}

function normalizeMermaidChart(value: string): string {
  return value.replaceAll('\\n', '\n');
}

function buildMermaidConfig(isDark: boolean): MermaidConfig {
  return {
    startOnLoad: false,
    securityLevel: 'loose',
    fontFamily: 'inherit',
    themeCSS: 'margin: 1.5rem auto 0;',
    theme: isDark ? 'dark' : 'default',
  };
}

export function Mermaid({ chart }: MermaidProps): JSX.Element {
  const id = useId();
  const [svg, setSvg] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(() => detectDarkTheme());

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const updateTheme = () => {
      setIsDark(detectDarkTheme());
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    void renderChart().catch((error) => {
      console.error('Error while rendering mermaid', error);
    });

    async function renderChart(): Promise<void> {
      const container = containerRef.current;
      if (!container) return;

      const mermaidConfig = buildMermaidConfig(isDark);
      const { default: mermaid } = await import('mermaid');

      mermaid.initialize(mermaidConfig);
      const { svg } = await mermaid.render(
        // Strip invalid characters for the `id` attribute.
        sanitizeMermaidId(id),
        normalizeMermaidChart(chart),
        container,
      );
      setSvg(svg);
    }
  }, [chart, id, isDark]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} />;
}

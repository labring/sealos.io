'use client';

import { ArrowRight } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useGTM } from '@/hooks/use-gtm';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getRybbitCtaProps } from '@/lib/analytics/rybbit-cta';
import { getOpenBrainParam } from '@/lib/utils/brain';
import { getLanguageSlug } from '@/lib/i18n';
import styles from './railway-alternative.module.css';

type RailwayAlternativeCta = {
  id:
    | 'railway_alt_hero_deploy_github'
    | 'railway_alt_cost_compare'
    | 'railway_alt_migration_deploy_image'
    | 'railway_alt_final_deploy_github';
  label: string;
  location: 'hero' | 'cost_example' | 'migration' | 'final_cta';
  destination: 'sealos_open_app' | '/pricing/#railway-cost';
  deployIntent: 'github_repo' | 'docker_image' | 'unselected';
};

type RailwayAlternativeCtaPlacement =
  | 'hero'
  | 'cost_example'
  | 'migration'
  | 'final_cta';

const ctas: Record<RailwayAlternativeCta['id'], RailwayAlternativeCta> = {
  railway_alt_hero_deploy_github: {
    id: 'railway_alt_hero_deploy_github',
    label: 'Deploy a GitHub repo',
    location: 'hero',
    destination: 'sealos_open_app',
    deployIntent: 'github_repo',
  },
  railway_alt_cost_compare: {
    id: 'railway_alt_cost_compare',
    label: 'Compare your cost',
    location: 'cost_example',
    destination: '/pricing/#railway-cost',
    deployIntent: 'unselected',
  },
  railway_alt_migration_deploy_image: {
    id: 'railway_alt_migration_deploy_image',
    label: 'Deploy your existing image',
    location: 'migration',
    destination: 'sealos_open_app',
    deployIntent: 'docker_image',
  },
  railway_alt_final_deploy_github: {
    id: 'railway_alt_final_deploy_github',
    label: 'Deploy a GitHub repo',
    location: 'final_cta',
    destination: 'sealos_open_app',
    deployIntent: 'github_repo',
  },
};

export function RailwayAlternativeCtas({
  lang,
  placement,
}: {
  lang: string;
  placement: RailwayAlternativeCtaPlacement;
}) {
  const redirect = useAuthRedirect();
  const { trackCustom } = useGTM();

  const activate = useCallback(
    (cta: RailwayAlternativeCta) => {
      trackCustom('railway_alt_cta_clicked', {
        cta_id: cta.id,
        location: cta.location,
        destination: cta.destination,
        deploy_intent: cta.deployIntent,
      });
    },
    [trackCustom],
  );

  const handleDeploy = useCallback(
    (cta: RailwayAlternativeCta) => {
      activate(cta);
      const openapp =
        cta.deployIntent === 'docker_image'
          ? getOpenBrainParam('Deploy my existing Docker image')
          : getOpenBrainParam('Deploy my GitHub repository');
      void redirect({ openapp });
    },
    [activate, redirect],
  );

  const cta =
    ctas[
      placement === 'hero'
        ? 'railway_alt_hero_deploy_github'
        : placement === 'cost_example'
          ? 'railway_alt_cost_compare'
          : placement === 'migration'
            ? 'railway_alt_migration_deploy_image'
            : 'railway_alt_final_deploy_github'
    ];

  if (placement === 'cost_example') {
    return (
      <a
        href={`${getLanguageSlug(lang)}/pricing/#railway-cost`}
        onClick={() => activate(cta)}
        className={styles.costCta}
        {...getRybbitCtaProps(cta)}
      >
        {cta.label}
        <ArrowRight aria-hidden="true" className={styles.inlineIcon} />
      </a>
    );
  }

  return (
    <div className={styles.deployGroup}>
      <Button
        variant="outline"
        className={styles.deployButton}
        onClick={() => handleDeploy(cta)}
        {...getRybbitCtaProps(cta)}
      >
        {cta.label}
        <ArrowRight aria-hidden="true" className={styles.inlineIcon} />
      </Button>
      {placement === 'hero' ? (
        <a
          href={`${getLanguageSlug(lang)}/railway-alternative/#cost-example`}
          className={styles.heroCostLink}
        >
          Compare costs
        </a>
      ) : null}
    </div>
  );
}

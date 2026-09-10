import Link from 'next/link';

import { ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { AppIcon } from '@/components/ui/app-icon';
import { getLanguageSlug, type languagesType } from '@/lib/i18n';
import { DeployButton } from './DeployButton';
import AppPreviewPanel from './AppPreviewPanel';
import WorldPreview from './WorldPreview';
import {
  formatAppCount,
  getDeployCount,
  getDisplayDescription,
  type AppDetailConfig,
} from './app-detail-utils';
import s from './detail.module.css';
import { eaglercraftConfig } from '@/config/eaglercraft';

interface AppDetailHeroProps {
  app: AppDetailConfig;
  lang: languagesType;
  templateName: string;
}

export default function AppDetailHero({
  app,
  lang,
  templateName,
}: AppDetailHeroProps) {
  const deployCount = getDeployCount(app);
  const featured = app.slug === 'eaglercraft-server';
  const hosting = featured && lang === 'en';
  return (
    <section className={s.hero}>
      <nav aria-label="Breadcrumb" className={s.breadcrumb}>
        <Link href={`${getLanguageSlug(lang)}/products/app-store/`}>
          App Store
        </Link>
        <span aria-hidden="true">/</span>
        <span>{app.category}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{app.name}</span>
      </nav>
      <div className={`${s.heroIntro} ${featured ? s.featureIntro : ''}`}>
        {featured && <WorldPreview />}
        <div className={s.titleBlock}>
          <span className={s.eyebrow}>
            {featured ? 'Browser gaming / Self-hosted' : 'App Store template'}
          </span>
          <div className={s.appHeading}>
            {!featured && (
              <AppIcon
                src={app.icon}
                alt={`${app.name} icon`}
                width={64}
                height={64}
                className={s.appIcon}
              />
            )}
            <h1>{hosting ? eaglercraftConfig.title : app.name}</h1>
          </div>
          <p className={s.description}>
            {hosting
              ? eaglercraftConfig.subtitle
              : app.slug === 'eaglercraft-server'
                ? 'A Minecraft world in your browser. A server of your own.'
                : getDisplayDescription(app)}
          </p>
          {hosting && (
            <p className={s.deployNote}>
              Includes the browser client, Paper game server, secure WSS
              connection, admin console, and persistent world storage.
            </p>
          )}
        </div>
        <div className={s.launchBlock}>
          <DeployButton
            templateName={templateName}
            appName={app.name}
            category={app.category}
            className={s.deployButton}
          >
            {hosting ? 'Deploy Eaglercraft' : 'Deploy now'}{' '}
            <ArrowRight size={18} />
          </DeployButton>
          {!featured && (
            <p className={s.deployNote}>Launch in your Sealos workspace.</p>
          )}
          <div className={s.heroLinks}>
            {app.github && (
              <a
                href={app.github}
                target="_blank"
                rel="noopener noreferrer"
                className={s.textLink}
              >
                <Github size={15} /> Source
              </a>
            )}
            <a
              href={hosting ? '#how-to-join' : '#readme'}
              className={s.textLink}
            >
              {hosting ? 'See how to join' : 'Deploy guide'}{' '}
              <ArrowRight size={14} />
            </a>
            {featured && app.screenshots?.[0] && (
              <a
                href={app.screenshots[0]}
                target="_blank"
                rel="noopener noreferrer"
                className={s.textLink}
              >
                Console screenshot <ArrowUpRight size={14} />
              </a>
            )}
            {app.website && app.website !== app.github && (
              <a
                href={app.website}
                target="_blank"
                rel="noopener noreferrer"
                className={s.textLink}
              >
                Website <ArrowUpRight size={14} />
              </a>
            )}
          </div>
          {featured && (
            <p className={s.featureProof}>
              <strong>{formatAppCount(deployCount)}</strong> template
              deployments on Sealos
            </p>
          )}
        </div>
      </div>
      {!featured && <AppPreviewPanel app={app} />}
      {!featured && (
        <dl className={s.facts}>
          {deployCount > 0 && (
            <div className={s.deploymentCount}>
              <dt>Template deployments</dt>
              <dd>
                {formatAppCount(deployCount)}
                <span className={s.factNote}> on Sealos</span>
              </dd>
            </div>
          )}
          <div>
            <dt>Deployment</dt>
            <dd>Your own instance</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{app.category}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}

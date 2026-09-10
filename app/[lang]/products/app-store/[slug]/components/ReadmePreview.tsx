import Image from 'next/image';
import StackIllustration from '@/assets/app-previews/eaglercraft-stack.webp';
import type { AppDetailConfig } from './app-detail-utils';
import ReadmeMarkdownWindow, {
  type LoadedReadmeMarkdown,
} from './ReadmeMarkdownWindow';
import s from './detail.module.css';
import ReadmeDisclosure from './ReadmeDisclosure';
import { getReadmeSummary } from './readme-summary';
import DeploymentEssentials from './DeploymentEssentials';
import content from '@/config/app-store-content.json';

interface ReadmePreviewProps {
  app: AppDetailConfig;
  readme: LoadedReadmeMarkdown | null;
}

export default function ReadmePreview({ app, readme }: ReadmePreviewProps) {
  const featured = app.slug === 'eaglercraft-server';
  const summary = readme ? getReadmeSummary(readme.markdown) : [];
  if (content[app.slug as keyof typeof content]) summary[0] = app.description;
  if (summary[1]?.includes('repository-maintained Sealos manifest')) {
    summary.splice(1);
  }
  const summaryTitles = ['Overview', 'From the documentation'];
  return (
    <section
      id="readme"
      className={`${s.documentation} ${featured ? s.featureDocumentation : ''}`}
      aria-labelledby="documentation-title"
    >
      <div className={s.documentationHeader}>
        <h2 id="documentation-title">
          {featured ? (
            <>
              <span>Your world,</span>
              <br />
              connected.
            </>
          ) : (
            'About this template'
          )}
        </h2>
        {featured && (
          <p>
            A browser client, your own Paper server, and persistent storage. One
            template connects the whole world.
          </p>
        )}
      </div>
      <div className={s.readmeCard}>
        {readme ? (
          <ReadmeDisclosure
            preview={
              <div>
                {featured ? (
                  <div className={s.deploymentDetails}>
                    <div className={s.connectedScene}>
                      <Image
                        src={StackIllustration}
                        alt="Illustrated connection from a browser through a game server to a persistent world."
                        className={s.connectedWorld}
                        sizes="(max-width: 1280px) 100vw, 1200px"
                      />
                      <div className={s.sceneLabels} aria-hidden="true">
                        <span>Browser</span>
                        <span>Paper</span>
                        <span>Storage</span>
                      </div>
                    </div>
                    <dl>
                      {[
                        [
                          'Play in your browser',
                          'EaglerCraft 1.8 / 1.12',
                          'Share your URL and bring your friends. Play directly in a browser.',
                        ],
                        [
                          'Run your own server',
                          'Paper 1.8.8 / 1.12.2',
                          'Choose one version per deployment. Running both requires separate instances and volumes.',
                        ],
                        [
                          'Keep what you build',
                          'Persistent world storage',
                          'Your builds stay on persistent storage for the next session.',
                        ],
                      ].map(([title, detail, description]) => (
                        <div key={title}>
                          <dt>{title}</dt>
                          <dd>
                            <p>{description}</p>
                            <span>{detail}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : (
                  <div
                    className={`${s.readmeSummary} ${summary.length === 1 ? s.readmeSummarySingle : ''}`}
                  >
                    {(summary.length ? summary : [app.description]).map(
                      (markdown, index) => (
                        <div key={index}>
                          <h3>{summaryTitles[index]}</h3>
                          <ReadmeMarkdownWindow
                            app={app}
                            readme={{ ...readme, markdown }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                )}
                <DeploymentEssentials app={app} />
              </div>
            }
          >
            <ReadmeMarkdownWindow app={app} readme={readme} />
          </ReadmeDisclosure>
        ) : (
          <>
            <DeploymentEssentials app={app} />
            <ReadmeMarkdownWindow app={app} readme={null} />
          </>
        )}
      </div>
    </section>
  );
}

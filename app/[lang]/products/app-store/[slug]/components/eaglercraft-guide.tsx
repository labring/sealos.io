import Image from 'next/image';
import { ArrowRight, ChevronDown, Globe, Network, KeyRound, UserRound, HardDrive, Archive } from 'lucide-react';
import StackIllustration from '@/assets/app-previews/eaglercraft-stack.webp';
import MobileStackIllustration from '@/assets/app-previews/eaglercraft-stack-mobile.webp';
import { eaglercraftConfig } from '@/config/eaglercraft';
import { DeployButton } from './DeployButton';
import ConsoleScreenshot from './ConsoleScreenshot';
import ResponsiveDisclosure from './responsive-disclosure';
import type { AppDetailConfig } from './app-detail-utils';
import s from './detail.module.css';
import g from './eaglercraft.module.css';

export default function EaglercraftGuide({
  app,
  templateName,
}: {
  app: AppDetailConfig;
  templateName: string;
}) {
  const { pricing } = eaglercraftConfig;
  return (
    <div className={g.guide}>
      <section id="how-to-join" aria-labelledby="join-title">
        <h2 id="join-title">Your friend’s first join, in four steps</h2>
        <ol className={g.steps}>
          <li>
            <details className={g.stepRow} open>
              <summary>
                <h3>Choose your version and Administrator Password</h3>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
            <div className={g.stepBody}>
            <p>
              Choose 1.8 (Paper 1.8.8) or 1.12 (Paper 1.12.2) in the deployment
              configuration. Each deployment runs one selected version; running
              both uses separate instances and volumes.
            </p>
            <p>
              Set a strong, single-line Administrator Password in{' '}
              <code>rcon_password</code> and save it for server management.
            </p>
            </div>
            </details>
          </li>
          <li>
            <details className={g.stepRow}>
              <summary>
                <h3>Deploy and open the admin console</h3>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
            <div className={g.stepBody}>
            <p>
              Select Deploy Eaglercraft, sign in to Sealos, and review your
              configuration. Open the deployed application card in Canvas to
              reach <code>/admin</code>. Enter your Administrator Password and
              select Confirm.
            </p>
            <p>
              The console opens during startup. Watch its status while Paper
              prepares the world.
            </p>
            </div>
            </details>
          </li>
          <li>
            <details className={g.stepRow}>
              <summary>
                <h3>Wait for Paper, then join</h3>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
            <div className={g.stepBody}>
            <p>
              Wait for <strong>Paper is ready</strong> on Overview, then select{' '}
              <strong>Join game</strong>. In a fresh browser profile, use Edit
              Profile to choose a stable player name of 3–16 characters, then
              Done. Use Multiplayer → Join Server to enter the listed world.
            </p>
            <p>
              Press T and create your Player Account within 30 seconds using a
              personal password of 6–32 characters:
            </p>
            <p className={g.command}>
              <code>/register &lt;player-password&gt;</code>
            </p>
            <p>
              Registration signs you in. On later visits, keep the same player
              name and enter <code>/login &lt;player-password&gt;</code>.
            </p>
            </div>
            </details>
          </li>
          <li>
            <details className={g.stepRow}>
              <summary>
                <h3>Invite a friend</h3>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
            <div className={g.stepBody}>
            <p>
              Copy the destination of Join game: this is the{' '}
              <strong>Browser Play Link</strong>. Share it with your friend.
              They open it in a WebGL-capable browser, choose their own stable
              player name, and register their own Player Account to join your
              world.
            </p>
            <p>
              Keep the Administrator Password private. Each player uses their
              personal game password.
            </p>
            </div>
            </details>
          </li>
        </ol>
        <ConsoleScreenshot />
      </section>

      <section aria-labelledby="world-title">
        <h2 id="world-title">Manage access and keep what you build</h2>
        <div className={s.connectedScene}>
          <div className={g.sceneFrame}>
            <picture>
              <source
                media="(max-width: 800px), (min-width: 1101px)"
                srcSet={MobileStackIllustration.src}
              />
              <Image
                src={StackIllustration}
                alt="Illustrated connection from a browser through a game server to a persistent world."
                className={s.connectedWorld}
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </picture>
          </div>
          <div className={s.sceneLabels} aria-hidden="true">
            <span>Browser</span>
            <span>Paper</span>
            <span>Storage</span>
          </div>
        </div>
        <div className={g.capabilities}>
          <ResponsiveDisclosure defaultOpen heading={<><Globe size={18} aria-hidden="true" />Browser Play Link</>}>
              The included browser client opens the game over HTTPS. Friends can
              play while your browser is closed, as long as the hosted server is
              running, reachable, and covered by your account’s available
              resources.
            </ResponsiveDisclosure>
          <ResponsiveDisclosure heading={<><Network size={18} aria-hidden="true" />WebSocket Server Address</>}>
              Overview shows the secure <code>wss://</code> address. Paste it
              into a compatible existing Eaglercraft client using the same game
              version as your server.
            </ResponsiveDisclosure>
          <ResponsiveDisclosure heading={<><KeyRound size={18} aria-hidden="true" />Administrator Password</>}>
              Use it at <code>/admin</code> to manage time, weather, players,
              world saves, configuration, trusted plugins, and controlled Paper
              restarts. Admin access controls the server.
            </ResponsiveDisclosure>
          <ResponsiveDisclosure heading={<><UserRound size={18} aria-hidden="true" />Player Account</>}>
              Your stable player name and LoginSecurity password identify you in
              the game. Register once, then log in with the same identity on
              future visits.
            </ResponsiveDisclosure>
          <ResponsiveDisclosure heading={<><HardDrive size={18} aria-hidden="true" />Persistent World</>}>
              Worlds, player accounts, and configuration live on the
              deployment’s persistent volume. For retention across application
              restarts, preserve the same volume mounted at{' '}
              <code>/eaglerx-data</code>.
            </ResponsiveDisclosure>
          <ResponsiveDisclosure heading={<><Archive size={18} aria-hidden="true" />A separate recovery copy</>}>
              Persistent storage keeps the working world across restarts. A
              separate backup provides a recovery copy after deletion or
              corruption. Save and keep a copy separately before upgrades or
              game-version changes.
            </ResponsiveDisclosure>
        </div>
      </section>

      <section id="hosting-cost" aria-labelledby="cost-title">
        <h2 id="cost-title">Server resources and monthly hosting</h2>
        <div className={g.plans}>
          <div>
            <h3>Server Allocation</h3>
            <p>
              Default main-container limits in template release{' '}
              {eaglercraftConfig.release}:
            </p>
            <dl className={g.allocation}>
              <div>
                <dt>CPU limit</dt>
                <dd>0.2 vCPU</dd>
              </div>
              <div>
                <dt>Memory limit</dt>
                <dd>1 GiB</dd>
              </div>
              <div>
                <dt>Persistent storage</dt>
                <dd>1 GiB</dd>
              </div>
            </dl>
            <p>
              Player capacity depends on world complexity, chunk generation,
              plugins, and activity. Monitor CPU, memory, and free disk space in
              Canvas and adjust resources for your workload.
            </p>
            <a href={eaglercraftConfig.template}>Review template resources</a>
          </div>
          <div>
            <div className={g.priceHighlight}>
            <h3>Resource Plan</h3>
            <p>Starter example · monthly resource pool</p>
            <dl className={g.prices}>
              <div>
                <dt>Eligible introductory price</dt>
                <dd>
                  ${pricing.introductory}
                  <span>/month</span>
                </dd>
              </div>
              <div>
                <dt>Listed regular price</dt>
                <dd>
                  ${pricing.regular}
                  <span>/month</span>
                </dd>
              </div>
            </dl>
            </div>
            <p>{pricing.eligibility}</p>
            <p>
              Includes <strong>{pricing.resources}</strong>. Your plan covers the resources of
              all deployed services; the server allocation uses part of that
              pool.
            </p>
            <p>
              Public prices and conditions checked{' '}
              <time dateTime={pricing.checked}>{pricing.checked}</time>.
            </p>
            <a href={pricing.url}>
              View current plans <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        <p>{pricing.trial}</p>
      </section>

      <section id="faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Before you start</h2>
        <div className={g.faqList}>
          {[
            [
              'Does this include the client and server?',
              'Yes. The template includes the browser client, Paper game server, secure WebSocket gateway, web admin console, and persistent storage.',
            ],
            [
              'How do I share the game with friends?',
              'Send the Browser Play Link from Join game. Each friend chooses a stable player name and registers a personal Player Account when entering the world.',
            ],
            [
              'Can I use an existing Eaglercraft client?',
              'Yes. Use the WebSocket Server Address shown on Overview in a compatible Eaglercraft client matching your selected server version.',
            ],
            [
              'Which game version should I choose?',
              'Choose 1.8 for Paper 1.8.8 or 1.12 for Paper 1.12.2 to match your players. One deployment runs one version. Use separate instances and volumes for both.',
            ],
            [
              'Can friends play after I close my browser?',
              'Yes, while the hosted application remains running and reachable and your account has the required resources. Server operation is independent of your browser session.',
            ],
            [
              'How many players can I host?',
              'Capacity depends on world complexity, plugins, and player activity. Watch CPU, memory, and storage usage during play and increase your server allocation and plan when needed.',
            ],
          ].map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><h3>{question}</h3><ChevronDown size={18} aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="readme" aria-labelledby="references-title">
        <h2 id="references-title">Technical references</h2>
        <p>
          Inspect the maintained implementation and selected release for
          configuration details. Template documentation contains operational
          guidance and historical timing or billing references; use the checked
          Resource Plan above and Cost Center for current charges.
        </p>
        <ul className={g.references}>
          <li>
            <a href={eaglercraftConfig.repository}>
              EaglerXserver implementation
            </a>
          </li>
          <li>
            <a
              href={`${eaglercraftConfig.repository}/releases/tag/v${eaglercraftConfig.release}`}
            >
              Release v{eaglercraftConfig.release}
            </a>
          </li>
          <li>
            <a href={eaglercraftConfig.documentation}>
              Current template documentation
            </a>
          </li>
        </ul>
        <DeployButton
          templateName={templateName}
          appName={app.name}
          category={app.category}
          className={s.deployButton}
        >
          Deploy Eaglercraft <ArrowRight size={18} />
        </DeployButton>
      </section>
    </div>
  );
}

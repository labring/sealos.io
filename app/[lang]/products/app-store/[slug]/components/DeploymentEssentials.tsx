import content from '@/config/app-store-content.json';
import inputs from '@/config/template-sources.json';
import type { AppDetailConfig } from './app-detail-utils';
import { APP_STORE_BILLING_DESCRIPTION } from '../../app-store-seo';
import s from './detail.module.css';

type DeploymentNotes = {
  steps: string[];
  resources: string;
  access: string;
};

export default function DeploymentEssentials({
  app,
}: {
  app: AppDetailConfig;
}) {
  const entry = content[app.slug as keyof typeof content] as
    | { deployment?: DeploymentNotes }
    | undefined;
  const fields = inputs[app.slug as keyof typeof inputs] || [];
  const notes = entry?.deployment;
  const steps = notes?.steps || [
    `Choose Deploy now to start ${app.name} in your Sealos workspace.`,
    fields.length
      ? `Review ${fields
          .slice(0, 3)
          .map((field) => field.label || field.key)
          .join(
            ', ',
          )}${fields.length > 3 ? ' and the remaining settings' : ''} in the deployment form.`
      : 'Sign in to Sealos and review the template configuration in your workspace.',
    'Launch the template, then inspect the application status and resource cards in Canvas.',
  ];

  return (
    <div
      className={s.deploymentGuide}
      aria-label={`${app.name} deployment essentials`}
    >
      <div>
        <h3>How to deploy {app.name}</h3>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <div>
        <h3>Resources to plan for</h3>
        <p>
          {notes?.resources ||
            `Start with the resources defined by the ${app.name} template. Review CPU, memory, persistent storage, and network allocations for every service in Canvas. Capacity needs depend on your data and workload; monitor usage as they grow.`}
        </p>
        {app.readme && (
          <a href={app.readme} target="_blank" rel="noopener noreferrer">
            Template configuration and setup
          </a>
        )}
      </div>
      <div>
        <h3>Access after deployment</h3>
        <p>
          {notes?.access ||
            'Use the application URL or connection details shown in Canvas. Follow the deployment guide for first-time account setup or client configuration, and keep generated credentials available for that step.'}
        </p>
      </div>
      <div>
        <h3>Hosting and billing</h3>
        <p>{APP_STORE_BILLING_DESCRIPTION}</p>
        <a href="/pricing/">Compare Sealos resource plans</a>
      </div>
    </div>
  );
}

import {
  Activity,
  Database,
  Globe,
  HardDrive,
  KeyRound,
  Layers,
} from 'lucide-react';
import s from './detail.module.css';

const resources = [
  {
    title: 'App Service',
    description:
      'Container workloads with configurable CPU, memory, and replicas.',
    icon: Layers,
  },
  {
    title: 'Public HTTPS URL',
    description: 'An address for your app, with managed TLS certificates.',
    icon: Globe,
  },
  {
    title: 'Database',
    description:
      'A database provisioned alongside your app when the template calls for one.',
    icon: Database,
  },
  {
    title: 'Persistent Volume',
    description:
      'Storage for the files and data your application needs to keep.',
    icon: HardDrive,
  },
  {
    title: 'Environment Variables',
    description: 'Application settings and secrets configured in one place.',
    icon: KeyRound,
  },
  {
    title: 'Logs & Metrics',
    description: 'Inspect container logs and resource usage from the console.',
    icon: Activity,
  },
];

export default function WholeStackSection() {
  return (
    <section className={s.platformStack} aria-labelledby="platform-stack-title">
      <div className={s.stackHeading}>
        <div className={s.platformIntro}>
          <span className={s.eyebrow}>One template. Connected resources.</span>
          <h2 id="platform-stack-title">
            You Get the <span>Whole Stack</span>
          </h2>
        </div>
        <p>
          Sealos provisions the resources defined by your template and brings
          them together in your workspace.
        </p>
      </div>
      <ul className={s.resourceList}>
        {resources.map(({ title, description, icon: Icon }) => (
          <li key={title}>
            <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className={s.stackNote}>
        Resources and their configuration vary by template. Review the
        deployment form for this app’s exact setup.
      </p>
    </section>
  );
}

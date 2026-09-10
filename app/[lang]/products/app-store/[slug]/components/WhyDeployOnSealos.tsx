import s from './detail.module.css';

const benefits = [
  [
    'One-click deployment',
    'Start with a ready-made template. Review its configuration and launch from the Sealos console.',
  ],
  [
    'Managed Kubernetes',
    'Run on managed infrastructure with built-in workload scheduling and recovery.',
  ],
  [
    'Automatic HTTPS',
    'Give your application a public HTTPS endpoint with certificates managed for you.',
  ],
  [
    'Persistent storage',
    'Keep application data on persistent volumes across container restarts.',
  ],
  [
    'Room to grow',
    'Adjust CPU, memory, and replicas from the console as your workload changes.',
  ],
];

export default function WhyDeployOnSealos() {
  return (
    <section
      className={s.platformBenefits}
      aria-labelledby="platform-benefits-title"
    >
      <div className={s.platformIntro}>
        <span className={s.eyebrow}>From launch to everyday operations</span>
        <h2 id="platform-benefits-title">
          Why deploy
          <br />
          on <span>Sealos</span>
        </h2>
        <p>
          A shorter path from an app you want to an app you can run. Sealos
          brings deployment and ongoing operations into one place.
        </p>
      </div>
      <ol className={s.benefitList}>
        {benefits.map(([title, description], index) => (
          <li key={title}>
            <span className={s.benefitNumber} aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

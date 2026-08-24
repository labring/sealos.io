import type { Metadata } from 'next';
import { RailwayAlternativeCtas } from './railway-alternative-ctas';
import { RailwayHeroDemo } from './railway-hero-demo';
import styles from './railway-alternative.module.css';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { StructuredDataComponent } from '@/components/structured-data';
import { generateBreadcrumbSchema } from '@/lib/utils/structured-data';
import { siteConfig } from '@/config/site';
import { getLanguageSlug } from '@/lib/i18n';
import {
  RAILWAY_RATE_CARD,
  estimateRailwayMonthlyCost,
  formatUsd,
  type RailwayCostInput,
} from '../pricing/config/railway-cost';
import { railwayComparablePlans } from '../pricing/config/plans';

interface RailwayAlternativePageProps {
  params: Promise<{ lang: string }>;
}

const standardPlan = railwayComparablePlans.find(
  ({ planId }) => planId === 'standard',
)!;

const standardRailwayInput: RailwayCostInput = {
  averageVcpu: 4,
  averageRamGb: 8,
  volumeGb: 50,
  egressGb: 300,
};

const standardRailwayEstimate =
  estimateRailwayMonthlyCost(standardRailwayInput);
const standardRailwayPlan =
  RAILWAY_RATE_CARD.plans[standardRailwayEstimate.selectedPlan];

const standardEstimateIsValid =
  standardRailwayEstimate.selectedPlan === 'pro' &&
  standardRailwayEstimate.requiredPlan === 'pro' &&
  standardRailwayEstimate.validationResult.valid &&
  standardRailwayEstimate.resourceEligibility.eligible &&
  standardRailwayEstimate.usageSubtotal === 182.5 &&
  standardRailwayEstimate.usageSubtotal ===
    standardRailwayEstimate.billedTotal &&
  !standardRailwayEstimate.minimumApplied;

const comparisonRows = [
  {
    dimension: 'Billing model',
    sealos: 'Fixed monthly resource packages',
    railway:
      'Usage rates with plan minimums and included usage defined by plan',
  },
  {
    dimension: 'Deployment workflow',
    sealos: 'GitHub repository, Docker image, and guided product deployment',
    railway:
      'Mature Git-to-URL workflow with repository, image, and template entry points',
  },
  {
    dimension: 'Workload organization',
    sealos: 'Apps, workers, databases, and storage in one workspace',
    railway: 'Services, databases, and volumes grouped in a project',
  },
  {
    dimension: 'Infrastructure path',
    sealos: 'Managed workflow with Kubernetes-native controls available',
    railway: 'Managed PaaS abstraction focused on operational simplicity',
  },
  {
    dimension: 'Strongest fit',
    sealos:
      'Always-on applications, multi-service systems, and predictable resource budgets',
    railway:
      'Lightweight or variable workloads, rapid Git deployments, and usage-based budgets',
  },
];

const migrationSteps = [
  'Deploy the application from its GitHub repository or existing Docker image.',
  'Copy environment variables and secrets into the target workspace.',
  'Provision the required database and persistent or object storage.',
  'Export and import application data with a workload-specific maintenance window.',
  'Verify internal connections, health checks, logs, and public behavior.',
  'Point the domain to Sealos after the verification gate passes.',
];

const createFaqs = (pricingPath: string) => [
  {
    question: 'When can Sealos cost less than Railway?',
    answer: (
      <>
        The documented Standard example estimates{' '}
        {formatUsd(standardPlan.monthlyPrice)} on Sealos and{' '}
        {standardEstimateIsValid
          ? formatUsd(standardRailwayEstimate.billedTotal)
          : 'the current shared Railway estimate'}{' '}
        on Railway at 50% average compute utilization, 50 GB of volume, and 300
        GB of egress. Visitors can enter their own usage in the{' '}
        <a href={pricingPath} className="underline underline-offset-4">
          linked calculator
        </a>
        .
      </>
    ),
  },
  {
    question: 'Can I deploy a GitHub repository on Sealos?',
    answer: (
      <>
        Yes. The page CTA opens the current guided product flow with a GitHub
        deployment task, including the existing authentication and attribution
        handoff.
      </>
    ),
  },
  {
    question: 'Can I move a Railway database and persistent data?',
    answer: (
      <>
        Yes. Provision the destination, export and import with the
        database-specific guide, verify application connections, and schedule
        domain cutover after the data gate passes.
      </>
    ),
  },
  {
    question: 'Which platform fits lightweight or variable workloads?',
    answer: (
      <>
        Railway is a strong fit for intermittent services, rapid Git-to-URL
        deployment, and teams that prefer measured usage billing. Sealos is a
        strong fit for always-on stacks and defined monthly resource packages.
      </>
    ),
  },
];

export async function generateMetadata({
  params,
}: RailwayAlternativePageProps): Promise<Metadata> {
  const { lang } = await params;
  const metadata = generatePageMetadata({
    title: 'Railway Alternative for Always-On Apps',
    description:
      'Run always-on apps, databases, workers, and storage with fixed monthly resource packages. Compare Sealos and Railway, then deploy from GitHub.',
    pathname: '/railway-alternative',
    lang,
    languageAlternates: false,
  });

  if (lang !== 'en') {
    metadata.robots = {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    };
  }

  return metadata;
}

export default async function RailwayAlternativePage({
  params,
}: RailwayAlternativePageProps) {
  const { lang } = await params;
  const comparisonPath = `${getLanguageSlug(lang)}/comparison/sealos-vs-railway/`;
  const pricingPath = `${getLanguageSlug(lang)}/pricing/#railway-cost`;
  const breadcrumbSchema =
    lang === 'en'
      ? generateBreadcrumbSchema([
          { name: 'Home', url: `${siteConfig.url.base}/` },
          {
            name: 'Railway Alternative',
            url: `${siteConfig.url.base}/railway-alternative/`,
          },
        ])
      : null;

  return (
    <main className={styles.page}>
      {breadcrumbSchema ? (
        <StructuredDataComponent data={breadcrumbSchema} />
      ) : null}

      <section
        data-railway-alternative-section="hero"
        className={`${styles.section} ${styles.hero}`}
      >
        <div className={`container-compact ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.title}>
              A Railway alternative with fixed monthly resource packages.
            </h1>
            <p className={styles.lede}>
              Run applications, databases, workers, and storage in one
              workspace. Start from GitHub and keep a Kubernetes control path
              available as your system grows.
            </p>
            <div className={styles.heroActions}>
              <RailwayAlternativeCtas lang={lang} placement="hero" />
            </div>
            <p className={`${styles.body} ${styles.positioning}`}>
              Sealos fits always-on applications and multi-service stacks where
              predictable monthly resources matter. Railway fits lightweight or
              variable workloads, mature Git-to-URL workflows, and teams that
              prefer usage billing.
            </p>
          </div>

          <RailwayHeroDemo />
        </div>
      </section>

      <section
        data-railway-alternative-section="reasons"
        className={`container-compact ${styles.section}`}
      >
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>
            Three reasons to choose Sealos
          </h2>
        </div>
        <div className={styles.reasons}>
          {[
            {
              title: 'Predictable monthly resources.',
              body: 'Sealos packages a defined amount of CPU, memory, disk, and traffic into a monthly plan. This supports budgeting for continuously running workloads.',
              href: `${getLanguageSlug(lang)}/pricing/`,
              label: 'See Sealos pricing packages',
            },
            {
              title: 'A full stack in one workspace.',
              body: 'Applications, workers, databases, persistent storage, and object storage can share one operational workspace.',
              href: `${getLanguageSlug(lang)}/products/databases/`,
              label: 'Explore managed databases',
            },
            {
              title: 'A Kubernetes control path.',
              body: 'Teams can begin with the managed product experience and retain access to Kubernetes-native controls for deeper scheduling, networking, and policy needs.',
              href: 'https://github.com/labring/sealos',
              label: 'View the open-source project',
            },
          ].map((reason) => (
            <article key={reason.title} className={styles.reason}>
              <h3 className={styles.cardTitle}>{reason.title}</h3>
              <p className={styles.body}>{reason.body}</p>
              <a
                href={reason.href}
                target={reason.href.startsWith('http') ? '_blank' : undefined}
                rel={reason.href.startsWith('http') ? 'noreferrer' : undefined}
                className={styles.reasonLink}
              >
                {reason.label}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section
        id="cost-example"
        data-railway-alternative-section="cost-example"
        className={`${styles.section} ${styles.costBand}`}
      >
        <div className="container-compact">
          <div className={styles.costHead}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>
                Transparent Standard cost example
              </h2>
              <p className={styles.body}>
                This normalized workload uses 50% average compute utilization.
                Sealos Traffic and Railway outbound egress remain different
                billing concepts; the displayed values carry the same numeric
                workload input without a unit conversion.
              </p>
            </div>
            <div>
              <RailwayAlternativeCtas lang={lang} placement="cost_example" />
            </div>
          </div>

          <div className={styles.costCards}>
            <article className={`${styles.costCard} ${styles.costCardSignal}`}>
              <p className={styles.proofLabel}>Sealos {standardPlan.name}</p>
              <p className={styles.price}>
                {formatUsd(standardPlan.monthlyPrice)}
                <span className={styles.priceLabel}>monthly plan price</span>
              </p>
              <ul className={styles.resourceList}>
                <li>{standardPlan.resources.cpu} vCPU included</li>
                <li>{standardPlan.resources.ram} GiB memory included</li>
                <li>{standardPlan.resources.disk} GiB persistent volume</li>
                <li>{standardPlan.resources.traffic} GB traffic</li>
              </ul>
            </article>

            <article className={styles.costCard}>
              <div className={styles.costTop}>
                <div>
                  <p className={styles.proofLabel}>
                    Railway{' '}
                    {
                      RAILWAY_RATE_CARD.plans[
                        standardRailwayEstimate.selectedPlan
                      ].name
                    }{' '}
                    estimate
                  </p>
                  <p className={styles.rateNote}>
                    {standardRailwayEstimate.validationResult.message}
                  </p>
                </div>
                <span className={styles.status}>
                  {standardEstimateIsValid ? 'Validated' : 'Recalculate'}
                </span>
              </div>
              <div className={styles.costRows}>
                {[
                  {
                    label: 'CPU',
                    input: '4 average vCPU',
                    rate: `${formatUsd(RAILWAY_RATE_CARD.cpuPerVcpuMonth)} / vCPU-month`,
                    amount: standardRailwayEstimate.cpu,
                  },
                  {
                    label: 'Memory',
                    input: '8 average GB',
                    rate: `${formatUsd(RAILWAY_RATE_CARD.ramPerGbMonth)} / GB-month`,
                    amount: standardRailwayEstimate.ram,
                  },
                  {
                    label: 'Volume',
                    input: '50 GB',
                    rate: `${formatUsd(RAILWAY_RATE_CARD.volumePerGbMonth)} / GB-month`,
                    amount: standardRailwayEstimate.volume,
                  },
                  {
                    label: 'Egress',
                    input: '300 GB',
                    rate: `${formatUsd(RAILWAY_RATE_CARD.egressPerGb)} / GB`,
                    amount: standardRailwayEstimate.egress,
                  },
                ].map((row) => (
                  <div key={row.label} className={styles.costRow}>
                    <div>
                      <p>{row.label}</p>
                      <p className={styles.rateNote}>
                        {row.input} · {row.rate}
                      </p>
                    </div>
                    <span>{formatUsd(row.amount)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.costTotal}>
                <div>
                  <p className={styles.rateNote}>
                    Usage subtotal ·{' '}
                    {formatUsd(standardRailwayEstimate.usageSubtotal)}
                  </p>
                  <p className={styles.rateNote}>
                    {standardRailwayPlan.name} minimum ·{' '}
                    {formatUsd(standardRailwayEstimate.planMinimum)}
                  </p>
                </div>
                <p className={styles.price}>
                  {standardEstimateIsValid
                    ? formatUsd(standardRailwayEstimate.billedTotal)
                    : 'See calculator'}
                  <span className={styles.priceLabel}>
                    estimated monthly cost
                  </span>
                </p>
              </div>
              <p className={`${styles.rateNote} ${styles.body}`}>
                Rates and plan metadata verified {RAILWAY_RATE_CARD.verifiedAt}.
                The 50 GB volume requires Railway {standardRailwayPlan.name};
                the usage subtotal exceeds the {standardRailwayPlan.name}{' '}
                minimum for this profile.
              </p>
              <div className={styles.costLinks}>
                <a
                  href={RAILWAY_RATE_CARD.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.costLink}
                >
                  Railway plan and rate sources
                </a>
                <a
                  href={RAILWAY_RATE_CARD.costControlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.costLink}
                >
                  Railway cost controls
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        data-railway-alternative-section="comparison"
        className={`container-compact ${styles.section}`}
      >
        <div className={styles.comparisonHead}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              Choose the operating model that fits your workload.
            </h2>
          </div>
          <a href={comparisonPath} className={styles.textLink}>
            Read the full comparison
            <span aria-hidden="true" className={styles.inlineIcon}>
              →
            </span>
          </a>
        </div>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th scope="col">Dimension</th>
              <th scope="col">Sealos</th>
              <th scope="col">Railway</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.dimension}>
                <th scope="row">{row.dimension}</th>
                <td data-label="Sealos">{row.sealos}</td>
                <td data-label="Railway">{row.railway}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section
        data-railway-alternative-section="migration"
        className={`${styles.section} ${styles.migration}`}
      >
        <div className={`container-compact ${styles.migrationGrid}`}>
          <div>
            <h2 className={styles.sectionTitle}>
              Move one verified workload at a time.
            </h2>
            <p className={styles.body}>
              Use a manual migration path with a workload-specific data gate and
              cutover check.
            </p>
            <div className={styles.heroActions}>
              <RailwayAlternativeCtas lang={lang} placement="migration" />
            </div>
          </div>
          <ol className={styles.steps}>
            {migrationSteps.map((step) => (
              <li key={step} className={styles.step}>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className={styles.guides}>
            <h3 className={styles.guideTitle}>Maintained guides</h3>
            <div className={styles.guideList}>
              {[
                ['Create an app', '/docs/guides/app-deploy/create-app/'],
                [
                  'Configure environments',
                  '/docs/guides/app-deploy/environments/',
                ],
                [
                  'Migrate a database',
                  '/docs/guides/databases/database-migration-guide/',
                ],
                ['Add a domain', '/docs/guides/app-deploy/add-a-domain/'],
              ].map(([label, path]) => (
                <a
                  key={path}
                  href={`${getLanguageSlug(lang)}${path}`}
                  className={styles.textLink}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        data-railway-alternative-section="faq"
        className={`container-compact ${styles.section}`}
      >
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>
            Evaluate the move with practical answers.
          </h2>
        </div>
        <div className={styles.faqList}>
          {createFaqs(pricingPath).map((faq) => (
            <details key={faq.question} className={styles.faq}>
              <summary className={styles.faqSummary}>
                <span>{faq.question}</span>
                <span aria-hidden="true" className={styles.faqIndicator}>
                  +
                </span>
              </summary>
              <div className={styles.faqAnswer}>{faq.answer}</div>
            </details>
          ))}
        </div>
        <div className={styles.finalCta}>
          <h2 className={styles.sectionTitle}>
            Run your always-on stack on Sealos.
          </h2>
          <p className={styles.body}>
            Start with a GitHub repository and keep the deployment path open as
            your workload grows.
          </p>
          <RailwayAlternativeCtas lang={lang} placement="final_cta" />
        </div>
      </section>
    </main>
  );
}

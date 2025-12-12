import Image from 'next/image';
import RailwayIcon from '@/assets/platform-icons/railway.svg';
import { ComparisonConfig } from './platforms';

export const railwayConfig: ComparisonConfig = {
  name: 'Railway',
  icon: <Image src={RailwayIcon} alt="Railway" className="size-full" />,
  order: 1,
  content: {
    overview: {
      name: 'Railway',
      description:
        'Railway is a managed Platform-as-a-Service (PaaS) that simplifies application deployment through Git integration and usage-based billing. It automates builds and deploys for web services, background workers, Cron Jobs, and databases. Railway provides a fast path from code to production with automatic scaling (including scale-to-zero), abstracting away infrastructure complexity for individual developers and small teams.',
    },
    pricing: {
      cpu: '$0.000463/vCPU-minute (~$0.028/vCPU-hour)',
      memory: '$0.000231/GB-minute (~$0.014/GB-hour)',
      egress: '$0.05/GB',
      storage: '$0.25/GB-month',
      objectStorage: '$0.015/GB-month',
    },
    dimensions: {
      'developer-experience': {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: {
          strengths: [
            'Railway offers a remarkably streamlined git-push-to-deploy workflow with automatic buildpack detection—no configuration required for most frameworks.',
            "The platform's **Preview Environments** automatically spin up isolated instances for every pull request, making code review and testing seamless.",
            "Railway's CLI tool (`railway run`) allows developers to run local code while connected to cloud-provisioned databases, bridging the local-cloud gap elegantly.",
            'The `railway.toml` config-as-code approach keeps deployment settings versioned alongside your code.',
          ],
        },
        keyDifference:
          "Railway prioritizes deployment simplicity through zero-config automation. Teams that want the fastest path from git push to production URL will appreciate Railway's streamlined workflow.",
      },
      architecture: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Railway Enterprise plan',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'Manual',
            note: 'Requires manual configuration',
          },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: {
          strengths: [
            "Railway's automatic **scale-to-zero** capability is a standout feature for intermittent workloads. When your service receives no traffic for ~5-10 minutes, Railway automatically suspends the container and resumes it on the next request (with <1 second cold-start)—you only pay for actual usage.",
            'This is ideal for staging environments, admin dashboards, or low-traffic APIs.',
            'Railway also offers native **multi-region deployment** on Pro plans, allowing you to run replicas across US, Europe, and Asia simultaneously.',
            "The platform's **automatic vertical scaling** adjusts CPU/RAM allocation dynamically based on actual usage, without manual intervention.",
          ],
        },
        keyDifference:
          'Railway provides maximum operational simplicity at the cost of vendor lock-in. Enterprise customers on Railway can access "Bring Your Own Cloud" for dedicated infrastructure, but this is a premium feature not available on standard plans.',
      },
      collaboration: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Pro',
            note: 'Available only on Railway Pro plan',
          },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Railway Enterprise plan',
          },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Railway Enterprise plan',
          },
        ],
        strengths: {
          strengths: [
            'Railway offers a straightforward team model with three predefined roles (Admin, Developer, Deploy-only) that covers most use cases without complexity.',
            'The **Pro plan includes unlimited team seats** at no extra cost—a significant advantage for growing teams.',
            'Each project has its own private network, providing natural isolation between environments.',
            'The activity feed provides a clear audit trail of all deployments and changes.',
            "For compliance-heavy industries, Railway's **Enterprise plan offers HIPAA/BAA compliance**, SSO/SAML integration, and 90-day audit logs.",
          ],
        },
        keyDifference:
          'Railway provides simpler team management that "just works" for most teams, with enterprise compliance features available at higher tiers.',
      },
      ecosystem: {
        features: [
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'text', value: 'Hobby: 50, Pro: 100' },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: {
          strengths: [
            'Railway offers a polished, integrated developer experience for its managed services.',
            'The **built-in database viewer** lets you browse tables, view records, and inspect Redis keys directly in the dashboard without external tools.',
            '**Cron Jobs** get first-class UI treatment with visual scheduling, execution logs, and manual trigger buttons—Railway supports up to 50 cron jobs on Hobby and 100 on Pro plans.',
            'The platform\'s services (PostgreSQL, MySQL, MongoDB, Redis, storage buckets) are tightly integrated with the deployment workflow, providing a cohesive experience that "just works" without configuration.',
          ],
        },
        keyDifference:
          "Railway offers a narrower but more polished set of built-in tools with superior UI/UX for common use cases. If you want the most streamlined experience for standard web apps with PostgreSQL/Redis, Railway's integrated tooling shines.",
      },
    },
    sourceUrl: 'https://railway.com/pricing',
  },
};



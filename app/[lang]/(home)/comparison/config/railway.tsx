import Image from 'next/image';
import RailwayIcon from '@/assets/platform-icons/railway.svg';
import {
  CodeXml,
  GitCompare,
  Settings,
  Box,
  Globe,
  Shield,
  TrendingUp,
  Users,
  Key,
  Network,
  Store,
  Database,
  Bot,
  Wrench,
  Plug,
  Zap,
  Clock,
  DollarSign,
} from 'lucide-react';
import { ComparisonConfig } from './platforms';

export const railwayConfig: ComparisonConfig = {
  name: 'Railway',
  icon: <Image src={RailwayIcon} alt="" className="size-full" />,
  order: 1,
  content: {
    overview:
      'Railway is a managed Platform-as-a-Service (PaaS) that simplifies application deployment through Git integration and usage-based billing. It automates builds and deploys for web services, background workers, Cron Jobs, and databases. Railway provides a fast path from code to production with automatic scaling (including scale-to-zero), abstracting away infrastructure complexity for individual developers and small teams.',
    pricing: `Railway Usage-Based Rates:
• CPU: $0.000463/vCPU-minute (~$0.028/vCPU-hour)
• Memory: $0.000231/GB-minute (~$0.014/GB-hour)
• Egress: $0.05/GB
• Storage: $0.25/GB-month
• Object Storage: $0.015/GB-month`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Proprietary PaaS' },
          { type: 'check', value: false },
          {
            type: 'text-multi-check',
            value: ['Cloud only', 'BYO Cloud: Enterprise'],
          },
          { type: 'text', value: '30 days, $5 credit' },
          { type: 'text', value: 'Hobby: 8, Pro: 32' },
          { type: 'text', value: 'Hobby: 8GB, Pro: 32GB' },
          { type: 'text', value: 'Hobby: 2, Pro: 20' },
          { type: 'text', value: 'Hobby: 5, Pro: 50' },
          { type: 'text', value: 'Hobby: 50, Pro: 100' },
          { type: 'text', value: 'Free: 3d, Hobby: 7d, Pro: 30d' },
          { type: 'text-with-check', value: '(saves on idle)' },
          { type: 'check', value: true },
        ],
        strengths: [],
      },
      'developer-experience': {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <GitCompare className="size-full" />,
            title: 'Streamlined Git-Push-to-Deploy',
            content:
              'Railway offers a remarkably streamlined git-push-to-deploy workflow with automatic buildpack detection—no configuration required for most frameworks.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Preview Environments',
            content:
              "The platform's **Preview Environments** automatically spin up isolated instances for every pull request, making code review and testing seamless.",
          },
          {
            icon: <Settings className="size-full" />,
            title: 'CLI Tool Integration',
            content:
              "Railway's CLI tool (`railway run`) allows developers to run local code while connected to cloud-provisioned databases, bridging the local-cloud gap elegantly.",
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Config-as-Code',
            content:
              'The `railway.toml` config-as-code approach keeps deployment settings versioned alongside your code.',
          },
        ],
        keyDifference: {
          title: 'Railway Approach',
          content:
            "Railway prioritizes deployment simplicity through zero-config automation. Teams that want the fastest path from git push to production URL will appreciate Railway's streamlined workflow.",
        },
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
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <TrendingUp className="size-full" />,
            title: 'Scale-to-Zero',
            content:
              "Railway's automatic **scale-to-zero** capability is a standout feature for intermittent workloads. When your service receives no traffic for ~5-10 minutes, Railway automatically suspends the container and resumes it on the next request (with <1 second cold-start)—you only pay for actual usage.",
          },
          {
            icon: <Box className="size-full" />,
            title: 'Ideal for Intermittent Workloads',
            content:
              'This is ideal for staging environments, admin dashboards, or low-traffic APIs.',
          },
          {
            icon: <Globe className="size-full" />,
            title: 'Multi-Region Deployment',
            content:
              'Railway also offers native **multi-region deployment** on Pro plans, allowing you to run replicas across US, Europe, and Asia simultaneously.',
          },
          {
            icon: <TrendingUp className="size-full" />,
            title: 'Automatic Vertical Scaling',
            content:
              "The platform's **automatic vertical scaling** adjusts CPU/RAM allocation dynamically based on actual usage, without manual intervention.",
          },
        ],
        keyDifference: {
          title: 'Railway Approach',
          content:
            'Railway provides maximum operational simplicity at the cost of vendor lock-in. Enterprise customers on Railway can access "Bring Your Own Cloud" for dedicated infrastructure, but this is a premium feature not available on standard plans.',
        },
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
        strengths: [
          {
            icon: <Users className="size-full" />,
            title: 'Straightforward Team Model',
            content:
              'Railway offers a straightforward team model with three predefined roles (Admin, Developer, Deploy-only) that covers most use cases without complexity.',
          },
          {
            icon: <Users className="size-full" />,
            title: 'Unlimited Team Seats',
            content:
              'The **Pro plan includes unlimited team seats** at no extra cost—a significant advantage for growing teams.',
          },
          {
            icon: <Network className="size-full" />,
            title: 'Private Network Isolation',
            content:
              'Each project has its own private network, providing natural isolation between environments.',
          },
          {
            icon: <Key className="size-full" />,
            title: 'Activity Feed & Audit Trail',
            content:
              'The activity feed provides a clear audit trail of all deployments and changes.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Enterprise Compliance',
            content:
              "For compliance-heavy industries, Railway's **Enterprise plan offers HIPAA/BAA compliance**, SSO/SAML integration, and 90-day audit logs.",
          },
        ],
        keyDifference: {
          title: 'Railway Approach',
          content:
            'Railway provides simpler team management that "just works" for most teams, with enterprise compliance features available at higher tiers.',
        },
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
        strengths: [
          {
            icon: <Wrench className="size-full" />,
            title: 'Polished Developer Experience',
            content:
              'Railway offers a polished, integrated developer experience for its managed services.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Built-in Database Viewer',
            content:
              'The **built-in database viewer** lets you browse tables, view records, and inspect Redis keys directly in the dashboard without external tools.',
          },
          {
            icon: <Settings className="size-full" />,
            title: 'First-Class Cron Jobs UI',
            content:
              '**Cron Jobs** get first-class UI treatment with visual scheduling, execution logs, and manual trigger buttons—Railway supports up to 50 cron jobs on Hobby and 100 on Pro plans.',
          },
          {
            icon: <Plug className="size-full" />,
            title: 'Tightly Integrated Services',
            content:
              'The platform\'s services (PostgreSQL, MySQL, MongoDB, Redis, storage buckets) are tightly integrated with the deployment workflow, providing a cohesive experience that "just works" without configuration.',
          },
        ],
        keyDifference: {
          title: 'Railway Approach',
          content:
            "Railway offers a narrower but more polished set of built-in tools with superior UI/UX for common use cases. If you want the most streamlined experience for standard web apps with PostgreSQL/Redis, Railway's integrated tooling shines.",
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$90/mo',
          savings: 0,
          label: 'Railway (Usage-Based)',
        },
        {
          cost: '~$320/mo',
          savings: 0,
          label: 'Railway (Usage-Based)',
        },
        {
          cost: '~$640/mo',
          savings: 0,
          label: 'Railway (Usage-Based)',
        },
      ],
      sealosSavings: [72, 60, 20], // Sealos savings vs Railway: $25 vs $90, $128 vs $320, $512 vs $640
      note: 'Railway calculation: $0.000463/vCPU-min + $0.000231/GB-min = 43,200 min/month',
      source: {
        url: 'https://railway.com/pricing',
        label: 'Railway Pricing',
      },
    },
    guidance: [
      {
        icon: <TrendingUp className="size-full" />,
        content:
          'Have **intermittent workloads** that benefit from scale-to-zero billing',
      },
      {
        icon: <DollarSign className="size-full" />,
        content:
          'Prefer **usage-based billing** for unpredictable or low traffic patterns',
      },
      {
        icon: <Zap className="size-full" />,
        content:
          'Need the **fastest path from Git to URL** for quick prototypes',
      },
      {
        icon: <Box className="size-full" />,
        content: "Don't need Kubernetes-level infrastructure control",
      },
      {
        icon: <Clock className="size-full" />,
        content:
          'Run mostly **stateless, low-traffic hobby projects** under $5/month',
      },
      {
        icon: <CodeXml className="size-full" />,
        content: 'Want **Preview Environments** for pull request testing',
      },
    ],
  },
};

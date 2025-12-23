import Image from 'next/image';
import RenderIcon from '@/assets/platform-icons/render.svg';
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
  MonitorPlay,
  Sparkles,
  FileCode,
  GitBranch,
} from 'lucide-react';
import { ComparisonConfig } from './platforms';

export const renderConfig: ComparisonConfig = {
  name: 'Render',
  icon: <Image src={RenderIcon} alt="" className="size-full" />,
  order: 3,
  content: {
    overview:
      'Render is a fully-managed, proprietary Platform-as-a-Service (PaaS) that simplifies application deployment through Git integration and instance-based pricing. It automates builds and deploys for web services, background workers, static sites, Cron Jobs, and managed databases (PostgreSQL, Redis). Render provides a streamlined path from code to production with automatic scaling and zero-config deploys, abstracting away infrastructure complexity for developers and small-to-medium teams who prefer a turnkey hosting solution.',
    pricing: `Render Pricing Model:
• Starter: $7/mo (512 MB, 0.5 vCPU)
• Standard: $25/mo (2 GB, 1 vCPU)
• Pro: $85/mo (8 GB, 4 vCPU)
• Pro Max: $340/mo (32 GB, 8 vCPU)
• Pro Ultra: $680/mo (64 GB, 16 vCPU)
• PostgreSQL: $7-$1,400/mo depending on tier
• Bandwidth: $0.10/GB beyond free tier`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Proprietary PaaS' },
          { type: 'check', value: false },
          { type: 'text-multi-check', value: ['Cloud only'] },
          { type: 'text', value: 'Free tier (512MB instance, limited)' },
          { type: 'text', value: 'Up to 64 vCPU (Ultra instance)' },
          { type: 'text', value: 'Up to 512 GB (Ultra instance)' },
          {
            type: 'warning',
            value: 'Unlimited',
            note: 'Custom domains available on paid plans',
          },
          { type: 'text', value: 'Up to 100 instances' },
          {
            type: 'warning',
            value: 'Supported',
            note: 'Charged per execution',
          },
          { type: 'text', value: 'Free: 7d, Pro: 30d' },
          { type: 'check', value: false },
          { type: 'check', value: false },
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
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <GitBranch className="size-full" />,
            title: 'Zero-Config Git Deployments',
            content:
              'Render offers remarkably simple git-push-to-deploy with automatic language/framework detection (Node, Python, Go, Ruby, Rust, Elixir, and more)—no configuration required for most standard frameworks.',
          },
          {
            icon: <Clock className="size-full" />,
            title: 'Instant Rollbacks',
            content:
              'The platform provides instant rollback to any previous deploy with a single click, and maintains detailed deployment history for easy version management.',
          },
          {
            icon: <Zap className="size-full" />,
            title: 'Zero-Downtime Deploys',
            content:
              "Render's blue/green deployment strategy ensures zero-downtime deploys by default, automatically routing traffic to new instances only after health checks pass.",
          },
          {
            icon: <FileCode className="size-full" />,
            title: 'Blueprint Infrastructure as Code',
            content:
              'The `render.yaml` Blueprint system allows you to define all services, databases, and environment variables in a single file, enabling reproducible infrastructure across environments.',
          },
        ],
        keyDifference: {
          title: 'Render Approach',
          content:
            'Render prioritizes deployment simplicity through zero-config automation and polished UX. Teams that want the cleanest path from Git to production URL will appreciate Render\'s streamlined workflow.',
        },
      },
      architecture: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'Pro+',
            note: 'Horizontal autoscaling available on Pro and above plans',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <Globe className="size-full" />,
            title: 'Multi-Region Deployment',
            content:
              'Render offers deployment across 5 regions (US West, US Central, US East, Europe, Asia) with a simple dropdown selection, allowing you to place applications close to your users.',
          },
          {
            icon: <Network className="size-full" />,
            title: 'Zero-Configuration Load Balancing',
            content:
              'Render automatically load balances traffic across your service instances when scaled horizontally, with no configuration required.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Built-in Health Checks',
            content:
              'The platform provides automatic health check monitoring with configurable endpoints, automatically restarting unhealthy instances.',
          },
          {
            icon: <Zap className="size-full" />,
            title: 'Global CDN for Static Sites',
            content:
              'Static sites on Render are automatically served via a global CDN, providing edge delivery worldwide without any additional setup.',
          },
        ],
        keyDifference: {
          title: 'Render Approach',
          content:
            "Render provides maximum operational simplicity at the cost of vendor lock-in. You cannot self-host Render or run it on your own infrastructure—all workloads must run on Render's managed cloud.",
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
            value: 'Org plan',
            note: 'Organization plan ($29/user/month)',
          },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Render Enterprise plan',
          },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Render Enterprise plan',
          },
        ],
        strengths: [
          {
            icon: <Users className="size-full" />,
            title: 'Straightforward Team Model',
            content:
              'Render offers a straightforward team model with three predefined roles (Admin, Developer, Guest) that covers most use cases without complexity.',
          },
          {
            icon: <Network className="size-full" />,
            title: 'Private Networking',
            content:
              'Each project environment has its own private network, providing natural isolation for internal service-to-service communication within a region.',
          },
          {
            icon: <Clock className="size-full" />,
            title: 'Detailed Activity Logs',
            content:
              'The dashboard provides a comprehensive activity feed showing all deployments, configuration changes, and team actions.',
          },
          {
            icon: <Plug className="size-full" />,
            title: 'Webhook Notifications',
            content:
              'Render supports webhook notifications for deploy events, enabling integration with Slack, Discord, or custom alerting systems.',
          },
        ],
        keyDifference: {
          title: 'Render Approach',
          content:
            'Render provides simpler team management that "just works" for most teams, with enterprise compliance features (SSO, SAML, audit logs) available at higher tiers.',
        },
      },
      ecosystem: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: [
          {
            icon: <Database className="size-full" />,
            title: 'Polished PostgreSQL & Redis',
            content:
              'Render offers well-integrated, managed PostgreSQL with features like high availability, read replicas, and point-in-time recovery on higher tiers, plus a managed Redis cache service.',
          },
          {
            icon: <Box className="size-full" />,
            title: 'Persistent Disks',
            content:
              'SSD persistent disks can be attached to any service at $0.25/GB-month for stateful applications.',
          },
          {
            icon: <GitBranch className="size-full" />,
            title: 'Service Previews',
            content:
              'Pull request preview environments automatically spin up isolated instances of your services for testing before merge.',
          },
          {
            icon: <FileCode className="size-full" />,
            title: 'Blueprint System',
            content:
              'The `render.yaml` Infrastructure as Code system allows you to version control your entire infrastructure configuration.',
          },
        ],
        keyDifference: {
          title: 'Render Approach',
          content:
            "Render offers a narrower but more polished set of built-in tools with superior UX for common use cases (PostgreSQL, Redis, static sites). If your stack fits within Render's offerings, the experience is very streamlined.",
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$170/mo',
          sealosSavings: { type: 'comparable', savings: 85 },
          label: 'Render (2× Pro: 8 vCPU, 16GB total)',
        },
        {
          cost: '~$680/mo',
          sealosSavings: { type: 'comparable', savings: 81 },
          label: 'Render (2× Pro Max: 16 vCPU, 64GB total)',
        },
        {
          cost: '~$1,360/mo',
          sealosSavings: { type: 'comparable', savings: 62 },
          label: 'Render (4× Pro Max: 32 vCPU, 128GB total)',
        },
      ],
      note: 'Render calculation: Pro ($85/mo for 4 vCPU, 8GB), Pro Max ($340/mo for 8 vCPU, 32GB). Additional costs for PostgreSQL, bandwidth, and persistent storage not included.',
      source: {
        url: 'https://render.com/pricing',
        label: 'Render Pricing',
      },
    },
    guidance: [
      {
        icon: <GitBranch className="size-full" />,
        content: 'Want the **simplest zero-config deployment** experience for standard web apps',
      },
      {
        icon: <DollarSign className="size-full" />,
        content: 'Prefer **instance-based pricing** with simple per-service billing',
      },
      {
        icon: <Globe className="size-full" />,
        content: 'Need **multiple geographic regions** with one-click selection',
      },
      {
        icon: <Box className="size-full" />,
        content: "Don't need Kubernetes-level infrastructure control",
      },
      {
        icon: <Database className="size-full" />,
        content: 'Run mostly **PostgreSQL/Redis-backed web applications**',
      },
      {
        icon: <Zap className="size-full" />,
        content: 'Want **automatic zero-downtime deploys** with instant rollback',
      },
    ],
  },
};

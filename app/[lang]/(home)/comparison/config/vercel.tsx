import Image from 'next/image';
import VercelIcon from '@/assets/platform-icons/vercel.svg';
import {
  Box,
  Command,
  Database,
  FileCode,
  GitBranch,
  GitCompare,
  Globe,
  MonitorPlay,
  Network,
  Plug,
  Shield,
  Store,
  TrendingUp,
  Users,
  Wrench,
  Zap,
  Clock,
  DollarSign,
} from 'lucide-react';
import { ComparisonConfig } from './platforms';

export const vercelConfig: ComparisonConfig = {
  name: 'Vercel',
  icon: <Image src={VercelIcon} alt="" className="size-full" />,
  order: 4,
  content: {
    overview:
      'Vercel is a frontend-first platform ("Frontend Cloud") optimized for frameworks like Next.js. It automates builds and deployments from Git, serves static assets on a global Edge Network, and runs backend logic through serverless and edge functions. Vercel excels at preview environments and fast front-end delivery, with usage-based pricing for compute, bandwidth, and storage add-ons (Postgres, KV, Blob).',
    pricing: `Vercel Usage-Based Rates (Fluid Compute & Managed Infra):
- Active CPU: billed per CPU-hour (e.g., $0.128/hr in iad1; region-based)
- Provisioned Memory: billed per GB-hour (after included quota)
- Invocations: $0.60 per million (after included quota)
- Bandwidth: metered by region after included plan quota
- Storage Add-ons: Vercel Postgres/KV/Blob billed by usage
- Seats: Pro $20/user/month (Enterprise custom)`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Proprietary Edge/Serverless Platform' },
          { type: 'check', value: false },
          { type: 'text-multi-check', value: ['Cloud only'] },
          {
            type: 'text',
            value: 'Hobby free tier (4 Active CPU hrs + 360GB-hrs memory)',
          },
          {
            type: 'text',
            value: 'Default 1 vCPU/function (Fluid Compute for more)',
          },
          {
            type: 'text',
            value: 'Default 2GB; higher via Fluid Compute',
          },
          {
            type: 'text',
            value: 'Hobby: 50/project; Pro: higher limits',
          },
          {
            type: 'text',
            value: 'Auto-scaled instances (no manual replica caps)',
          },
          {
            type: 'text',
            value: 'Hobby: 2/day; Pro: 40/account (20/project)',
          },
          {
            type: 'text',
            value: 'Short-term logs; up to 30d with Observability Plus',
          },
          { type: 'check', value: true },
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
              'Vercel offers a remarkably streamlined git-push-to-deploy workflow with automatic buildpack detection - no configuration required for most frameworks (especially Next.js).',
          },
          {
            icon: <MonitorPlay className="size-full" />,
            title: 'Preview Deployments',
            content:
              "The platform's Preview Deployments automatically spin up isolated instances for every pull request, making code review and testing seamless with live Edge-cached URLs.",
          },
          {
            icon: <Command className="size-full" />,
            title: 'CLI Tool Integration',
            content:
              "Vercel's CLI (`vercel dev`, `vercel deploy`) lets developers emulate Edge/Serverless locally and ship to production with minimal friction.",
          },
          {
            icon: <FileCode className="size-full" />,
            title: 'Config-as-Code',
            content:
              'The `vercel.json` config-as-code approach keeps deployment settings versioned alongside your code.',
          },
        ],
        keyDifference: {
          title: 'Vercel Approach',
          content:
            'Vercel prioritizes zero-config frontend speed and Edge delivery. Teams that want the fastest path from git push to a globally cached URL will appreciate Vercel\'s streamlined workflow.',
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
            value: 'Proprietary autoscaling',
            note: 'Autoscaling handled by platform; HPA not exposed',
          },
          {
            type: 'text-with-check',
            value: 'Function memory/CPU auto-sizing (Fluid Compute)',
          },
          { type: 'check', value: true },
          { type: 'text-with-check', value: 'Edge network + regions' },
        ],
        strengths: [
          {
            icon: <Globe className="size-full" />,
            title: 'Edge-Optimized Delivery',
            content:
              "Vercel's global Edge Network and CDN deliver static assets and prerendered pages with minimal latency, ideal for frontend-heavy workloads.",
          },
          {
            icon: <Zap className="size-full" />,
            title: 'Scale-to-Zero by Default',
            content:
              'Automatic scale-to-zero for serverless and edge functions keeps costs low for intermittent workloads; billing ties to Active CPU and Provisioned Memory.',
          },
          {
            icon: <Network className="size-full" />,
            title: 'Preview & Multi-Region by Default',
            content:
              'Preview deployments and globally distributed edge endpoints are native features, giving every branch a live URL without extra setup.',
          },
          {
            icon: <TrendingUp className="size-full" />,
            title: 'Automatic Resource Sizing',
            content:
              'Functions can auto-adjust memory/CPU within plan limits (and Fluid Compute for larger workloads) without manual tuning.',
          },
        ],
        keyDifference: {
          title: 'Vercel Approach',
          content:
            'Vercel provides maximum frontend speed and operational simplicity at the cost of deeper backend control and portability. Long-running or stateful services require external providers beyond Vercel\'s serverless model.',
        },
      },
      collaboration: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'text-with-check', value: 'Owner/Member/Viewer (seat-based)' },
          {
            type: 'warning',
            value: 'Seat-based',
            note: '$20/user/month on Pro plan',
          },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'SSO/SAML on Enterprise only',
          },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Extended audit logs on Enterprise only',
          },
        ],
        strengths: [
          {
            icon: <Users className="size-full" />,
            title: 'Straightforward Team Model',
            content:
              'Vercel offers a straightforward team model with predefined roles and seat-based billing that covers most frontend collaboration needs without complexity.',
          },
          {
            icon: <GitBranch className="size-full" />,
            title: 'Preview Deployments for Every PR',
            content:
              'Every pull request automatically gets an isolated preview URL, making design reviews and QA frictionless for distributed teams.',
          },
          {
            icon: <Clock className="size-full" />,
            title: 'Activity Feed & Audit Trail',
            content:
              'The activity feed provides a clear audit trail of all deployments and changes.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Enterprise Compliance',
            content:
              "For compliance-heavy industries, Vercel's Enterprise plan offers SSO/SAML integration and extended audit log retention.",
          },
        ],
        keyDifference: {
          title: 'Vercel Approach',
          content:
            'Vercel provides simpler team management and world-class preview workflows that "just work" for frontend-centric teams, with enterprise compliance available at higher tiers.',
        },
      },
      ecosystem: {
        features: [
          { type: 'text-with-check', value: 'Integrations & templates' },
          { type: 'check', value: true },
          { type: 'text-with-check', value: 'Via partners (e.g., PlanetScale)' },
          { type: 'text-with-check', value: 'Via MongoDB Atlas integration' },
          { type: 'text-with-check', value: 'Vercel KV/Upstash' },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'Blob (not S3-compatible API)',
            note: 'S3 compatibility requires external providers',
          },
          { type: 'check', value: true },
          { type: 'check', value: true },
          {
            type: 'text',
            value: 'Hobby: 2/day; Pro: 40/account (20/project)',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: [
          {
            icon: <Store className="size-full" />,
            title: 'Polished Frontend & Integration Experience',
            content:
              'Vercel offers a polished, integrated developer experience for frontend deployments with built-in analytics, image optimization, and framework-aware routing.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Managed Data Add-ons',
            content:
              'Vercel Postgres, Vercel KV (Redis), Blob storage, and third-party integrations (Neon, PlanetScale, MongoDB Atlas) plug directly into the deployment workflow.',
          },
          {
            icon: <Wrench className="size-full" />,
            title: 'Cron & Edge Tools',
            content:
              'Cron Jobs have first-class UI support with project-level limits, and Edge Config provides low-latency configuration reads at the edge.',
          },
          {
            icon: <Plug className="size-full" />,
            title: 'Tightly Integrated Services',
            content:
              'The platform\'s services are tightly integrated with preview deployments, providing a cohesive experience that "just works" for frontend-first stacks.',
          },
        ],
        keyDifference: {
          title: 'Vercel Approach',
          content:
            "Vercel offers a narrower but highly polished set of managed services and integrations optimized for frontend-led workflows. If you want the fastest experience for shipping Next.js/React apps with hosted Postgres/KV, Vercel's integrated tooling shines.",
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$184/mo',
          sealosSavings: { type: 'comparable', savings: 86 },
          label:
            'Vercel (Active CPU @ $0.128/hr in iad1; excludes bandwidth/storage/seats)',
        },
        {
          cost: '~$737/mo',
          sealosSavings: { type: 'comparable', savings: 83 },
          label:
            'Vercel (Active CPU only; excludes Provisioned Memory, bandwidth, seats)',
        },
        {
          cost: '~$1475/mo',
          sealosSavings: { type: 'comparable', savings: 65 },
          label:
            'Vercel (Active CPU only; excludes Provisioned Memory, bandwidth, seats)',
        },
      ],
      note: 'Vercel calculation: Active CPU @$0.128/hr (iad1) x vCPU-hrs; Provisioned Memory, bandwidth, Blob/KV/Postgres usage, and Pro seats ($20/user/mo) not included. Pricing varies by region.',
      source: {
        url: 'https://vercel.com/docs/pricing/regional-pricing',
        label: 'Vercel Pricing',
      },
    },
    guidance: [
      {
        icon: <Zap className="size-full" />,
        content:
          'Have **frontend-heavy or intermittent workloads** that benefit from scale-to-zero billing',
      },
      {
        icon: <DollarSign className="size-full" />,
        content:
          'Prefer **usage-based billing** tied to Active CPU/Provisioned Memory for spiky traffic',
      },
      {
        icon: <GitCompare className="size-full" />,
        content:
          'Need the **fastest path from Git to a globally cached URL** for web frontends',
      },
      {
        icon: <Box className="size-full" />,
        content:
          "Don't need Kubernetes-level infrastructure control or long-running stateful services",
      },
      {
        icon: <Plug className="size-full" />,
        content:
          'Run mostly **stateless, event-driven functions** with low average utilization',
      },
      {
        icon: <MonitorPlay className="size-full" />,
        content:
          'Want **Preview Deployments** for every pull request and built-in Edge delivery',
      },
    ],
  },
};

import Image from 'next/image';
import FlyIcon from '@/assets/platform-icons/fly.svg';
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

export const flyioConfig: ComparisonConfig = {
  name: 'Fly.io',
  icon: <Image src={FlyIcon} alt="" className="size-full" />,
  order: 11,
  content: {
    overview:
      'Fly.io is an edge application platform that runs apps as lightweight Firecracker micro-VMs across a global network. It emphasizes Dockerfile-first deployments and a powerful CLI (`flyctl`) for fast, scriptable workflows. Fly.io provides Anycast networking, global routing, per-region scaling, and scale-to-zero for idle workloads, making it a strong fit for latency-sensitive apps and globally distributed teams.',
    pricing: `Fly.io Usage-Based Rates:
• CPU: billed per vCPU-second (shared/dedicated)
• Memory: billed per GB-second
• Volumes: billed per GB-month
• Network Egress: billed per GB (after free allowance)
• Static IPv4: billed per address/month`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Edge micro-VMs (Firecracker)' },
          { type: 'check', value: false },
          {
            type: 'text-multi-check',
            value: ['Cloud only'],
          },
          { type: 'text', value: 'Free allowance (shared CPU, limited)' },
          { type: 'text', value: 'Plan-based (per VM size)' },
          { type: 'text', value: 'Plan-based (per VM size)' },
          { type: 'check', value: true },
          { type: 'text', value: '(within org limits)' },
          { type: 'text', value: 'Scheduled machines' },
          { type: 'text', value: 'Limited (plan-based)' },
          { type: 'text-with-check', value: '(saves on idle)' },
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
            icon: <Settings className="size-full" />,
            title: 'CLI-First Workflow',
            content:
              'Fly.io is built around the `flyctl` CLI, giving developers fast, scriptable control over deploys, scaling, secrets, and regions.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Dockerfile-Based Deployments',
            content:
              'Fly.io favors Dockerfile-based builds, offering full control over the runtime environment and making containerized apps highly portable.',
          },
          {
            icon: <Globe className="size-full" />,
            title: 'Global Edge Deployments',
            content:
              'With a single configuration, you can deploy across multiple regions and route traffic via Anycast to the closest instance.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Config-as-Code',
            content:
              'The `fly.toml` config-as-code approach keeps deployment settings versioned alongside your code.',
          },
        ],
        keyDifference: {
          title: 'Fly.io Approach',
          content:
            'Fly.io prioritizes edge performance and CLI-driven control. Teams that want global low-latency deployments with Docker-level flexibility will appreciate Fly.io workflow.',
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
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <Box className="size-full" />,
            title: 'Edge Micro-VM Isolation',
            content:
              'Fly.io runs workloads as Firecracker micro-VMs, providing strong isolation while keeping cold starts fast.',
          },
          {
            icon: <Globe className="size-full" />,
            title: 'Global Anycast Routing',
            content:
              'Apps can be deployed in multiple regions with Anycast IPs that route users to the closest instance automatically.',
          },
          {
            icon: <TrendingUp className="size-full" />,
            title: 'Scale-to-Zero for Idle Apps',
            content:
              'Fly.io can stop idle machines and resume them on demand, helping reduce costs for spiky or low-traffic workloads.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Per-Region Volumes',
            content:
              'Persistent volumes are attached at the region level, making it easier to keep data close to users while maintaining performance.',
          },
        ],
        keyDifference: {
          title: 'Fly.io Approach',
          content:
            'Fly.io provides edge performance and global distribution through a proprietary platform. Teams get strong latency benefits, but portability is limited compared to Kubernetes-native platforms.',
        },
      },
      collaboration: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Paid seats',
            note: 'Additional team members require paid seats',
          },
          { type: 'check', value: true },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Fly.io Enterprise plan',
          },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Fly.io Enterprise plan',
          },
        ],
        strengths: [
          {
            icon: <Users className="size-full" />,
            title: 'Organization-Based Collaboration',
            content:
              'Fly.io uses organizations and role-based access to manage teams across apps and environments.',
          },
          {
            icon: <Network className="size-full" />,
            title: 'Private Networking by Default',
            content:
              'Apps can communicate over Fly.io private network without public exposure, simplifying secure service-to-service traffic.',
          },
          {
            icon: <Key className="size-full" />,
            title: 'Secrets & Configuration',
            content:
              'Secrets and configuration are managed via the CLI and API, making automation and CI/CD integration straightforward.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'WireGuard Access',
            content:
              "Fly.io WireGuard-based access model gives developers secure connectivity to private services during development and operations.",
          },
        ],
        keyDifference: {
          title: 'Fly.io Approach',
          content:
            'Fly.io provides a lightweight, developer-friendly team model that works well for small-to-mid teams, with enterprise compliance options available at higher tiers.',
        },
      },
      ecosystem: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'Via add-ons',
            note: 'Available through third-party services',
          },
          {
            type: 'warning',
            value: 'Via Tigris/S3',
            note: 'Through third-party integration',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'text', value: 'Scheduled machines' },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: [
          {
            icon: <Database className="size-full" />,
            title: 'Edge-Native Volumes',
            content:
              'Fly.io volumes are region-scoped and optimized for low-latency access close to users.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Managed Postgres',
            content:
              'Fly.io provides managed Postgres clusters with replication and easy CLI-driven operations.',
          },
          {
            icon: <Plug className="size-full" />,
            title: 'Add-on Ecosystem',
            content:
              'The platform integrates with third-party services (Redis, object storage, observability) that can be wired into apps quickly.',
          },
          {
            icon: <Wrench className="size-full" />,
            title: 'Developer-First Tooling',
            content:
              'Most ecosystem operations can be scripted via `flyctl`, making automation and repeatability straightforward.',
          },
        ],
        keyDifference: {
          title: 'Fly.io Approach',
          content:
            'Fly.io offers a leaner ecosystem with strong edge primitives and CLI-driven workflows. If you want global performance and are comfortable assembling services via add-ons, Fly.io delivers.',
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$85/mo',
          sealosSavings: { type: 'comparable', savings: 71 },
          label: 'Fly.io (Usage-Based)',
        },
        {
          cost: '~$300/mo',
          sealosSavings: { type: 'comparable', savings: 57 },
          label: 'Fly.io (Usage-Based)',
        },
        {
          cost: '~$600/mo',
          sealosSavings: { type: 'comparable', savings: 15 },
          label: 'Fly.io (Usage-Based)',
        },
      ],
      note: 'Fly.io calculation: estimated using always-on VM pricing (CPU + RAM) across 720 hours/month',
      source: {
        url: 'https://fly.io/pricing',
        label: 'Fly.io Pricing',
      },
    },
    guidance: [
      {
        icon: <Globe className="size-full" />,
        content: 'Need **global low-latency** delivery with edge deployments',
      },
      {
        icon: <Settings className="size-full" />,
        content: 'Prefer a **CLI-first workflow** with Dockerfile control',
      },
      {
        icon: <Network className="size-full" />,
        content: 'Want **Anycast routing** and multi-region replicas',
      },
      {
        icon: <TrendingUp className="size-full" />,
        content: 'Have **spiky traffic** that benefits from scale-to-zero',
      },
      {
        icon: <Globe className="size-full" />,
        content: 'Run apps close to users for **latency-sensitive experiences**',
      },
      {
        icon: <DollarSign className="size-full" />,
        content: 'Are comfortable with **usage-based billing**',
      },
    ],
  },
};

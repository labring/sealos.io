import Image from 'next/image';
import DigitalOceanIcon from '@/assets/platform-icons/digitalocean.svg';
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

export const digitaloceanConfig: ComparisonConfig = {
  name: 'DigitalOcean',
  icon: <Image src={DigitalOceanIcon} alt="" className="size-full" />,
  order: 12,
  content: {
    overview:
      'DigitalOcean App Platform is a fully managed PaaS that provides a fast path from Git to production. It automates builds, deploys web services, background workers, and static sites, and integrates with DigitalOcean-managed databases. The platform prioritizes simplicity and a UI-first workflow with tier-based pricing, making it ideal for teams that want a turnkey deployment experience without managing infrastructure.',
    pricing: `DigitalOcean App Platform Rates:
• Basic: $5/mo (shared CPU)
• Professional: from $12/mo (dedicated CPU)
• Example: 1 vCPU / 2GB RAM = $25/mo
• Managed databases: from $15/mo
• Bandwidth: metered beyond allowance`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Managed App Platform PaaS' },
          { type: 'check', value: false },
          { type: 'text-multi-check', value: ['Cloud only'] },
          { type: 'text', value: 'Starter $5/mo (shared)' },
          { type: 'text', value: 'Plan-based (dedicated tiers)' },
          { type: 'text', value: 'Plan-based (dedicated tiers)' },
          { type: 'check', value: true },
          { type: 'text', value: 'Plan-based (manual scaling)' },
          { type: 'text', value: 'Scheduled jobs' },
          { type: 'text', value: 'Limited (plan-based)' },
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
            icon: <Settings className="size-full" />,
            title: 'UI-First Workflow',
            content:
              'DigitalOcean prioritizes a clean, intuitive web UI for deploying and managing apps without deep CLI knowledge.',
          },
          {
            icon: <GitCompare className="size-full" />,
            title: 'Git Integration',
            content:
              'Connect your GitHub or GitLab repo for automatic deployments on push.',
          },
          {
            icon: <Plug className="size-full" />,
            title: 'Managed Database Integration',
            content:
              'One-click provisioning of managed PostgreSQL, MySQL, and Redis databases directly from the app dashboard.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'App Spec Config',
            content:
              'The `app.yaml` configuration file defines your app structure, domains, and environment variables as code.',
          },
        ],
        keyDifference: {
          title: 'DigitalOcean Approach',
          content:
            'DigitalOcean prioritizes simplicity and a UI-first approach. Teams that want a straightforward, fully managed PaaS with transparent tier-based pricing will appreciate DigitalOcean workflow.',
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
            icon: <TrendingUp className="size-full" />,
            title: 'Horizontal Autoscaling',
            content:
              'Apps can automatically scale out based on CPU/memory thresholds on Professional tiers.',
          },
          {
            icon: <Box className="size-full" />,
            title: 'Component-Based Architecture',
            content:
              'Build apps from multiple components (web services, workers, static sites) with individual scaling rules.',
          },
          {
            icon: <Globe className="size-full" />,
            title: 'Global Region Choice',
            content:
              'Deploy to multiple datacenter regions worldwide for reduced latency.',
          },
          {
            icon: <Network className="size-full" />,
            title: 'VPC Networking',
            content:
              'Apps run in an isolated VPC with private connectivity to databases and other DigitalOcean resources.',
          },
        ],
        keyDifference: {
          title: 'DigitalOcean Approach',
          content:
            'DigitalOcean provides a fully managed PaaS experience with clear tier-based pricing. Teams get operational simplicity without the complexity of Kubernetes, at the cost of portability and self-hosting options.',
        },
      },
      collaboration: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Team plans',
            note: 'Available on paid team plans',
          },
          { type: 'check', value: true },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Advanced',
            note: 'Available on higher tiers',
          },
          {
            type: 'warning',
            value: 'Advanced',
            note: 'Available on higher tiers',
          },
        ],
        strengths: [
          {
            icon: <Users className="size-full" />,
            title: 'Team Collaboration',
            content:
              'Teams can collaborate on apps with role-based access control and project-based organization.',
          },
          {
            icon: <Clock className="size-full" />,
            title: 'Deployment History',
            content:
              'View deployment history and roll back to previous versions directly from the dashboard.',
          },
          {
            icon: <Network className="size-full" />,
            title: 'Shared Projects',
            content:
              'Organize apps and databases into projects for team-based resource management.',
          },
          {
            icon: <Key className="size-full" />,
            title: 'Access Control',
            content:
              ' granular permissions for team members with read-write or read-only access.',
          },
        ],
        keyDifference: {
          title: 'DigitalOcean Approach',
          content:
            'DigitalOcean provides simple, project-based team management that works well for small-to-medium teams. Advanced governance features are available on higher-tier plans.',
        },
      },
      ecosystem: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Via add-ons',
            note: 'Available through DigitalOcean Marketplace',
          },
          {
            type: 'warning',
            value: 'Via Spaces',
            note: 'Object storage via DigitalOcean Spaces',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'text', value: 'Scheduled jobs' },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: [
          {
            icon: <Database className="size-full" />,
            title: 'Managed Databases',
            content:
              'Fully managed PostgreSQL, MySQL, and Redis with automatic backups, high availability, and easy scaling.',
          },
          {
            icon: <Store className="size-full" />,
            title: '1-Click Marketplace',
            content:
              'Deploy popular open-source software and development tools directly from the DigitalOcean Marketplace.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Object Storage',
            content:
              'DigitalOcean Spaces provides S3-compatible object storage for files, backups, and static assets.',
          },
          {
            icon: <Wrench className="size-full" />,
            title: 'Load Balancers',
            content:
              'Managed load balancers distribute traffic across app instances for high availability.',
          },
        ],
        keyDifference: {
          title: 'DigitalOcean Approach',
          content:
            'DigitalOcean offers a curated ecosystem of managed services and marketplace integrations. If you want a simple, all-in-one platform with predictable pricing and managed databases, DigitalOcean delivers.',
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$75/mo',
          sealosSavings: { type: 'comparable', savings: 67 },
          label: 'DigitalOcean App Platform',
        },
        {
          cost: '~$300/mo',
          sealosSavings: { type: 'comparable', savings: 57 },
          label: 'DigitalOcean App Platform',
        },
        {
          cost: '~$600/mo',
          sealosSavings: { type: 'comparable', savings: 15 },
          label: 'DigitalOcean App Platform',
        },
      ],
      note: 'DigitalOcean calculation: Pro-tier containers + managed database add-ons (monthly pricing)',
      source: {
        url: 'https://www.digitalocean.com/pricing/app-platform',
        label: 'DigitalOcean App Platform Pricing',
      },
    },
    guidance: [
      {
        icon: <Settings className="size-full" />,
        content: 'Want a **UI-first** experience with minimal CLI usage',
      },
      {
        icon: <Database className="size-full" />,
        content: 'Need **managed databases** (PostgreSQL, MySQL, Redis) with one-click provisioning',
      },
      {
        icon: <DollarSign className="size-full" />,
        content: 'Prefer **tier-based pricing** with clear upgrade paths',
      },
      {
        icon: <Plug className="size-full" />,
        content: 'Already using **DigitalOcean droplets** or other services',
      },
      {
        icon: <Zap className="size-full" />,
        content: 'Need **horizontal autoscaling** based on CPU/memory',
      },
      {
        icon: <Globe className="size-full" />,
        content: 'Want deployment in **multiple global regions**',
      },
    ],
  },
};

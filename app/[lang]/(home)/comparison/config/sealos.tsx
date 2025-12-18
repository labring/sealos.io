import Image from 'next/image';
import SealosIcon from '@/assets/shared-icons/sealos.svg';
import {
  CodeXml,
  Box,
  Globe,
  Shield,
  Users,
  Key,
  Network,
  Store,
  Database,
  Bot,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { ComparisonConfig } from './platforms';

export const sealosConfig: ComparisonConfig = {
  name: 'Sealos',
  icon: <Image src={SealosIcon} alt="" className="size-full" />,
  order: -1,
  content: {
    overview:
      'Sealos is an AI-native Cloud Operating System built on Kubernetes that unifies the entire application lifecycle, from development in Cloud Development Environments (CDEs) to production deployment and management. It is perfect for building and scaling modern AI applications, SaaS platforms, managed databases (MySQL, PostgreSQL, Redis, MongoDB) and complex microservice architectures. The platform is 100% source-available, and for production you can choose either a fully managed cloud service or self-host on your own infrastructure.',
    pricing: `Sealos Fixed Plans (All-Inclusive):
• Hobby: $25/mo → 4 vCPU, 4GB RAM, 30GB disk, 50GB traffic
• Standard: $128/mo → 8 vCPU, 8GB RAM, 50GB disk, 300GB traffic
• Pro: $512/mo → 16 vCPU, 32GB RAM, 200GB disk, 1TB traffic
• 7-day free trial with 4 vCPU + 4GB (no credit card required)`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Standard Kubernetes' },
          {
            type: 'text-with-check',
            value: '100% source-available (Apache 2.0)',
          },
          {
            type: 'text-multi-check',
            value: ['Cloud', 'Self-hosted', 'Hybrid'],
          },
          {
            type: 'text',
            value: '7 days, 4 vCPU + 4GB (no credit card)',
          },
          { type: 'text', value: 'Plan-based (4-64 vCPU)' },
          { type: 'text', value: 'Plan-based (4-128 GB)' },
          { type: 'text-with-check', value: 'Unlimited' },
          { type: 'text-with-check', value: 'Unlimited (within quota)' },
          { type: 'text-with-check', value: 'Unlimited' },
          { type: 'text', value: 'Configurable' },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [],
      },
      'developer-experience': {
        features: [
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <CodeXml className="size-full" />,
            title: 'Seamless End-to-End Experience',
            content:
              'Sealos delivers a seamless, end-to-end experience within a single platform. Developers can start coding instantly in **DevBox**, a powerful Cloud Development Environment (CDE) that mirrors the production environment, eliminating the "it works on my machine" problem.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Automated Workflow',
            content:
              'DevBox automates OCI image creation without needing manual Dockerfiles, and the **App Launchpad** handles deployment to Kubernetes. This creates a fluid, powerful workflow from code to cloud.',
          },
        ],
        keyDifference: {
          title: 'Sealos Approach',
          content:
            'Sealos prioritizes environment consistency through cloud-native development. Teams that struggle with "it works on my machine" issues will appreciate Sealos\'s DevBox.',
        },
      },
      architecture: {
        features: [
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <Box className="size-full" />,
            title: 'Standard Kubernetes Foundation',
            content:
              'Sealos is built on a foundation of standard Kubernetes, giving you the full power and portability of the cloud-native ecosystem.',
          },
          {
            icon: <Globe className="size-full" />,
            title: 'Zero Vendor Lock-in',
            content:
              'This open architecture means zero vendor lock-in—you can deploy Sealos on any public cloud or your own on-premise hardware, and your applications can be migrated to any other Kubernetes environment at any time.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Full Kubernetes API Access',
            content:
              'You get full, unrestricted access to the Kubernetes API for advanced configurations, and fine-tuned autoscaling via HPA.',
          },
        ],
        keyDifference: {
          title: 'Sealos Approach',
          content:
            'Sealos provides maximum control and portability at the cost of more operational responsibility.',
        },
      },
      collaboration: {
        features: [
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <Users className="size-full" />,
            title: 'Enterprise-Scale Collaboration',
            content:
              'Sealos is architected for secure, scalable team collaboration at enterprise scale. It leverages Kubernetes namespaces to create fully isolated workspaces for each team, project, or environment.',
          },
          {
            icon: <Key className="size-full" />,
            title: 'Granular RBAC & Resource Quotas',
            content:
              'Platform admins can use native Kubernetes RBAC to define granular permissions and set strict resource quotas, ensuring fair usage and predictable costs.',
          },
          {
            icon: <Users className="size-full" />,
            title: 'Collaborative DevBox',
            content:
              'The collaborative DevBox feature allows multiple team members to work in the same cloud development environment—ideal for pair programming, onboarding, or educational scenarios.',
          },
        ],
        keyDifference: {
          title: 'Sealos Approach',
          content:
            'Sealos provides deeper multi-tenancy controls (namespace isolation, resource quotas, custom RBAC) suited for large organizations with complex governance needs.',
        },
      },
      ecosystem: {
        features: [
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Available',
            note: 'Via Kubernetes primitives or third-party tools',
          },
          { type: 'text', value: 'Unlimited' },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <Store className="size-full" />,
            title: 'Extensive App Store',
            content:
              'Sealos provides a comprehensive ecosystem through its extensive **App Store**, where you can deploy dozens of popular open-source tools and databases—like MySQL, MongoDB, and ClickHouse—with a single click, including high-availability configurations with clustering and replication.',
          },
          {
            icon: <Bot className="size-full" />,
            title: 'AI Infrastructure',
            content:
              'It goes beyond basic databases to offer critical infrastructure for AI applications, including built-in S3-compatible object storage and a native AI proxy.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Kubernetes-Native Integration',
            content:
              'Because Sealos is standard Kubernetes, it integrates seamlessly with the entire cloud-native toolchain, including Helm, ArgoCD, and any tool that speaks the Kubernetes API.',
          },
        ],
        keyDifference: {
          title: 'Sealos Approach',
          content:
            'Sealos offers unmatched ecosystem breadth and Kubernetes-native extensibility—you can deploy virtually anything from the cloud-native ecosystem.',
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$25/mo (Hobby)',
          savings: 72,
          label: 'Sealos (Fixed Plan)',
        },
        {
          cost: '~$128/mo (Standard)',
          savings: 60,
          label: 'Sealos (Fixed Plan)',
        },
        {
          cost: '~$512/mo (Pro)',
          savings: 20,
          label: 'Sealos (Fixed Plan)',
        },
      ],
      source: {
        url: 'https://sealos.io/pricing',
        label: 'Sealos Pricing',
      },
    },
    guidance: [
      {
        icon: <DollarSign className="size-full" />,
        content: '**Predictable costs** for 24/7 production workloads',
      },
      {
        icon: <CodeXml className="size-full" />,
        content:
          'Cloud Development Environment (CDE) for consistent dev/prod environments',
      },
      {
        icon: <Shield className="size-full" />,
        content:
          '**Self-hosting option** for data sovereignty or compliance (100% source-available)',
      },
      {
        icon: <Box className="size-full" />,
        content: '**Kubernetes-native control** with full API access',
      },
      {
        icon: <Store className="size-full" />,
        content: '**100+ ready-to-deploy apps** from the marketplace',
      },
      {
        icon: <Users className="size-full" />,
        content:
          '**Enterprise multi-tenancy** with granular RBAC and resource quotas',
      },
    ],
  },
};

import { ReactNode } from 'react';
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
} from 'lucide-react';
import { sealosConfig } from './sealos';
import { railwayConfig } from './railway';
import { replitConfig } from './replit';

export type ComparisonCellValue =
  | { type: 'check'; value: boolean }
  | { type: 'text'; value: string }
  | { type: 'text-with-check'; value: string }
  | { type: 'text-multi-check'; value: string[] } // Array of strings, each with a check
  | { type: 'warning'; value: string; note?: string }
  | { type: 'info'; value: string };

export type PlatformStrength = {
  icon: ReactNode;
  title: string;
  content: string; // Markdown format
};

export type PlatformKeyDifference = {
  title: string;
  content: string; // Markdown format
};

export type PlatformGuidance = {
  icon: ReactNode;
  content: string; // Markdown format
};

export type FeatureGroup = {
  name: string;
  icon: ReactNode;
  items: string[];
};

export const DIMENSIONS = {
  overview: {
    id: 'overview',
    title: 'Overview',
    subtitle: 'Platform Comparison at a Glance',
    description:
      'A comprehensive comparison of key platform features and capabilities.',
    features: [
      {
        name: '',
        icon: null,
        items: [
          'Infrastructure',
          'Source Available',
          'Deployment Options',
          'Free Trial',
          'Max vCPU per Service',
          'Max RAM per Service',
          'Custom Domains',
          'Replicas per Service',
          'Cron Jobs',
          'Log Retention',
          'Scale-to-Zero',
          'App Marketplace',
        ],
      },
    ],
  },
  'developer-experience': {
    id: 'developer-experience',
    title: 'Developer Experience',
    subtitle: 'Unified Cloud OS vs. Streamlined PaaS',
    description:
      'A superior developer experience eliminates friction, prevents environment drift, and accelerates the entire development lifecycle.',
    features: [
      {
        name: 'Cloud-Native Development',
        icon: <CodeXml size={20} />,
        items: [
          'Integrated Cloud Development Environments(CDEs)',
          'Consistent Dev/Prod Environments',
        ],
      },
      {
        name: 'Deployment Flexibility',
        icon: <GitCompare size={20} />,
        items: [
          'Git-Push Deployment',
          'Deploy from CDE',
          'Deploy from Docker Images',
          'App Store for One-Click Deployment',
        ],
      },
      {
        name: 'Build & Management',
        icon: <Settings size={20} />,
        items: [
          'Automated Image Builds (No Dockerfile)',
          'Unified Dashboard for All Resources',
        ],
      },
    ],
  },
  architecture: {
    id: 'architecture',
    title: 'Architecture & Flexibility',
    subtitle: 'Kubernetes-Native Freedom vs. Managed Simplicity',
    description:
      "The right architecture depends on your team's priorities. An open, Kubernetes-native platform provides ultimate flexibility and portability.",
    features: [
      {
        name: 'Core Foundation',
        icon: <Box size={20} />,
        items: ['Built on Standard Kubernetes', 'Source Available'],
      },
      {
        name: 'Deployment Freedom',
        icon: <Globe size={20} />,
        items: [
          'Run on Any Public Cloud (AWS, GCP, etc.)',
          'On-Premise & Hybrid Cloud Support',
        ],
      },
      {
        name: 'Control & Portability',
        icon: <Shield size={20} />,
        items: [
          'No Vendor Lock-in',
          'Full Access to Kubernetes API',
          'Advanced Scheduling & Custom Policies',
        ],
      },
      {
        name: 'Scaling Capabilities',
        icon: <TrendingUp size={20} />,
        items: [
          'Horizontal Pod Autoscaling (HPA)',
          'Automatic Vertical Scaling',
          'Scale-to-Zero for Idle Apps',
          'Multi-Region Deployment',
        ],
      },
    ],
  },
  collaboration: {
    id: 'collaboration',
    title: 'Collaboration & Governance',
    subtitle: 'Enterprise-Grade Multi-Tenancy vs. Team-Friendly Simplicity',
    description:
      'Modern platforms must scale with your organization. Sealos offers deep multi-tenancy with granular controls for enterprise needs, while Railway provides a simpler team model that works well for most small-to-medium teams.',
    features: [
      {
        name: 'Multi-Tenancy & Isolation',
        icon: <Users size={20} />,
        items: [
          'Namespace-based Team Workspaces',
          'Strong Project/Environment Isolation',
        ],
      },
      {
        name: 'Access & Cost Control',
        icon: <Key size={20} />,
        items: [
          'Granular, Kubernetes-Native RBAC',
          'Per-Workspace Resource Quotas (CPU/Mem)',
          'Pre-defined Roles (Admin/Dev/Deploy-only)',
        ],
      },
      {
        name: 'Team Features',
        icon: <Users size={20} />,
        items: [
          'Unlimited Team Seats',
          'Activity Feed & Deployment History',
          'Collaborative Dev Environments',
        ],
      },
      {
        name: 'Networking & Security',
        icon: <Network size={20} />,
        items: [
          'Secure Cross-Service Internal Networking',
          'SSO/SAML Integration',
          'Audit Logs for Compliance',
        ],
      },
    ],
  },
  ecosystem: {
    id: 'ecosystem',
    title: 'Ecosystem & Data Services',
    subtitle: 'Rich App Store vs. Limited Add-ons',
    description:
      "A powerful platform thrives on a rich, extensible ecosystem. For AI and data-driven applications, the ability to instantly provision a wide array of databases, storage, and open-source tools is not a luxury—it's a necessity for rapid innovation.",
    features: [
      {
        name: 'Ecosystem Richness',
        icon: <Store size={20} />,
        items: ['Extensive One-Click App Marketplace'],
      },
      {
        name: 'Database Variety',
        icon: <Database size={20} />,
        items: [
          'Managed PostgreSQL',
          'Managed MySQL',
          'Managed MongoDB',
          'Managed Redis',
          'More Database Types (ClickHouse, etc.)',
        ],
      },
      {
        name: 'AI & Data Infrastructure',
        icon: <Bot size={20} />,
        items: [
          'Built-in S3-Compatible Object Storage',
          'Native AI Model Proxy/Endpoint',
        ],
      },
      {
        name: 'Developer Tooling',
        icon: <Wrench size={20} />,
        items: [
          'Built-in Database UI Viewer',
          'Native Cron Job UI & Management',
        ],
      },
      {
        name: 'Extensibility',
        icon: <Plug size={20} />,
        items: [
          'Full Integration with K8s Ecosystem (Helm, etc.)',
          'Standard kubectl & K8s Client Library Support',
        ],
      },
    ],
  },
} as const;

export type DimensionId = keyof typeof DIMENSIONS;

export type PlatformDimensionData = {
  features: ComparisonCellValue[];
  strengths: PlatformStrength[];
  keyDifference?: PlatformKeyDifference; // Title + content
};

export const COSTS = {
  title: 'Why Teams Switch: The Cost Reality Check',
  description:
    "For production workloads running 24/7 usage-based billing adds up fast. Here's a transparent comparison using publicly available pricing data.",
  rows: [
    {
      workload: 'Small API',
      specs: '2 vCPU, 4GB RAM, 24/7',
    },
    {
      workload: 'Medium App',
      specs: '8 vCPU, 16GB RAM, 24/7',
    },
    {
      workload: 'Production Stack',
      specs: '16 vCPU, 32GB RAM, 24/7',
    },
  ],
} as const;

export type CostRow = {
  cost: string;
  savings: number; // Percentage savings compared to the other platform
  label: string; // Display label, e.g., "Railway (Usage-Based)" or "Sealos (Fixed Plan)"
};

export type CostSource = {
  url: string;
  label: string; // Display label for the source link
};

export type SealosSavings =
  | { type: 'comparable'; savings: number } // 可对比，显示节省百分比（可能为负）
  | { type: 'not-applicable'; reason?: string }; // 无效对比（如对方平台不支持）

export type PlatformContent = {
  overview: string; // Platform overview description
  pricing: string; // Markdown format pricing information
  dimensions: Record<DimensionId, PlatformDimensionData>;
  costs: {
    rows: CostRow[]; // Cost data for each workload in COSTS.rows
    sealosSavings?: SealosSavings[]; // Savings when using Sealos vs this platform (per row)
    note?: string; // Optional note/explanation
    source?: CostSource; // Optional source link with label
  };
  guidance: PlatformGuidance[]; // Array of guidance items with icon and content
};

export type ComparisonConfig = {
  name: string;
  icon: ReactNode;
  order: number;
  content: PlatformContent;
};

export type Platforms = {
  sealos: ComparisonConfig;
  railway: ComparisonConfig;
  replit: ComparisonConfig;
};

export const platforms: Platforms = {
  sealos: sealosConfig,
  railway: railwayConfig,
  replit: replitConfig,
};

export function getPlatform(slug: keyof Platforms) {
  return platforms[slug];
}

export function getAllPlatformSlugs(): (keyof Platforms)[] {
  return (Object.keys(platforms) as (keyof Platforms)[]).sort((a, b) => {
    const orderA = platforms[a].order;
    const orderB = platforms[b].order;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.localeCompare(b);
  });
}

export function hasPlatform(slug: string): slug is keyof Platforms {
  return slug in platforms;
}

export function comparePlatforms(
  a: keyof Platforms,
  b: keyof Platforms,
): [keyof Platforms, keyof Platforms] {
  const orderA = platforms[a].order;
  const orderB = platforms[b].order;
  if (orderA !== orderB) {
    return orderA < orderB ? [a, b] : [b, a];
  }
  return a < b ? [a, b] : [b, a];
}

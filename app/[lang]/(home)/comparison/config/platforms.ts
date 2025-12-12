import { ReactNode } from 'react';
import { sealosConfig } from './sealos';
import { railwayConfig } from './railway';

export type ComparisonCellValue =
  | { type: 'check'; value: boolean }
  | { type: 'text'; value: string }
  | { type: 'warning'; value: string; note?: string }
  | { type: 'info'; value: string };

export type PlatformStrengths = {
  strengths: string[];
};

export const DIMENSIONS = {
  'developer-experience': {
    id: 'developer-experience',
    title: 'Developer Experience',
    subtitle: 'Unified Cloud OS vs. Streamlined PaaS',
    description:
      'A superior developer experience eliminates friction, prevents environment drift, and accelerates the entire development lifecycle.',
    keyDifference:
      'Sealos prioritizes environment consistency through cloud-native development, while Railway prioritizes deployment simplicity through zero-config automation.',
    features: [
      'Cloud-Native Development',
      'Integrated Cloud IDEs',
      'Consistent Dev/Prod Environments',
      'Git-Push Deployment',
      'Deploy from Cloud IDE',
      'Deploy from Docker Images',
      'App Store for One-Click Deployment',
      'Automated Image Builds (No Dockerfile)',
      'Unified Dashboard for All Resources',
    ],
  },
  architecture: {
    id: 'architecture',
    title: 'Architecture & Flexibility',
    subtitle: 'Kubernetes-Native Freedom vs. Managed Simplicity',
    description:
      "The right architecture depends on your team's priorities. An open, Kubernetes-native platform provides ultimate flexibility and portability.",
    keyDifference:
      'Sealos provides maximum control and portability at the cost of more operational responsibility. Railway provides maximum operational simplicity at the cost of vendor lock-in.',
    features: [
      'Built on Standard Kubernetes',
      'Open Source Available',
      'Run on Any Public Cloud (AWS, GCP, etc.)',
      'On-Premise & Hybrid Cloud Support',
      'No Vendor Lock-in',
      'Full Access to Kubernetes API',
      'Advanced Scheduling & Custom Policies',
      'Horizontal Pod Autoscaling (HPA)',
      'Automatic Vertical Scaling',
      'Scale-to-Zero for Idle Apps',
      'Multi-Region Deployment',
    ],
  },
  collaboration: {
    id: 'collaboration',
    title: 'Collaboration & Governance',
    subtitle: 'Enterprise-Grade Multi-Tenancy vs. Team-Friendly Simplicity',
    description:
      'Modern platforms must scale with your organization. Sealos offers deep multi-tenancy with granular controls for enterprise needs, while Railway provides a simpler team model that works well for most small-to-medium teams.',
    keyDifference:
      'Sealos provides deeper multi-tenancy controls (namespace isolation, resource quotas, custom RBAC) suited for large organizations with complex governance needs. Railway provides simpler team management that "just works" for most teams.',
    features: [
      'Namespace-based Team Workspaces',
      'Strong Project/Environment Isolation',
      'Granular, Kubernetes-Native RBAC',
      'Per-Workspace Resource Quotas (CPU/Mem)',
      'Pre-defined Roles (Admin/Dev/Deploy-only)',
      'Unlimited Team Seats',
      'Activity Feed & Deployment History',
      'Collaborative Dev Environments',
      'Secure Cross-Service Internal Networking',
      'SSO/SAML Integration',
      'Audit Logs for Compliance',
    ],
  },
  ecosystem: {
    id: 'ecosystem',
    title: 'Ecosystem & Data Services',
    subtitle: 'Rich App Store vs. Limited Add-ons',
    description:
      "A powerful platform thrives on a rich, extensible ecosystem. For AI and data-driven applications, the ability to instantly provision a wide array of databases, storage, and open-source tools is not a luxury—it's a necessity for rapid innovation.",
    keyDifference:
      'Sealos offers unmatched ecosystem breadth and Kubernetes-native extensibility—you can deploy virtually anything from the cloud-native ecosystem. Railway offers a narrower but more polished set of built-in tools with superior UI/UX for common use cases.',
    features: [
      'Extensive One-Click App Marketplace',
      'Managed PostgreSQL',
      'Managed MySQL',
      'Managed MongoDB',
      'Managed Redis',
      'More Database Types (ClickHouse, etc.)',
      'Built-in S3-Compatible Object Storage',
      'Native AI Model Proxy/Endpoint',
      'Built-in Database UI Viewer',
      'Native Cron Job UI & Management',
      'Full Integration with K8s Ecosystem (Helm, etc.)',
      'Standard kubectl & K8s Client Library Support',
    ],
  },
} as const;

export type DimensionId = keyof typeof DIMENSIONS;

export type PlatformDimensionData = {
  features: ComparisonCellValue[];
  strengths: PlatformStrengths;
  keyDifference?: string;
};

export type PlatformContent = {
  overview: {
    name: string;
    description: string;
  };
  pricing: {
    hobby?: string;
    standard?: string;
    pro?: string;
    freeTrial?: string;
    cpu?: string;
    memory?: string;
    egress?: string;
    storage?: string;
    objectStorage?: string;
  };
  dimensions: Record<DimensionId, PlatformDimensionData>;
  sourceUrl?: string;
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
};

export const platforms: Platforms = {
  sealos: sealosConfig,
  railway: railwayConfig,
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



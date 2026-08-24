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
import {
  RAILWAY_RATE_CARD,
  calculateCostDifference,
  estimateRailwayMonthlyCost,
  formatUsd,
} from '../../pricing/config/railway-cost';
import { railwayComparablePlans } from '../../pricing/config/plans';

const railwayWorkloadInputs = [
  { averageVcpu: 2, averageRamGb: 4, volumeGb: 0, egressGb: 0 },
  { averageVcpu: 8, averageRamGb: 16, volumeGb: 0, egressGb: 0 },
  { averageVcpu: 16, averageRamGb: 32, volumeGb: 0, egressGb: 0 },
] as const;

const comparableSealosPrices = ['hobby', 'standard', 'pro'].map(
  (planId) =>
    railwayComparablePlans.find((plan) => plan.planId === planId)!.monthlyPrice,
);

const railwayPlanEvidence = `See [Railway plans](${RAILWAY_RATE_CARD.sourceUrl}), verified ${RAILWAY_RATE_CARD.verifiedAt}.`;
const railwayDeploymentEvidence = `See [Railway deployment guides](${RAILWAY_RATE_CARD.deploymentSourceUrl}), verified ${RAILWAY_RATE_CARD.verifiedAt}.`;

const railwayCostRows = railwayWorkloadInputs.map((input, index) => {
  const estimate = estimateRailwayMonthlyCost(input);
  const difference = calculateCostDifference(
    comparableSealosPrices[index],
    estimate.billedTotal,
  );
  const railwayPlan = RAILWAY_RATE_CARD.plans[estimate.selectedPlan];

  return {
    cost: `~${formatUsd(estimate.billedTotal)}/mo`,
    sealosSavings: {
      type: 'comparable' as const,
      savings:
        difference.lowerCost === 'sealos'
          ? difference.percentage
          : -difference.percentage,
    },
    label: `Railway ${railwayPlan.name} estimate · ${formatUsd(estimate.planMinimum)} minimum · ${estimate.resourceEligibility.eligible ? 'eligible' : estimate.validationResult.message}`,
  };
});

export const railwayConfig: ComparisonConfig = {
  name: 'Railway',
  icon: <Image src={RailwayIcon} alt="" className="size-full" />,
  order: 1,
  content: {
    overview:
      'Railway is a managed Platform-as-a-Service (PaaS) that simplifies application deployment through Git integration and usage-based billing. It automates builds and deploys for web services, background workers, Cron Jobs, and databases. Railway provides a fast path from code to production while abstracting away infrastructure complexity for individual developers and small teams.',
    pricing: `Railway Usage-Based Rates:
• Hobby subscription: $${RAILWAY_RATE_CARD.hobbyMonthlySubscription}/month, including $${RAILWAY_RATE_CARD.hobbyIncludedUsage} of resource usage
• Pro subscription: $${RAILWAY_RATE_CARD.proMonthlySubscription}/month, including $${RAILWAY_RATE_CARD.proIncludedUsage} of resource usage
• CPU: $${RAILWAY_RATE_CARD.cpuPerVcpuMonth}/vCPU-month
• Memory: $${RAILWAY_RATE_CARD.ramPerGbMonth}/GB-month
• Egress: $${RAILWAY_RATE_CARD.egressPerGb}/GB
• Volume storage: $${RAILWAY_RATE_CARD.volumePerGbMonth}/GB-month
• Verified ${RAILWAY_RATE_CARD.verifiedAt}: ${RAILWAY_RATE_CARD.sourceUrl}`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Proprietary PaaS' },
          { type: 'check', value: false },
          {
            type: 'text-multi-check',
            value: ['Managed cloud', 'Plan-dependent'],
          },
          { type: 'text', value: 'Plan terms vary' },
          { type: 'text', value: 'Plan-dependent' },
          { type: 'text', value: 'Plan-dependent' },
          { type: 'text', value: 'Plan-dependent' },
          { type: 'text', value: 'Plan-dependent' },
          { type: 'text', value: 'Plan-dependent' },
          { type: 'text', value: 'Plan-dependent' },
          { type: 'text', value: 'Usage-based billing' },
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
            content: `Railway supports a streamlined Git-to-URL workflow for repository-based deployments. ${railwayDeploymentEvidence}`,
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Preview Environments',
            content: `Railway preview environments can support pull-request testing when enabled for a project. ${railwayDeploymentEvidence}`,
          },
          {
            icon: <Settings className="size-full" />,
            title: 'CLI Tool Integration',
            content: `Railway's CLI provides a repository-adjacent workflow for local development and deployment tasks. ${railwayDeploymentEvidence}`,
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Config-as-Code',
            content: `Railway supports config-as-code workflows for keeping deployment settings with a repository. ${railwayDeploymentEvidence}`,
          },
        ],
        keyDifference: {
          title: 'Railway Approach',
          content:
            'Railway prioritizes managed deployment simplicity. Teams that want a fast path from a repository to a production URL may find its workflow a good fit.',
        },
      },
      architecture: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'Plan-dependent',
            note: railwayPlanEvidence,
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
            title: 'Usage-Based Scaling',
            content: `Railway's usage-based billing supports intermittent workloads. See [Railway pricing documentation](${RAILWAY_RATE_CARD.sourceUrl}), verified ${RAILWAY_RATE_CARD.verifiedAt}.`,
          },
          {
            icon: <Box className="size-full" />,
            title: 'Ideal for Intermittent Workloads',
            content:
              'This is ideal for staging environments, admin dashboards, or low-traffic APIs.',
          },
          {
            icon: <Globe className="size-full" />,
            title: 'Regional Deployment Options',
            content: `Railway documents regional deployment options in its current plan documentation. ${railwayPlanEvidence}`,
          },
          {
            icon: <TrendingUp className="size-full" />,
            title: 'Managed Resource Controls',
            content: `Railway provides managed resource controls; current limits vary by plan. ${railwayPlanEvidence}`,
          },
        ],
        keyDifference: {
          title: 'Railway Approach',
          content: `Railway provides a managed experience focused on operational simplicity. Additional infrastructure options are documented in its current plan materials. ${railwayPlanEvidence}`,
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
            value: 'Plan-dependent',
            note: railwayPlanEvidence,
          },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Plan-dependent',
            note: railwayPlanEvidence,
          },
          {
            type: 'warning',
            value: 'Plan-dependent',
            note: railwayPlanEvidence,
          },
        ],
        strengths: [
          {
            icon: <Users className="size-full" />,
            title: 'Straightforward Team Model',
            content: `Railway documents a team model for managed deployment. ${railwayPlanEvidence}`,
          },
          {
            icon: <Users className="size-full" />,
            title: 'Team Collaboration',
            content: `Team collaboration terms vary by plan. ${railwayPlanEvidence}`,
          },
          {
            icon: <Network className="size-full" />,
            title: 'Private Network Isolation',
            content: `Railway projects can use private networking for service-to-service communication. ${railwayDeploymentEvidence}`,
          },
          {
            icon: <Key className="size-full" />,
            title: 'Activity Feed & Audit Trail',
            content: `Railway provides deployment activity history for project operations. ${railwayDeploymentEvidence}`,
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Enterprise Compliance',
            content: `Railway documents additional compliance and audit controls in its current plan materials. ${railwayPlanEvidence}`,
          },
        ],
        keyDifference: {
          title: 'Railway Approach',
          content: `Railway provides a managed team experience, with additional compliance features documented at higher tiers. ${railwayPlanEvidence}`,
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
          { type: 'text', value: 'Plan-dependent' },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: [
          {
            icon: <Wrench className="size-full" />,
            title: 'Polished Developer Experience',
            content: `Railway offers an integrated developer experience for its managed services. ${railwayDeploymentEvidence}`,
          },
          {
            icon: <Database className="size-full" />,
            title: 'Built-in Database Viewer',
            content: `Railway's database tooling supports inspecting managed data services from the project workflow. ${railwayDeploymentEvidence}`,
          },
          {
            icon: <Settings className="size-full" />,
            title: 'First-Class Cron Jobs UI',
            content: `Railway provides a managed cron-job workflow with current plan terms documented in its official materials. ${railwayPlanEvidence}`,
          },
          {
            icon: <Plug className="size-full" />,
            title: 'Tightly Integrated Services',
            content: `Railway groups application and data services within a managed project workflow. ${railwayDeploymentEvidence}`,
          },
        ],
        keyDifference: {
          title: 'Railway Approach',
          content: `Railway offers an integrated managed workflow for common web applications and data services. ${railwayDeploymentEvidence}`,
        },
      },
    },
    costs: {
      rows: railwayCostRows,
      note: `Each row uses estimateRailwayMonthlyCost() with automatic plan selection. Billed totals, plan minimums, included usage, and resource eligibility come from the shared estimate and rate card. Volume and egress are excluded from these three examples. ${railwayPlanEvidence}`,
      source: {
        url: RAILWAY_RATE_CARD.sourceUrl,
        label: 'Railway pricing documentation',
      },
    },
    guidance: [
      {
        icon: <TrendingUp className="size-full" />,
        content:
          'Have **intermittent workloads** that benefit from usage-based billing',
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
          "Run mostly **stateless, low-traffic hobby projects** near Railway's Hobby subscription",
      },
      {
        icon: <CodeXml className="size-full" />,
        content: 'Want **Preview Environments** for pull request testing',
      },
      {
        icon: <GitCompare className="size-full" />,
        content:
          'Ready to migrate or deploy? Read the [Railway alternative page](/railway-alternative/).',
      },
    ],
  },
};

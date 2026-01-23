import Image from 'next/image';
import AzureIcon from '@/assets/platform-icons/azure.svg';
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

export const azureConfig: ComparisonConfig = {
  name: 'Azure',
  icon: <Image src={AzureIcon} alt="" className="size-full" />,
  order: 14,
  content: {
    overview:
      'Azure App Service is Microsoft managed PaaS for hosting web apps, APIs, and containerized services. It integrates with Azure DevOps/GitHub, supports deployment slots, and scales within App Service Plans. It a strong fit for teams already on Azure who want a managed runtime with deep Azure integrations and enterprise compliance support.',
    pricing: `Azure App Service Pricing Model:
• App Service Plans: tiered pricing by instance size
• Autoscale: available on higher tiers
• Networking: VNet integration available on selected plans
• Monitoring: Azure Monitor billed separately`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Azure-managed PaaS' },
          { type: 'check', value: false },
          { type: 'text-multi-check', value: ['Azure cloud only'] },
          { type: 'text', value: 'Azure free tier (limited)' },
          { type: 'text', value: 'Plan-based (App Service Plan)' },
          { type: 'text', value: 'Plan-based (App Service Plan)' },
          { type: 'check', value: true },
          { type: 'text', value: 'Plan-based (scale out)' },
          { type: 'text', value: 'WebJobs/Functions' },
          { type: 'text', value: 'Configurable (Azure Monitor)' },
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
            icon: <GitCompare className="size-full" />,
            title: 'Azure DevOps Integration',
            content:
              'Seamless integration with Azure DevOps, GitHub Actions, and other CI/CD tools.',
          },
          {
            icon: <Settings className="size-full" />,
            title: 'Deployment Slots',
            content:
              'Swap production and staging environments with zero downtime using deployment slots.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Multiple Language Support',
            content:
              'Support for .NET, Java, Node.js, Python, PHP, and custom containers.',
          },
          {
            icon: <Plug className="size-full" />,
            title: 'Azure Service Integration',
            content:
              'Built-in integration with Azure SQL, Cosmos DB, Blob Storage, and other Azure services.',
          },
        ],
        keyDifference: {
          title: 'Azure Approach',
          content:
            'Azure App Service prioritizes integration with the Microsoft ecosystem. Teams using .NET, Azure DevOps, or other Microsoft services will find the workflow seamless and productive.',
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
            title: 'Autoscale',
            content:
              'Automatic scaling based on CPU, memory, or custom metrics with scale-out rules.',
          },
          {
            icon: <Box className="size-full" />,
            title: 'App Service Plans',
            content:
              'Flexible pricing tiers with dedicated cores and memory options for different workloads.',
          },
          {
            icon: <Globe className="size-full" />,
            title: 'Multi-Region Deployment',
            content:
              'Deploy to multiple Azure regions worldwide for redundancy and reduced latency.',
          },
          {
            icon: <Network className="size-full" />,
            title: 'VNet Integration',
            content:
              'Connect apps to Azure Virtual Networks for isolated, secure communication with resources.',
          },
        ],
        keyDifference: {
          title: 'Azure Approach',
          content:
            'Azure provides a mature PaaS with deep Microsoft ecosystem integration. Teams get enterprise features like deployment slots and VNet integration at the cost of Azure vendor lock-in.',
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
            value: 'Azure AD/IAM',
            note: 'Via Azure Active Directory',
          },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <Key className="size-full" />,
            title: 'Azure AD Integration',
            content:
              'Enterprise-grade authentication and authorization via Azure Active Directory.',
          },
          {
            icon: <Users className="size-full" />,
            title: 'Role-Based Access',
            content:
              'Fine-grained access control using Azure RBAC for users and resources.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Enterprise Compliance',
            content:
              'SOC, ISO, HIPAA, PCI, and other compliance certifications for regulated industries.',
          },
          {
            icon: <Clock className="size-full" />,
            title: 'Azure Monitor',
            content:
              'Comprehensive monitoring, logging, and diagnostics with integration to Log Analytics.',
          },
        ],
        keyDifference: {
          title: 'Azure Approach',
          content:
            'Azure provides enterprise-grade collaboration and governance through Azure AD, RBAC, and Azure Monitor. Large organizations with Microsoft infrastructure will find the integration comprehensive.',
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
            value: 'Via Azure services',
            note: 'Available through Azure-managed services',
          },
          {
            type: 'warning',
            value: 'Via Blob Storage',
            note: 'Object storage via Azure Blob Storage',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'text', value: 'WebJobs/Functions' },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: [
          {
            icon: <Store className="size-full" />,
            title: 'Azure Service Ecosystem',
            content:
              'Access to 100+ Azure services including SQL Database, Cosmos DB, Blob Storage, and Functions.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Managed Databases',
            content:
              'Azure SQL Database, Database for MySQL, PostgreSQL, and Cosmos DB for NoSQL workloads.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Azure Cache',
            content:
              'Managed Redis Cache for caching and session state with high availability.',
          },
          {
            icon: <Wrench className="size-full" />,
            title: 'Developer Tools',
            content:
              'Azure DevOps, GitHub Actions, and Visual Studio integration for streamlined development.',
          },
        ],
        keyDifference: {
          title: 'Azure Approach',
          content:
            'Azure offers a comprehensive PaaS with deep Microsoft ecosystem integration. If you want managed services with .NET optimization and enterprise compliance, Azure App Service delivers.',
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$90/mo',
          sealosSavings: { type: 'comparable', savings: 72 },
          label: 'Azure App Service',
        },
        {
          cost: '~$320/mo',
          sealosSavings: { type: 'comparable', savings: 60 },
          label: 'Azure App Service',
        },
        {
          cost: '~$600/mo',
          sealosSavings: { type: 'comparable', savings: 15 },
          label: 'Azure App Service',
        },
      ],
      note: 'Azure calculation: App Service Plan tiers + monitoring over 720 hours/month',
      source: {
        url: 'https://azure.microsoft.com/pricing/details/app-service/',
        label: 'Azure App Service Pricing',
      },
    },
    guidance: [
      {
        icon: <CodeXml className="size-full" />,
        content: 'Building **.NET applications** with Microsoft tooling',
      },
      {
        icon: <Store className="size-full" />,
        content: 'Need **Azure service integration** (Cosmos DB, Blob Storage, etc.)',
      },
      {
        icon: <Shield className="size-full" />,
        content: 'Require **enterprise compliance** with Azure certifications',
      },
      {
        icon: <Settings className="size-full" />,
        content: 'Want **deployment slots** for zero-downtime staging',
      },
      {
        icon: <Key className="size-full" />,
        content: 'Using **Azure AD** for identity and access management',
      },
      {
        icon: <Globe className="size-full" />,
        content: 'Need **global Azure regions** for worldwide deployment',
      },
    ],
  },
};

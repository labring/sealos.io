import Image from 'next/image';
import GcpIcon from '@/assets/platform-icons/gcp.svg';
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

export const gcpConfig: ComparisonConfig = {
  name: 'Google Cloud',
  icon: <Image src={GcpIcon} alt="" className="size-full" />,
  order: 15,
  content: {
    overview:
      'Google App Engine is Google Cloud managed PaaS for deploying web apps and APIs with minimal infrastructure management. It supports multiple runtimes, integrates with GCP services, and provides automatic scaling within region. App Engine is well-suited for teams that want a managed runtime inside Google Cloud without operating Kubernetes.',
    pricing: `Google App Engine Pricing Model:
• Instance classes: tiered pricing by runtime and size
• Autoscaling: built in for standard environment
• Networking: billed per GB egress
• Logging/Monitoring: Cloud Logging pricing`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Google-managed PaaS' },
          { type: 'check', value: false },
          { type: 'text-multi-check', value: ['GCP cloud only'] },
          { type: 'text', value: 'GCP free tier (limited)' },
          { type: 'text', value: 'Plan-based (instance class)' },
          { type: 'text', value: 'Plan-based (instance class)' },
          { type: 'check', value: true },
          { type: 'text', value: 'Plan-based (autoscale)' },
          { type: 'text', value: 'Cloud Scheduler' },
          { type: 'text', value: 'Configurable (Cloud Logging)' },
          { type: 'text-with-check', value: 'Standard env only' },
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
            title: 'Cloud Build Integration',
            content:
              'Continuous deployment via Google Cloud Build with GitHub and Bitbucket integration.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Runtime Support',
            content:
              'Support for Python, Java, Node.js, Go, PHP, Ruby, and custom runtimes in flexible environment.',
          },
          {
            icon: <Settings className="size-full" />,
            title: 'Cloud SDK',
            content:
              'Command-line tools and local development server for testing before deployment.',
          },
          {
            icon: <Plug className="size-full" />,
            title: 'GCP Service Integration',
            content:
              'Built-in integration with Cloud SQL, Cloud Firestore, Cloud Storage, and other GCP services.',
          },
        ],
        keyDifference: {
          title: 'Google Cloud Approach',
          content:
            'Google App Engine prioritizes integration with Google Cloud services. Teams using GCP or Google services will appreciate the native integrations and automated scaling.',
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
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <TrendingUp className="size-full" />,
            title: 'Automatic Scaling',
            content:
              'Built-in automatic scaling based on request traffic in standard environment with zero configuration.',
          },
          {
            icon: <Box className="size-full" />,
            title: 'Instance Classes',
            content:
              'Flexible instance classes with automatic scaling and manual basic scaling options.',
          },
          {
            icon: <Globe className="size-full" />,
            title: 'Regional Deployment',
            content:
              'Deploy to multiple GCP regions for redundancy and reduced latency.',
          },
          {
            icon: <Network className="size-full" />,
            title: 'VPC Access',
            content:
              'Secure serverless VPC access for private communication with GCP resources.',
          },
        ],
        keyDifference: {
          title: 'Google Cloud Approach',
          content:
            'Google Cloud provides a serverless-optimized PaaS with automatic scaling. Teams get hands-off scaling at the cost of portability and infrastructure control.',
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
            value: 'Cloud IAM',
            note: 'Via Google Cloud IAM',
          },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <Key className="size-full" />,
            title: 'Cloud IAM',
            content:
              'Fine-grained access control via Google Cloud Identity and Access Management.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Enterprise Compliance',
            content:
              'SOC, ISO, HIPAA, PCI, and other compliance certifications across GCP services.',
          },
          {
            icon: <Clock className="size-full" />,
            title: 'Cloud Logging',
            content:
              'Centralized logging and monitoring with Cloud Logging and Cloud Monitoring.',
          },
          {
            icon: <Users className="size-full" />,
            title: 'Resource Organization',
            content:
              'Organize resources into projects, folders, and organizations for structured management.',
          },
        ],
        keyDifference: {
          title: 'Google Cloud Approach',
          content:
            'Google Cloud provides enterprise-grade collaboration through Cloud IAM, Logging, and resource hierarchy. Large organizations will find the governance tools comprehensive.',
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
            value: 'Via GCP services',
            note: 'Available through Google Cloud services',
          },
          {
            type: 'warning',
            value: 'Via Cloud Storage',
            note: 'Object storage via Google Cloud Storage',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'text', value: 'Cloud Scheduler' },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: [
          {
            icon: <Store className="size-full" />,
            title: 'Google Cloud Ecosystem',
            content:
              'Access to 100+ GCP services including Cloud SQL, Firestore, BigQuery, and AI/ML tools.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Managed Databases',
            content:
              'Cloud SQL for MySQL, PostgreSQL, and SQL Server with automated backups and high availability.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Firestore & Memorystore',
            content:
              'Managed NoSQL document database and Redis-compatible in-memory data store.',
          },
          {
            icon: <Wrench className="size-full" />,
            title: 'AI/ML Integration',
            content:
              'Direct access to Google AI services including Vertex AI, Translation, Speech, and Vision APIs.',
          },
        ],
        keyDifference: {
          title: 'Google Cloud Approach',
          content:
            'Google Cloud offers strong AI/ML services and data analytics. If you want a PaaS integrated with Google AI services and big data tools, App Engine delivers.',
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$90/mo',
          sealosSavings: { type: 'comparable', savings: 72 },
          label: 'Google App Engine',
        },
        {
          cost: '~$320/mo',
          sealosSavings: { type: 'comparable', savings: 60 },
          label: 'Google App Engine',
        },
        {
          cost: '~$600/mo',
          sealosSavings: { type: 'comparable', savings: 15 },
          label: 'Google App Engine',
        },
      ],
      note: 'GCP calculation: App Engine instance class + logging over 720 hours/month',
      source: {
        url: 'https://cloud.google.com/appengine/pricing',
        label: 'Google App Engine Pricing',
      },
    },
    guidance: [
      {
        icon: <Bot className="size-full" />,
        content: 'Need **Google AI services** (Vertex AI, Translation, Vision, etc.)',
      },
      {
        icon: <Store className="size-full" />,
        content: 'Want **GCP service integration** (BigQuery, Firestore, etc.)',
      },
      {
        icon: <TrendingUp className="size-full" />,
        content: 'Prefer **automatic scaling** with zero configuration',
      },
      {
        icon: <Shield className="size-full" />,
        content: 'Require **enterprise compliance** with GCP certifications',
      },
      {
        icon: <Settings className="size-full" />,
        content: 'Building **Python or Java** applications with Google services',
      },
      {
        icon: <Globe className="size-full" />,
        content: 'Need **global GCP regions** for worldwide deployment',
      },
    ],
  },
};

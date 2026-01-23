import Image from 'next/image';
import AwsIcon from '@/assets/platform-icons/aws.svg';
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

export const awsConfig: ComparisonConfig = {
  name: 'AWS',
  icon: <Image src={AwsIcon} alt="" className="size-full" />,
  order: 13,
  content: {
    overview:
      'AWS Elastic Beanstalk is a mature AWS-native PaaS that automates deployment and scaling on top of EC2, ELB, Auto Scaling, and CloudWatch. It supports multiple runtimes, integrates deeply with AWS services, and lets teams deploy via the EB CLI or console. Beanstalk simplifies infrastructure management while keeping you inside the AWS ecosystem and cost model.',
    pricing: `AWS Elastic Beanstalk Pricing Model:
• Beanstalk service: No additional charge
• Compute: EC2 instance pricing (on-demand or reserved)
• Load Balancer: Hourly + per-GB processed
• Managed DB: RDS pricing by instance class
• Logs/Monitoring: CloudWatch pricing`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'AWS-managed PaaS' },
          { type: 'check', value: false },
          { type: 'text-multi-check', value: ['AWS cloud only'] },
          { type: 'text', value: 'AWS free tier (limited)' },
          { type: 'text', value: 'Plan-based (EC2 instance types)' },
          { type: 'text', value: 'Plan-based (EC2 instance types)' },
          { type: 'text', value: '(Route 53 / ALB)' },
          { type: 'text', value: 'Plan-based (Auto Scaling)' },
          { type: 'text', value: 'CloudWatch/EventBridge' },
          { type: 'text', value: 'Configurable (CloudWatch)' },
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
            title: 'EB CLI & Console',
            content:
              'Deploy and manage applications via the Elastic Beanstalk CLI or AWS Management Console.',
          },
          {
            icon: <GitCompare className="size-full" />,
            title: 'Git Integration',
            content:
              'Connect to GitHub, CodeCommit, or other Git providers for automatic deployments.',
          },
          {
            icon: <Plug className="size-full" />,
            title: 'AWS Service Integration',
            content:
              'Seamless integration with RDS, ElastiCache, S3, CloudFront, and other AWS services.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Multiple Runtime Support',
            content:
              'Support for Node.js, Python, Java, Ruby, Go, .NET, Docker, and custom runtimes.',
          },
        ],
        keyDifference: {
          title: 'AWS Approach',
          content:
            'AWS Elastic Beanstalk prioritizes deep integration with the AWS ecosystem. Teams already invested in AWS services will appreciate the unified experience and native integrations.',
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
            title: 'Auto Scaling',
            content:
              'Automatic horizontal scaling based on CPU, network, or custom metrics via Auto Scaling groups.',
          },
          {
            icon: <Box className="size-full" />,
            title: 'EC2 Foundation',
            content:
              'Full access to underlying EC2 instances with support for multiple instance families and purchasing options.',
          },
          {
            icon: <Network className="size-full" />,
            title: 'Load Balancing',
            content:
              'Integrated ELB for distributing traffic across instances in multiple Availability Zones.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Rolling Deployments',
            content:
              'Zero-downtime deployments with rolling updates, blue/green deployments, and immutable infrastructure.',
          },
        ],
        keyDifference: {
          title: 'AWS Approach',
          content:
            'AWS provides mature infrastructure services with deep platform integration. Teams get enterprise-grade reliability and scalability at the cost of AWS vendor lock-in and complexity.',
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
            value: 'IAM-based',
            note: 'Via AWS IAM roles',
          },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <Users className="size-full" />,
            title: 'AWS IAM Integration',
            content:
              'Fine-grained access control via AWS Identity and Access Management (IAM) roles and policies.',
          },
          {
            icon: <Clock className="size-full" />,
            title: 'CloudWatch Monitoring',
            content:
              'Integrated monitoring, logging, and alerting via Amazon CloudWatch.',
          },
          {
            icon: <Key className="size-full" />,
            title: 'Resource Tagging',
            content:
              'Organize and track resources using AWS tags for cost allocation and management.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Enterprise Compliance',
            content:
              'SOC, HIPAA, PCI, and other compliance certifications across AWS services.',
          },
        ],
        keyDifference: {
          title: 'AWS Approach',
          content:
            'AWS provides enterprise-grade collaboration and governance through IAM, CloudWatch, and VPC isolation. Large organizations with strict compliance requirements will find AWS capabilities comprehensive.',
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
            value: 'Via AWS services',
            note: 'Available through AWS-managed services',
          },
          {
            type: 'warning',
            value: 'Via S3',
            note: 'Object storage via Amazon S3',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'EventBridge',
            note: 'Cron via Amazon EventBridge',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: [
          {
            icon: <Store className="size-full" />,
            title: 'AWS Service Ecosystem',
            content:
              'Access to 200+ AWS services including RDS, ElastiCache, Lambda, S3, and more.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Managed Databases',
            content:
              'Amazon RDS for PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server with automated backups and Multi-AZ.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'ElastiCache',
            content:
              'Fully managed Redis and Memcached for caching and real-time use cases.',
          },
          {
            icon: <Wrench className="size-full" />,
            title: 'Developer Tools',
            content:
              'AWS CodePipeline, CodeBuild, and CodeDeploy for CI/CD workflows.',
          },
        ],
        keyDifference: {
          title: 'AWS Approach',
          content:
            'AWS offers an unparalleled breadth of services and deep integrations. If you want access to the full AWS cloud ecosystem with enterprise-grade managed services, AWS Elastic Beanstalk delivers.',
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$90/mo',
          sealosSavings: { type: 'comparable', savings: 72 },
          label: 'AWS Elastic Beanstalk',
        },
        {
          cost: '~$320/mo',
          sealosSavings: { type: 'comparable', savings: 60 },
          label: 'AWS Elastic Beanstalk',
        },
        {
          cost: '~$600/mo',
          sealosSavings: { type: 'comparable', savings: 15 },
          label: 'AWS Elastic Beanstalk',
        },
      ],
      note: 'AWS calculation: EC2 + ELB + CloudWatch over 720 hours/month',
      source: {
        url: 'https://aws.amazon.com/elasticbeanstalk/pricing/',
        label: 'AWS Elastic Beanstalk Pricing',
      },
    },
    guidance: [
      {
        icon: <Store className="size-full" />,
        content: 'Need **deep integration** with AWS services (RDS, S3, Lambda, etc.)',
      },
      {
        icon: <Shield className="size-full" />,
        content: 'Require **enterprise compliance** (SOC, HIPAA, PCI)',
      },
      {
        icon: <Globe className="size-full" />,
        content: 'Want deployment in **multiple AWS regions** worldwide',
      },
      {
        icon: <TrendingUp className="size-full" />,
        content: 'Need **advanced Auto Scaling** with custom metrics',
      },
      {
        icon: <Settings className="size-full" />,
        content: 'Already invested in **AWS infrastructure and expertise**',
      },
      {
        icon: <Plug className="size-full" />,
        content: 'Require **VPC isolation** and networking control',
      },
    ],
  },
};

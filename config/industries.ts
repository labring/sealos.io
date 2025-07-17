import { LucideIcon } from 'lucide-react';
import {
  GraduationCap,
  Cloud,
  Layers,
  Shield,
  Globe,
  Server,
  Code,
  Users,
  DollarSign,
  Zap,
  Clock,
  GitBranch,
  Gamepad2,
  Wifi,
  BarChart3,
  Cpu,
  Database,
  Rocket,
  Trophy,
  Headphones,
  Code2,
  Settings,
  TrendingUp,
  Activity,
  FileText,
  Wrench,
  BookOpen,
  Smile,
} from 'lucide-react';

export interface IndustryChallenge {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}

export interface IndustryBenefit {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}

export interface IndustryStat {
  number: string;
  label: string;
  description: string;
}

export interface IndustryVisualIcon {
  icon: LucideIcon;
  label: string;
  color: string;
}

export interface IndustryVisualBreak {
  title: string;
  subtitle: string;
  bottomText: string;
  icons: IndustryVisualIcon[];
}

export interface IndustryProduct {
  name: string;
  slug: string;
  description: string;
  icon: string;
  benefits: string[];
  useCases: string[];
}

// Simple product reference - just the app slug
export interface IndustryProductRef {
  slug: string;
}

export interface IndustryConfig {
  slug: string;
  name: string;
  title: string;
  centralIcon: LucideIcon;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    ctaText?: string;
    ctaUrl?: string;
    description: string;
    introText: string;
  };
  overview: {
    title: string;
    paragraphs: string[];
  };
  visualBreak: IndustryVisualBreak;
  challenges: IndustryChallenge[];
  benefits: IndustryBenefit[];
  stats: IndustryStat[];
  products: IndustryProductRef[];
  implementation: IndustryBenefit[];
  cta: {
    title: string;
    description: string;
    features: string;
  };
  promoBanner?: IndustryPromoBanner;
}

export interface IndustryPromoBanner {
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

export const industriesConfig: Record<string, IndustryConfig> = {
  education: {
    slug: 'education',
    name: 'Education',
    title: 'Transform Education with Cloud Technology',
    centralIcon: GraduationCap,
    metadata: {
      title: 'Education Solutions | Cloud Platform for Schools & Universities',
      description:
        'Discover how Sealos cloud platform transforms educational institutions with scalable infrastructure, development tools, databases, and collaborative environments. Reduce IT costs while enhancing learning experiences.',
      keywords: [
        'education cloud platform',
        'school cloud solutions',
        'university cloud infrastructure',
        'educational technology',
        'student development environment',
        'academic cloud computing',
        'education database management',
        'remote learning platform',
        'educational software deployment',
      ],
    },
    hero: {
      description:
        'Join thousands of educational institutions already using Sealos to deliver better learning experiences with modern cloud infrastructure and development tools.',
      introText:
        'Empowering educational institutions with scalable, secure, and cost-effective cloud solutions',
    },
    overview: {
      title: 'Transforming Education Through Technology',
      paragraphs: [
        'The education sector is rapidly evolving, with institutions worldwide embracing digital transformation to enhance learning outcomes and operational efficiency. Modern educational institutions require flexible, scalable, and cost-effective technology solutions that can adapt to diverse learning environments, from traditional classrooms to remote and hybrid learning scenarios.',
        'Cloud computing has emerged as a game-changer, enabling schools and universities to provide students and faculty with instant access to powerful computing resources, collaborative tools, and cutting-edge software without the complexity and expense of traditional IT infrastructure.',
      ],
    },
    visualBreak: {
      title: 'Powering Education with Modern Cloud Technology',
      subtitle:
        'Experience the power of cloud-native infrastructure designed for modern education workflows',
      bottomText:
        'From development to deployment, Sealos provides the complete infrastructure stack you need',
      icons: [
        {
          icon: Cloud,
          label: 'Cloud Infrastructure',
          color: 'text-blue-500',
        },
        {
          icon: Layers,
          label: 'Scalable Platform',
          color: 'text-green-500',
        },
        {
          icon: Shield,
          label: 'Secure Access',
          color: 'text-purple-500',
        },
        { icon: Globe, label: 'Global Reach', color: 'text-orange-500' },
      ],
    },
    challenges: [
      {
        title: 'Limited IT Resources',
        description:
          'Educational institutions often struggle with budget constraints, lack of dedicated IT staff, and outdated infrastructure that hampers digital transformation.',
        icon: Server,
        iconColor: 'text-red-500',
      },
      {
        title: 'Complex Software Management',
        description:
          'Installing, maintaining, and updating educational software across multiple devices and platforms is time-consuming and error-prone.',
        icon: Code,
        iconColor: 'text-red-500',
      },
      {
        title: 'Scalability Issues',
        description:
          'Traditional on-premise solutions struggle to accommodate fluctuating student populations and varying computational demands throughout the academic year.',
        icon: Users,
        iconColor: 'text-red-500',
      },
      {
        title: 'Security & Compliance',
        description:
          'Protecting sensitive student data while maintaining compliance with educational privacy regulations like FERPA is increasingly challenging.',
        icon: Shield,
        iconColor: 'text-red-500',
      },
      {
        title: 'Remote Learning Barriers',
        description:
          'Providing consistent access to learning tools and computing resources for students across different locations and devices.',
        icon: Globe,
        iconColor: 'text-red-500',
      },
      {
        title: 'High Infrastructure Costs',
        description:
          'Maintaining physical servers, software licenses, and IT infrastructure consumes significant portions of educational budgets.',
        icon: DollarSign,
        iconColor: 'text-red-500',
      },
    ],
    benefits: [
      {
        title: 'Instant Development Environments',
        description:
          'Students and faculty can launch pre-configured development environments in seconds, eliminating setup time and ensuring consistent experiences.',
        icon: Zap,
        iconColor: 'text-blue-500',
      },
      {
        title: 'Cost-Effective Solution',
        description:
          'Pay-as-you-use pricing model significantly reduces infrastructure costs compared to traditional on-premise solutions.',
        icon: DollarSign,
        iconColor: 'text-green-500',
      },
      {
        title: 'Enhanced Collaboration',
        description:
          'Built-in collaboration tools enable seamless project sharing, code review, and group work across distributed teams.',
        icon: Users,
        iconColor: 'text-purple-500',
      },
      {
        title: 'Enterprise-Grade Security',
        description:
          'Advanced security features and compliance standards ensure student data protection and regulatory compliance.',
        icon: Shield,
        iconColor: 'text-red-500',
      },
    ],
    stats: [
      {
        number: '100+',
        label: 'Educational Institutions',
        description: 'Universities and schools using cloud solutions',
      },
      {
        number: '100,000+',
        label: 'Student Users',
        description: 'Students accessing development environments',
      },
      {
        number: '70%',
        label: 'Cost Reduction',
        description: 'Average savings on IT infrastructure',
      },
      {
        number: 'High',
        label: 'Uptime',
        description: 'Reliable access to learning resources',
      },
    ],
    products: [
      { slug: 'docker-stacks' },
      { slug: 'code-server' },
      { slug: 'pgadmin4' },
    ],
    implementation: [
      {
        title: 'Quick Deployment',
        description:
          'Get started in minutes with pre-configured educational templates and one-click deployments.',
        icon: Clock,
        iconColor: 'text-blue-500',
      },
      {
        title: 'Scalable Infrastructure',
        description:
          'Automatically scale resources based on student demand and course requirements.',
        icon: Server,
        iconColor: 'text-green-500',
      },
      {
        title: 'Integrated Ecosystem',
        description:
          'Seamlessly connect databases, development tools, and collaboration platforms.',
        icon: GitBranch,
        iconColor: 'text-purple-500',
      },
      {
        title: '24/7 Support',
        description:
          'Dedicated educational support team to ensure smooth operations during critical periods.',
        icon: Users,
        iconColor: 'text-orange-500',
      },
    ],
    cta: {
      title: 'Ready to Transform Your Educational Institution?',
      description:
        'Educational institutions worldwide trust Sealos to deliver reliable, scalable cloud infrastructure that enhances learning experiences and reduces operational complexity.',
      features:
        'Scalable infrastructure • Cost-effective solutions • Easy deployment',
    },
    promoBanner: {
      title: 'Special Offer for Education Professionals',
      subtitle:
        'Get started for free on Sealos - perfect for individual educators and students',
      cta: 'Claim Your Education Discount',
      link: 'https://go.sealos.io/edu-apply',
    },
  },
  gaming: {
    slug: 'gaming',
    name: 'Gaming',
    title: 'Power Your Gaming Infrastructure with Cloud',
    centralIcon: Gamepad2,
    metadata: {
      title: 'Gaming Solutions | Cloud Platform for Game Developers & Studios',
      description:
        'Discover how Sealos cloud platform empowers gaming companies with scalable game servers, real-time multiplayer infrastructure, and development tools. Optimize performance and reduce costs while enhancing player experiences.',
      keywords: [
        'gaming cloud platform',
        'game server hosting',
        'multiplayer game infrastructure',
        'gaming development tools',
        'game backend services',
        'cloud gaming solutions',
        'game database management',
        'esports infrastructure',
        'gaming application deployment',
      ],
    },
    hero: {
      description:
        'Join leading game studios and indie developers using Sealos to build, deploy, and scale gaming experiences worldwide with optimized, high-performance infrastructure.',
      introText:
        'Scale game servers, manage multiplayer experiences, and deploy gaming applications with enterprise-grade reliability',
    },
    overview: {
      title: 'Revolutionizing Gaming with Cloud Technology',
      paragraphs: [
        'The gaming industry demands optimized performance, massive scalability, and reliable infrastructure. Modern game developers need infrastructure that can instantly scale from dozens to millions of concurrent players, handle real-time multiplayer interactions, and provide seamless experiences across global regions.',
        'Cloud computing has become the backbone of modern gaming, enabling developers to focus on creating amazing gameplay experiences while leveraging enterprise-grade infrastructure for game servers, databases, analytics, and content delivery without the complexity of managing physical hardware.',
      ],
    },
    visualBreak: {
      title: 'Powering Gaming with Modern Cloud Technology',
      subtitle:
        'Experience the power of cloud-native infrastructure designed for modern gaming workflows',
      bottomText:
        'From development to deployment, Sealos provides the complete infrastructure stack you need',
      icons: [
        {
          icon: Zap,
          label: 'High Performance',
          color: 'text-yellow-500',
        },
        { icon: Cpu, label: 'Powerful Computing', color: 'text-red-500' },
        {
          icon: Database,
          label: 'Real-time Data',
          color: 'text-blue-500',
        },
        {
          icon: Globe,
          label: 'Global Distribution',
          color: 'text-green-500',
        },
      ],
    },
    challenges: [
      {
        title: 'Performance & Responsiveness',
        description:
          'Gaming requires optimized performance and high-performance computing to deliver smooth, responsive gameplay experiences for competitive and casual players alike.',
        icon: Wifi,
        iconColor: 'text-red-500',
      },
      {
        title: 'Massive Scaling',
        description:
          'Game traffic can spike from hundreds to millions of concurrent players instantly, requiring infrastructure that can scale rapidly without performance degradation.',
        icon: BarChart3,
        iconColor: 'text-red-500',
      },
      {
        title: 'Global Distribution',
        description:
          'Players are worldwide, requiring game servers and content to be distributed globally for consistent performance experiences across regions.',
        icon: Globe,
        iconColor: 'text-red-500',
      },
      {
        title: 'Real-time Data Processing',
        description:
          'Multiplayer games generate massive amounts of real-time data that must be processed, synchronized, and stored with minimal delay.',
        icon: Cpu,
        iconColor: 'text-red-500',
      },
      {
        title: 'Development Complexity',
        description:
          'Building and maintaining game servers, matchmaking systems, and backend infrastructure diverts resources from core game development.',
        icon: Code,
        iconColor: 'text-red-500',
      },
      {
        title: 'Infrastructure Costs',
        description:
          'Running game servers 24/7 across multiple regions with redundancy can result in massive infrastructure costs, especially for smaller studios.',
        icon: DollarSign,
        iconColor: 'text-red-500',
      },
    ],
    benefits: [
      {
        title: 'Optimized Performance Infrastructure',
        description:
          'Deploy game servers in multiple regions with optimized networking to deliver enhanced performance for competitive gaming experiences.',
        icon: Rocket,
        iconColor: 'text-purple-500',
      },
      {
        title: 'Instant Auto-Scaling',
        description:
          'Automatically scale game servers up or down based on player demand, handling viral growth or scheduled events seamlessly.',
        icon: Zap,
        iconColor: 'text-blue-500',
      },
      {
        title: 'Real-time Analytics',
        description:
          'Built-in monitoring and analytics provide real-time insights into player behavior, server performance, and game metrics.',
        icon: BarChart3,
        iconColor: 'text-green-500',
      },
      {
        title: 'Developer-Friendly Tools',
        description:
          'Comprehensive development tools, APIs, and SDKs designed specifically for game development workflows and deployment pipelines.',
        icon: Code,
        iconColor: 'text-orange-500',
      },
    ],
    stats: [
      {
        number: '500+',
        label: 'Game Studios',
        description: 'Independent and AAA studios using cloud infrastructure',
      },
      {
        number: '100M+',
        label: 'Players Served',
        description: 'Concurrent players supported across all regions',
      },
      {
        number: 'Low',
        label: 'Network Latency',
        description: 'Optimized performance for gaming',
      },
      {
        number: 'High',
        label: 'Reliability',
        description: 'Enterprise-grade infrastructure for gaming',
      },
    ],
    products: [
      { slug: 'minio' },
      { slug: 'uptime-kuma' },
      { slug: 'influxdb' },
    ],
    implementation: [
      {
        title: 'Rapid Deployment',
        description:
          'Deploy game servers and infrastructure in minutes with pre-configured gaming templates and one-click scaling.',
        icon: Rocket,
        iconColor: 'text-purple-500',
      },
      {
        title: 'Global Edge Network',
        description:
          'Leverage edge computing and CDN to deliver optimized gaming experiences worldwide.',
        icon: Globe,
        iconColor: 'text-blue-500',
      },
      {
        title: 'Gaming-Optimized Stack',
        description:
          'Purpose-built tools and services designed specifically for gaming workloads and requirements.',
        icon: Trophy,
        iconColor: 'text-yellow-500',
      },
      {
        title: 'Expert Gaming Support',
        description:
          'Dedicated gaming infrastructure experts available 24/7 to optimize performance and resolve issues.',
        icon: Headphones,
        iconColor: 'text-green-500',
      },
    ],
    cta: {
      title: 'Ready to Level Up Your Gaming Infrastructure?',
      description:
        'Game studios and developers choose Sealos for its high-performance infrastructure that scales with player demand and delivers consistent gaming experiences.',
      features:
        'High-performance computing • Global scalability • Gaming-optimizations',
    },
  },
  it: {
    slug: 'information-technology',
    name: 'Information Technology',
    title: 'Accelerate Development with Cloud-Native Platform',
    centralIcon: Code2,
    metadata: {
      title:
        'Information Technology Solutions | Cloud Platform for Developers & IT Teams',
      description:
        'Discover how Sealos cloud platform empowers IT teams and developers with one-click Dev/Prod environments, app templates, and scalable SaaS/PaaS solutions. Accelerate development cycles and reduce infrastructure complexity.',
      keywords: [
        'information technology platform',
        'IT cloud solutions',
        'cloud development environment',
        'SaaS platform',
        'PaaS solutions',
        'app development tools',
        'dev environment',
        'production deployment',
        'app templates',
        'scalable development',
        'cloud-native development',
      ],
    },
    hero: {
      description:
        'Join thousands of IT professionals and development teams using Sealos to accelerate deployment cycles with instant environments, scalable infrastructure, and seamless operational workflows.',
      introText:
        'Build, deploy, and scale applications faster with one-click environments and cloud-native development tools',
    },
    overview: {
      title: 'Revolutionizing IT Operations with Cloud Technology',
      paragraphs: [
        'Modern IT operations require agility, scalability, and efficiency. IT teams need infrastructure that can instantly provision environments, scale applications seamlessly, and provide reliable deployment pipelines without the complexity of traditional server management.',
        'Cloud-native platforms have transformed how IT professionals build and deploy applications, enabling teams to focus on delivering business value rather than managing infrastructure. With containerization, microservices, and automated scaling, IT teams can deliver solutions faster and more reliably than ever before.',
      ],
    },
    visualBreak: {
      title: 'Powering IT Operations with Modern Cloud Technology',
      subtitle:
        'Experience the power of cloud-native infrastructure designed for modern IT workflows',
      bottomText:
        'From development to deployment, Sealos provides the complete infrastructure stack you need',
      icons: [
        {
          icon: Zap,
          label: 'One-Click Deploy',
          color: 'text-blue-500',
        },
        {
          icon: Layers,
          label: 'App Templates',
          color: 'text-green-500',
        },
        {
          icon: Activity,
          label: 'Auto Scaling',
          color: 'text-purple-500',
        },
        {
          icon: GitBranch,
          label: 'DevOps Ready',
          color: 'text-orange-500',
        },
      ],
    },
    challenges: [
      {
        title: 'Environment Setup Complexity',
        description:
          'Setting up consistent development and production environments across teams often involves complex configuration and significant time investment.',
        icon: Settings,
        iconColor: 'text-red-500',
      },
      {
        title: 'Scaling Infrastructure',
        description:
          'Traditional infrastructure struggles to handle variable workloads and requires extensive planning and management to scale applications effectively.',
        icon: TrendingUp,
        iconColor: 'text-red-500',
      },
      {
        title: 'DevOps Pipeline Complexity',
        description:
          'Building and maintaining CI/CD pipelines, deployment automation, and monitoring systems requires specialized knowledge and resources.',
        icon: GitBranch,
        iconColor: 'text-red-500',
      },
      {
        title: 'Resource Management',
        description:
          'Managing multiple environments, databases, and services across different stages of development leads to resource waste and increased costs.',
        icon: Database,
        iconColor: 'text-red-500',
      },
      {
        title: 'Deployment Bottlenecks',
        description:
          'Manual deployment processes and environment inconsistencies create bottlenecks that slow down development and increase deployment risks.',
        icon: Clock,
        iconColor: 'text-red-500',
      },
      {
        title: 'Infrastructure Costs',
        description:
          'Maintaining dedicated servers and infrastructure for development, testing, and production environments results in high operational costs.',
        icon: DollarSign,
        iconColor: 'text-red-500',
      },
    ],
    benefits: [
      {
        title: 'One-Click Environments',
        description:
          'Instantly provision development and production environments with pre-configured templates, eliminating setup time and ensuring consistency.',
        icon: Zap,
        iconColor: 'text-blue-500',
      },
      {
        title: 'App Templates & Starters',
        description:
          'Choose from a comprehensive library of application templates and starter projects to accelerate development and follow best practices.',
        icon: FileText,
        iconColor: 'text-green-500',
      },
      {
        title: 'Automatic Scaling',
        description:
          'Applications automatically scale based on demand, ensuring optimal performance during traffic spikes without manual intervention.',
        icon: Activity,
        iconColor: 'text-purple-500',
      },
      {
        title: 'Integrated Development Tools',
        description:
          'Complete development ecosystem with databases, caching, monitoring, and CI/CD tools integrated and ready to use.',
        icon: Wrench,
        iconColor: 'text-orange-500',
      },
    ],
    stats: [
      {
        number: '1000+',
        label: 'IT Teams',
        description: 'Active IT teams using the platform',
      },
      {
        number: '50+',
        label: 'App Templates',
        description: 'Ready-to-use application templates and starters',
      },
      {
        number: '< 30s',
        label: 'Environment Setup',
        description: 'Average time to provision new environments',
      },
      {
        number: '99.9%',
        label: 'Uptime',
        description: 'Platform reliability for production workloads',
      },
    ],
    products: [
      { slug: 'code-server' },
      { slug: 'docker-stacks' },
      { slug: 'pgadmin4' },
    ],
    implementation: [
      {
        title: 'Instant Environment Provisioning',
        description:
          'Deploy complete development environments in seconds with pre-configured templates for popular frameworks and languages.',
        icon: Rocket,
        iconColor: 'text-blue-500',
      },
      {
        title: 'Template Library',
        description:
          'Access a comprehensive collection of application templates, from simple APIs to complex microservices architectures.',
        icon: BookOpen,
        iconColor: 'text-green-500',
      },
      {
        title: 'Seamless Scaling',
        description:
          'Applications automatically scale horizontally and vertically based on real-time demand and resource utilization.',
        icon: TrendingUp,
        iconColor: 'text-purple-500',
      },
      {
        title: 'Developer Experience',
        description:
          'Intuitive interface and powerful CLI tools designed to enhance developer productivity and reduce friction.',
        icon: Smile,
        iconColor: 'text-orange-500',
      },
    ],
    cta: {
      title: 'Ready to Accelerate Your IT Operations?',
      description:
        'IT teams choose Sealos for its powerful platform that eliminates infrastructure complexity and accelerates time-to-deployment.',
      features:
        'One-click environments • App templates • Auto-scaling • Integrated tools',
    },
  },
};

export function getIndustryConfig(slug: string): IndustryConfig | null {
  return (
    Object.values(industriesConfig).find((config) => config.slug === slug) ||
    null
  );
}

export function getAllIndustries(): string[] {
  return Object.values(industriesConfig).map((config) => config.slug);
}

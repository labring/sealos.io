import Image from 'next/image';
import { GradientText } from '@/new-components/GradientText';
import { cn } from '@/lib/utils';
import {
  GradientCodeXml,
  GradientLayoutGrid,
  GradientDatabaseIcon,
  GradientCpu,
  GradientBox,
  GradientBotIcon,
} from '../../(new-home)/components/GradientIcon';
import CloudIDEImage from '../assets/card-cloudide.svg';
import AppStoreImage from '../assets/card-appstore.svg';
import DBStorageImage from '../assets/card-dbstor.svg';
import K8sImage from '../assets/card-k8s.svg';
import MultiTenancyImage from '../assets/card-multitenancy.svg';
import AINativeImage from '../assets/card-ainative.svg';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  children,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'bg-card flex flex-col justify-start gap-5 rounded-xl border p-8',
        className,
      )}
    >
      <div className="flex size-fit grow-0 items-center justify-center rounded-full border bg-white/5 p-4">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-foreground text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
          {description}
        </p>
      </div>
      {children && (
        <div className="relative w-full flex-1 overflow-hidden">
          <div className="relative aspect-[12/5] w-full">{children}</div>
        </div>
      )}
    </div>
  );
}

interface FeatureData {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  image?: React.ReactNode;
}

const features: FeatureData[] = [
  {
    icon: GradientCodeXml,
    title: 'Integrated Cloud IDEs',
    description:
      'Zero-setup, collaborative development in the cloud. Eliminate local environment inconsistencies with DevBox.',
    image: (
      <Image
        src={CloudIDEImage}
        alt="Integrated Cloud IDEs"
        className="h-full w-full object-contain"
        fill
      />
    ),
  },
  {
    icon: GradientLayoutGrid,
    title: 'Extensive App Store',
    description:
      'Deploy complex applications with a single click. No YAML configuration, no container orchestration complexity - just point, click, and deploy.',
    image: (
      <Image
        src={AppStoreImage}
        alt="Extensive App Store"
        className="h-full w-full object-contain"
        fill
      />
    ),
  },
  {
    icon: GradientDatabaseIcon,
    title: 'Managed Databases & Storage',
    description:
      'Production-ready PostgreSQL, MySQL, MongoDB, Redis, and built-in S3-compatible Object Storage.',
    image: (
      <Image
        src={DBStorageImage}
        alt="Managed Databases & Storage"
        className="h-full w-full object-contain"
        fill
      />
    ),
  },
  {
    icon: GradientCpu,
    title: 'Full Kubernetes Power',
    description:
      'Access the full power of Kubernetes without the complexity. K8s-native from day one.',
    image: (
      <Image
        src={K8sImage}
        alt="Full Kubernetes Power"
        className="h-full w-full object-contain"
        fill
      />
    ),
  },
  {
    icon: GradientBox,
    title: 'Enterprise Multi-Tenancy',
    description:
      'Workspace-based isolation with granular RBAC and per-workspace resource quotas for secure collaboration.',
    image: (
      <Image
        src={MultiTenancyImage}
        alt="Enterprise Multi-Tenancy"
        className="h-full w-full object-contain"
        fill
      />
    ),
  },
  {
    icon: GradientBotIcon,
    title: 'AI-Native Infrastructure',
    description:
      'Build and scale modern AI applications, SaaS platforms, and complex microservice architectures with AI simply by describing them.',
    image: (
      <Image
        src={AINativeImage}
        alt="AI-Native Infrastructure"
        className="h-full w-full object-contain"
        fill
      />
    ),
  },
];

interface FeaturesSectionProps {
  className?: string;
  featureImages?: React.ReactNode[];
}

export function FeaturesSection({
  className,
  featureImages = [],
}: FeaturesSectionProps) {
  return (
    <section className={cn('container py-18', className)}>
      <div className="mb-16 flex flex-col items-center gap-6">
        <h2 className="text-center text-4xl font-semibold">
          <span>Everything You Need to </span>
          <GradientText>Build and Scale</GradientText>
        </h2>
        <p className="text-muted-foreground w-full max-w-2xl text-center text-base">
          Unify the entire application lifecycle, from development in cloud IDEs
          to production deployment and management.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          >
            {featureImages[index] || feature.image}
          </FeatureCard>
        ))}
      </div>
    </section>
  );
}

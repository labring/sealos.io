import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  bgColor,
  iconColor,
}: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgColor}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

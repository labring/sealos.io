'use client';

import { useOpenDeployModal } from '@/new-components/DeployModal';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DeployButtonProps {
  templateName: string;
  appName: string;
  category: string;
  children: React.ReactNode;
  className?: string;
}

export function DeployButton({
  templateName,
  appName,
  category,
  children,
  className,
}: DeployButtonProps) {
  const openDeployModal = useOpenDeployModal();

  const handleClick = () => {
    openDeployModal(templateName);
  };

  const primaryCtaClassName = cn(
    buttonVariants({ variant: 'landing-primary' }),
    'h-11 px-6 text-base cursor-pointer transition duration-200 focus-visible:ring-2 focus-visible:ring-[#6ea2ff] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.98]',
    className,
  );

  return (
    <button
      type="button"
      className={primaryCtaClassName}
      onClick={handleClick}
      data-technology={appName}
      data-category={category}
    >
      {children}
    </button>
  );
}

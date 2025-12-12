import { ComparisonConfig } from '../../config/platforms';
import { ChoosePlatform } from '../components/ChoosePlatform';

interface ChoosePlatformSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function ChoosePlatformSection({
  firstPlatform,
  secondPlatform,
}: ChoosePlatformSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <ChoosePlatform
        firstPlatform={firstPlatform}
        secondPlatform={secondPlatform}
      />
    </section>
  );
}

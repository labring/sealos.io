import { appDomain } from '@/config/site';
import { AttributionLink } from '@/components/ui/attribution-link';

export function AppDashboardLink() {
  return <AttributionLink href={appDomain}>Sealos Dashbord</AttributionLink>;
}

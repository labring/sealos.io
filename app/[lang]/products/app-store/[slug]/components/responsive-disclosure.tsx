import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import g from './eaglercraft.module.css';

export default function ResponsiveDisclosure({
  heading,
  children,
  defaultOpen = false,
}: {
  heading: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {

  return (
    <details name="world-capabilities" open={defaultOpen} className={g.capability}>
      <summary>
        <h3>{heading}</h3>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <p>{children}</p>
    </details>
  );
}

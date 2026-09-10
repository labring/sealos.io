import type { ReactNode } from 'react';
import { ArrowDown } from 'lucide-react';
import s from './detail.module.css';

export default function ReadmeDisclosure({
  children,
  preview,
}: {
  children: ReactNode;
  preview: ReactNode;
}) {
  return (
    <>
      <div className={s.readmeExcerpt}>{preview}</div>
      <details className={s.readmeDisclosure}>
        <summary className={s.readmeToggle}>
          <span className={s.readmeExpandLabel}>Read full documentation</span>
          <span className={s.readmeCollapseLabel}>Collapse documentation</span>
          <ArrowDown size={15} />
        </summary>
        <div className={s.readmeBody}>
          <p className={s.readmeBillingNote}>
            For current cloud charges, refer to{' '}
            <a href="/pricing/">Sealos plan pricing</a>. Upstream documentation
            may reference earlier billing models.
          </p>
          {children}
        </div>
      </details>
    </>
  );
}

// Direct email section for the abuse report page.

import { AbuseTranslations } from '../content';
import { MailIcon } from './icons';

type AbuseContactProps = {
  content: AbuseTranslations;
};

export default function AbuseContact({ content }: AbuseContactProps) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 text-center">
      <p className="text-sm text-muted-foreground">{content.directEmail}</p>
      <a
        href="mailto:abuse@sealos.io"
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold text-custom-primary-text transition-colors hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-offset-0 hover:bg-white/5"
      >
        <MailIcon className="h-4 w-4" aria-hidden="true" />
        abuse@sealos.io
      </a>
    </div>
  );
}

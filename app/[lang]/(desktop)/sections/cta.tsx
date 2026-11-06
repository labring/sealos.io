import { CtaDownloads } from '../components/download';
import type { HomeCopy } from '../content';

export function CtaSection({ copy }: { copy: HomeCopy }) {
  return (
    <section className="sx-container sx-cta">
      <h2 className="sx-cta-title">{copy.cta.title}</h2>
      <CtaDownloads
        copy={copy.download}
        tracking={{
          id: 'home_bottom_download',
          location: 'bottom_cta',
          destination: 'desktop_download',
        }}
      />
    </section>
  );
}

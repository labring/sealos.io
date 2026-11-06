import { DownloadActions } from '../components/download';
import type { HomeCopy } from '../content';

export function CtaSection({ copy }: { copy: HomeCopy }) {
  return (
    <section className="sx-container sx-cta">
      <h2 className="sx-cta-title">{copy.cta.title}</h2>
      <div className="sx-cta-buttons">
        <DownloadActions
          copy={copy.download}
          tracking={{
            id: 'home_bottom_download',
            location: 'bottom_cta',
            destination: 'desktop_download',
          }}
          signUpTracking={{
            id: 'home_bottom_sign_up',
            location: 'bottom_cta',
            destination: 'signup_modal',
          }}
        />
      </div>
    </section>
  );
}

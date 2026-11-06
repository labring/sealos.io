import { AsciiWatercolor } from '../components/ascii-watercolor';
import { DownloadSplitButton } from '../components/download';
import { InstallWithAgent } from '../components/install-agent';
import type { HomeCopy } from '../content';
import { HeroApp } from '../faux/hero-app';

export function HeroSection({
  copy,
  skillsHref,
}: {
  copy: HomeCopy;
  skillsHref: string;
}) {
  return (
    <section className="sx-hero" id="download">
      <div className="sx-container">
        <div className="sx-hero-copy">
          <h1 className="sx-display">{copy.hero.title}</h1>
          <p className="sx-lede">{copy.hero.subtitle}</p>
          <div className="sx-hero-actions">
            <DownloadSplitButton
              copy={copy.download}
              tracking={{
                id: 'home_hero_download',
                location: 'hero',
                destination: 'desktop_download',
              }}
            />
            <InstallWithAgent
              copy={copy.installAgent}
              skillsHref={skillsHref}
            />
          </div>
        </div>
        <AsciiWatercolor image="hero" interactive className="sx-hero-panel">
          <div
            className="sx-scaler"
            style={{
              ['--w' as string]: 1296,
              ['--h' as string]: 764,
              ['--m-scale' as string]: 0.52,
              ['--m-shift' as string]: 400,
              ['--m-ar' as string]: '358 / 400',
            }}
          >
            <div className="sx-scaler-stage">
              <HeroApp />
            </div>
          </div>
        </AsciiWatercolor>
      </div>
    </section>
  );
}

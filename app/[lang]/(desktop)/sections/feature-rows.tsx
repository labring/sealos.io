import type { ReactNode } from 'react';
import {
  AsciiWatercolor,
  type WatercolorImage,
} from '../components/ascii-watercolor';
import type { FeatureRowCopy, HomeCopy } from '../content';
import {
  AgentLogsShot,
  GithubDeployShot,
  LocalDeployShot,
  ProjectViewShot,
} from '../faux/rows';

const SHOTS: Record<
  FeatureRowCopy['id'],
  { image: WatercolorImage; shot: ReactNode; mobileShift: number }
> = {
  local: { image: 'a', shot: <LocalDeployShot />, mobileShift: 24 },
  github: { image: 'b', shot: <GithubDeployShot />, mobileShift: 250 },
  project: { image: 'a', shot: <ProjectViewShot />, mobileShift: 24 },
  agent: { image: 'hero', shot: <AgentLogsShot />, mobileShift: 0 },
};

export function FeatureRows({ copy }: { copy: HomeCopy }) {
  return (
    <section className="sx-section" id="deploy" style={{ paddingTop: 0 }}>
      <div className="sx-container sx-rows">
        {copy.features.map((feature, index) => {
          const { image, shot, mobileShift } = SHOTS[feature.id];
          return (
            <article
              key={feature.id}
              className="sx-row sx-reveal"
              data-flip={index % 2 === 1 || undefined}
            >
              <div className="sx-row-copy">
                <div className="sx-row-copy-text">
                  <h2 className="sx-title">{feature.title}</h2>
                  <p className="sx-body">{feature.body}</p>
                </div>
              </div>
              <AsciiWatercolor image={image}>
                <div
                  className="sx-scaler sx-row-scaler"
                  style={{
                    ['--w' as string]: 769,
                    ['--h' as string]: 724,
                    ['--m-scale' as string]: 0.6,
                    ['--m-shift' as string]: mobileShift,
                    ['--m-ar' as string]: '1 / 1.05',
                  }}
                >
                  <div className="sx-scaler-stage">{shot}</div>
                </div>
              </AsciiWatercolor>
            </article>
          );
        })}
      </div>
    </section>
  );
}

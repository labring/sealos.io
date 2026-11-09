import type { HomeCopy } from '../content';
import { GithubRepoShot, LocalProjectShot, TemplateShot } from '../faux/cards';

const SHOTS = [
  <LocalProjectShot key="local" />,
  <GithubRepoShot key="gh" />,
  <TemplateShot key="tpl" />,
];

export function DeployAnySection({ copy }: { copy: HomeCopy }) {
  return (
    <section className="sx-section">
      <div className="sx-container">
        <div className="sx-section-head">
          <h2 className="sx-title">{copy.deployAny.title}</h2>
          <p className="sx-body">{copy.deployAny.body}</p>
        </div>
        <div className="sx-grid-3">
          {copy.deployAny.cards.map((card, index) => (
            <div key={card.title} className="sx-card sx-shot-card sx-reveal">
              <div className="sx-shot-card-head">
                <h3 className="sx-card-title">{card.title}</h3>
                <p className="sx-card-body">{card.body}</p>
              </div>
              <div className="sx-shot">
                <div
                  className="sx-scaler"
                  style={{ ['--w' as string]: 377, ['--h' as string]: 295 }}
                >
                  <div className="sx-scaler-stage">{SHOTS[index]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

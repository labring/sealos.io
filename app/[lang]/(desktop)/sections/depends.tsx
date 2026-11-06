import type { HomeCopy } from '../content';
import {
  BucketsShot,
  DatabasesShot,
  GatewayShot,
  WorkspacesShot,
} from '../faux/cards';

const SHOTS = [
  <DatabasesShot key="db" />,
  <BucketsShot key="buckets" />,
  <GatewayShot key="gw" />,
  <WorkspacesShot key="ws" />,
];

export function DependsSection({ copy }: { copy: HomeCopy }) {
  return (
    <section className="sx-section" id="workspace">
      <div className="sx-container">
        <div className="sx-section-head">
          <h2 className="sx-title">{copy.depends.title}</h2>
          <p className="sx-body">{copy.depends.body}</p>
        </div>
        <div className="sx-grid-4">
          {copy.depends.cards.map((card, index) => (
            <div key={card.title} className="sx-card sx-shot-card sx-reveal">
              <div className="sx-shot-card-head">
                <h3 className="sx-card-title">{card.title}</h3>
                <p className="sx-card-body">{card.body}</p>
              </div>
              <div className="sx-shot" style={{ marginTop: 'auto' }}>
                <div
                  className="sx-scaler"
                  style={{ ['--w' as string]: 268, ['--h' as string]: 350 }}
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

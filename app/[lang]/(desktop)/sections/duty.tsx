import type { HomeCopy } from '../content';
import {
  DiagnoseCard,
  HotUpdateCard,
  ScaleCard,
  WarningsCard,
} from '../faux/cards';
import { DutyStack } from './duty-stack';

export function DutySection({ copy }: { copy: HomeCopy }) {
  return (
    <section className="sx-section" id="run">
      <div className="sx-container">
        <DutyStack
          items={copy.duty.items}
          head={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h2 className="sx-title">{copy.duty.title}</h2>
              <p className="sx-body">{copy.duty.body}</p>
            </div>
          }
          cards={[
            { node: <DiagnoseCard />, tone: 'plain' },
            { node: <HotUpdateCard />, tone: 'tint' },
            { node: <ScaleCard />, tone: 'plain' },
            { node: <WarningsCard />, tone: 'tint' },
          ]}
        />
      </div>
    </section>
  );
}

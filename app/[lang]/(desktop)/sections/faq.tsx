'use client';

import * as Accordion from '@radix-ui/react-accordion';
import type { HomeCopy } from '../content';

export function FaqSection({ copy }: { copy: HomeCopy }) {
  return (
    <section className="sx-faq" id="faq">
      <div className="sx-container sx-faq-inner">
        <h2 className="sx-display">{copy.faq.title}</h2>
        <Accordion.Root
          type="single"
          collapsible
          defaultValue="0"
          className="sx-faq-list"
        >
          {copy.faq.items.map((item, index) => (
            <Accordion.Item
              key={item.q}
              value={String(index)}
              className="sx-faq-item"
            >
              <Accordion.Header asChild>
                <h3 style={{ margin: 0, fontWeight: 400 }}>
                  <Accordion.Trigger className="sx-faq-trigger">
                    {item.q}
                    <span className="sx-faq-icon" aria-hidden />
                  </Accordion.Trigger>
                </h3>
              </Accordion.Header>
              <Accordion.Content className="sx-faq-content">
                <p>{item.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}

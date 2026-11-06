'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { useEffect, useState } from 'react';
import type { HomeCopy } from '../content';

export function FaqSection({ copy }: { copy: HomeCopy }) {
  const [open, setOpen] = useState('0');
  // Open and close animate only after hydration, so the server-rendered
  // answers do not play a collapse animation on first paint.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <section className="sx-faq" id="faq">
      <div className="sx-container sx-faq-inner">
        <h2 className="sx-display">{copy.faq.title}</h2>
        <Accordion.Root
          type="single"
          collapsible
          value={open}
          onValueChange={setOpen}
          data-ready={ready || undefined}
          className="sx-faq-list"
        >
          {copy.faq.items.map((item, index) => {
            const value = String(index);
            return (
              <Accordion.Item
                key={item.q}
                value={value}
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
                {/* Every answer stays in the HTML so crawlers can read it. A
                    closed answer collapses to zero height (see home.css)
                    instead of being unmounted. */}
                <Accordion.Content
                  forceMount
                  aria-hidden={open !== value}
                  className="sx-faq-content"
                >
                  <div>
                    <p>{item.a}</p>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>
      </div>
    </section>
  );
}

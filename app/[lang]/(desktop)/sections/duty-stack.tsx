'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

const STICK_TOP = 118;
const STEP = 14;
const GAP = 16;

interface DutyStackProps {
  items: Array<{ title: string; body: string }>;
  head: ReactNode;
  cards: Array<{ node: ReactNode; tone: 'plain' | 'tint' }>;
}

/**
 * Stacked cards in the style of a sliding deck: every card sticks a little
 * lower than the one before, the next one slides over it, and the list on
 * the left follows along with a progress line under the active item.
 */
export function DutyStack({ items, head, cards }: DutyStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [active, setActive] = useState(0);

  const measure = useCallback(() => {
    const stack = stackRef.current;
    if (!stack) return;
    if (window.matchMedia('(max-width: 960px)').matches) {
      cardRefs.current.forEach((card) =>
        card?.style.setProperty('--cover', '0'),
      );
      return;
    }
    const stackTop = stack.getBoundingClientRect().top;
    const height = cardRefs.current[0]?.offsetHeight ?? 378;
    const pitch = height + GAP;
    const n = cards.length;
    // How far the page has scrolled past the point where card 0 sticks.
    const travelled = STICK_TOP - stackTop;
    const position = Math.max(0, Math.min(travelled / pitch, n - 1 + 0.999));
    const current = Math.min(n - 1, Math.floor(position));
    const progress =
      current < n - 1
        ? position - current
        : Math.max(
            0,
            Math.min(1, (travelled - (n - 1) * pitch) / (pitch * 0.6)),
          );

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cover = i < current ? 1 : i === current && i < n - 1 ? progress : 0;
      card.style.setProperty('--cover', cover.toFixed(3));
    });
    itemRefs.current.forEach((item, i) => {
      item?.style.setProperty(
        '--progress',
        i === current ? progress.toFixed(3) : i < current ? '1' : '0',
      );
    });
    setActive((prev) => (prev === current ? prev : current));
  }, [cards.length]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [measure]);

  const goTo = (index: number) => {
    const stack = stackRef.current;
    if (!stack) return;
    const height = cardRefs.current[0]?.offsetHeight ?? 378;
    const stackTop = stack.getBoundingClientRect().top + window.scrollY;
    const target = stackTop + index * (height + GAP) - STICK_TOP + 2;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="sx-duty">
      <div className="sx-duty-aside">
        {head}
        <ol
          className="sx-duty-list"
          style={{ margin: 0, padding: 0, listStyle: 'none' }}
        >
          {items.map((item, index) => (
            <li
              key={item.title}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="sx-duty-item"
              data-active={active === index || undefined}
            >
              <button
                type="button"
                className="sx-duty-item-button"
                aria-current={active === index ? 'step' : undefined}
                onClick={() => goTo(index)}
              >
                {item.title}
              </button>
              <div className="sx-duty-item-body">
                <div>
                  <p>{item.body}</p>
                </div>
              </div>
              <span className="sx-duty-progress" aria-hidden />
            </li>
          ))}
        </ol>
      </div>

      <div
        ref={stackRef}
        className="sx-duty-stack"
        style={{ paddingBottom: 240 }}
      >
        {cards.map((card, index) => [
          <div key={`caption-${index}`} className="sx-duty-card-caption">
            <h3 className="sx-card-title">{items[index]?.title}</h3>
            <p className="sx-card-body">{items[index]?.body}</p>
          </div>,
          <div
            key={`card-${index}`}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="sx-duty-card"
            data-tone={card.tone}
            style={{ ['--i' as string]: index }}
          >
            <div
              className="sx-scaler"
              style={{
                ['--w' as string]: 788,
                ['--h' as string]: 378,
                ['--m-scale' as string]: 0.68,
                ['--m-shift' as string]: 134,
                ['--m-ar' as string]: '358 / 250',
              }}
            >
              <div className="sx-scaler-stage">{card.node}</div>
            </div>
          </div>,
        ])}
      </div>
    </div>
  );
}

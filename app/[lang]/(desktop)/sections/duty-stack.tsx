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
// How long the last card stays pinned after it lands, as a share of a pitch.
const TAIL_DWELL = 0.6;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

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
  const tailRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [active, setActive] = useState(0);

  // Scroll distance between two cards landing on their sticky tops. Card i
  // lands exactly when position === i.
  const getPitch = () =>
    (cardRefs.current[0]?.offsetHeight ?? 378) + GAP - STEP;

  const measure = useCallback(() => {
    const stack = stackRef.current;
    if (!stack) return;
    if (window.matchMedia('(max-width: 960px)').matches) {
      cardRefs.current.forEach((card) =>
        card?.style.setProperty('--cover', '0'),
      );
      return;
    }
    const n = cards.length;
    const pitch = getPitch();
    // How far the page has scrolled past the point where card 0 sticks.
    const position = (STICK_TOP - stack.getBoundingClientRect().top) / pitch;
    // The list follows whichever card fills most of the frame: the incoming
    // card takes over once it is halfway to its sticky top.
    const current = Math.max(0, Math.min(n - 1, Math.floor(position + 0.5)));

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cover = i < n - 1 ? clamp01(position - i) : 0;
      card.style.setProperty('--cover', cover.toFixed(3));
    });
    itemRefs.current.forEach((item, i) => {
      item?.style.setProperty(
        '--progress',
        clamp01(position - i + 0.5).toFixed(3),
      );
    });
    setActive((prev) => (prev === current ? prev : current));
  }, [cards.length]);

  // The sticky cards are held by the stack's content box, so the last card
  // only stays pinned while there is content below it. The tail spacer keeps
  // it pinned long enough for the last item's progress line to finish.
  const layoutTail = useCallback(() => {
    const tail = tailRef.current;
    if (!tail) return;
    const height = Math.max(0, Math.round(getPitch() * TAIL_DWELL - GAP));
    tail.style.height = `${height}px`;
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    const onResize = () => {
      layoutTail();
      onScroll();
    };
    onResize();
    const observer = new ResizeObserver(onResize);
    if (cardRefs.current[0]) observer.observe(cardRefs.current[0]);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [measure, layoutTail]);

  const goTo = (index: number) => {
    const stack = stackRef.current;
    if (!stack) return;
    const stackTop = stack.getBoundingClientRect().top + window.scrollY;
    const target = stackTop + index * getPitch() - STICK_TOP + 2;
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

      <div ref={stackRef} className="sx-duty-stack">
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
        <div ref={tailRef} className="sx-duty-tail" aria-hidden />
      </div>
    </div>
  );
}

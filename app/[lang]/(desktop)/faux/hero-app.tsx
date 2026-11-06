'use client';

import {
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Globe,
  LayoutGrid,
  LineChart,
  ListTree,
  Lock,
  Plus,
  RotateCw,
  Search,
  Settings,
} from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { NextMark } from './rows';

/*
 * The hero's product shot: one request becomes a running full-stack app.
 *
 * One fixed frame, the project view, and one region moving at a time. It
 * plays once, the first time the shot comes into view, then holds:
 *
 * 1. Chat. The request is typed into the composer and sent. The agent thinks,
 *    then streams its plan.
 * 2. Canvas. The web service and its two databases arrive. The web service
 *    reports its build; the connectors draw with the env var each one
 *    injects; the databases come up, then the app, which gets its URL.
 * 3. Payoff. A preview of the live app rises over the canvas, and the agent
 *    signs off in the chat.
 *
 * Every line of the thread is laid out from the first frame and only fades
 * in, so nothing above or below it ever moves. Phones see a crop that starts
 * on the chat and pans once to the canvas when the services arrive.
 *
 * Framing: the window sits whole inside its panel with the same insets as the
 * ship section's window on the same 1296 × 764 stage: 110px from each side,
 * 56px from the top and bottom.
 */

const GREETING = 'What do you want to deploy?';
const PROMPT = 'Deploy ./bookings with a Postgres and Redis';
const REPLY =
  'A Next.js app with Prisma and a session store. I’ll build it, add both databases and wire them in.';
const REPLY_WORDS = REPLY.split(' ');
const URL_TEXT = 'bookings.sealos.run';
const WEB_STEPS = ['Detecting Next.js', 'Installing deps', 'Building image'];

// Stage geometry, in design pixels.
const WIN = { left: 110, top: 56, width: 1076, height: 652 };
const SIDEBAR_W = 208;
const GUTTER = 24;
const TOPBAR = 44;
const CHAT_W = 320;
const CANVAS_W = WIN.width - SIDEBAR_W - CHAT_W;
const CANVAS_H = WIN.height - TOPBAR;

type Svc = 'off' | 'pending' | 'running';
type Phase = 'chat' | 'canvas';

interface DemoState {
  phase: Phase;
  typed: number;
  pressed: boolean;
  sent: boolean;
  thinking: boolean;
  /** Words of the reply on screen. */
  words: number;
  web: Svc;
  /** Index into WEB_STEPS while the web service builds. */
  webStep: number;
  pg: Svc;
  redis: Svc;
  wired: boolean;
  env: boolean;
  live: boolean;
  preview: boolean;
  signoff: boolean;
}

const INITIAL: DemoState = {
  phase: 'chat',
  typed: 0,
  pressed: false,
  sent: false,
  thinking: false,
  words: 0,
  web: 'off',
  webStep: 0,
  pg: 'off',
  redis: 'off',
  wired: false,
  env: false,
  live: false,
  preview: false,
  signoff: false,
};

/** The payoff, and the frame the story stops on. Reduced motion starts here. */
const POSTER: DemoState = {
  phase: 'canvas',
  typed: 0,
  pressed: false,
  sent: true,
  thinking: false,
  words: REPLY_WORDS.length,
  web: 'running',
  webStep: WEB_STEPS.length - 1,
  pg: 'running',
  redis: 'running',
  wired: true,
  env: true,
  live: true,
  preview: true,
  signoff: true,
};

const ICON = { size: 15, strokeWidth: 1.75 } as const;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Text that rolls to a new value: the old words leave upward, the new ones
 * come up from below, and the box eases to the new width so whatever sits
 * after it moves with it instead of jumping.
 */
function Roll({ value, className }: { value: string; className?: string }) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [items, setItems] = useState([{ text: value, key: 0, out: false }]);

  useLayoutEffect(() => {
    if (measureRef.current) setWidth(measureRef.current.offsetWidth);
    setItems((prev) => {
      const last = prev[prev.length - 1];
      if (last.text === value) return prev;
      return [
        { ...last, out: true },
        { text: value, key: last.key + 1, out: false },
      ];
    });
  }, [value]);

  return (
    <span
      className={`fx-roll ${className ?? ''}`}
      style={{ width: width ?? 'auto' }}
    >
      <span ref={measureRef} className="fx-roll-measure" aria-hidden>
        {value}
      </span>
      {items.map((item) => (
        <span
          key={item.key}
          className="fx-roll-item"
          data-out={item.out || undefined}
          data-in={item.key > 0 && !item.out ? '' : undefined}
          onAnimationEnd={() => {
            if (item.out)
              setItems((prev) => prev.filter((p) => p.key !== item.key));
          }}
        >
          {item.text}
        </span>
      ))}
    </span>
  );
}

function StatusDot({ svc }: { svc: Svc }) {
  return (
    <span className="fx-hx-dot" data-tone={svc === 'running' ? 'green' : ''} />
  );
}

interface NodeProps {
  svc: Svc;
  icon: ReactNode;
  name: string;
  sub: string;
  pending: string;
  style: React.CSSProperties;
  nodeRef?: React.Ref<HTMLDivElement>;
  children?: ReactNode;
}

function ServiceNode({
  svc,
  icon,
  name,
  sub,
  pending,
  style,
  nodeRef,
  children,
}: NodeProps) {
  return (
    <div
      ref={nodeRef}
      className="fx-node fx-hx-node"
      data-in={svc !== 'off' || undefined}
      style={style}
    >
      <div className="fx-node-head">
        {icon}
        <span>
          <div className="fx-node-title">{name}</div>
          <div className="fx-node-sub">{sub}</div>
        </span>
      </div>
      <div className="fx-node-status">
        <StatusDot svc={svc} />
        <Roll value={svc === 'running' ? 'Running' : pending} />
      </div>
      {children}
    </div>
  );
}

// Canvas layout: the web service centered over its two databases, and the
// live preview docked in the lower right once the app is up.
const NODE_W = 200;
const NODE_GAP = 48;
const DB_LEFT = (CANVAS_W - NODE_W * 2 - NODE_GAP) / 2;
const WEB_POS = { left: (CANVAS_W - NODE_W) / 2, top: 56 };
const PG_POS = { left: DB_LEFT, top: 280 };
const REDIS_POS = { left: DB_LEFT + NODE_W + NODE_GAP, top: 280 };
const PREVIEW = { width: 280, height: 184 };
const ADD_TOP = CANVAS_H - GUTTER - 28;

const ENV = [
  { key: 'DATABASE_URL', x: PG_POS.left + NODE_W / 2 },
  { key: 'REDIS_URL', x: REDIS_POS.left + NODE_W / 2 },
];

const SLOTS = ['09:00', '10:30', '14:00'];

/** The deployed app, as its visitors see it. */
function LivePreview({ shown }: { shown: boolean }) {
  return (
    <div
      className="fx-float fx-hx-preview"
      data-in={shown || undefined}
      style={{
        right: GUTTER,
        bottom: GUTTER,
        width: PREVIEW.width,
        height: PREVIEW.height,
      }}
    >
      <div className="fx-hx-preview-bar">
        <span className="fx-hx-preview-nav">
          <ChevronLeft size={12} strokeWidth={2} />
          <ChevronRight size={12} strokeWidth={2} />
        </span>
        <span className="fx-hx-preview-url">
          <Lock size={9} strokeWidth={2.4} />
          {URL_TEXT}
        </span>
        <RotateCw size={11} strokeWidth={2} color="#909090" />
      </div>
      <div className="fx-hx-preview-body">
        <div className="fx-strong" style={{ fontSize: 13 }}>
          Book a session
        </div>
        <div className="fx-faint" style={{ fontSize: 11, marginTop: 2 }}>
          Thu, Nov 12
        </div>
        <div className="fx-hx-slots">
          {SLOTS.map((slot) => (
            <span
              key={slot}
              className="fx-hx-slot"
              data-selected={slot === '10:30' || undefined}
            >
              {slot}
            </span>
          ))}
        </div>
        <span className="fx-hx-book">Confirm booking</span>
      </div>
    </div>
  );
}

export function HeroApp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<DemoState>(INITIAL);
  const [edges, setEdges] = useState<{ paths: string[]; labelY: number }>({
    paths: [],
    labelY: 0,
  });

  // The story plays once, the first time the shot is on screen, then holds.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState(POSTER);
      return;
    }

    let cancelled = false;
    const set = (patch: Partial<DemoState>) =>
      !cancelled && setState((s) => ({ ...s, ...patch }));

    const play = async () => {
      await wait(600);
      // Beat 1: the request is typed and sent.
      for (let i = 1; i <= PROMPT.length && !cancelled; i++) {
        set({ typed: i });
        await wait(PROMPT[i - 1] === ' ' ? 60 : 28 + Math.random() * 22);
      }
      await wait(380);
      set({ pressed: true });
      await wait(140);
      set({ pressed: false, sent: true, typed: 0 });
      await wait(420);
      // Beat 2: the agent thinks, then streams its plan.
      set({ thinking: true });
      await wait(1100);
      set({ thinking: false });
      for (let i = 1; i <= REPLY_WORDS.length && !cancelled; i++) {
        set({ words: i });
        await wait(55);
      }
      await wait(450);
      // Beat 3: the services arrive on the canvas.
      set({ phase: 'canvas' });
      await wait(250);
      set({ web: 'pending' });
      await wait(90);
      set({ pg: 'pending' });
      await wait(90);
      set({ redis: 'pending' });
      await wait(900);
      set({ webStep: 1 });
      await wait(500);
      // They get wired; each connector names what it injects.
      set({ wired: true });
      await wait(450);
      set({ webStep: 2 });
      await wait(450);
      set({ env: true });
      await wait(500);
      set({ pg: 'running' });
      await wait(70);
      set({ redis: 'running' });
      await wait(900);
      // Beat 4, the payoff: the app is live, and here it is.
      set({ web: 'running', live: true });
      await wait(650);
      set({ preview: true });
      await wait(1000);
      set({ signoff: true });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        play();
      },
      { threshold: 0.35 },
    );
    io.observe(root);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  // Connector paths from the web service's foot to each database's head.
  useLayoutEffect(() => {
    const web = webRef.current;
    if (!web) return;
    const x = web.offsetLeft + web.offsetWidth / 2;
    const y0 = web.offsetTop + web.offsetHeight;
    const y1 = PG_POS.top;
    const mid = Math.round((y0 + y1) / 2);
    const r = 10;
    const branch = (to: number) => {
      const dir = to < x ? -1 : 1;
      return `M${x} ${y0} V${mid - r} Q${x} ${mid} ${x + dir * r} ${mid} H${to - dir * r} Q${to} ${mid} ${to} ${mid + r} V${y1}`;
    };
    setEdges({
      paths: ENV.map((env) => branch(env.x)),
      labelY: Math.round((mid + y1) / 2),
    });
  }, []);

  const typing = state.typed > 0;
  const badge = state.live
    ? { tone: 'green', text: 'Live' }
    : state.web !== 'off'
      ? { tone: 'amber', text: 'Deploying' }
      : { tone: undefined, text: 'No services' };

  return (
    <div
      ref={rootRef}
      className="fx fx-hx"
      data-phase={state.phase}
      style={{ position: 'absolute', inset: 0 }}
    >
      <div
        className="fx-window"
        style={{
          left: WIN.left,
          top: WIN.top,
          width: WIN.width,
          height: WIN.height,
        }}
      >
        <aside className="fx-sidebar" style={{ width: SIDEBAR_W }}>
          <div className="fx-traffic" style={{ paddingLeft: 4, paddingTop: 2 }}>
            <i />
            <i />
            <i />
          </div>
          <div className="fx-ws">
            <span className="fx-avatar">A</span>
            <span
              style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
            >
              <span className="fx-strong" style={{ fontSize: 12.5 }}>
                Acme Inc
              </span>
              <span
                className="fx-faint"
                style={{ fontSize: 11, whiteSpace: 'nowrap' }}
              >
                Free plan · 1 member
              </span>
            </span>
            <ChevronsUpDown
              size={13}
              strokeWidth={1.75}
              color="#909090"
              style={{ marginLeft: 'auto' }}
            />
          </div>
          <div className="fx-nav-item">
            <Plus {...ICON} />
            New project
          </div>
          <div className="fx-nav-item">
            <LayoutGrid {...ICON} />
            All projects
          </div>
          <div className="fx-nav-item">
            <Search {...ICON} />
            Search
          </div>
          <div className="fx-nav-label">Recent</div>
          <div className="fx-nav-item" data-active="">
            <span
              className="fx-dot fx-hx-recent-dot"
              data-tone={
                state.live ? undefined : state.web !== 'off' ? 'amber' : 'gray'
              }
            />
            bookings
          </div>
          <div className="fx-nav-item">
            <span className="fx-dot" />
            storefront
          </div>
          <div className="fx-nav-item">
            <span className="fx-dot" />
            quote-deck
          </div>
          <div className="fx-nav-item">
            <span className="fx-dot" data-tone="amber" />
            new-api
          </div>
          <div className="fx-nav-item" style={{ marginTop: 'auto' }}>
            <Settings {...ICON} />
            Settings
          </div>
        </aside>

        <main className="fx-hx-main">
          <div className="fx-hx-topbar" style={{ height: TOPBAR }}>
            <span
              className="fx-strong"
              style={{
                fontSize: 12.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              bookings
              <ChevronDown size={12} strokeWidth={1.75} color="#909090" />
            </span>
            <span className="fx-badge fx-hx-badge" data-tone={badge.tone}>
              <span className="fx-hx-dot" />
              <Roll value={badge.text} />
            </span>
            <span className="fx-hx-tools">
              <LineChart size={14} strokeWidth={1.75} />
              <ListTree size={14} strokeWidth={1.75} />
              <Settings size={14} strokeWidth={1.75} />
            </span>
          </div>

          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            {/* Chat. Every line is laid out from the start and fades in. */}
            <div
              className="fx-hx-chat"
              style={{ width: CHAT_W, paddingBottom: 20 }}
            >
              <div className="fx-hx-thread">
                <div className="fx-faint">{GREETING}</div>
                <div
                  className="fx-hx-bubble fx-hx-in"
                  data-in={state.sent || undefined}
                >
                  {PROMPT}
                </div>
                <div className="fx-hx-reply">
                  <span
                    className="fx-hx-thinking"
                    data-in={state.thinking || undefined}
                  >
                    Thinking
                  </span>
                  {REPLY_WORDS.map((word, i) => (
                    <span
                      key={i}
                      className="fx-hx-word"
                      data-in={i < state.words || undefined}
                    >
                      {word}{' '}
                    </span>
                  ))}
                </div>
                <div className="fx-hx-in" data-in={state.signoff || undefined}>
                  <span className="fx-strong">{URL_TEXT}</span> is live. I’ll
                  keep watching its logs and metrics.
                </div>
              </div>
              <div className="fx-composer fx-hx-composer">
                <div
                  className="fx-composer-text"
                  data-filled={typing || undefined}
                >
                  {typing ? PROMPT.slice(0, state.typed) : 'Ask Sealos…'}
                  {typing ? <span className="fx-caret" /> : null}
                </div>
                <div className="fx-composer-row">
                  <span className="fx-icon-btn">
                    <Plus strokeWidth={1.75} />
                  </span>
                  <span
                    className="fx-send"
                    data-pressed={state.pressed || undefined}
                  >
                    <ArrowUp strokeWidth={2.2} />
                  </span>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="fx-canvas" style={{ flex: 1 }}>
              <div
                className="fx-hx-empty"
                data-out={state.web !== 'off' || undefined}
              >
                <LayoutGrid size={18} strokeWidth={1.5} />
                Services you deploy show up here
              </div>
              <svg
                className="fx-hx-edges"
                data-in={state.wired || undefined}
                width={CANVAS_W}
                height={CANVAS_H}
                aria-hidden
              >
                {edges.paths.map((d) => (
                  <path key={d} d={d} pathLength={1} />
                ))}
              </svg>
              {ENV.map((env, i) => (
                <span
                  key={env.key}
                  className="fx-mono fx-hx-env-tag"
                  data-in={state.env || undefined}
                  style={{
                    left: env.x,
                    top: edges.labelY,
                    transitionDelay: state.env ? `${i * 70}ms` : undefined,
                  }}
                >
                  {env.key}
                </span>
              ))}
              <ServiceNode
                nodeRef={webRef}
                svc={state.web}
                icon={<NextMark size={30} />}
                name="bookings"
                sub="Next.js · ./bookings"
                pending={WEB_STEPS[state.webStep]}
                style={{ ...WEB_POS, width: NODE_W }}
              >
                <div
                  className="fx-node-foot fx-hx-url"
                  data-live={state.live || undefined}
                >
                  <Globe size={12} strokeWidth={1.75} />
                  <Roll
                    value={state.live ? URL_TEXT : 'Public URL after deploy'}
                  />
                  <ArrowUpRight
                    className="fx-hx-open"
                    size={12}
                    strokeWidth={1.75}
                  />
                </div>
              </ServiceNode>
              <ServiceNode
                svc={state.pg}
                icon={
                  <span className="fx-logo">
                    <img src="/icons/postgresql.svg" alt="" />
                  </span>
                }
                name="bookings-pg"
                sub="PostgreSQL 16"
                pending="Creating"
                style={{ ...PG_POS, width: NODE_W }}
              />
              <ServiceNode
                svc={state.redis}
                icon={
                  <span className="fx-logo">
                    <img src="/icons/redis.svg" alt="" />
                  </span>
                }
                name="bookings-redis"
                sub="Redis 7"
                pending="Creating"
                style={{ ...REDIS_POS, width: NODE_W }}
              />
              <span
                className="fx-light-btn"
                style={{ position: 'absolute', left: DB_LEFT, top: ADD_TOP }}
              >
                <Plus strokeWidth={1.75} /> Add service
              </span>
              <LivePreview shown={state.preview} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

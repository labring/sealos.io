'use client';

import {
  Archive,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Globe,
  LayoutGrid,
  LineChart,
  LoaderCircle,
  Logs,
  Maximize2,
  Monitor,
  Network,
  Plus,
  Settings,
  SquarePen,
  Waypoints,
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
 * The window is drawn from the Sealos desktop app's own shell (sealox
 * DESIGN.md): the sidebar with its nav and project tree, the
 * session's chat, and the Right pane with its tab bar over an inset canvas.
 * It plays once, the first time the shot comes into view, then holds:
 *
 * 1. Chat. The request is typed into the composer and sent. The agent thinks,
 *    then states its plan.
 * 2. Work. Each step the agent runs is a row in the chat and an event on the
 *    canvas at the same time: the app is detected, both databases are
 *    created, their URLs are injected along the connectors, the app deploys.
 * 3. Payoff. The app gets its URL, the workbench dot turns green, and the
 *    agent signs off with the address.
 *
 * Every line of the thread is laid out from the first frame and only fades
 * in, so nothing above or below it ever moves. Phones see a crop that starts
 * on the chat and pans once to the canvas when the work starts.
 *
 * Framing: the window sits whole inside its panel, 110px from each side and
 * 56px from the top and bottom of the 1296 × 764 stage, like the ship
 * section's window.
 */

const PROMPT = 'Deploy ./bookings with a Postgres and Redis';
const REPLY =
  'A Next.js app with Prisma and a session store. I’ll build it, add both databases and wire them in.';
const REPLY_WORDS = REPLY.split(' ');
const URL_TEXT = 'bookings.sealos.run';
const WEB_STEPS = ['Detecting Next.js', 'Building image', 'Deploying'];

// Stage geometry, in design pixels.
const WIN = { left: 110, top: 56, width: 1076, height: 652 };
const SIDEBAR_W = 216;
const CHAT_W = 348;
const TOPBAR = 44;
const SEAM = 12;
const INSET = 8;
const CANVAS_W = WIN.width - SIDEBAR_W - CHAT_W - SEAM - INSET;
const CANVAS_H = WIN.height - TOPBAR - INSET;

type Svc = 'off' | 'pending' | 'running';
type Step = 'off' | 'run' | 'done';
type Phase = 'chat' | 'canvas';

/**
 * The agent's steps, each tied to what it changes on the canvas. The verb
 * rolls from running to done; `took` arrives with the check.
 */
interface StepSpec {
  running: string;
  done: string;
  object: ReactNode;
  took?: string;
}

const STEPS: StepSpec[] = [
  { running: 'Detecting', done: 'Detected', object: 'Next.js 14 · Prisma' },
  {
    running: 'Creating',
    done: 'Created',
    object: 'bookings-pg · PostgreSQL 16',
  },
  { running: 'Creating', done: 'Created', object: 'bookings-redis · Redis 7' },
  {
    running: 'Injecting',
    done: 'Injected',
    object: (
      <>
        <span className="fx-mono">DATABASE_URL</span>,{' '}
        <span className="fx-mono">REDIS_URL</span>
      </>
    ),
  },
  { running: 'Deploying', done: 'Deployed', object: 'bookings', took: '41s' },
];

interface DemoState {
  phase: Phase;
  typed: number;
  pressed: boolean;
  sent: boolean;
  thinking: boolean;
  thought: boolean;
  /** Words of the reply on screen. */
  words: number;
  steps: Step[];
  web: Svc;
  /** Index into WEB_STEPS while the web service builds. */
  webStep: number;
  pg: Svc;
  redis: Svc;
  wired: boolean;
  env: boolean;
  live: boolean;
  signoff: boolean;
}

const INITIAL: DemoState = {
  phase: 'chat',
  typed: 0,
  pressed: false,
  sent: false,
  thinking: false,
  thought: false,
  words: 0,
  steps: STEPS.map(() => 'off'),
  web: 'off',
  webStep: 0,
  pg: 'off',
  redis: 'off',
  wired: false,
  env: false,
  live: false,
  signoff: false,
};

/** The payoff, and the frame the story stops on. Reduced motion starts here. */
const POSTER: DemoState = {
  phase: 'canvas',
  typed: 0,
  pressed: false,
  sent: true,
  thinking: false,
  thought: true,
  words: REPLY_WORDS.length,
  steps: STEPS.map(() => 'done'),
  web: 'running',
  webStep: WEB_STEPS.length - 1,
  pg: 'running',
  redis: 'running',
  wired: true,
  env: true,
  live: true,
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

/** A project's letter tile, the app's fallback logo. */
function LetterLogo({ letter, color }: { letter: string; color: string }) {
  return (
    <span className="fx-hx-letter" style={{ background: color }}>
      {letter}
    </span>
  );
}

interface NodeProps {
  svc: Svc;
  logo: ReactNode;
  name: string;
  reference: string;
  pending: string;
  style: React.CSSProperties;
  nodeRef?: React.Ref<HTMLDivElement>;
  children?: ReactNode;
}

/** A Canvas node: white, no outline, logo, name, reference and status. */
function ServiceNode({
  svc,
  logo,
  name,
  reference,
  pending,
  style,
  nodeRef,
  children,
}: NodeProps) {
  return (
    <div
      ref={nodeRef}
      className="fx-hx-node"
      data-in={svc !== 'off' || undefined}
      style={style}
    >
      <div className="fx-hx-node-body">
        <div className="fx-hx-node-head">
          {logo}
          <span style={{ minWidth: 0 }}>
            <div className="fx-hx-node-name">{name}</div>
            <div className="fx-mono fx-hx-node-ref">{reference}</div>
          </span>
        </div>
        <div className="fx-hx-status">
          <span
            className="fx-hx-dot"
            data-tone={svc === 'running' ? 'green' : 'amber'}
          />
          <Roll value={svc === 'running' ? 'Running' : pending} />
        </div>
      </div>
      {children}
    </div>
  );
}

// Canvas layout: the web service over its two databases, the group centered
// in the canvas above the Add service pill.
const NODE_W = 200;
const NODE_GAP = 36;
const WEB_W = 224;
const DB_LEFT = (CANVAS_W - NODE_W * 2 - NODE_GAP) / 2;
const WEB_POS = { left: (CANVAS_W - WEB_W) / 2, top: 96 };
const DB_TOP = 316;
const PG_POS = { left: DB_LEFT, top: DB_TOP };
const REDIS_POS = { left: DB_LEFT + NODE_W + NODE_GAP, top: DB_TOP };

const ENV = [
  { key: 'DATABASE_URL', x: PG_POS.left + NODE_W / 2 },
  { key: 'REDIS_URL', x: REDIS_POS.left + NODE_W / 2 },
];

/** One step the agent ran: a spinner while it runs, a check once done. */
function StepRow({ step, spec }: { step: Step; spec: StepSpec }) {
  const done = step === 'done';
  return (
    <div className="fx-hx-step" data-in={step !== 'off' || undefined}>
      <span className="fx-hx-step-mark" data-state={step}>
        <LoaderCircle className="fx-hx-spin" size={13} strokeWidth={2} />
        <Check className="fx-hx-check" size={13} strokeWidth={2} />
      </span>
      <Roll
        className="fx-hx-step-verb"
        value={done ? spec.done : spec.running}
      />
      <span className="fx-hx-step-object">
        {spec.object}
        {spec.took ? (
          <span className="fx-hx-step-took" data-in={done || undefined}>
            {' · '}
            {spec.took}
          </span>
        ) : null}
      </span>
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
    const step = (i: number, value: Step) =>
      !cancelled &&
      setState((s) => ({
        ...s,
        steps: s.steps.map((v, j) => (j === i ? value : v)),
      }));

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
      // The agent thinks, then states its plan.
      set({ thinking: true });
      await wait(1300);
      set({ thinking: false, thought: true });
      await wait(200);
      for (let i = 1; i <= REPLY_WORDS.length && !cancelled; i++) {
        set({ words: i });
        await wait(50);
      }
      await wait(400);
      // Beat 2: each step lands in the chat and on the canvas together.
      set({ phase: 'canvas' });
      step(0, 'run');
      set({ web: 'pending' });
      await wait(900);
      step(0, 'done');
      set({ webStep: 1 });
      step(1, 'run');
      set({ pg: 'pending' });
      await wait(140);
      step(2, 'run');
      set({ redis: 'pending' });
      await wait(1000);
      step(1, 'done');
      set({ pg: 'running' });
      await wait(160);
      step(2, 'done');
      set({ redis: 'running' });
      await wait(350);
      step(3, 'run');
      set({ wired: true });
      await wait(550);
      set({ env: true });
      await wait(450);
      step(3, 'done');
      step(4, 'run');
      set({ webStep: 2 });
      await wait(1100);
      // Beat 3, the payoff: the app is live, and here it is.
      step(4, 'done');
      set({ web: 'running', live: true });
      await wait(900);
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
    const y1 = DB_TOP;
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
  const working = state.sent && !state.signoff;
  const project = state.live
    ? 'live'
    : state.web !== 'off'
      ? 'deploying'
      : 'idle';

  return (
    <div
      ref={rootRef}
      className="fx fx-hx"
      data-phase={state.phase}
      style={{ position: 'absolute', inset: 0 }}
    >
      <div
        className="fx-window fx-hx-window"
        style={{
          left: WIN.left,
          top: WIN.top,
          width: WIN.width,
          height: WIN.height,
        }}
      >
        {/* Sidebar */}
        <aside className="fx-hx-sidebar" style={{ width: SIDEBAR_W }}>
          <div className="fx-traffic fx-hx-traffic" style={{ height: TOPBAR }}>
            <i />
            <i />
            <i />
          </div>
          <div className="fx-hx-nav">
            <SquarePen {...ICON} />
            New task
          </div>
          <div className="fx-hx-nav">
            <LayoutGrid {...ICON} />
            All projects
          </div>
          <div className="fx-hx-nav">
            <Archive {...ICON} />
            Buckets
          </div>
          <div className="fx-hx-nav">
            <Waypoints {...ICON} />
            AI Gateway
          </div>

          <div className="fx-hx-section">Projects</div>
          <div className="fx-hx-project">
            <NextMark size={16} />
            bookings
          </div>
          <div className="fx-hx-session" data-active="">
            <span className="fx-hx-session-mark" data-working={working || undefined}>
              <i />
              <LoaderCircle className="fx-hx-spin" size={12} strokeWidth={2} />
            </span>
            <span className="fx-hx-ellipsis">Deploy with Postgres and Redis</span>
          </div>
          <div className="fx-hx-session">
            <span className="fx-hx-session-mark">
              <i />
            </span>
            <span className="fx-hx-ellipsis">Add booking reminders</span>
          </div>
          <div className="fx-hx-project">
            <LetterLogo letter="S" color="#00847F" />
            storefront
          </div>
          <div className="fx-hx-project">
            <LetterLogo letter="Q" color="#B4436C" />
            quote-deck
          </div>
          <div className="fx-hx-project">
            <LetterLogo letter="N" color="#2B6CB0" />
            new-api
          </div>
          <div className="fx-hx-project">
            <LetterLogo letter="A" color="#7A6AA8" />
            analytics
          </div>
          <div className="fx-hx-project">
            <LetterLogo letter="D" color="#6B7A2A" />
            docs-site
          </div>
          <div className="fx-hx-project">
            <LetterLogo letter="I" color="#56657A" />
            image-worker
          </div>

          <div className="fx-hx-account">
            <span className="fx-hx-avatar">J</span>
            Jordan Lee
            <ChevronsUpDown size={13} strokeWidth={1.75} />
          </div>
        </aside>

        {/* Session: chat on the left, the Right pane on the right. */}
        <main className="fx-hx-main">
          <div className="fx-hx-topbar" style={{ height: TOPBAR }}>
            <div className="fx-hx-title" style={{ width: CHAT_W }}>
              Deploy with Postgres and Redis
            </div>
            <div className="fx-hx-tabs">
              <span className="fx-hx-tab" data-active="">
                <Network size={14} strokeWidth={1.75} />
                Architecture
              </span>
              <span className="fx-hx-tab">
                <LineChart size={14} strokeWidth={1.75} />
              </span>
              <span className="fx-hx-tab">
                <Logs size={14} strokeWidth={1.75} />
              </span>
              <span className="fx-hx-tab">
                <Settings size={14} strokeWidth={1.75} />
              </span>
              <span className="fx-hx-tab-rule" />
              <span className="fx-hx-tab">
                <Plus size={14} strokeWidth={1.75} />
              </span>
              <span className="fx-hx-tab" style={{ marginLeft: 'auto' }}>
                <Maximize2 size={14} strokeWidth={1.75} />
              </span>
              <span className="fx-hx-tab fx-hx-pane-toggle">
                <Monitor size={15} strokeWidth={1.75} />
                <span className="fx-hx-pane-dot" data-state={project} />
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            {/* Chat. Every line is laid out from the start and fades in. */}
            <div className="fx-hx-chat" style={{ width: CHAT_W }}>
              <div className="fx-hx-thread">
                <div
                  className="fx-hx-bubble fx-hx-in"
                  data-in={state.sent || undefined}
                >
                  {PROMPT}
                </div>
                <div className="fx-hx-turn">
                  <div
                    className="fx-hx-thought fx-hx-in"
                    data-in={state.thinking || state.thought || undefined}
                    data-thinking={state.thinking || undefined}
                  >
                    <Roll
                      value={
                        state.thought ? 'Thought for 3 seconds' : 'Thinking'
                      }
                    />
                    <ChevronRight size={12} strokeWidth={1.75} />
                  </div>
                  <div className="fx-hx-reply">
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
                  <div className="fx-hx-steps">
                    {STEPS.map((s, i) => (
                      <StepRow key={i} step={state.steps[i]} spec={s} />
                    ))}
                  </div>
                  <div
                    className="fx-hx-reply fx-hx-in"
                    data-in={state.signoff || undefined}
                  >
                    Live at <span className="fx-strong">{URL_TEXT}</span>.
                    I’ll keep watching its logs and metrics.
                  </div>
                </div>
              </div>
              <div className="fx-hx-composer">
                <div
                  className="fx-hx-composer-text"
                  data-filled={typing || undefined}
                >
                  {typing
                    ? PROMPT.slice(0, state.typed)
                    : 'Ask Sealos Agent anything…'}
                  {typing ? <span className="fx-caret" /> : null}
                </div>
                <div className="fx-hx-composer-row">
                  <span className="fx-hx-ghost">
                    <Plus size={15} strokeWidth={1.75} />
                  </span>
                  <span className="fx-hx-picker">
                    Default
                    <ChevronDown size={12} strokeWidth={1.75} />
                  </span>
                  <span
                    className="fx-send fx-hx-send"
                    data-pressed={state.pressed || undefined}
                  >
                    <ArrowUp strokeWidth={2.2} />
                  </span>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div
              className="fx-hx-canvas"
              style={{ width: CANVAS_W, height: CANVAS_H }}
            >
              <div
                className="fx-hx-empty"
                data-out={state.web !== 'off' || undefined}
              >
                <Network size={18} strokeWidth={1.5} />
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
                logo={<NextMark size={24} />}
                name="bookings"
                reference="./bookings"
                pending={WEB_STEPS[state.webStep]}
                style={{ ...WEB_POS, width: WEB_W }}
              >
                <div
                  className="fx-hx-url"
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
                logo={
                  <img
                    className="fx-hx-node-logo"
                    src="/icons/postgresql.svg"
                    alt=""
                  />
                }
                name="bookings-pg"
                reference="postgres:16"
                pending="Creating"
                style={{ ...PG_POS, width: NODE_W }}
              />
              <ServiceNode
                svc={state.redis}
                logo={
                  <img
                    className="fx-hx-node-logo"
                    src="/icons/redis.svg"
                    alt=""
                  />
                }
                name="bookings-redis"
                reference="redis:7"
                pending="Creating"
                style={{ ...REDIS_POS, width: NODE_W }}
              />
              <span className="fx-hx-add">
                <Plus size={13} strokeWidth={1.75} /> Add service
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Database,
  Github,
  Globe,
  LayoutGrid,
  LineChart,
  ListTree,
  Plus,
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
 * Beats: the request is typed on the "Deploy something new" screen and sent;
 * the window turns into the new project, chat on the left and the canvas on
 * the right; the web service and its two databases drop onto the canvas, get
 * wired together, roll to Running, and the web service gets its public URL;
 * the agent signs off. A press on "New project" brings the start screen back.
 *
 * Framing: the window sits whole inside its panel with the same insets as the
 * ship section's window on the same 1296 × 764 stage: 110px from each side,
 * 56px from the top and bottom.
 */

const PROMPT = 'Deploy ./bookings with a Postgres and Redis';
const REPLY =
  'A Next.js app with Prisma and a session store. I’ll build it, add both databases and wire them in.';
const STATUS = [
  'Building image',
  'Creating databases',
  'Wiring connections',
  'Publishing',
  'Deployed',
];
const URL_TEXT = 'bookings.sealos.run';

// Stage geometry, in design pixels.
const WIN = { left: 110, top: 56, width: 1076, height: 652 };
/** How much of the window the stage shows. */
const VISIBLE = WIN.height;
const GUTTER = 24;
const TOPBAR = 44;
const CHAT_W = 320;

type View = 'home' | 'project';
type Svc = 'off' | 'pending' | 'running';

interface DemoState {
  view: View;
  typed: number;
  pressed: boolean;
  navActive: boolean;
  navPressed: boolean;
  reply: boolean;
  /** Index into STATUS; -1 before the deploy starts. */
  step: number;
  web: Svc;
  pg: Svc;
  redis: Svc;
  wired: boolean;
  live: boolean;
  signoff: boolean;
}

const INITIAL: DemoState = {
  view: 'home',
  typed: 0,
  pressed: false,
  navActive: true,
  navPressed: false,
  reply: false,
  step: -1,
  web: 'off',
  pg: 'off',
  redis: 'off',
  wired: false,
  live: false,
  signoff: false,
};

/** The payoff: shown under reduced motion, and the frame that tells it all. */
const POSTER: DemoState = {
  ...INITIAL,
  view: 'project',
  navActive: false,
  reply: true,
  step: STATUS.length - 1,
  web: 'running',
  pg: 'running',
  redis: 'running',
  wired: true,
  live: true,
  signoff: true,
};

/** Resets everything the project view added, while it is hidden. */
const PROJECT_RESET: Partial<DemoState> = {
  reply: false,
  step: -1,
  web: 'off',
  pg: 'off',
  redis: 'off',
  wired: false,
  live: false,
  signoff: false,
};

const ICON = { size: 15, strokeWidth: 1.75 } as const;

function DockerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden>
      <path
        fill="#1D91E6"
        d="M13.98 11.08h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19h-2.12a.19.19 0 0 0-.19.19v1.88c0 .1.08.19.19.19m-2.95-5.43h2.12a.19.19 0 0 0 .19-.19V3.57a.19.19 0 0 0-.19-.19h-2.12a.19.19 0 0 0-.19.19v1.89c0 .1.09.19.19.19m0 2.71h2.12a.19.19 0 0 0 .19-.19V6.29a.19.19 0 0 0-.19-.19h-2.12a.19.19 0 0 0-.19.19v1.88c0 .11.09.19.19.19m-2.93 0h2.12a.19.19 0 0 0 .19-.19V6.29a.19.19 0 0 0-.19-.19H8.1a.19.19 0 0 0-.19.19v1.88c0 .11.08.19.19.19m-2.96 0h2.12a.19.19 0 0 0 .19-.19V6.29a.19.19 0 0 0-.19-.19H5.14a.19.19 0 0 0-.19.19v1.88c0 .11.09.19.19.19m5.89 2.72h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19h-2.12a.19.19 0 0 0-.19.19v1.88c0 .1.09.19.19.19m-2.93 0h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19H8.1a.19.19 0 0 0-.19.19v1.88c0 .1.08.19.19.19m-2.96 0h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19H5.14a.19.19 0 0 0-.19.19v1.88c0 .1.09.19.19.19m-2.92 0h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19H2.22a.19.19 0 0 0-.19.19v1.88c0 .1.08.19.19.19m21.54-1.19c-.06-.05-.67-.51-1.95-.51-.34 0-.68.03-1.01.09-.25-1.7-1.65-2.53-1.71-2.56l-.34-.2-.23.33a4.6 4.6 0 0 0-.61 1.43c-.23.97-.09 1.88.4 2.66-.59.33-1.55.41-1.74.42H.75a.75.75 0 0 0-.75.75 11.4 11.4 0 0 0 .7 4.06c.55 1.44 1.37 2.5 2.43 3.15 1.19.73 3.13 1.15 5.33 1.15.99 0 1.98-.09 2.96-.27a12.24 12.24 0 0 0 3.87-1.4 10.66 10.66 0 0 0 2.64-2.16c1.27-1.44 2.03-3.04 2.59-4.46h.22c1.39 0 2.25-.56 2.72-1.02.31-.3.56-.66.71-1.07l.1-.29-.24-.18Z"
      />
    </svg>
  );
}

const METHODS = [
  {
    icon: <DockerIcon />,
    title: 'Local project',
    body: 'Any folder on your machine',
  },
  {
    icon: <Github size={17} strokeWidth={1.75} />,
    title: 'GitHub repo',
    body: 'Build and deploy from source',
  },
  {
    icon: <Database size={17} strokeWidth={1.75} color="#0FA3B1" />,
    title: 'Database',
    body: 'Postgres, Redis, MySQL, Mongo',
  },
  {
    icon: <LayoutGrid size={17} strokeWidth={1.75} color="#7A3FE4" />,
    title: 'Template',
    body: 'One-click apps from the library',
  },
];

const TEMPLATES = [
  { name: 'Dify', icon: '/images/apps/dify.svg', desc: 'LLM app platform' },
  { name: 'n8n', icon: '/images/apps/n8n.svg', desc: 'Workflow automation' },
  {
    name: 'New API',
    icon: '/images/apps/new-api.png',
    desc: 'AI model gateway',
  },
  {
    name: 'WordPress',
    icon: '/images/apps/wordpress.svg',
    desc: 'Sites and blogs',
  },
];

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

// Canvas layout: the web service centered over its two databases.
const NODE_W = 200;
const CANVAS_W = WIN.width - 208 - CHAT_W;
const NODE_GAP = 48;
const DB_LEFT = (CANVAS_W - NODE_W * 2 - NODE_GAP) / 2;
const WEB_POS = { left: (CANVAS_W - NODE_W) / 2, top: 104 };
const PG_POS = { left: DB_LEFT, top: 360 };
const REDIS_POS = { left: DB_LEFT + NODE_W + NODE_GAP, top: 360 };

const ENV = [
  {
    key: 'DATABASE_URL',
    target: 'bookings-pg',
    icon: '/icons/postgresql.svg',
  },
  { key: 'REDIS_URL', target: 'bookings-redis', icon: '/icons/redis.svg' },
];

export function HeroApp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<DemoState>(INITIAL);
  const [edges, setEdges] = useState<string[]>([]);
  const visibleRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState(POSTER);
      return;
    }

    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );
    io.observe(root);

    const until = async () => {
      while (!cancelled && (!visibleRef.current || document.hidden)) {
        await wait(250);
      }
    };
    const set = (patch: Partial<DemoState>) =>
      !cancelled && setState((s) => ({ ...s, ...patch }));

    const run = async () => {
      while (!cancelled) {
        await until();
        await wait(700);
        // Beat 1: the request is typed on the start screen and sent.
        for (let i = 1; i <= PROMPT.length && !cancelled; i++) {
          set({ typed: i });
          await wait(PROMPT[i - 1] === ' ' ? 70 : 34 + Math.random() * 26);
        }
        await wait(450);
        set({ pressed: true });
        await wait(150);
        set({ pressed: false });
        await wait(110);
        // Beat 2: the window becomes the new project; the agent answers.
        set({ view: 'project', navActive: false });
        await wait(380);
        set({ typed: 0 });
        await wait(220);
        set({ reply: true });
        await wait(700);
        // Beat 3: the services land on the canvas and get wired together.
        set({ step: 0, web: 'pending' });
        await wait(1300);
        set({ step: 1, pg: 'pending' });
        await wait(120);
        set({ redis: 'pending' });
        await wait(1000);
        set({ step: 2, wired: true });
        await wait(1100);
        set({ pg: 'running' });
        await wait(90);
        set({ redis: 'running' });
        await wait(600);
        set({ step: 3 });
        await wait(1100);
        // Beat 4, the payoff: the app is live at its URL.
        set({ step: 4, web: 'running', live: true });
        await wait(700);
        set({ signoff: true });
        await wait(3200);
        await until();
        // Reset with a cause: "New project" is pressed.
        set({ navPressed: true });
        await wait(160);
        set({ navPressed: false, navActive: true, view: 'home' });
        await wait(420);
        set(PROJECT_RESET);
        await wait(600);
      }
    };
    run();

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
    const pgX = PG_POS.left + NODE_W / 2;
    const redisX = REDIS_POS.left + NODE_W / 2;
    const r = 10;
    const branch = (to: number) => {
      const dir = to < x ? -1 : 1;
      return `M${x} ${y0} V${mid - r} Q${x} ${mid} ${x + dir * r} ${mid} H${to - dir * r} Q${to} ${mid} ${to} ${mid + r} V${y1}`;
    };
    setEdges([branch(pgX), branch(redisX)]);
  }, []);

  const typedText = PROMPT.slice(0, state.typed);
  // The typed request stays in the composer while the start screen fades out;
  // it is cleared once hidden.
  const typing = state.typed > 0;
  const caret = typing && state.view === 'home';
  const finished = state.step >= STATUS.length - 1;

  return (
    <div
      ref={rootRef}
      className="fx fx-hx"
      data-view={state.view}
      data-step={state.step}
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
        <aside className="fx-sidebar" style={{ width: 208 }}>
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
          <div
            className="fx-nav-item"
            data-active={state.navActive || undefined}
            data-pressed={state.navPressed || undefined}
          >
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
          <div
            className="fx-nav-item"
            style={{ marginTop: 'auto', marginBottom: WIN.height - VISIBLE }}
          >
            <Settings {...ICON} />
            Settings
          </div>
        </aside>

        <main className="fx-hx-main">
          {/* Start screen */}
          <div
            className="fx-hx-page"
            data-shown={state.view === 'home' || undefined}
            style={{ height: VISIBLE }}
          >
            <div className="fx-hx-home">
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Deploy something new
                </div>
                <div
                  className="fx-muted"
                  style={{ marginTop: 6, fontSize: 13 }}
                >
                  Describe it, or pick a method below.
                </div>
              </div>

              <div className="fx-composer">
                <div
                  className="fx-composer-text"
                  data-filled={typing || undefined}
                >
                  {typing ? typedText : 'Describe what you want to deploy…'}
                  {caret ? <span className="fx-caret" /> : null}
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

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 10,
                  marginTop: 24,
                }}
              >
                {METHODS.map((method) => (
                  <div
                    key={method.title}
                    className="fx-card"
                    style={{ padding: '12px 12px 13px', borderRadius: 12 }}
                  >
                    <div
                      style={{
                        height: 22,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {method.icon}
                    </div>
                    <div
                      className="fx-strong"
                      style={{ marginTop: 8, fontSize: 12.5 }}
                    >
                      {method.title}
                    </div>
                    <div
                      className="fx-muted"
                      style={{ marginTop: 3, fontSize: 11.5, lineHeight: 1.35 }}
                    >
                      {method.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fx-hx-tray">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                }}
              >
                <span className="fx-hx-tag" data-active="">
                  All templates
                </span>
                {['AI', 'Database', 'Web', 'Tools'].map((tag) => (
                  <span key={tag} className="fx-hx-tag">
                    {tag}
                  </span>
                ))}
                <span
                  className="fx-muted"
                  style={{
                    marginLeft: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  Browse all <ArrowRight size={12} strokeWidth={1.75} />
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 10,
                  marginTop: 12,
                }}
              >
                {TEMPLATES.map((template) => (
                  <div
                    key={template.name}
                    className="fx-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 11,
                    }}
                  >
                    <span className="fx-logo">
                      <img src={template.icon} alt="" />
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                      }}
                    >
                      <span className="fx-strong" style={{ fontSize: 12.5 }}>
                        {template.name}
                      </span>
                      <span className="fx-faint" style={{ fontSize: 11 }}>
                        {template.desc}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The new project */}
          <div
            className="fx-hx-page"
            data-shown={state.view === 'project' || undefined}
          >
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
              <span
                className="fx-badge fx-hx-badge"
                data-tone={state.live ? 'green' : 'amber'}
              >
                <span className="fx-hx-dot" />
                <Roll value={state.live ? 'Live' : 'Deploying'} />
              </span>
              <span className="fx-hx-tools">
                <LineChart size={14} strokeWidth={1.75} />
                <ListTree size={14} strokeWidth={1.75} />
                <Settings size={14} strokeWidth={1.75} />
              </span>
            </div>

            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
              {/* Chat */}
              <div
                className="fx-hx-chat"
                style={{
                  width: CHAT_W,
                  paddingBottom: 20,
                }}
              >
                <div className="fx-hx-thread">
                  <div className="fx-hx-bubble">{PROMPT}</div>
                  <div className="fx-hx-in" data-in={state.reply || undefined}>
                    {REPLY}
                  </div>
                  <div
                    className="fx-hx-in fx-hx-status"
                    data-in={state.step >= 0 || undefined}
                    data-done={finished || undefined}
                  >
                    <span className="fx-hx-mark">
                      <span className="fx-hx-spin" />
                      <span className="fx-hx-check">
                        <Check strokeWidth={3} />
                      </span>
                    </span>
                    <Roll
                      value={STATUS[Math.max(0, state.step)]}
                      className="fx-strong"
                    />
                    <span
                      className="fx-faint fx-mono"
                      style={{ marginLeft: 'auto' }}
                    >
                      <Roll
                        value={
                          finished
                            ? '1m 12s'
                            : `${Math.max(0, state.step)}/${STATUS.length - 1}`
                        }
                      />
                    </span>
                  </div>
                  <div
                    className="fx-hx-in fx-hx-env"
                    data-in={state.wired || undefined}
                  >
                    {ENV.map((env) => (
                      <div key={env.key} className="fx-hx-env-row">
                        <span className="fx-mono">{env.key}</span>
                        <ArrowRight
                          size={12}
                          strokeWidth={1.75}
                          color="#909090"
                        />
                        <span className="fx-logo" data-size="sm">
                          <img src={env.icon} alt="" />
                        </span>
                        {env.target}
                      </div>
                    ))}
                  </div>
                  <div
                    className="fx-hx-in"
                    data-in={state.signoff || undefined}
                  >
                    <span className="fx-strong">{URL_TEXT}</span> is live. I’ll
                    keep watching its logs and metrics.
                  </div>
                </div>
                <div className="fx-composer fx-hx-composer">
                  <div className="fx-composer-text">Ask about this deploy…</div>
                  <div className="fx-composer-row">
                    <span className="fx-icon-btn">
                      <Plus strokeWidth={1.75} />
                    </span>
                    <span className="fx-send">
                      <ArrowUp strokeWidth={2.2} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="fx-canvas" style={{ flex: 1 }}>
                <svg
                  className="fx-hx-edges"
                  data-in={state.wired || undefined}
                  width={CANVAS_W}
                  height={WIN.height}
                  aria-hidden
                >
                  {edges.map((d) => (
                    <path key={d} d={d} pathLength={1} />
                  ))}
                </svg>
                <ServiceNode
                  nodeRef={webRef}
                  svc={state.web}
                  icon={<NextMark size={30} />}
                  name="bookings"
                  sub="Next.js · ./bookings"
                  pending="Building"
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
                  style={{
                    position: 'absolute',
                    left: DB_LEFT,
                    top: VISIBLE - TOPBAR - GUTTER - 28,
                  }}
                >
                  <Plus strokeWidth={1.75} /> Add service
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronsUpDown,
  Database,
  Github,
  Globe,
  LayoutGrid,
  Plus,
  Rocket,
  Search,
  Settings,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const PROMPT = 'Deploy ./quote-deck and give it a Postgres for leads';

const STEPS = [
  { label: 'Package ./quote-deck', meta: '12 files' },
  { label: 'Provision leads-pg', meta: 'PostgreSQL 16' },
  { label: 'Wire DATABASE_URL', meta: 'private DNS' },
  { label: 'Publish over HTTPS', meta: '8/8 assets' },
];

type Phase = 'idle' | 'typing' | 'sent' | 'running' | 'done' | 'reset';

interface DemoState {
  phase: Phase;
  typed: number;
  step: number;
  pressed: boolean;
}

const INITIAL: DemoState = {
  phase: 'idle',
  typed: 0,
  step: -1,
  pressed: false,
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
 * The hero's product shot. It starts on the empty "Deploy something new"
 * screen from the design; once on screen it types a request, sends it, and
 * shows the deploy plan running to a live URL, then returns to the start.
 */
export function HeroApp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const [dock, setDock] = useState(0);
  const [state, setState] = useState<DemoState>(INITIAL);
  const visibleRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
      await wait(1400);
      while (!cancelled) {
        await until();
        set({ phase: 'typing' });
        for (let i = 1; i <= PROMPT.length && !cancelled; i++) {
          set({ typed: i });
          await wait(PROMPT[i - 1] === ' ' ? 70 : 38 + Math.random() * 30);
        }
        await wait(500);
        set({ pressed: true });
        await wait(160);
        set({ pressed: false, phase: 'sent' });
        await wait(900);
        set({ phase: 'running', step: 0 });
        for (let i = 1; i <= STEPS.length && !cancelled; i++) {
          await wait(i === 2 ? 1300 : 950);
          set({ step: i });
        }
        set({ phase: 'done' });
        await wait(4200);
        await until();
        set({ phase: 'reset' });
        await wait(480);
        set({ ...INITIAL });
        await wait(2400);
      }
    };
    run();

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  const showThread =
    state.phase === 'sent' ||
    state.phase === 'running' ||
    state.phase === 'done';
  // The reset fades the conversation out first, then brings the start back.
  const hideEmpty = showThread || state.phase === 'reset';
  const docked = hideEmpty;
  const finished = state.step >= STEPS.length;

  // Where the composer docks once the conversation starts: just above the
  // visible bottom of the window (the window runs off the stage).
  useEffect(() => {
    const column = columnRef.current;
    const composer = composerRef.current;
    if (!column || !composer) return;
    const visibleBottom = 764 - 56;
    const bottom =
      column.offsetTop + composer.offsetTop + composer.offsetHeight;
    setDock(visibleBottom - 26 - bottom);
  }, []);
  const typedText = PROMPT.slice(0, state.typed);
  const composerText =
    state.phase === 'typing' || (state.phase === 'idle' && state.typed > 0)
      ? typedText
      : '';

  return (
    <div
      ref={rootRef}
      className="fx"
      style={{ position: 'absolute', inset: 0 }}
    >
      <div
        className="fx-window"
        style={{ left: 110, top: 56, width: 1076, height: 768 }}
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
          <div className="fx-nav-item" data-active="">
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
            <span
              className="fx-dot"
              data-tone={state.phase === 'done' ? undefined : 'gray'}
            />
            quote-deck
          </div>
          <div className="fx-nav-item">
            <span className="fx-dot" />
            storefront
          </div>
          <div className="fx-nav-item">
            <span className="fx-dot" data-tone="amber" />
            new-api
          </div>
          <div style={{ marginTop: 'auto' }} className="fx-nav-item">
            <Settings {...ICON} />
            Settings
          </div>
        </aside>

        <main
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            ref={columnRef}
            style={{
              position: 'relative',
              width: 536,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingBottom: 120,
            }}
          >
            <div
              className="fx-hero-empty"
              data-hidden={hideEmpty || undefined}
              style={{ textAlign: 'center', marginBottom: 28 }}
            >
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                }}
              >
                Deploy something new
              </div>
              <div className="fx-muted" style={{ marginTop: 6, fontSize: 13 }}>
                Describe it, or pick a method below.
              </div>
            </div>

            <div
              className="fx-thread"
              data-hidden={showThread ? undefined : ''}
            >
              <div className="fx-bubble" style={{ maxWidth: 440 }}>
                {PROMPT}
              </div>
              <div
                className="fx-appear"
                data-hidden={state.phase === 'sent' || undefined}
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  maxWidth: 500,
                }}
              >
                Found a static deck with a lead form. I&apos;ll package the
                folder, add a Postgres for the form and wire it in before
                publishing.
              </div>
              <div
                className="fx-appear"
                data-hidden={state.step < 0 || undefined}
                style={{ width: '100%' }}
              >
                <div className="fx-plan" data-done={finished || undefined}>
                  <div className="fx-plan-head">
                    <span className="fx-plan-icon">
                      {finished ? (
                        <Check size={14} strokeWidth={2.2} />
                      ) : (
                        <Rocket size={14} strokeWidth={1.75} />
                      )}
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="fx-faint" style={{ fontSize: 11 }}>
                        Deploy plan
                      </span>
                      <span className="fx-strong" style={{ fontSize: 13 }}>
                        {finished
                          ? 'quote-deck is live'
                          : 'Deploying quote-deck'}
                      </span>
                    </span>
                    <span
                      className="fx-faint fx-mono"
                      style={{ marginLeft: 'auto' }}
                    >
                      {Math.max(0, Math.min(state.step, STEPS.length))}/
                      {STEPS.length}
                    </span>
                  </div>
                  <div className="fx-plan-body fx-steps">
                    {STEPS.map((step, index) => {
                      const s =
                        index < state.step
                          ? 'done'
                          : index === state.step
                            ? 'active'
                            : 'todo';
                      return (
                        <div
                          key={step.label}
                          className="fx-step"
                          data-state={s}
                        >
                          <span className="fx-step-mark">
                            {s === 'done' ? <Check strokeWidth={3} /> : null}
                          </span>
                          <span>{step.label}</span>
                          <span
                            className="fx-faint fx-mono"
                            style={{ fontSize: 11 }}
                          >
                            {s === 'todo' ? '' : step.meta}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="fx-url" data-hidden={!finished || undefined}>
                    <Globe strokeWidth={1.75} />
                    <span className="fx-strong">
                      https://quote-deck.sealos.run
                    </span>
                    <ArrowRight
                      strokeWidth={1.75}
                      style={{ marginLeft: 'auto' }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="fx-appear fx-muted"
                data-hidden={!finished || undefined}
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Leads from the form now land in{' '}
                <span className="fx-strong" style={{ color: '#1c1c1c' }}>
                  leads-pg
                </span>
                . I&apos;ll keep an eye on it.
              </div>
            </div>

            <div
              ref={composerRef}
              className="fx-composer"
              style={{
                position: 'relative',
                zIndex: 1,
                transform: docked ? `translateY(${dock}px)` : 'none',
                transition: 'transform 560ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div
                className="fx-composer-text"
                data-filled={composerText ? '' : undefined}
              >
                {composerText ||
                  (state.phase === 'typing'
                    ? ''
                    : showThread
                      ? 'Ask about this plan…'
                      : 'Describe what you want to deploy…')}
                {state.phase === 'typing' ? (
                  <span className="fx-caret" />
                ) : null}
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
              className="fx-hero-empty"
              data-hidden={hideEmpty || undefined}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
                marginTop: 28,
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

          <div
            className="fx-hero-empty"
            data-hidden={hideEmpty || undefined}
            style={{
              alignSelf: 'stretch',
              margin: '0 18px',
              padding: '12px 14px 0',
              height: 168,
              borderRadius: '16px 16px 0 0',
              background: '#f6f6f6',
              boxShadow: 'inset 0 0 0 1px #ededed',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
              }}
            >
              <span
                style={{
                  padding: '5px 10px',
                  borderRadius: 999,
                  background: '#fff',
                  boxShadow: '0 0 0 1px #e8e8e8',
                  fontWeight: 500,
                }}
              >
                All templates
              </span>
              {['AI', 'Database', 'Web', 'Tools'].map((tag) => (
                <span
                  key={tag}
                  className="fx-muted"
                  style={{ padding: '5px 10px' }}
                >
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
        </main>
      </div>
    </div>
  );
}

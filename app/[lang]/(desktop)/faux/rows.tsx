import {
  ArrowUp,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Database,
  Ellipsis,
  Globe,
  LineChart,
  ListTree,
  Mic,
  Network,
  Plus,
  RotateCw,
  Search,
  Settings,
  Square,
  X,
} from 'lucide-react';
import nextjsIcon from '@/assets/stacks-appicons/nextjs.svg';

const I = { size: 14, strokeWidth: 1.75 } as const;

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden>
      <circle
        cx="8"
        cy="8"
        r="7"
        fill="none"
        stroke="#1F9E3F"
        strokeWidth="1.4"
      />
      <path
        d="M5.2 8.2 7.1 10l3.7-4"
        fill="none"
        stroke="#1F9E3F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NextMark({ size }: { size: number }) {
  return (
    <img
      src={nextjsIcon.src}
      alt=""
      width={size}
      height={size}
      style={{ flex: 'none', width: size, height: size, filter: 'invert(1)' }}
    />
  );
}

function Traffic() {
  return (
    <div className="fx-traffic">
      <i />
      <i />
      <i />
    </div>
  );
}

function ChatComposer({ placeholder }: { placeholder: string }) {
  return (
    <div
      className="fx-composer"
      style={{
        padding: '12px 12px 9px',
        borderRadius: 16,
        boxShadow: '0 1px 4px rgb(0 0 0 / 0.06)',
      }}
    >
      <div
        className="fx-composer-text"
        style={{ minHeight: 34, fontSize: 12.5, lineHeight: '18px' }}
      >
        {placeholder}
      </div>
      <div className="fx-composer-row" style={{ height: 28 }}>
        <span className="fx-icon-btn" style={{ width: 24, height: 24 }}>
          <Plus strokeWidth={1.75} />
        </span>
        <span style={{ marginLeft: 'auto', color: '#909090', display: 'grid' }}>
          <Mic size={14} strokeWidth={1.75} />
        </span>
        <span
          className="fx-send"
          style={{ width: 26, height: 26, marginLeft: 6 }}
        >
          <ArrowUp size={13} strokeWidth={2.2} />
        </span>
      </div>
    </div>
  );
}

/* 1. Local folder to live URL */
export function LocalDeployShot() {
  return (
    <div className="fx" style={{ position: 'absolute', inset: 0 }}>
      <div
        className="fx-window"
        style={{
          left: 40,
          top: 40,
          width: 860,
          height: 704,
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 44,
            padding: '0 14px',
            borderBottom: '1px solid #efefef',
            gap: 14,
          }}
        >
          <Traffic />
          <span
            className="fx-strong"
            style={{
              marginLeft: 10,
              fontSize: 12.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            quote-deck{' '}
            <ChevronDown size={12} strokeWidth={1.75} color="#909090" />
          </span>
          <span
            style={{
              marginLeft: 262,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 999,
              background: '#f2f2f2',
              fontSize: 12,
            }}
          >
            <Network size={13} strokeWidth={1.75} /> Architecture
          </span>
          <span style={{ display: 'inline-flex', gap: 14, color: '#909090' }}>
            <LineChart {...I} />
            <ListTree {...I} />
            <Database {...I} />
            <Settings {...I} />
          </span>
        </div>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <div
            style={{
              width: 252,
              display: 'flex',
              flexDirection: 'column',
              padding: 12,
              gap: 12,
              borderRight: '1px solid #efefef',
            }}
          >
            <div style={{ fontSize: 12.5, lineHeight: 1.45 }}>
              Publish local{' '}
              <span className="fx-mono" style={{ fontSize: 11.5 }}>
                ./quote-deck
              </span>{' '}
              sales deck with live PostgreSQL lead capture.
            </div>
            <div
              style={{
                borderRadius: 12,
                boxShadow: '0 0 0 1px #9fd6ad',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '10px 11px',
                  borderBottom: '1px solid #e8efe9',
                }}
              >
                <span
                  className="fx-plan-icon"
                  style={{
                    background: '#e9f6ec',
                    color: '#1F9E3F',
                    width: 24,
                    height: 24,
                  }}
                >
                  <CheckCircle2 size={13} strokeWidth={1.9} />
                </span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="fx-faint" style={{ fontSize: 10.5 }}>
                    quote-deck
                  </span>
                  <span className="fx-strong" style={{ fontSize: 12 }}>
                    Deployed successfully
                  </span>
                </span>
                <span
                  className="fx-faint fx-mono"
                  style={{ marginLeft: 'auto', fontSize: 10.5 }}
                >
                  4/4
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                  padding: '11px 11px 12px',
                  fontSize: 11.5,
                }}
              >
                {[
                  'Local directory packaged',
                  'Wired leads-pg DATABASE_URL',
                  '8/8 static assets 200 OK',
                  'quote-deck.sealos.run',
                ].map((line) => (
                  <span
                    key={line}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Check />
                    {line}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <ChatComposer placeholder="Ask about this plan, or tell me what to change…" />
            </div>
          </div>
          <div
            className="fx-canvas"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                height: 40,
                padding: '0 12px',
                background: '#fff',
                borderBottom: '1px solid #efefef',
                color: '#909090',
              }}
            >
              <ChevronLeft {...I} />
              <ChevronRight {...I} />
              <RotateCw size={13} strokeWidth={1.75} />
              <span
                style={{
                  flex: 1,
                  height: 26,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '0 10px',
                  borderRadius: 8,
                  background: '#f5f5f5',
                  color: '#1c1c1c',
                  fontSize: 12,
                }}
              >
                <Globe size={12} strokeWidth={1.75} color="#1F9E3F" />{' '}
                https://quote-deck.sealos.run
              </span>
            </div>
            <div
              style={{
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>
                Interactive quote deck
              </div>
              {[
                {
                  t: 'Growth Cloud',
                  tag: 'Popular',
                  d: 'Dedicated PostgreSQL 16 and custom HTTPS hosting.',
                  price: '$49/mo',
                  on: true,
                },
                {
                  t: 'Agency Multi-tenant',
                  tag: 'Isolated',
                  d: '12 isolated client workspaces with daily snapshots.',
                  price: '$129/mo',
                },
                {
                  t: 'ROI widget',
                  tag: 'Live',
                  d: 'Real-time quote estimator wired to leads-pg.',
                  price: 'Included',
                },
              ].map((tier) => (
                <div
                  key={tier.t}
                  style={{
                    position: 'relative',
                    padding: '14px 16px',
                    borderRadius: 12,
                    background: tier.on ? '#f3f9ff' : '#fff',
                    boxShadow: tier.on
                      ? '0 0 0 1.5px #0A84FF, 0 4px 14px -6px rgb(10 132 255 / 0.35)'
                      : '0 0 0 1px #e8e8e8',
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span className="fx-strong">{tier.t}</span>
                    <span
                      className="fx-badge"
                      data-tone={tier.on ? 'blue' : undefined}
                    >
                      {tier.tag}
                    </span>
                    <span className="fx-strong" style={{ marginLeft: 'auto' }}>
                      {tier.price}
                    </span>
                  </div>
                  <div
                    className="fx-muted"
                    style={{ marginTop: 4, fontSize: 12 }}
                  >
                    {tier.d}
                  </div>
                  {tier.on ? (
                    <div
                      className="fx-mono"
                      style={{ marginTop: 8, color: '#0A84FF', fontSize: 11 }}
                    >
                      Selected · &lt;div.pricing-tier&gt; · 520×96
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <span
              className="fx-light-btn"
              style={{
                marginTop: 'auto',
                margin: 'auto 0 14px 14px',
                alignSelf: 'flex-start',
              }}
            >
              <Plus strokeWidth={1.75} /> Add service
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2. GitHub repo with its database */
export function GithubDeployShot() {
  return (
    <div className="fx" style={{ position: 'absolute', inset: 0 }}>
      <div
        className="fx-window"
        style={{
          left: 40,
          top: 40,
          width: 760,
          height: 724,
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 44,
            padding: '0 14px',
            borderBottom: '1px solid #efefef',
            gap: 14,
          }}
        >
          <Traffic />
          <span
            className="fx-strong"
            style={{
              marginLeft: 10,
              fontSize: 12.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            storefront{' '}
            <ChevronDown size={12} strokeWidth={1.75} color="#909090" />
          </span>
          <span
            className="fx-badge"
            data-tone="amber"
            style={{ marginLeft: 4 }}
          >
            <span className="fx-dot" /> Building
          </span>
        </div>
        <div className="fx-canvas" style={{ flex: 1 }}>
          <div
            className="fx-node"
            data-selected=""
            style={{ left: 40, top: 150 }}
          >
            <div className="fx-node-head">
              <NextMark size={30} />
              <span>
                <div className="fx-node-title">storefront</div>
                <div className="fx-node-sub">acme/storefront · main</div>
              </span>
            </div>
            <div className="fx-node-status">
              <span className="fx-dot" data-tone="amber" /> Deploying{' '}
              <span className="fx-faint">Building image</span>
            </div>
            <div className="fx-node-foot">
              <Globe size={12} strokeWidth={1.75} /> Public URL after deploy
            </div>
          </div>
          <div
            className="fx-edge"
            style={{ left: 144, top: 261, width: 1, height: 48 }}
          />
          <div className="fx-node" style={{ left: 40, top: 309 }}>
            <div className="fx-node-head">
              <span className="fx-logo">
                <img src="/icons/postgresql.svg" alt="" />
              </span>
              <span>
                <div className="fx-node-title">postgres</div>
                <div className="fx-node-sub">PostgreSQL 16</div>
              </span>
            </div>
            <div className="fx-node-status">
              <span className="fx-dot" /> Running
            </div>
          </div>
          <span
            className="fx-light-btn"
            style={{ position: 'absolute', left: 14, bottom: 14 }}
          >
            <Plus strokeWidth={1.75} /> Add service
          </span>
        </div>
      </div>
      <div
        className="fx-float"
        style={{
          position: 'absolute',
          left: 340,
          top: 100,
          width: 392,
          height: 640,
          padding: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <NextMark size={34} />
          <span>
            <div style={{ fontSize: 16, fontWeight: 500 }}>storefront</div>
            <div className="fx-faint" style={{ fontSize: 11.5 }}>
              acme/storefront · main · a41c9e2
            </div>
          </span>
          <X
            size={15}
            strokeWidth={1.75}
            color="#909090"
            style={{ marginLeft: 'auto' }}
          />
        </div>
        <div className="fx-tabs" style={{ marginTop: 16 }}>
          <span>Overview</span>
          <span data-active="">Deployments</span>
          <span>Logs</span>
          <span>Metrics</span>
          <span>Variables</span>
        </div>
        <div
          style={{
            marginTop: 14,
            borderRadius: 12,
            background: '#fafafa',
            boxShadow: '0 0 0 1px #ececec',
          }}
        >
          <div
            style={{ padding: '12px 13px', borderBottom: '1px solid #ececec' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="fx-strong" style={{ fontSize: 12.5 }}>
                Initial deploy
              </span>
              <span className="fx-badge" data-tone="amber">
                <span className="fx-dot" /> Deploying
              </span>
            </div>
            <div className="fx-faint" style={{ fontSize: 11, marginTop: 3 }}>
              a41c9e2 · main · by Jamie Lin · 1m 02s
            </div>
          </div>
          <div className="fx-steps" style={{ padding: '6px 13px 8px' }}>
            {[
              ['Clone repository', '3.2s', 'done'],
              ['Build image', '58s', 'active'],
              ['Push image', '', 'todo'],
              ['Start container', '', 'todo'],
              ['Health check', '', 'todo'],
              ['Assign public URL', 'port 3000', 'todo'],
            ].map(([label, meta, s]) => (
              <div key={label} className="fx-step" data-state={s}>
                <span className="fx-step-mark">
                  {s === 'done' ? (
                    <svg viewBox="0 0 12 12" width="9" height="9">
                      <path
                        d="M2.5 6.2 4.8 8.5 9.5 3.5"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </span>
                <span>{label}</span>
                <span
                  className="fx-mono"
                  style={{
                    fontSize: 10.5,
                    color: s === 'active' ? '#a86a00' : '#909090',
                  }}
                >
                  {meta}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: '10px 13px 13px',
              borderTop: '1px solid #ececec',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10.5,
                letterSpacing: '0.04em',
              }}
            >
              <span className="fx-faint">LATEST LOGS</span>
              <span>View full logs ›</span>
            </div>
            <div
              className="fx-logs"
              style={{
                marginTop: 8,
                padding: '8px 10px',
                borderRadius: 8,
                background: '#f1f1f1',
                color: '#3d3d3d',
              }}
            >
              {`10:42:11  #5 [deps 2/3] COPY package.json ./
10:42:12  #6 [deps 3/3] RUN npm ci
10:42:41  added 812 packages in 29s
10:42:42  #9 [build 3/4] RUN npm run build`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spark({
  points,
  color = '#5c5c5c',
}: {
  points: number[];
  color?: string;
}) {
  const w = 480;
  const h = 26;
  const max = Math.max(...points);
  const step = w / (points.length - 1);
  const d = points
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)} ${(h - (p / max) * (h - 4)).toFixed(1)}`,
    )
    .join(' ');
  return (
    <svg
      viewBox={`0 0 ${w} ${h + 2}`}
      width={w}
      height={h + 2}
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      {[0.25, 0.5, 0.75].map((x) => (
        <line key={x} x1={w * x} x2={w * x} y1={0} y2={h} stroke="#ececec" />
      ))}
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill="#f2f2f2" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.2" />
      <circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * (h - 4)}
        r="2.6"
        fill="#1c1c1c"
      />
    </svg>
  );
}

/* 3. One service, everything about it */
export function ProjectViewShot() {
  return (
    <div className="fx" style={{ position: 'absolute', inset: 0 }}>
      <div
        className="fx-float"
        style={{
          position: 'absolute',
          left: 40,
          top: 40,
          width: 689,
          height: 720,
          padding: '26px 26px 0',
          borderRadius: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <span className="fx-logo" data-size="lg">
            <img src="/icons/postgresql.svg" alt="" />
          </span>
          <span>
            <div style={{ fontSize: 19, fontWeight: 500 }}>postgres</div>
            <div className="fx-muted" style={{ fontSize: 13 }}>
              PostgreSQL 16
            </div>
          </span>
          <X
            size={16}
            strokeWidth={1.75}
            color="#909090"
            style={{ marginLeft: 'auto' }}
          />
        </div>
        <div
          className="fx-tabs"
          style={{ marginTop: 20, fontSize: 13.5, gap: 24 }}
        >
          <span data-active="">Overview</span>
          <span>Logs</span>
          <span>Metrics</span>
          <span>Settings</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            marginTop: 20,
          }}
        >
          <span className="fx-dot" />
          <span style={{ fontSize: 15 }}>Running</span>
          <span className="fx-badge">1 instance</span>
          <Ellipsis
            size={16}
            strokeWidth={1.75}
            color="#717171"
            style={{ marginLeft: 'auto' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 40, marginTop: 18 }}>
          {[
            ['Uptime', '3d 4h'],
            ['Restarts', '0'],
            ['Last deploy', '2h ago'],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="fx-muted" style={{ fontSize: 12 }}>
                {k}
              </div>
              <div style={{ marginTop: 4, fontSize: 15 }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="fx-hr" style={{ margin: '22px 0' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <span className="fx-strong" style={{ fontSize: 13.5 }}>
            Connection
          </span>
          <span className="fx-muted" style={{ fontSize: 12 }}>
            Edit in Settings ›
          </span>
        </div>
        <dl
          className="fx-kv"
          style={{ margin: 0, gridTemplateColumns: '144px 1fr' }}
        >
          <dt>Host</dt>
          <dd>postgres-postgresql.ns-ffmbxs.svc</dd>
          <dt>Port</dt>
          <dd>5432</dd>
          <dt>User</dt>
          <dd>postgres</dd>
          <dt>Password</dt>
          <dd style={{ letterSpacing: 2 }}>••••••••••••••••</dd>
          <dt>Connection string</dt>
          <dd>
            postgresql://postgres:••••@postgres-postgresql.ns-ffmbxs.svc:5432
          </dd>
        </dl>
        <div className="fx-hr" style={{ margin: '22px 0' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <span className="fx-strong" style={{ fontSize: 13.5 }}>
            Usage
          </span>
          <span className="fx-muted" style={{ fontSize: 12 }}>
            Metrics ›
          </span>
        </div>
        {[
          [
            'CPU',
            '24%',
            [6, 7, 6, 9, 10, 8, 7, 12, 18, 14, 9, 8, 8, 7, 8, 9, 7, 7, 8, 8, 7],
          ],
          [
            'Memory',
            '62%',
            [
              30, 30, 31, 33, 33, 35, 35, 36, 38, 38, 40, 41, 41, 42, 44, 44,
              44, 45, 46, 46, 46,
            ],
          ],
          [
            'Storage',
            '12%',
            [4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8],
          ],
        ].map(([label, value, pts]) => (
          <div
            key={label as string}
            style={{
              display: 'grid',
              gridTemplateColumns: '96px 1fr 44px',
              alignItems: 'center',
              height: 38,
            }}
          >
            <span style={{ fontSize: 13 }}>{label as string}</span>
            <Spark points={pts as number[]} />
            <span style={{ textAlign: 'right', fontSize: 13 }}>
              {value as string}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const LOG_LINES: Array<
  [string, string, string, string, 'info' | 'warn' | 'error']
> = [
  [
    '10:41:55',
    'nginx',
    'nginx-1',
    '10.244.0.9 - "POST /api/login HTTP/1.1" 200 341',
    'info',
  ],
  [
    '10:41:58',
    'postgres',
    '',
    'LOG:  duration: 212.418 ms  statement: SELECT * FROM shops',
    'info',
  ],
  [
    '10:42:00',
    'nginx',
    'nginx-0',
    '10.244.0.12 - "GET /api/coffee-shops/17 HTTP/1.1" 200 1288',
    'info',
  ],
  [
    '10:42:03',
    'nginx',
    'nginx-0',
    '[warn] upstream response is buffered to a temporary file',
    'warn',
  ],
  [
    '10:42:06',
    'nginx',
    'nginx-1',
    '10.244.0.9 - "GET /api/health HTTP/1.1" 200 15',
    'info',
  ],
  [
    '10:42:10',
    'postgres',
    '',
    'LOG:  server process (PID 71) was terminated by signal 9: Killed',
    'error',
  ],
  [
    '10:42:10',
    'postgres',
    '',
    'LOG:  terminating any other active server processes',
    'error',
  ],
  [
    '10:42:11',
    'nginx',
    'nginx-0',
    '[error] connect() failed (111: Connection refused) while connecting',
    'error',
  ],
  [
    '10:42:11',
    'postgres',
    '',
    'LOG:  database system was not properly shut down; recovering',
    'info',
  ],
  [
    '10:42:12',
    'nginx',
    'nginx-1',
    '10.244.0.9 - "POST /api/reviews HTTP/1.1" 502 157',
    'error',
  ],
  [
    '10:42:13',
    'postgres',
    '',
    'FATAL:  the database system is starting up',
    'error',
  ],
  [
    '10:42:14',
    'nginx',
    'nginx-0',
    '10.244.0.12 - "GET /api/me HTTP/1.1" 502 157',
    'error',
  ],
  [
    '10:42:15',
    'postgres',
    '',
    'LOG:  redo done at 0/1A4C0F0 system usage: CPU: user: 0.02 s',
    'info',
  ],
  [
    '10:42:15',
    'nginx',
    'nginx-1',
    '10.244.0.9 - "GET /api/health HTTP/1.1" 200 15',
    'info',
  ],
  [
    '10:42:16',
    'postgres',
    '',
    'LOG:  database system is ready to accept connections',
    'info',
  ],
  [
    '10:42:16',
    'nginx',
    'nginx-0',
    '10.244.0.12 - "GET /api/coffee-shops?page=2 HTTP/1.1" 200 5088',
    'info',
  ],
  [
    '10:42:17',
    'nginx',
    'nginx-1',
    '10.244.0.9 - "POST /api/reviews HTTP/1.1" 201 412',
    'info',
  ],
  [
    '10:42:18',
    'postgres',
    '',
    'LOG:  checkpoint starting: end-of-recovery immediate wait',
    'info',
  ],
  [
    '10:42:19',
    'nginx',
    'nginx-0',
    '10.244.0.12 - "GET /api/me HTTP/1.1" 200 288',
    'info',
  ],
  [
    '10:42:20',
    'postgres',
    '',
    'LOG:  connection authorized: user=app database=app SSL enabled',
    'info',
  ],
  [
    '10:42:21',
    'nginx',
    'nginx-1',
    '10.244.0.9 - "GET /api/health HTTP/1.1" 200 15',
    'info',
  ],
  [
    '10:42:22',
    'nginx',
    'nginx-0',
    '10.244.0.12 - "GET /api/favorites HTTP/1.1" 200 932',
    'info',
  ],
];

const BARS = [
  5, 7, 4, 6, 8, 5, 6, 9, 7, 5, 6, 7, 8, 6, 5, 7, 9, 6, 7, 5, 6, 8, 7, 6, 9, 7,
  6, 8, 7, 9, 8, 10,
];

/* 4. Logs, with the agent one click away */
export function AgentLogsShot() {
  return (
    <div className="fx" style={{ position: 'absolute', inset: 0 }}>
      <div
        className="fx-window"
        style={{
          left: -60,
          top: 40,
          width: 790,
          height: 724,
          flexDirection: 'column',
          padding: '0 0 0 72px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 16px 12px 12px',
          }}
        >
          <span className="fx-light-btn">
            All services <ChevronDown strokeWidth={1.75} />
          </span>
          <span className="fx-light-btn" style={{ flex: 1, color: '#909090' }}>
            <Search strokeWidth={1.75} /> Search logs · service:nginx
            level:error
          </span>
          <span className="fx-light-btn">
            All levels <ChevronDown strokeWidth={1.75} />
          </span>
          <span className="fx-light-btn">
            Last 1 hour <ChevronDown strokeWidth={1.75} />
          </span>
          <span className="fx-light-btn">
            <Circle size={8} fill="#909090" stroke="none" /> Paused
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 16px 0 12px',
            fontSize: 11.5,
          }}
        >
          <span className="fx-muted">1,296 lines</span>
          <span style={{ color: '#E5484D' }}>● 7 errors</span>
          <span className="fx-muted">3 warnings</span>
          <span
            className="fx-badge fx-mono"
            style={{ marginLeft: 'auto', fontSize: 10.5 }}
          >
            10:40 – 10:42 ×
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 4,
            height: 44,
            margin: '10px 16px 0 12px',
          }}
        >
          {BARS.map((b, i) => (
            <span
              key={i}
              style={{
                flex: 1,
                height: b * 3.6,
                borderRadius: 2,
                background:
                  i >= BARS.length - 2
                    ? '#E5484D'
                    : i === BARS.length - 3
                      ? '#E5960F'
                      : '#dcdcdc',
              }}
            />
          ))}
        </div>
        <div
          className="fx-mono fx-faint"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '6px 16px 0 12px',
            fontSize: 10,
          }}
        >
          {['09:42', '09:52', '10:02', '10:12', '10:22', '10:32', 'now'].map(
            (t) => (
              <span key={t}>{t}</span>
            ),
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '14px 16px 10px 12px',
            padding: '11px 12px',
            borderRadius: 10,
            background: '#fdeced',
            boxShadow: 'inset 0 0 0 1px #f8d3d5',
          }}
        >
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#c4282d', fontWeight: 500, fontSize: 12.5 }}>
              7 errors in the last hour · latest 10:42:15
            </span>
            <span className="fx-muted" style={{ fontSize: 11.5 }}>
              postgres restarted at 10:42:10 · exit 137 · nginx 3 errors
            </span>
          </span>
          <span
            className="fx-light-btn"
            style={{ marginLeft: 'auto', boxShadow: '0 0 0 1px #f0c6c8' }}
          >
            <Bot strokeWidth={1.75} /> Ask Agent
          </span>
        </div>
        <span
          className="fx-dark-btn"
          style={{
            position: 'absolute',
            left: 372,
            top: 664,
            height: 24,
            zIndex: 1,
          }}
        >
          Live ↓
        </span>
        <div style={{ flex: 1, overflow: 'hidden', padding: '0 0 0 12px' }}>
          {LOG_LINES.map(([time, svc, pod, msg, level], i) => (
            <div
              key={i}
              className="fx-logs"
              style={{
                display: 'grid',
                gridTemplateColumns: '64px 82px 58px 1fr',
                gap: 8,
                paddingLeft: 8,
                boxShadow:
                  level === 'error'
                    ? 'inset 2px 0 0 #E5484D'
                    : level === 'warn'
                      ? 'inset 2px 0 0 #E5960F'
                      : 'none',
                color:
                  level === 'error'
                    ? '#c4282d'
                    : level === 'warn'
                      ? '#a86a00'
                      : '#3d3d3d',
              }}
            >
              <span style={{ color: '#909090' }}>{time}</span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  color: '#3d3d3d',
                }}
              >
                {svc === 'postgres' ? (
                  <Database size={11} strokeWidth={1.75} color="#336791" />
                ) : (
                  <Square size={10} strokeWidth={2} color="#1F9E3F" />
                )}
                {svc}
              </span>
              <span style={{ color: '#909090' }}>{pod}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'clip' }}>
                {msg}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

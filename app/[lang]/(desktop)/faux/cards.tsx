import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FolderOpen,
  Github,
  HardDrive,
  LayoutGrid,
  MessageSquare,
  Plus,
  Search,
  Settings,
  User,
  UserPlus,
  Waypoints,
} from 'lucide-react';

const fill = { position: 'absolute', inset: 0 } as const;

/* ---------------- Deploy any project ---------------- */

export function LocalProjectShot() {
  return (
    <div className="fx" style={fill}>
      <div style={{ position: 'absolute', left: 20, top: 36, width: 337 }}>
        <div className="fx-composer">
          <div className="fx-composer-text">
            Describe what you want to deploy…
          </div>
          <div className="fx-composer-row">
            <span className="fx-icon-btn">
              <Plus strokeWidth={1.75} />
            </span>
            <span className="fx-chip">
              Select project <ChevronUp strokeWidth={2} />
            </span>
            <span className="fx-send">
              <ArrowUp strokeWidth={2.2} />
            </span>
          </div>
        </div>
        <div
          className="fx-float"
          style={{
            position: 'absolute',
            left: 52,
            top: 112,
            width: 226,
            padding: 4,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 32,
              padding: '0 8px',
              borderBottom: '1px solid #f0f0f0',
              color: '#909090',
            }}
          >
            <Search size={13} strokeWidth={1.75} /> Search
          </div>
          {[
            {
              icon: <FolderOpen size={14} strokeWidth={1.75} />,
              label: 'Open folder',
              on: true,
            },
            {
              icon: <MessageSquare size={14} strokeWidth={1.75} />,
              label: 'Work outside a project',
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 32,
                marginTop: 2,
                padding: '0 8px',
                borderRadius: 9,
                background: item.on ? '#f2f2f2' : undefined,
              }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GithubRepoShot() {
  return (
    <div className="fx" style={fill}>
      <div
        className="fx-float"
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 20,
          padding: 16,
          borderRadius: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 11 }}>
          <span className="fx-logo">
            <Github size={16} strokeWidth={1.75} />
          </span>
          <span>
            <div className="fx-strong">GitHub repo</div>
            <div className="fx-muted" style={{ fontSize: 11.5 }}>
              Build and deploy from a repository
            </div>
          </span>
        </div>
        <div className="fx-strong" style={{ marginTop: 16, fontSize: 12 }}>
          Repository URL
        </div>
        <div
          style={{
            marginTop: 6,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            borderRadius: 10,
            boxShadow: '0 0 0 1.5px #1c1c1c',
            fontSize: 13,
          }}
        >
          github.com/acme/storefront
          <span
            className="fx-caret"
            style={{ height: 15, background: '#1c1c1c' }}
          />
        </div>
        <div className="fx-strong" style={{ marginTop: 14, fontSize: 12 }}>
          Branch
        </div>
        <div
          className="fx-mono"
          style={{
            marginTop: 6,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            borderRadius: 10,
            boxShadow: '0 0 0 1px #e2e2e2',
            fontSize: 12.5,
          }}
        >
          main <ChevronDown size={13} strokeWidth={1.75} color="#909090" />
        </div>
        <div
          className="fx-dark-btn"
          style={{ display: 'flex', marginTop: 16, height: 34, fontSize: 13 }}
        >
          Deploy
        </div>
      </div>
    </div>
  );
}

const TEMPLATE_ROWS = [
  {
    name: 'dify',
    icon: '/images/apps/dify.svg',
    desc: 'LLM app development platform for agents and RAG',
  },
  {
    name: 'new-api',
    icon: '/images/apps/new-api.png',
    desc: 'AI model gateway with multi-provider routing',
  },
  {
    name: 'n8n',
    icon: '/images/apps/n8n.svg',
    desc: 'Workflow automation with the speed of no-code',
  },
  {
    name: 'wordpress',
    icon: '/images/apps/wordpress.svg',
    desc: 'The open-source CMS behind a third of the web',
  },
];

export function TemplateShot() {
  return (
    <div className="fx" style={fill}>
      <div
        className="fx-float"
        style={{
          position: 'absolute',
          left: 20,
          top: 20,
          width: 420,
          height: 320,
          padding: 12,
          borderRadius: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span className="fx-logo" data-size="sm" style={{ color: '#7A3FE4' }}>
            <LayoutGrid size={13} strokeWidth={1.75} />
          </span>
          <span>
            <div className="fx-strong" style={{ fontSize: 12 }}>
              Template
            </div>
            <div className="fx-faint" style={{ fontSize: 10.5 }}>
              One-click apps from the library
            </div>
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            height: 32,
            marginTop: 12,
            padding: '0 10px',
            borderRadius: 9,
            boxShadow: '0 0 0 1.5px #1c1c1c',
            color: '#909090',
          }}
        >
          <Search size={13} strokeWidth={1.75} /> Search 240+ templates
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 10, fontSize: 11.5 }}>
          {['All', 'AI', 'Tools', 'Backend', 'DevOps'].map((tag, i) => (
            <span
              key={tag}
              style={{
                padding: '3px 9px',
                borderRadius: 999,
                boxShadow: i === 0 ? '0 0 0 1px #d8d8d8' : undefined,
                color: i === 0 ? '#1c1c1c' : '#717171',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          {TEMPLATE_ROWS.map((row) => (
            <div
              key={row.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '28px 74px 1fr',
                alignItems: 'center',
                gap: 8,
                height: 46,
                borderTop: '1px solid #f0f0f0',
              }}
            >
              <span className="fx-logo" data-size="sm">
                <img src={row.icon} alt="" />
              </span>
              <span className="fx-strong" style={{ fontSize: 12 }}>
                {row.name}
              </span>
              <span
                className="fx-muted"
                style={{ fontSize: 11, lineHeight: 1.3, whiteSpace: 'nowrap' }}
              >
                {row.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Agent on duty ---------------- */

const dutyCard = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: 466,
  transform: 'translate(-50%, -50%)',
  borderRadius: 16,
  overflow: 'hidden',
} as const;

function DutyFrame({
  children,
  live = true,
  title,
}: {
  children: React.ReactNode;
  live?: boolean;
  title: React.ReactNode;
}) {
  return (
    <div className="fx-float" style={dutyCard}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          height: 46,
          padding: '0 14px',
          borderBottom: '1px solid #efefef',
          background: '#fbfbfb',
        }}
      >
        {title}
        {live ? (
          <span
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11.5,
            }}
            className="fx-mono"
          >
            <span
              className="fx-dot"
              style={{ boxShadow: '0 0 0 3px #e3f3e7' }}
            />{' '}
            Live
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function DiagnoseCard() {
  return (
    <div className="fx" style={fill}>
      <DutyFrame
        live={false}
        title={
          <>
            <span className="fx-logo" data-size="sm">
              <img src="/images/apps/new-api.png" alt="" />
            </span>
            <span className="fx-strong">new-api</span>
            <span
              className="fx-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11.5,
                marginLeft: 4,
              }}
            >
              <span className="fx-dot" data-tone="red" /> Restarting
            </span>
            <span className="fx-segmented" style={{ marginLeft: 'auto' }}>
              <span data-active="">Logs</span>
              <span>Metrics</span>
            </span>
          </>
        }
      >
        <div
          style={{
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            className="fx-logs"
            style={{
              padding: '8px 11px',
              borderRadius: 10,
              boxShadow: '0 0 0 1px #ececec',
            }}
          >
            <div>03:15:52 [warn] pg pool 20/20</div>
            <div style={{ color: '#c4282d' }}>
              03:15:54 [fatal] new-api-0 OOMKilled (exit 137 · 512MiB)
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '9px 11px',
              borderRadius: 10,
              boxShadow: '0 0 0 1px #ececec',
              fontSize: 12,
            }}
          >
            <span className="fx-muted">Root cause</span>
            <span>Exit 137 · 96% memory peak</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderTop: '1px solid #efefef',
            background: '#fbfbfb',
          }}
        >
          <span className="fx-muted" style={{ fontSize: 12 }}>
            Deploy plan #4
          </span>
          <span className="fx-dark-btn">Approve 512 MiB → 1024 MiB</span>
        </div>
      </DutyFrame>
    </div>
  );
}

export function HotUpdateCard() {
  return (
    <div className="fx" style={fill}>
      <DutyFrame
        live={false}
        title={
          <>
            <span
              className="fx-mono"
              style={{
                flex: 1,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                padding: '0 11px',
                borderRadius: 999,
                background: '#f1f1f1',
                fontSize: 11.5,
              }}
            >
              quote-deck.sealos.run/pricing
            </span>
            <span
              className="fx-badge fx-mono"
              style={{ boxShadow: '0 0 0 1px #e5e5e5', background: '#fff' }}
            >
              800×600
            </span>
          </>
        }
      >
        <div style={{ padding: 12 }}>
          <div
            className="fx-mono"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '2px 2px 10px',
              fontSize: 11.5,
            }}
          >
            <span>
              ± Changes <span style={{ color: '#1F9E3F' }}>+154</span>{' '}
              <span style={{ color: '#E5484D' }}>−8</span>
            </span>
            <span className="fx-faint">Hot update #12</span>
          </div>
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: '#f3f9ff',
              boxShadow: '0 0 0 1.5px #0A84FF',
            }}
          >
            <div
              className="fx-mono"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
              }}
            >
              <span style={{ color: '#0A84FF' }}>
                &lt;section.pricing-card&gt;
              </span>
              <span className="fx-faint">Selected</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,
                fontSize: 13,
              }}
            >
              <span className="fx-strong">Enterprise Cloud plan</span>
              <span className="fx-strong">$49/mo</span>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderTop: '1px solid #efefef',
            background: '#fbfbfb',
          }}
        >
          <span
            className="fx-mono"
            style={{
              fontSize: 11.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Check size={13} strokeWidth={2} color="#1F9E3F" /> 8/8 static
            assets 200 OK
          </span>
          <span className="fx-dark-btn">Rollback</span>
        </div>
      </DutyFrame>
    </div>
  );
}

export function ScaleCard() {
  return (
    <div className="fx" style={fill}>
      <DutyFrame
        title={
          <>
            <span className="fx-logo" data-size="sm">
              <img src="/icons/postgresql.svg" alt="" />
            </span>
            <span className="fx-strong">saas-pg</span>
            <span className="fx-badge">Replicated</span>
          </>
        }
      >
        <div
          style={{
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontSize: 12.5,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 7px 7px 11px',
              borderRadius: 10,
              boxShadow: '0 0 0 1px #ececec',
            }}
          >
            <span className="fx-muted">Storage volume</span>
            <span className="fx-segmented" style={{ fontSize: 12 }}>
              <span>20 GiB</span>
              <span data-active="">40 GiB</span>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 11px',
              borderRadius: 10,
              boxShadow: '0 0 0 1px #ececec',
            }}
          >
            <span>Daily 12:00 backup · 14 days</span>
            <span
              className="fx-mono"
              style={{ fontSize: 11, color: '#17803a' }}
            >
              ✓ Active
            </span>
          </div>
          <div
            className="fx-mono"
            style={{
              padding: '10px 11px',
              borderRadius: 10,
              boxShadow: '0 0 0 1px #ececec',
              fontSize: 11.5,
            }}
          >
            127.0.0.1:15432 ⇄ saas-pg.ns-prod.svc:5432
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 12px',
            borderTop: '1px solid #efefef',
            background: '#fbfbfb',
            fontSize: 12,
          }}
        >
          <span className="fx-muted">Online resize to 40 GiB, no downtime</span>
          <span className="fx-mono" style={{ fontSize: 11 }}>
            TLS tunnel ready
          </span>
        </div>
      </DutyFrame>
    </div>
  );
}

const HINTS = [
  ['Deploying update', 'new-api', 'amber'],
  ['Last deploy failed', 'billing-worker', 'red'],
  ['Partial instances unhealthy · 1/2', 'auth-ssr', 'red'],
  ['Recently restarted', 'webhook-relay', 'amber'],
  ['Approaching limit · 96%', 'new-api', 'amber'],
] as const;

export function WarningsCard() {
  return (
    <div className="fx" style={fill}>
      <DutyFrame title={<span className="fx-strong">Service hints · 7</span>}>
        <div style={{ padding: '6px 8px' }}>
          {HINTS.map(([hint, service, tone], i) => (
            <div
              key={hint}
              style={{
                display: 'grid',
                gridTemplateColumns: '14px 1fr auto',
                alignItems: 'center',
                gap: 8,
                height: 34,
                padding: '0 8px',
                borderRadius: 8,
                background: i === 0 ? '#f4f4f4' : undefined,
                fontSize: 12.5,
              }}
            >
              <span className="fx-dot" data-tone={tone} />
              <span style={{ fontWeight: i === 0 ? 500 : 400 }}>{hint}</span>
              <span className="fx-mono fx-faint" style={{ fontSize: 11 }}>
                {service}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            padding: '11px 14px',
            borderTop: '1px solid #efefef',
            background: '#fbfbfb',
            fontSize: 12,
          }}
        >
          Rolling out revision #18 · 1/2 pods updated
        </div>
      </DutyFrame>
    </div>
  );
}

/* ---------------- Everything your app depends on ---------------- */

const DATABASES = [
  { name: 'postgres', version: 'PostgreSQL 16', icon: '/icons/postgresql.svg' },
  { name: 'mysql', version: 'MySQL 8.0', icon: '/icons/mysql.svg' },
  { name: 'mongo', version: 'MongoDB 8.0', icon: '/icons/mongodb.svg' },
  { name: 'redis', version: 'Redis 7.2', icon: '/icons/redis.svg' },
];

export function DatabasesShot() {
  return (
    <div className="fx" style={fill}>
      {DATABASES.map((db, i) => (
        <div
          key={db.name}
          className="fx-float"
          style={{
            position: 'absolute',
            left: 20,
            top: 20 + i * 82,
            width: 280,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 18px',
            borderRadius: 16,
          }}
        >
          <span className="fx-logo" data-size="lg">
            <img src={db.icon} alt="" />
          </span>
          <span>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{db.name}</div>
            <div className="fx-muted" style={{ fontSize: 12.5, marginTop: 1 }}>
              {db.version}
            </div>
          </span>
          <span
            className="fx-dot"
            style={{ marginLeft: 'auto', boxShadow: '0 0 0 3px #e3f3e7' }}
          />
        </div>
      ))}
    </div>
  );
}

export function BucketsShot() {
  return (
    <div className="fx" style={fill}>
      <div
        className="fx-float"
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 20,
          height: 360,
          padding: 16,
          borderRadius: 16,
        }}
      >
        <div className="fx-strong" style={{ fontSize: 14 }}>
          Buckets
        </div>
        <div className="fx-faint" style={{ fontSize: 11 }}>
          3 buckets · 12.4 GB of 20 GB used
        </div>
        <div
          style={{
            marginTop: 14,
            borderRadius: 10,
            boxShadow: '0 0 0 1px #ececec',
            overflow: 'hidden',
          }}
        >
          {[
            ['assets', 'Public', 'blue'],
            ['uploads', 'Private', undefined],
            ['backups', 'Private', undefined],
          ].map(([name, perm, tone]) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 38,
                padding: '0 10px',
                borderTop: name === 'assets' ? 'none' : '1px solid #f0f0f0',
                fontSize: 12,
              }}
            >
              <HardDrive size={13} strokeWidth={1.75} color="#717171" />
              <span className="fx-strong">{name}</span>
              <span
                className="fx-badge"
                data-tone={tone}
                style={{ marginLeft: 'auto' }}
              >
                {perm}
              </span>
            </div>
          ))}
        </div>
        <div className="fx-strong" style={{ marginTop: 16, fontSize: 12 }}>
          Connection
        </div>
        <dl
          className="fx-kv"
          style={{
            margin: '10px 0 0',
            gridTemplateColumns: '76px 1fr',
            fontSize: 11.5,
            rowGap: 9,
          }}
        >
          <dt>Access key</dt>
          <dd
            className="fx-mono"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            mz0dmtig <Copy size={11} strokeWidth={1.75} color="#909090" />
          </dd>
          <dt>Secret key</dt>
          <dd style={{ letterSpacing: 1.5 }}>••••••••••••••</dd>
          <dt>Endpoint</dt>
          <dd className="fx-mono">s3.sealos.run</dd>
        </dl>
      </div>
    </div>
  );
}

export function GatewayShot() {
  return (
    <div className="fx" style={fill}>
      <div
        className="fx-float"
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 20,
          height: 360,
          padding: 16,
          borderRadius: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="fx-logo">
            <Waypoints size={15} strokeWidth={1.75} />
          </span>
          <span>
            <div className="fx-strong" style={{ fontSize: 14 }}>
              prod
            </div>
            <div className="fx-faint" style={{ fontSize: 11 }}>
              AI Gateway key
            </div>
          </span>
        </div>
        <div className="fx-tabs" style={{ marginTop: 14, fontSize: 11.5 }}>
          <span>Overview</span>
          <span data-active="">Connections</span>
        </div>
        <div
          className="fx-muted"
          style={{ marginTop: 10, fontSize: 11, lineHeight: 1.4 }}
        >
          Services that call models with this key.
        </div>
        {[
          {
            name: 'web',
            kind: 'OpenAI',
            vars: ['OPENAI_API_KEY', 'OPENAI_BASE_URL'],
          },
          {
            name: 'worker',
            kind: 'Anthropic',
            vars: ['ANTHROPIC_API_KEY', 'ANTHROPIC_BASE_URL'],
          },
        ].map((svc) => (
          <div
            key={svc.name}
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid #f0f0f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
              }}
            >
              <span
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: '#0A84FF',
                  color: '#fff',
                }}
              >
                <Check size={10} strokeWidth={3} />
              </span>
              <span className="fx-strong">{svc.name}</span>
              <span
                className="fx-light-btn"
                style={{
                  marginLeft: 'auto',
                  height: 22,
                  fontSize: 10.5,
                  padding: '0 8px',
                }}
              >
                {svc.kind} <ChevronDown strokeWidth={1.75} />
              </span>
            </div>
            {svc.vars.map((v) => (
              <div
                key={v}
                className="fx-mono"
                style={{
                  marginTop: 7,
                  marginLeft: 22,
                  padding: '4px 7px',
                  borderRadius: 6,
                  boxShadow: '0 0 0 1px #ececec',
                  fontSize: 10.5,
                }}
              >
                {v}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const WORKSPACES = [
  { name: 'Personal', color: '#cfe0fb', ink: '#1d4f9a', owner: true },
  { name: 'Community', color: '#fbd5d5', ink: '#9a2b2b' },
  { name: 'Client', color: '#ead5fb', ink: '#6b2b9a' },
];

export function WorkspacesShot() {
  return (
    <div className="fx" style={fill}>
      <div
        className="fx-float"
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          top: 24,
          padding: 6,
          borderRadius: 16,
        }}
      >
        {WORKSPACES.map((ws) => (
          <div
            key={ws.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              height: 46,
              padding: '0 8px',
              borderRadius: 11,
              background: ws.owner ? '#f2f2f2' : undefined,
              fontSize: 13.5,
            }}
          >
            <span
              className="fx-avatar"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: ws.color,
                color: ws.ink,
              }}
            >
              <User size={15} strokeWidth={1.75} />
            </span>
            {ws.name}
            {ws.owner ? (
              <span
                style={{
                  marginLeft: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Check size={14} strokeWidth={2} />
                <span
                  className="fx-badge"
                  style={{ background: '#e4e4e4', color: '#1c1c1c' }}
                >
                  Owner
                </span>
              </span>
            ) : null}
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 42,
            padding: '0 10px',
            fontSize: 13,
          }}
        >
          <Plus size={15} strokeWidth={1.75} /> Create new workspace
        </div>
        <div className="fx-hr" style={{ margin: '4px 4px' }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 42,
            padding: '0 10px',
            fontSize: 13,
          }}
        >
          <UserPlus size={15} strokeWidth={1.75} /> Invite members
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 42,
            padding: '0 10px',
            fontSize: 13,
          }}
        >
          <Settings size={15} strokeWidth={1.75} /> Workspace settings
        </div>
      </div>
    </div>
  );
}

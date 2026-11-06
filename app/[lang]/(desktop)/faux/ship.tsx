import {
  ArrowUp,
  ChevronDown,
  Database,
  HardDrive,
  LineChart,
  ListTree,
  Network,
  Plus,
  Settings,
  Waypoints,
} from 'lucide-react';
import { NextMark } from './rows';

const I = { size: 14, strokeWidth: 1.75 } as const;

const TEAM = [
  { initials: 'JL', color: '#F2C94C', ink: '#5c4400' },
  { initials: 'MK', color: '#9AD0F5', ink: '#0b4a75' },
  { initials: 'RS', color: '#C6B5F7', ink: '#3b2a7a' },
];

type ServiceNode = {
  id: string;
  title: string;
  sub: string;
  status: string;
  icon: React.ReactNode;
  y: number;
};

const SERVICES: ServiceNode[] = [
  {
    id: 'postgres',
    title: 'postgres',
    sub: 'PostgreSQL 16 · replicated',
    status: 'Running',
    icon: <img src="/icons/postgresql.svg" alt="" />,
    y: 70,
  },
  {
    id: 'redis',
    title: 'redis',
    sub: 'Redis 7.2 · sessions',
    status: 'Running',
    icon: <img src="/icons/redis.svg" alt="" />,
    y: 196,
  },
  {
    id: 'gateway',
    title: 'ai-gateway',
    sub: 'Claude · GPT-5 · one key',
    status: '1.2k calls today',
    icon: <Waypoints size={16} strokeWidth={1.75} color="#1c1c1c" />,
    y: 322,
  },
  {
    id: 'assets',
    title: 'assets',
    sub: 'Object storage · 12.4 GB',
    status: 'Public read',
    icon: <HardDrive size={16} strokeWidth={1.75} color="#1c1c1c" />,
    y: 448,
  },
];

const WEB = { x: 70, y: 236, w: 232, h: 142 };
const SVC_X = 452;

export function ShipCanvasShot() {
  const edgeStart = { x: WEB.x + WEB.w, y: WEB.y + WEB.h / 2 };
  return (
    <div className="fx" style={{ position: 'absolute', inset: 0 }}>
      <div
        className="fx-window"
        style={{
          left: 110,
          top: 56,
          width: 1076,
          height: 768,
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 46,
            padding: '0 14px',
            borderBottom: '1px solid #efefef',
            gap: 14,
          }}
        >
          <div className="fx-traffic">
            <i />
            <i />
            <i />
          </div>
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
            acme-saas{' '}
            <ChevronDown size={12} strokeWidth={1.75} color="#909090" />
          </span>
          <span
            style={{
              marginLeft: 196,
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
          <span style={{ marginLeft: 'auto', display: 'inline-flex' }}>
            {TEAM.map((m, i) => (
              <span
                key={m.initials}
                className="fx-avatar"
                data-round=""
                style={{
                  width: 26,
                  height: 26,
                  background: m.color,
                  color: m.ink,
                  marginLeft: i ? -5 : 0,
                  boxShadow: '0 0 0 2px #fff',
                  fontSize: 10,
                }}
              >
                {m.initials}
              </span>
            ))}
          </span>
          <span className="fx-dark-btn">Share</span>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <div
            style={{
              width: 312,
              height: 662,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 14,
              borderRight: '1px solid #efefef',
            }}
          >
            <div
              className="fx-bubble"
              style={{ maxWidth: 'none', fontSize: 12.5 }}
            >
              Add Redis for sessions and route support chat through the AI
              Gateway.
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
              Added <span className="fx-strong">redis</span> and wired{' '}
              <span className="fx-mono">REDIS_URL</span> into web. Support chat
              now calls Claude through your gateway key, so no provider keys
              live in the app.
            </div>
            <div className="fx-card" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 11px',
                  borderBottom: '1px solid #ececec',
                  fontSize: 12,
                }}
              >
                <span className="fx-strong">Plan #7</span>
                <span className="fx-badge" data-tone="green">
                  Applied
                </span>
                <span
                  className="fx-faint"
                  style={{ marginLeft: 'auto', fontSize: 11 }}
                >
                  approved by Jamie
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                  padding: '10px 11px 11px',
                }}
              >
                {[
                  ['+', 'redis', 'Redis 7.2, 1 GiB'],
                  ['~', 'web', 'REDIS_URL, AI_GATEWAY_URL'],
                  ['~', 'ai-gateway', 'key scoped to web'],
                ].map(([op, name, detail]) => (
                  <div
                    key={name}
                    className="fx-mono"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '14px 78px 1fr',
                      fontSize: 11,
                    }}
                  >
                    <span style={{ color: op === '+' ? '#1F9E3F' : '#E5960F' }}>
                      {op}
                    </span>
                    <span>{name}</span>
                    <span className="fx-faint">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 'auto' }}>
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
                  Ask the Ops Agent…
                </div>
                <div className="fx-composer-row" style={{ height: 28 }}>
                  <span
                    className="fx-icon-btn"
                    style={{ width: 24, height: 24 }}
                  >
                    <Plus strokeWidth={1.75} />
                  </span>
                  <span className="fx-send" style={{ width: 26, height: 26 }}>
                    <ArrowUp size={13} strokeWidth={2.2} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="fx-canvas" style={{ flex: 1, position: 'relative' }}>
            <svg
              width="764"
              height="722"
              style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
              aria-hidden
            >
              {SERVICES.map((s) => {
                const end = { x: SVC_X, y: s.y + 38 };
                const mid = (edgeStart.x + end.x) / 2;
                return (
                  <path
                    key={s.id}
                    d={`M${edgeStart.x} ${edgeStart.y} C${mid} ${edgeStart.y}, ${mid} ${end.y}, ${end.x} ${end.y}`}
                    fill="none"
                    stroke={s.id === 'redis' ? '#1c1c1c' : '#cfcfcf'}
                    strokeWidth={s.id === 'redis' ? 1.4 : 1.2}
                    strokeDasharray={s.id === 'redis' ? '4 4' : undefined}
                  />
                );
              })}
            </svg>

            <div
              className="fx-node"
              style={{ left: WEB.x, top: WEB.y, width: WEB.w }}
            >
              <div className="fx-node-head">
                <NextMark size={30} />
                <span>
                  <div className="fx-node-title">web</div>
                  <div className="fx-node-sub">acme/saas · main</div>
                </span>
              </div>
              <div className="fx-node-status">
                <span className="fx-dot" /> Live{' '}
                <span className="fx-faint">2 replicas</span>
              </div>
              <div className="fx-node-foot">
                <span style={{ color: '#1c1c1c' }}>app.acme.run</span>
              </div>
            </div>

            {SERVICES.map((s) => (
              <div
                key={s.id}
                className="fx-node"
                data-selected={s.id === 'redis' || undefined}
                style={{ left: SVC_X, top: s.y, width: 236 }}
              >
                <div className="fx-node-head" style={{ paddingBottom: 8 }}>
                  <span className="fx-logo">{s.icon}</span>
                  <span>
                    <div className="fx-node-title">{s.title}</div>
                    <div className="fx-node-sub">{s.sub}</div>
                  </span>
                </div>
                <div className="fx-node-status" style={{ paddingBottom: 12 }}>
                  <span className="fx-dot" /> {s.status}
                  {s.id === 'redis' ? (
                    <span
                      className="fx-badge"
                      data-tone="blue"
                      style={{ marginLeft: 'auto' }}
                    >
                      New
                    </span>
                  ) : null}
                </div>
              </div>
            ))}

            <span
              className="fx-light-btn"
              style={{ position: 'absolute', left: 16, bottom: 16 }}
            >
              <Plus strokeWidth={1.75} /> Add service
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

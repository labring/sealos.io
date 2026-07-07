'use client';

import { Fragment } from 'react';
import {
  Activity,
  Calendar,
  Container,
  Cpu,
  Database,
  FileCode2,
  FileText,
  HardDrive,
  Layers3,
  MemoryStick,
  MoreHorizontal,
  Router,
  Sheet,
  SquareTerminal,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

import { screenTransition } from './deploy-demo-common';

type DeploymentCanvasVariant = 'database' | 'docker' | 'github' | 'template';

type DeploymentCanvasConfig = {
  accessStage?: number;
  access?: { x: number; y: number };
  image?: string;
  line?: { x: number; y: number };
  runtimeName: string;
  runtimeStatus?: 'Creating' | 'Running' | 'Updating';
  runtime: { x: number; y: number };
  runtimeType: string;
  variant: 'container' | 'database';
};

const canvasConfigs: Record<DeploymentCanvasVariant, DeploymentCanvasConfig> = {
  github: {
    access: { x: 113, y: 125 },
    accessStage: 15,
    image: 'ghcr.io/every-app/open-seo:latest',
    line: { x: 295, y: 172 },
    runtime: { x: 344, y: 171 },
    runtimeName: 'open-seo-nzbmvj',
    runtimeStatus: 'Creating',
    runtimeType: 'Container Instance',
    variant: 'container',
  },
  docker: {
    access: { x: 128, y: 185 },
    accessStage: 7,
    image: 'ngix',
    line: { x: 310, y: 228 },
    runtime: { x: 359, y: 227 },
    runtimeName: 'orders-api',
    runtimeStatus: 'Running',
    runtimeType: 'Container Instance',
    variant: 'container',
  },
  database: {
    runtime: { x: 312, y: 217 },
    runtimeName: 'orders-api',
    runtimeStatus: 'Creating',
    runtimeType: 'Database PostgreSQL 16.4',
    variant: 'database',
  },
  template: {
    access: { x: 144, y: 199 },
    accessStage: 7,
    image: 'registry.cn-hangzhou.aliyuncs.com/fastgpt/fastgpt:v4.14.22',
    line: { x: 326, y: 242 },
    runtime: { x: 375, y: 241 },
    runtimeName: 'fastgpt-jwfifh',
    runtimeStatus: 'Updating',
    runtimeType: 'Container Instance',
    variant: 'container',
  },
};

export function DeploymentCanvas({
  readyStage,
  shifted = false,
  variant,
}: {
  readyStage: number;
  shifted?: boolean;
  variant: DeploymentCanvasVariant;
}) {
  const config = canvasConfigs[variant];
  const showRuntime = readyStage >= 4;
  const accessStage = config.accessStage;
  const showAccess = accessStage !== undefined && readyStage >= accessStage;
  const status = config.runtimeStatus ?? 'Creating';

  return (
    <div
      data-deployment-canvas
      data-deployment-canvas-variant={variant}
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden max-sm:hidden"
    >
      <div className="absolute top-1/2 left-1/2 h-[601px] w-[744px] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="size-full"
          animate={{ x: shifted ? -220 : 0 }}
          transition={screenTransition}
        >
          <AnimatePresence>
            {showRuntime && (
              <motion.div
                key="runtime"
                className="absolute z-10"
                style={{ left: config.runtime.x, top: config.runtime.y }}
                initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                transition={screenTransition}
              >
                <RuntimeCanvasCard
                  config={config}
                  showDatabaseDetails={config.variant === 'database'}
                  status={status}
                />
              </motion.div>
            )}

            {showAccess && config.access && config.line && (
              <Fragment key="access-group">
                <motion.div
                  key="access-line"
                  data-deployment-connector
                  className="absolute z-0 h-[83px] w-[46px]"
                  style={{ left: config.line.x, top: config.line.y }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={screenTransition}
                >
                  <svg
                    className="size-full overflow-visible"
                    viewBox="0 0 46 83"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M0 0 C30 12 10 63 45 83"
                      stroke="#3b82f6"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                      strokeWidth="1"
                    />
                    <rect
                      x="35"
                      y="36"
                      width="22"
                      height="22"
                      rx="6"
                      fill="#171a22"
                      stroke="rgba(255,255,255,0.12)"
                    />
                    <path
                      d="M42 45h7M42 49h7M42 53h7"
                      stroke="#d4d4d8"
                      strokeLinecap="round"
                      strokeWidth="1.2"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  key="access"
                  className="absolute z-10"
                  style={{ left: config.access.x, top: config.access.y }}
                  initial={{ opacity: 0, x: -18, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -12, filter: 'blur(8px)' }}
                  transition={screenTransition}
                >
                  <AccessDomainCanvasCard />
                </motion.div>
              </Fragment>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function RuntimeCanvasCard({
  config,
  showDatabaseDetails,
  status,
}: {
  config: DeploymentCanvasConfig;
  showDatabaseDetails: boolean;
  status: string;
}) {
  const Icon = showDatabaseDetails ? Database : Container;
  const metricIcon = showDatabaseDetails ? HardDrive : Layers3;

  return (
    <article className="w-[214px] overflow-hidden rounded-md border border-blue-400/70 bg-[#171a22]/90 shadow-[0_0_0_3px_rgba(59,130,246,0.13),0_22px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/10 p-2">
        <span className="grid size-7 place-items-center rounded-md bg-white/[0.06]">
          <Icon className="size-4 text-blue-300" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] leading-4 text-zinc-100">
            {config.runtimeName}
          </span>
          <span className="block truncate text-[11px] leading-4 text-zinc-500">
            {config.runtimeType}
          </span>
        </span>
        <span className="grid size-6 place-items-center rounded-md bg-white/[0.04] text-zinc-400">
          <MoreHorizontal className="size-3.5" aria-hidden />
        </span>
      </div>

      <div className="space-y-2 p-2">
        {showDatabaseDetails ? (
          <>
            <CanvasInfoBlock label="Private Connection" value="********" />
            <div className="rounded-md bg-black/20 p-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Public Connection</span>
                <span className="flex h-[17px] w-[31px] items-center rounded-full bg-white/20 px-0.5">
                  <span className="size-3.5 rounded-full bg-zinc-200" />
                </span>
              </div>
            </div>
          </>
        ) : (
          <CanvasInfoBlock label="Image" value={config.image ?? ''} />
        )}

        <div className="flex justify-end gap-1">
          {(showDatabaseDetails
            ? [Activity, SquareTerminal, FileText, Sheet]
            : [FileCode2, Activity, SquareTerminal, FileText, Calendar]
          ).map((ToolIcon) => (
            <span
              key={ToolIcon.displayName ?? ToolIcon.name}
              className="grid size-6 place-items-center rounded-md bg-white/[0.06] text-zinc-300"
            >
              <ToolIcon className="size-3.5" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 p-2 text-[10px]">
        <MetricPill dot={status === 'Running'} label={status} />
        <MetricPill Icon={Cpu} label="18%" />
        <MetricPill Icon={MemoryStick} label="28%" />
        <MetricPill
          Icon={metricIcon}
          label={showDatabaseDetails ? '28%' : '3'}
        />
      </div>
    </article>
  );
}

function AccessDomainCanvasCard() {
  return (
    <article className="w-[190px] overflow-hidden rounded-md border border-white/10 bg-[#171a22]/90 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-md bg-white/[0.06]">
          <Router className="size-4 text-zinc-300" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11px] text-zinc-100">
            orders.demo.sealos.run
          </span>
          <span className="block text-[10px] text-zinc-500">Access domain</span>
        </span>
        <span className="grid size-4 place-items-center rounded-full bg-emerald-400/20">
          <span className="size-1.5 rounded-full bg-emerald-400" />
        </span>
      </div>
      <div className="rounded-md bg-black/20 p-2">
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-100">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Platform Address
        </div>
        <p className="mt-1 truncate text-[9px] text-zinc-500">
          https://jczwcf.staging-usw-1.sealos.io/
        </p>
      </div>
    </article>
  );
}

function CanvasInfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-black/20 p-2">
      <p className="mb-1.5 text-[11px] text-zinc-500">{label}</p>
      <p className="truncate text-[10px] text-zinc-200">{value}</p>
    </div>
  );
}

function MetricPill({
  dot = false,
  Icon,
  label,
}: {
  dot?: boolean;
  Icon?: LucideIcon;
  label: string;
}) {
  return (
    <span
      className={cn(
        'flex items-center gap-1 text-zinc-400',
        dot
          ? 'text-emerald-400'
          : label === 'Updating' || label === 'Creating'
            ? 'text-blue-400'
            : undefined,
      )}
    >
      {dot ? (
        <span className="grid size-2.5 place-items-center rounded-full bg-emerald-400/25">
          <span className="size-1.5 rounded-full bg-emerald-400" />
        </span>
      ) : Icon ? (
        <Icon className="size-3" aria-hidden />
      ) : (
        <span className="grid size-2.5 place-items-center rounded-full bg-blue-500/25">
          <span className="size-1.5 rounded-full bg-blue-500" />
        </span>
      )}
      {label}
    </span>
  );
}

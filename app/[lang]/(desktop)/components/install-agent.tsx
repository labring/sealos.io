'use client';

import * as Popover from '@radix-ui/react-popover';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import claudeCodeIcon from '@/assets/stacks-appicons/claude-code.svg';
import openaiIcon from '@/assets/aiagent-appicons/openai.svg';
import cursorIcon from '@/assets/ide-icons/cursor.svg';
import {
  CLAUDE_INSTALL_COMMAND,
  CODEX_INSTALL_COMMAND,
  SKILLS_SH_INSTALL_COMMAND,
} from '@/app/[lang]/(home)/sealos-skills/content';
import { getRybbitCtaProps } from '@/lib/analytics/rybbit-cta';
import type { HomeCopy } from '../content';
import { portalContainer } from './portal';
import { ArrowRight, CheckIcon, CopyIcon } from './icons';

type Tab = 'claude' | 'codex' | 'other';

const COMMANDS: Record<Tab, string> = {
  claude: CLAUDE_INSTALL_COMMAND,
  codex: CODEX_INSTALL_COMMAND,
  other: SKILLS_SH_INSTALL_COMMAND,
};

const AVATARS = [
  { src: claudeCodeIcon, alt: 'Claude Code', invert: false },
  { src: openaiIcon, alt: 'Codex', invert: true },
  { src: cursorIcon, alt: 'Cursor', invert: false },
];

export function InstallWithAgent({
  copy,
  skillsHref,
}: {
  copy: HomeCopy['installAgent'];
  skillsHref: string;
}) {
  const [tab, setTab] = useState<Tab>('claude');
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(COMMANDS[tab]);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger
        className="sx-btn sx-btn-secondary sx-btn-lg sx-agent-trigger"
        {...getRybbitCtaProps({
          id: 'home_hero_install_agent',
          location: 'hero',
          destination: 'install_agent_popover',
        })}
      >
        <span className="sx-facepile" aria-hidden>
          {AVATARS.map((avatar) => (
            <span
              key={avatar.alt}
              className="sx-facepile-item"
              data-invert={avatar.invert || undefined}
            >
              <Image src={avatar.src} alt="" width={15} height={15} />
            </span>
          ))}
        </span>
        <span>{copy.cta}</span>
      </Popover.Trigger>
      <Popover.Portal container={portalContainer()}>
        <Popover.Content
          className="sx-popover sx-agent-popover"
          sideOffset={10}
          align="start"
          collisionPadding={16}
        >
          <div className="sx-agent-head">
            <div className="sx-agent-title">{copy.title}</div>
            <p className="sx-agent-body">{copy.body}</p>
          </div>
          <div className="sx-agent-tabs" role="tablist">
            {(Object.keys(COMMANDS) as Tab[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className="sx-agent-tab"
                data-active={tab === key || undefined}
                onClick={() => {
                  setTab(key);
                  setCopied(false);
                }}
              >
                {copy.tabs[key]}
              </button>
            ))}
          </div>
          <div className="sx-agent-command">
            <pre>
              {COMMANDS[tab].split('\n').map((line) => (
                <span key={line}>
                  <span className="sx-agent-prompt" aria-hidden>
                    $
                  </span>
                  {line}
                  {'\n'}
                </span>
              ))}
            </pre>
            <button
              type="button"
              className="sx-agent-copy"
              onClick={onCopy}
              data-copied={copied || undefined}
              {...getRybbitCtaProps({
                id: `home_hero_install_agent_copy_${tab}`,
                location: 'install_agent_popover',
                destination: 'clipboard',
              })}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? copy.copied : copy.copy}</span>
            </button>
          </div>
          <Link className="sx-agent-more" href={skillsHref}>
            {copy.learnMore}
            <ArrowRight />
          </Link>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

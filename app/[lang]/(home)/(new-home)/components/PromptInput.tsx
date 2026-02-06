'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUp, ChevronRight, Bot, Database, Code } from 'lucide-react';
import { Glare } from './Glare';
import React, {
  ReactNode,
  useState,
  useEffect,
  memo,
  useCallback,
} from 'react';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { useTypewriterEffect } from '@/hooks/useTypewriterEffect';
// AI Agent icons
import DifyIcon from '@/assets/aiagent-appicons/dify.svg';
import FastGPTIcon from '@/assets/aiagent-appicons/fastgpt.svg';
import LobechatIcon from '@/assets/aiagent-appicons/lobechat.svg';
import N8NIcon from '@/assets/aiagent-appicons/n8n.svg';
// Database icons
import KafkaIcon from '@/assets/db-appicons/kafkaicon.svg';
import MilvusIcon from '@/assets/db-appicons/milvus.svg';
import MongoIcon from '@/assets/db-appicons/mongoicon.svg';
import MysqlIcon from '@/assets/db-appicons/mysqlicon.svg';
import PgIcon from '@/assets/db-appicons/pgicon.svg';
import RedisIcon from '@/assets/db-appicons/redisicon.svg';
// Dev Runtime icons
import AstroIcon from '@/assets/stacks-appicons/astro.svg';
import DjangoIcon from '@/assets/stacks-appicons/django.svg';
import FlaskIcon from '@/assets/stacks-appicons/flask.svg';
import GolangIcon from '@/assets/stacks-appicons/golang.svg';
import JavaIcon from '@/assets/stacks-appicons/java.svg';
import NextjsIcon from '@/assets/stacks-appicons/nextjs.svg';
import PhpIcon from '@/assets/stacks-appicons/php.svg';
import PythonIcon from '@/assets/stacks-appicons/python.svg';
import ReactIcon from '@/assets/stacks-appicons/react.svg';
import RustIcon from '@/assets/stacks-appicons/rust.svg';
import SpringbootIcon from '@/assets/stacks-appicons/springboot.svg';

import { useGTM } from '@/hooks/use-gtm';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';
import { getOpenBrainParam } from '@/lib/utils/brain';

interface PromptOption {
  icon: ReactNode;
  name: string;
  prompt: string;
}

type CategoryConfig = {
  name: string;
  icon?: ReactNode;
} & (
  | {
      type: 'list';
      prompts: PromptOption[];
    }
  | {
      type: 'single';
      prompt: string;
    }
);

// 预制的 prompt 数据配置
const PROMPT_CATEGORIES: CategoryConfig[] = [
  {
    type: 'single',
    name: 'OpenClaw',
    prompt: 'Give me OpenClaw',
  },
  {
    type: 'single',
    name: 'Claude Code',
    prompt: 'Give me a cloud dev environment with claude code.',
  },
  {
    type: 'single',
    name: 'Build full-stack application',
    prompt:
      'I want to create a full-stack application using Next.js and database.',
  },
  {
    type: 'single',
    name: 'Deploy N8N',
    prompt: 'I need to deploy n8n from an app store with queue mode.',
  },
  {
    type: 'single',
    name: 'Build Django application',
    prompt: 'I want to build a Python Django web application.',
  },
  {
    type: 'list',
    name: 'AI Agent',
    icon: <Bot size={14} />,
    prompts: [
      {
        icon: <Image src={N8NIcon} alt="N8N" width={16} height={16} />,
        name: 'N8N',
        prompt: 'I want to deploy N8N from app store.',
      },
      {
        icon: <Image src={DifyIcon} alt="Dify" width={16} height={16} />,
        name: 'Dify',
        prompt: 'I want to deploy Dify from app store.',
      },
      {
        icon: <Image src={FastGPTIcon} alt="FastGPT" width={16} height={16} />,
        name: 'FastGPT',
        prompt: 'I want to deploy FastGPT from app store.',
      },
      {
        icon: (
          <Image src={LobechatIcon} alt="Lobe Chat" width={16} height={16} />
        ),
        name: 'Lobe Chat',
        prompt: 'I want to deploy Lobe Chat from app store.',
      },
    ],
  },
  {
    type: 'list',
    name: 'Database',
    icon: <Database size={14} />,
    prompts: [
      {
        icon: <Image src={PgIcon} alt="PostgreSQL" width={16} height={16} />,
        name: 'PostgreSQL',
        prompt: 'I want to deploy only PostgreSQL.',
      },
      {
        icon: <Image src={MongoIcon} alt="MongoDB" width={16} height={16} />,
        name: 'MongoDB',
        prompt: 'I want to deploy only MongoDB.',
      },
      {
        icon: <Image src={MysqlIcon} alt="MySQL" width={16} height={16} />,
        name: 'MySQL',
        prompt: 'I want to deploy only MySQL.',
      },
      {
        icon: <Image src={RedisIcon} alt="Redis" width={16} height={16} />,
        name: 'Redis',
        prompt: 'I want to deploy only Redis.',
      },
      {
        icon: <Image src={KafkaIcon} alt="Kafka" width={16} height={16} />,
        name: 'Kafka',
        prompt: 'I want to deploy only Kafka.',
      },
      {
        icon: <Image src={MilvusIcon} alt="Milvus" width={16} height={16} />,
        name: 'Milvus',
        prompt: 'I want to deploy only Milvus.',
      },
    ],
  },
  {
    type: 'list',
    name: 'Dev Runtime',
    icon: <Code size={14} />,
    prompts: [
      {
        icon: <Image src={NextjsIcon} alt="Next.js" width={16} height={16} />,
        name: 'Next.js',
        prompt: 'I want to build an app using Next.js devbox runtime.',
      },
      {
        icon: <Image src={ReactIcon} alt="React" width={16} height={16} />,
        name: 'React',
        prompt: 'I want to build an app using React devbox runtime.',
      },
      {
        icon: <Image src={AstroIcon} alt="Astro" width={16} height={16} />,
        name: 'Astro',
        prompt: 'I want to build an app using Astro devbox runtime.',
      },
      {
        icon: <Image src={DjangoIcon} alt="Django" width={16} height={16} />,
        name: 'Django',
        prompt: 'I want to build an app using Django devbox runtime.',
      },
      {
        icon: <Image src={FlaskIcon} alt="Flask" width={16} height={16} />,
        name: 'Flask',
        prompt: 'I want to build an app using Flask devbox runtime.',
      },
      {
        icon: (
          <Image
            src={SpringbootIcon}
            alt="Spring Boot"
            width={16}
            height={16}
          />
        ),
        name: 'Spring Boot',
        prompt: 'I want to build an app using Spring Boot devbox runtime.',
      },
      {
        icon: <Image src={PythonIcon} alt="Python" width={16} height={16} />,
        name: 'Python',
        prompt: 'I want to build an app using python devbox runtime.',
      },
      {
        icon: <Image src={GolangIcon} alt="Go" width={16} height={16} />,
        name: 'Go',
        prompt: 'I want to build an app using golang devbox runtime.',
      },
      {
        icon: <Image src={PhpIcon} alt="PHP" width={16} height={16} />,
        name: 'PHP',
        prompt: 'I want to build an app using PHP devbox runtime.',
      },
      {
        icon: <Image src={JavaIcon} alt="Java" width={16} height={16} />,
        name: 'Java',
        prompt: 'I want to build an app using Java devbox runtime.',
      },
      {
        icon: <Image src={RustIcon} alt="Rust" width={16} height={16} />,
        name: 'Rust',
        prompt: 'I want to build an app using Rust devbox runtime.',
      },
    ],
  },
];

// Isolated typewriter component with its own hook
// This component manages its own state and only re-renders itself
const TypewriterOverlay = memo(
  ({
    isActive,
    language,
    isInView,
  }: {
    isActive: boolean;
    language: string;
    isInView: boolean;
  }) => {
    const { currentText } = useTypewriterEffect(isActive && isInView, language);

    if (!isActive) return null;

    return (
      <div
        className="pointer-events-none absolute inset-0 flex items-start p-3 pt-2"
        aria-hidden="true"
      >
        <div className="text-base text-zinc-400 md:text-base">
          {currentText}
          <span className="animate-pulse">|</span>
        </div>
      </div>
    );
  },
);
TypewriterOverlay.displayName = 'TypewriterOverlay';

// Memoized prompt categories component
const PromptCategories = memo(
  ({ onPromptSelect }: { onPromptSelect: (prompt: string) => void }) => (
    <div className="flex flex-col gap-2 p-2">
      <div className="text-xs text-zinc-500 sm:text-sm">
        <span className="text-zinc-400">Try instant deploys</span> — click to
        auto-fill:
      </div>

      <div className="flex flex-wrap gap-2">
        {PROMPT_CATEGORIES.map((category) => (
          <React.Fragment key={category.name}>
            {category.type === 'list' && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex cursor-pointer items-center gap-1 rounded-full bg-white/[0.07] px-2 py-1 text-xs whitespace-nowrap text-zinc-400 transition-colors hover:bg-white/[0.1] sm:text-sm"
                    aria-label={'Predefined prompt list: ' + category.name}
                    aria-description="Click to see available prompts"
                  >
                    {category.icon}
                    <span>{category.name}</span>
                    <ChevronRight size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {category.prompts.map((prompt) => (
                    <DropdownMenuItem
                      key={prompt.name}
                      onClick={() => onPromptSelect(prompt.prompt)}
                      className="cursor-pointer"
                      aria-label={'Predefined prompt: ' + category.name}
                      aria-description="Click to fill this prompt"
                    >
                      <span className="mr-2">{prompt.icon}</span>
                      <span>{prompt.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {category.type === 'single' && (
              <button
                className="flex cursor-pointer items-center gap-1 rounded-full bg-white/[0.07] px-2 py-1 text-xs whitespace-nowrap text-zinc-400 transition-colors hover:bg-white/[0.1] sm:text-sm"
                onClick={() => onPromptSelect(category.prompt)}
                aria-label={'Predefined prompt: ' + category.name}
                aria-description="Click to fill this prompt"
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
);
PromptCategories.displayName = 'PromptCategories';

// Memoized glare effect component
const GlareEffect = memo(() => {
  return (
    <>
      <Glare
        className="absolute -top-[4.25rem] -left-[4.25rem] size-36"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -top-16 -left-16 -z-5 h-32 w-32"
        style={{
          background: `radial-gradient(48px circle, rgba(255,255,255,1), transparent 70%)`,
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />
    </>
  );
});
GlareEffect.displayName = 'GlareEffect';

export function PromptInput() {
  const { trackButton, trackCustom } = useGTM();
  const openAuthForm = useOpenAuthForm();

  const [promptText, setPromptText] = useState('');
  const [isChromium, setIsChromium] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  // Use typewriter effect
  const { currentText: typewriterText, fullText: typewriterFullText } =
    useTypewriterEffect(!isTouched, currentLanguage);

  // Store the typewriter full text in a ref for send handler
  const typewriterFullTextRef = React.useRef('');
  useEffect(() => {
    typewriterFullTextRef.current = typewriterFullText;
  }, [typewriterFullText]);

  useEffect(() => {
    // Degrade for firefox/safari
    const userAgent = navigator.userAgent.toLowerCase();
    setIsChromium(userAgent.includes('chrome') && userAgent.includes('safari'));

    // 检测当前语言
    const pathLang = window.location.pathname.split('/')[1];
    if (pathLang === 'zh-cn') {
      setCurrentLanguage('zh-cn');
    } else {
      setCurrentLanguage('en');
    }
  }, []);

  const handlePromptSelect = useCallback((prompt: string) => {
    setIsTouched(true);
    setPromptText(prompt);
  }, []);

  const handleSendPrompt = useCallback(() => {
    // Use typewriter text if user hasn't touched the textarea, otherwise use promptText
    const textToSend = isTouched ? promptText : typewriterFullTextRef.current;

    if (textToSend.trim()) {
      trackButton('Get Started', 'hero-section', 'auth-form', '');
      openAuthForm({ openapp: getOpenBrainParam(textToSend) });
    }
  }, [promptText, isTouched, trackButton, openAuthForm]);

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setIsTouched(true);
      setPromptText(e.target.value);
    },
    [],
  );

  const handleTextareaInteraction = useCallback(() => {
    if (!isTouched) {
      setIsTouched(true);
      setPromptText('');
    }
  }, [isTouched]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter key (without Shift) triggers send
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendPrompt();
      }
      // Shift+Enter allows new line creation (default behavior)
    },
    [handleSendPrompt],
  );

  return (
    <div
      ref={containerRef}
      className="border-gradient relative flex flex-col rounded-2xl px-3 py-4 inset-shadow-[0_0_8px_0_rgba(255,255,255,0.25)]"
    >
      {isChromium && <GlareEffect />}

      {/* Textarea */}
      <div className="relative rounded-lg bg-white/[0.07]">
        <Textarea
          placeholder={
            isTouched
              ? 'Describe what you want to ship. e.g., I want to deploy N8N from app store. (Press Enter to send, Shift+Enter for new line)'
              : ''
          }
          rows={5}
          className="w-full resize-none border-none bg-transparent text-base shadow-none placeholder:text-zinc-400 focus-visible:ring-0 md:text-base"
          value={isTouched ? promptText : ''}
          onChange={handleTextareaChange}
          onFocus={(e) => {
            handleTextareaInteraction();
            trackCustom('prompt_focus', {
              interaction_location: 'prompt_textarea',
            });
          }}
          onClick={handleTextareaInteraction}
          onKeyDown={handleKeyDown}
          aria-live="polite"
          aria-label="Prompt input"
        />

        {/* 循环打字机效果叠加层 - 完全隔离的组件 */}
        <TypewriterOverlay
          isActive={!isTouched}
          language={currentLanguage}
          isInView={isInView}
        />

        <Button
          className="absolute right-3 bottom-3 z-10 size-10 cursor-pointer rounded-lg bg-zinc-200 p-0 text-zinc-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isTouched ? !promptText.trim() : !typewriterFullText.trim()}
          onClick={handleSendPrompt}
          aria-label={
            'Send prompt ' +
            (isTouched ? promptText : typewriterFullText) +
            ' to Sealos Brain.'
          }
        >
          <ArrowUp size={20} />
        </Button>
      </div>

      <PromptCategories onPromptSelect={handlePromptSelect} />
    </div>
  );
}

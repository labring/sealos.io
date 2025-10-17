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
import { ReactNode, useState } from 'react';
import Image from 'next/image';
// AI Agent icons
import DifyIcon from '../assets/aiagent-appicons/dify.svg';
import FastGPTIcon from '../assets/aiagent-appicons/fastgpt.svg';
import LobechatIcon from '../assets/aiagent-appicons/lobechat.svg';
import N8NIcon from '../assets/aiagent-appicons/n8n.svg';
// Database icons
import KafkaIcon from '../assets/db-appicons/kafkaicon.svg';
import MilvusIcon from '../assets/db-appicons/milvus.svg';
import MongoIcon from '../assets/db-appicons/mongoicon.svg';
import MysqlIcon from '../assets/db-appicons/mysqlicon.svg';
import PgIcon from '../assets/db-appicons/pgicon.svg';
import RedisIcon from '../assets/db-appicons/redisicon.svg';
// Dev Runtime icons
import AstroIcon from '../assets/stacks-appicons/astro.svg';
import DjangoIcon from '../assets/stacks-appicons/django.svg';
import GolangIcon from '../assets/stacks-appicons/golang.svg';
import JavaIcon from '../assets/stacks-appicons/java.svg';
import NextjsIcon from '../assets/stacks-appicons/nextjs.svg';
import PhpIcon from '../assets/stacks-appicons/php.svg';
import PythonIcon from '../assets/stacks-appicons/python.svg';
import ReactIcon from '../assets/stacks-appicons/react.svg';
import RustIcon from '../assets/stacks-appicons/rust.svg';
import SpringbootIcon from '../assets/stacks-appicons/springboot.svg';

interface PromptOption {
  icon: ReactNode;
  name: string;
  prompt: string;
}

interface CategoryConfig {
  name: string;
  icon: ReactNode;
  prompts: PromptOption[];
}

// 预制的 prompt 数据配置
const PROMPT_CATEGORIES: CategoryConfig[] = [
  {
    name: 'AI Agent',
    icon: <Bot size={14} />,
    prompts: [
      {
        icon: <Image src={DifyIcon} alt="Dify" width={16} height={16} />,
        name: 'Dify',
        prompt: '',
      },
      {
        icon: <Image src={FastGPTIcon} alt="FastGPT" width={16} height={16} />,
        name: 'FastGPT',
        prompt: '',
      },
      {
        icon: <Image src={LobechatIcon} alt="LobeChat" width={16} height={16} />,
        name: 'LobeChat',
        prompt: '',
      },
      {
        icon: <Image src={N8NIcon} alt="N8N" width={16} height={16} />,
        name: 'N8N',
        prompt: '',
      },
    ],
  },
  {
    name: 'Database',
    icon: <Database size={14} />,
    prompts: [
      {
        icon: <Image src={PgIcon} alt="PostgreSQL" width={16} height={16} />,
        name: 'PostgreSQL',
        prompt: '',
      },
      {
        icon: <Image src={MysqlIcon} alt="MySQL" width={16} height={16} />,
        name: 'MySQL',
        prompt: '',
      },
      {
        icon: <Image src={MongoIcon} alt="MongoDB" width={16} height={16} />,
        name: 'MongoDB',
        prompt: '',
      },
      {
        icon: <Image src={RedisIcon} alt="Redis" width={16} height={16} />,
        name: 'Redis',
        prompt: '',
      },
      {
        icon: <Image src={KafkaIcon} alt="Kafka" width={16} height={16} />,
        name: 'Kafka',
        prompt: '',
      },
      {
        icon: <Image src={MilvusIcon} alt="Milvus" width={16} height={16} />,
        name: 'Milvus',
        prompt: '',
      },
    ],
  },
  {
    name: 'Dev Runtime',
    icon: <Code size={14} />,
    prompts: [
      {
        icon: <Image src={NextjsIcon} alt="Next.js" width={16} height={16} />,
        name: 'Next.js',
        prompt: '',
      },
      {
        icon: <Image src={ReactIcon} alt="React" width={16} height={16} />,
        name: 'React',
        prompt: '',
      },
      {
        icon: <Image src={PythonIcon} alt="Python" width={16} height={16} />,
        name: 'Python',
        prompt: '',
      },
      {
        icon: <Image src={DjangoIcon} alt="Django" width={16} height={16} />,
        name: 'Django',
        prompt: '',
      },
      {
        icon: <Image src={GolangIcon} alt="Golang" width={16} height={16} />,
        name: 'Golang',
        prompt: '',
      },
      {
        icon: <Image src={JavaIcon} alt="Java" width={16} height={16} />,
        name: 'Java',
        prompt: '',
      },
      {
        icon: <Image src={SpringbootIcon} alt="Spring Boot" width={16} height={16} />,
        name: 'Spring Boot',
        prompt: '',
      },
      {
        icon: <Image src={PhpIcon} alt="PHP" width={16} height={16} />,
        name: 'PHP',
        prompt: '',
      },
      {
        icon: <Image src={RustIcon} alt="Rust" width={16} height={16} />,
        name: 'Rust',
        prompt: '',
      },
      {
        icon: <Image src={AstroIcon} alt="Astro" width={16} height={16} />,
        name: 'Astro',
        prompt: '',
      },
    ],
  },
];

export function PromptInput() {
  const [promptText, setPromptText] = useState('');

  const handlePromptSelect = (prompt: string) => {
    setPromptText(prompt);
  };

  const handleSendPrompt = () => {
    if (promptText.trim()) {
      const url = `https://brain.usw.sealos.io/tutorial?query=${encodeURIComponent(promptText)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="border-gradient-glass relative flex flex-col rounded-2xl px-3 py-4 inset-shadow-[0_0_8px_0_rgba(255,255,255,0.25)]">
      <Glare className="absolute -top-[4.25rem] -left-[4.25rem] size-36" />
      {/* Not bright enough */}
      <div
        className="pointer-events-none absolute inset-0 -top-16 -left-16 -z-5 h-32 w-32"
        style={{
          background: `radial-gradient(48px circle, rgba(255,255,255,1), transparent 70%)`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Textarea */}
      <div className="relative rounded-lg bg-white/[0.07]">
        <Textarea
          placeholder="Describe what you want to ship. e.g., I want to deploy N8N from app store."
          rows={5}
          className="w-full resize-none border-none bg-transparent text-sm shadow-none placeholder:text-zinc-400 focus-visible:ring-0 sm:text-base"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
        />

        <Button
          className="absolute right-3 bottom-3 z-10 size-10 rounded-lg bg-zinc-600 p-0 text-white disabled:opacity-40"
          disabled={!promptText.trim()}
          onClick={handleSendPrompt}
        >
          <ArrowUp size={20} />
        </Button>
      </div>

      <div className="flex flex-col gap-2 p-2">
        <div className="text-xs text-zinc-500 sm:text-sm">
          Some ideas to get started:
        </div>

        <div className="flex flex-wrap gap-2">
          {PROMPT_CATEGORIES.map((category) => (
            <DropdownMenu key={category.name}>
              <DropdownMenuTrigger asChild>
                <button className="flex cursor-pointer items-center gap-1 rounded-full bg-white/[0.07] px-2 py-1 text-xs whitespace-nowrap text-zinc-400 transition-colors hover:bg-white/[0.1] sm:text-sm">
                  {category.icon}
                  <span>{category.name}</span>
                  <ChevronRight size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {category.prompts.map((prompt) => (
                  <DropdownMenuItem
                    key={prompt.name}
                    onClick={() => handlePromptSelect(prompt.prompt)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{prompt.icon}</span>
                    <span>{prompt.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      </div>
    </div>
  );
}

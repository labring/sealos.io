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
        icon: <Bot size={16} />,
        name: 'Dify AI Agent',
        prompt:
          'I want to deploy Dify AI Agent from the app store to build my own AI assistant.',
      },
      {
        icon: <Bot size={16} />,
        name: 'FastGPT',
        prompt: 'I want to deploy FastGPT to create a knowledge base chatbot.',
      },
      {
        icon: <Bot size={16} />,
        name: 'Langfuse',
        prompt:
          'I want to deploy Langfuse for LLM observability and monitoring.',
      },
    ],
  },
  {
    name: 'Database',
    icon: <Database size={14} />,
    prompts: [
      {
        icon: <Database size={16} />,
        name: 'PostgreSQL',
        prompt: 'I want to create a PostgreSQL database for my application.',
      },
      {
        icon: <Database size={16} />,
        name: 'MongoDB',
        prompt: 'I want to deploy MongoDB for document-based data storage.',
      },
      {
        icon: <Database size={16} />,
        name: 'Redis',
        prompt: 'I want to set up Redis for caching and session management.',
      },
    ],
  },
  {
    name: 'Dev Runtime',
    icon: <Code size={14} />,
    prompts: [
      {
        icon: <Code size={16} />,
        name: 'Node.js App',
        prompt:
          'I want to deploy a Node.js application with custom runtime environment.',
      },
      {
        icon: <Code size={16} />,
        name: 'Python App',
        prompt:
          'I want to deploy a Python application with required dependencies.',
      },
      {
        icon: <Code size={16} />,
        name: 'Go App',
        prompt: 'I want to deploy a Go application with optimized performance.',
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

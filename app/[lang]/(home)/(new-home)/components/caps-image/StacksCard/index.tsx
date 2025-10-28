'use client';
import { StackCard } from './StackCard';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ClaudeCodeIcon from '../../../assets/stacks-appicons/claude-code.svg';
import EchoIcon from '../../../assets/stacks-appicons/echo.svg';
import McpIcon from '../../../assets/stacks-appicons/mcp.svg';
import NextjsIcon from '../../../assets/stacks-appicons/nextjs-caps.svg';
import SpringBootIcon from '../../../assets/stacks-appicons/springboot.svg';
import UbuntuIcon from '../../../assets/stacks-appicons/ubuntu.svg';

// 技术栈配置
const stacks = [
  {
    name: 'Next.js',
    version: 'v15.0',
    icon: <Image src={NextjsIcon} alt="Next.js" className="h-full w-full" />,
  },
  {
    name: 'Spring Boot',
    version: 'v3.2',
    icon: (
      <Image src={SpringBootIcon} alt="Spring Boot" className="h-full w-full" />
    ),
  },
  {
    name: 'Ubuntu',
    version: 'v24.04',
    icon: <Image src={UbuntuIcon} alt="Ubuntu" className="h-full w-full" />,
  },
  {
    name: 'Claude Code',
    version: 'v2.0',
    icon: (
      <Image src={ClaudeCodeIcon} alt="Claude Code" className="h-full w-full" />
    ),
  },
  {
    name: 'Echo',
    version: 'v4.12',
    icon: <Image src={EchoIcon} alt="Echo" className="h-full w-full" />,
  },
  {
    name: 'MCP',
    version: 'v1.0',
    icon: <Image src={McpIcon} alt="MCP" className="h-full w-full" />,
  },
];

export function StacksCard() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* 三列瀑布流容器 */}
      <div className="flex h-full gap-4 px-4 py-8">
        {/* 第一列 - 向下滚动 */}
        <div className="relative flex min-w-36 flex-1 overflow-hidden">
          <motion.div
            className="flex w-full flex-col gap-4 will-change-transform"
            animate={{ y: ['0%', '-50%'] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* 渲染两批相同内容 */}
            {[...stacks, ...stacks].map((stack, index) => (
              <StackCard
                key={index}
                name={stack.name}
                version={stack.version}
                icon={stack.icon}
              />
            ))}
          </motion.div>
        </div>

        {/* 第二列 - 向上滚动 */}
        <div className="relative flex min-w-36 flex-1 overflow-hidden">
          <motion.div
            className="flex w-full flex-col gap-4 will-change-transform"
            animate={{ y: ['-50%', '0%'] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* 渲染两批相同内容，起始位置不同 */}
            {[
              ...stacks.slice(2),
              ...stacks.slice(0, 2),
              ...stacks.slice(2),
              ...stacks.slice(0, 2),
            ].map((stack, index) => (
              <StackCard
                key={index}
                name={stack.name}
                version={stack.version}
                icon={stack.icon}
              />
            ))}
          </motion.div>
        </div>

        {/* 第三列 - 向下滚动 */}
        <div className="relative flex min-w-36 flex-1 overflow-hidden">
          <motion.div
            className="flex w-full flex-col gap-4 will-change-transform"
            animate={{ y: ['0%', '-50%'] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* 渲染两批相同内容，起始位置不同 */}
            {[
              ...stacks.slice(1),
              ...stacks.slice(0, 1),
              ...stacks.slice(1),
              ...stacks.slice(0, 1),
            ].map((stack, index) => (
              <StackCard
                key={index}
                name={stack.name}
                version={stack.version}
                icon={stack.icon}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* 暗角特效 - SVG 径向渐变叠加层 */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="vignette-stacks" cx="50%" cy="50%" r="50%">
            <stop offset="20%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.8" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#vignette-stacks)" />
      </svg>
    </div>
  );
}

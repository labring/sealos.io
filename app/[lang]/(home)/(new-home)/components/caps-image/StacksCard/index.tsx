'use client';
import { StackCard } from './StackCard';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ClaudeCodeIcon from '../../../assets/stacks-appicons/claude-code.svg';
import EchoIcon from '../../../assets/stacks-appicons/echo.svg';
import McpIcon from '../../../assets/stacks-appicons/mcp.svg';
import NextjsIcon from '../../../assets/stacks-appicons/nextjs-caps.svg';
import SpringBootIcon from '../../../assets/stacks-appicons/spring-boot.svg';
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

// 为每一列复制数据以实现无限滚动
const column1Data = [...stacks, ...stacks];
const column2Data = [
  ...stacks.slice(2),
  ...stacks.slice(0, 2),
  ...stacks.slice(2),
  ...stacks.slice(0, 2),
];
const column3Data = [
  ...stacks.slice(1),
  ...stacks.slice(0, 1),
  ...stacks.slice(1),
  ...stacks.slice(0, 1),
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
        <motion.div
          className="flex flex-1 flex-col gap-4"
          initial={{ y: '0%' }}
          animate={{ y: '-50%' }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        >
          {column1Data.map((stack, index) => (
            <StackCard
              key={index}
              name={stack.name}
              version={stack.version}
              icon={stack.icon}
            />
          ))}
        </motion.div>

        {/* 第二列 - 向上滚动 */}
        <motion.div
          className="flex flex-1 flex-col gap-4"
          initial={{ y: '-50%' }}
          animate={{ y: '0%' }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        >
          {column2Data.map((stack, index) => (
            <StackCard
              key={index}
              name={stack.name}
              version={stack.version}
              icon={stack.icon}
            />
          ))}
        </motion.div>

        {/* 第三列 - 向下滚动 */}
        <motion.div
          className="flex flex-1 flex-col gap-4"
          initial={{ y: '0%' }}
          animate={{ y: '-50%' }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        >
          {column3Data.map((stack, index) => (
            <StackCard
              key={index}
              name={stack.name}
              version={stack.version}
              icon={stack.icon}
            />
          ))}
        </motion.div>
      </div>

      {/* 暗角特效 - 使用 darken 混合模式 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 20%, rgba(0, 0, 0, 0.8) 100%)',
          mixBlendMode: 'darken',
        }}
      />
    </div>
  );
}

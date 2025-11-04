'use client';
import { DBCard } from './DBCard';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { memo, useRef } from 'react';
import KafkaIcon from '@/assets/db-appicons/kafkaicon.svg';
import MilvusIcon from '@/assets/db-appicons/milvus.svg';
import MongoIcon from '@/assets/db-appicons/mongoicon.svg';
import MysqlIcon from '@/assets/db-appicons/mysqlicon.svg';
import PgIcon from '@/assets/db-appicons/pgicon.svg';
import RedisIcon from '@/assets/db-appicons/redisicon.svg';
import ChatInputImage from './assets/chat-input.svg';

// 数据库配置
const databases = [
  {
    name: 'PostgreSQL',
    version: 'v16.1',
    icon: <Image src={PgIcon} alt="PostgreSQL" className="h-full w-full" />,
  },
  {
    name: 'MySQL',
    version: 'v8.0',
    icon: <Image src={MysqlIcon} alt="MySQL" className="h-full w-full" />,
  },
  {
    name: 'MongoDB',
    version: 'v7.0',
    icon: <Image src={MongoIcon} alt="MongoDB" className="h-full w-full" />,
  },
  {
    name: 'Redis',
    version: 'v7.2',
    icon: <Image src={RedisIcon} alt="Redis" className="h-full w-full" />,
  },
  {
    name: 'Kafka',
    version: 'v3.6',
    icon: <Image src={KafkaIcon} alt="Kafka" className="h-full w-full" />,
  },
  {
    name: 'Milvus',
    version: 'v2.3',
    icon: <Image src={MilvusIcon} alt="Milvus" className="h-full w-full" />,
  },
];

interface DataCardProps {
  isActive?: boolean;
}

export const DataCard = memo(function DataCard({
  isActive = false,
}: DataCardProps = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* 三列瀑布流容器 */}
      <div className="flex h-full gap-4 px-4">
        {/* 第一列 - 向下滚动 */}
        <div className="relative flex min-w-48 flex-1 overflow-hidden">
          <motion.div
            className="flex w-full flex-col gap-4 will-change-transform"
            animate={isInView ? { y: ['0%', '-50%'] } : {}}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* 渲染两批相同内容 */}
            {[...databases, ...databases].map((db, index) => (
              <DBCard
                key={index}
                name={db.name}
                version={db.version}
                icon={db.icon}
              />
            ))}
          </motion.div>
        </div>

        {/* 第二列 - 向上滚动 */}
        <div className="relative flex min-w-48 flex-1 overflow-hidden">
          <motion.div
            className="flex w-full flex-col gap-4 will-change-transform"
            animate={isInView ? { y: ['-50%', '0%'] } : {}}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* 渲染两批相同内容，起始位置不同 */}
            {[
              ...databases.slice(2),
              ...databases.slice(0, 2),
              ...databases.slice(2),
              ...databases.slice(0, 2),
            ].map((db, index) => (
              <DBCard
                key={index}
                name={db.name}
                version={db.version}
                icon={db.icon}
              />
            ))}
          </motion.div>
        </div>

        {/* 第三列 - 向下滚动 */}
        <div className="relative flex min-w-48 flex-1 overflow-hidden">
          <motion.div
            className="flex w-full flex-col gap-4 will-change-transform"
            animate={isInView ? { y: ['0%', '-50%'] } : {}}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* 渲染两批相同内容，起始位置不同 */}
            {[
              ...databases.slice(1),
              ...databases.slice(0, 1),
              ...databases.slice(1),
              ...databases.slice(0, 1),
            ].map((db, index) => (
              <DBCard
                key={index}
                name={db.name}
                version={db.version}
                icon={db.icon}
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
          <radialGradient id="vignette-data" cx="50%" cy="50%" r="50%">
            <stop offset="20%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.8" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#vignette-data)" />
      </svg>

      {/* 中间的 chat-input 图片 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Image src={ChatInputImage} alt="" className="h-auto w-2/3" />
      </div>
    </div>
  );
});

'use client';
import { DBCard } from './DBCard';
import { motion } from 'framer-motion';
import Image from 'next/image';
import KafkaIcon from '../../../assets/db-appicons/kafkaicon.svg';
import MilvusIcon from '../../../assets/db-appicons/milvus.svg';
import MongoIcon from '../../../assets/db-appicons/mongoicon.svg';
import MysqlIcon from '../../../assets/db-appicons/mysqlicon.svg';
import PgIcon from '../../../assets/db-appicons/pgicon.svg';
import RedisIcon from '../../../assets/db-appicons/redisicon.svg';
import ChatInputImage from '../IdeaCard/assets/chat-input.svg';

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

// 为每一列复制数据以实现无限滚动
const column1Data = [...databases, ...databases];
const column2Data = [
  ...databases.slice(2),
  ...databases.slice(0, 2),
  ...databases.slice(2),
  ...databases.slice(0, 2),
];
const column3Data = [
  ...databases.slice(1),
  ...databases.slice(0, 1),
  ...databases.slice(1),
  ...databases.slice(0, 1),
];

export function DataCard() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* 三列瀑布流容器 */}
      <div className="flex h-full gap-4 px-4 py-8">
        {/* 第一列 - 向下滚动 */}
        <motion.div
          className="flex flex-1 flex-col gap-4 will-change-transform"
          initial={{ y: '0%' }}
          animate={{ y: '-50%' }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        >
          {column1Data.map((db, index) => (
            <DBCard
              key={index}
              name={db.name}
              version={db.version}
              icon={db.icon}
            />
          ))}
        </motion.div>

        {/* 第二列 - 向上滚动 */}
        <motion.div
          className="flex flex-1 flex-col gap-4 will-change-transform"
          initial={{ y: '-50%' }}
          animate={{ y: '0%' }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        >
          {column2Data.map((db, index) => (
            <DBCard
              key={index}
              name={db.name}
              version={db.version}
              icon={db.icon}
            />
          ))}
        </motion.div>

        {/* 第三列 - 向下滚动 */}
        <motion.div
          className="flex flex-1 flex-col gap-4 will-change-transform"
          initial={{ y: '0%' }}
          animate={{ y: '-50%' }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        >
          {column3Data.map((db, index) => (
            <DBCard
              key={index}
              name={db.name}
              version={db.version}
              icon={db.icon}
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

      {/* 中间的 chat-input 图片 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Image src={ChatInputImage} alt="" className="h-auto w-2/3" />
      </div>
    </div>
  );
}

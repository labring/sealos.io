'use client';
import InputCard from './input-card.svg';
import ResponseCard from './response-card.svg';
import ReportCard from './report-card.svg';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function IdeaCard() {
  return (
    <svg className="h-full w-full overflow-visible">
      <foreignObject x="0" y="0" width="100%" height="100%">
        <div className="relative h-full w-full overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute top-[10%] left-[30%] w-[65%]"
          >
            <Image src={ReportCard} alt="" className="h-auto w-full" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-[30%] left-[15%] w-[65%]"
          >
            <Image src={ResponseCard} alt="" className="h-auto w-full" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="absolute top-[50%] left-[5%] w-[65%]"
          >
            <Image src={InputCard} alt="" className="h-auto w-full" />
          </motion.div>
        </div>
      </foreignObject>
    </svg>
  );
}

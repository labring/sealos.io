'use client';
import InputCard from './input-card.svg';
import ResponseCard from './response-card.svg';
import ReportCard from './report-card.svg';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function IdeaCard() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute top-[18%] left-[38%]"
      >
        <Image src={ReportCard} alt="" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-[36%] left-[24%]"
      >
        <Image src={ResponseCard} alt="" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0 }}
        className="absolute top-[54%] left-[10%]"
      >
        <Image src={InputCard} alt="" />
      </motion.div>
    </div>
  );
}

'use client';

import { motion } from 'motion/react';

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  bgColor,
  iconColor,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full cursor-pointer rounded-xl border border-gray-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-gray-200 hover:shadow-xl"
    >
      <div className="mb-3 flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgColor}`}
        >
          <div className={`h-5 w-5 ${iconColor}`}>{icon}</div>
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

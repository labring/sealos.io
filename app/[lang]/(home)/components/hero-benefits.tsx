import React from 'react';
import { CheckCircle } from 'lucide-react';

interface HeroBenefitsProps {
  lang: 'en' | 'zh-cn';
}

const translations = {
  en: {
    benefits: [
      'Deploy in minutes, not weeks',
      'Cut infrastructure costs by up to 90%',
      'No DevOps team required',
      'Zero vendor lock-in and open source',
    ],
  },
  'zh-cn': {
    benefits: [
      '几分钟内部署，而非数周',
      '基础设施成本降低高达90%',
      '无需DevOps团队',
      '零供应商锁定且开源',
    ],
  },
};

export default function HeroBenefits({ lang }: HeroBenefitsProps) {
  const t = translations[lang];

  return (
    <div className="flex justify-center">
      <div className="grid max-w-4xl grid-cols-2 gap-6 lg:grid-cols-4">
        {t.benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 text-sm lg:text-base"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="font-medium text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

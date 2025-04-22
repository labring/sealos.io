'use client';

import { languagesType } from '@/lib/i18n';
import { useState, useEffect } from 'react';

const translations = {
  'en': {
    title: 'Customer Testimonials',
    testimonials: [
    ]
  },
  'zh-cn': {
    title: '客户评价',
    testimonials: [
      {
        quote: "Sealos 让我在运维上的时间投入 ROI 变得异常的高，不需要再浪费时间在那些消耗生命的事情上。",
        author: "陈加贝",
        title: "Teable 创始人",
        image: ""
      },
      {
        quote: "我们现在的技术栈是 Sealos + 云开发 + FastGPT 的组合，这套方案既能通过 FastGPT 的流程编排降低开发门槛，又能用云开发实现定制化业务逻辑。比如最近客服希望 AI 收到的催发货的信息能发到企微，从需求提出到上线只用了 3 天。",
        author: "张依奔",
        title: "三诺生物算法工程师",
        image: ""
      },
      {
        quote: "通过 Sealos，我们实现了 '即日答' 的开发理念。最快一天就能完成一个项目，最慢也就第二天、第三天就搞定了。在过去，这简直是不可想象的事情。",
        author: "张高",
        title: "少年得到技术负责人",
        image: ""
      }
    ]
  }
};

export default function Testimonials({ lang }: { lang: languagesType }) {
  const t = translations[lang];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === t.testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [t.testimonials.length]);

  return (
    <section className="py-24">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-black md:text-4xl">{t.title}</h2>

      <div
        className="relative overflow-hidden rounded-xl p-10 shadow-lg md:p-12"
        style={{
          background: 'linear-gradient(135deg, rgba(82, 174, 255, 0.15), rgba(255, 248, 240, 0.4))',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 10px 20px -15px rgba(82, 174, 255, 0.2)'
        }}
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-yellow-500/5 blur-3xl"></div>
        <div className="absolute left-1/2 top-1/3 h-32 w-32 -translate-x-1/2 rounded-full bg-blue-500/5 blur-2xl"></div>

        <div className="relative mx-auto max-w-4xl">
          <div className="relative min-h-[300px]">
            {t.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  index === currentIndex
                    ? 'opacity-100 translate-y-0'
                    : 'absolute inset-0 translate-y-4 opacity-0'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                 {/*
                  <div className="mb-6 h-16 w-16 overflow-hidden rounded-full border-4 border-white shadow-md sm:mb-8 sm:h-20 sm:w-20 md:h-24 md:w-24">
                    {/*
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  */}
                  <blockquote className="mb-6 text-base font-medium italic leading-relaxed text-gray-800 sm:mb-8 sm:text-lg md:text-2xl">
                    <span className="text-2xl text-primary sm:text-3xl md:text-4xl">“</span>
                    <span className="relative">
                      <span className="relative z-10">{testimonial.quote}</span>
                      <span className="absolute bottom-0 left-0 z-0 h-2 w-full bg-primary/10 sm:h-3"></span>
                    </span>
                    <span className="text-2xl text-primary sm:text-3xl md:text-4xl">”</span>
                  </blockquote>
                  <div className="text-base font-bold text-gray-900 sm:text-lg">{testimonial.author}</div>
                  <div className="text-xs font-medium text-primary/80 sm:text-sm">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center space-x-3">
            {t.testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-primary to-blue-600 scale-125 shadow-md'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

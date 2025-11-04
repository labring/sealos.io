'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { languagesType } from '@/lib/i18n';
import { trackCustomEvent } from '@/lib/gtm';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useCallback } from 'react';

// FAQ translations
const translations = {
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions about Sealos',
    getStarted: 'Get Started Free',
    stillHaveQuestions: 'Still have questions?',
    contactUs: 'Contact us',
    faqs: [
      {
        question: 'What is Sealos?',
        answer:
          'Sealos is an enterprise-grade cloud operating system built on Kubernetes. It provides a unified platform for developers to develop, deploy, and scale applications with ease, offering features like one-click deployments, cloud workspaces, and efficient resource management.',
      },
      {
        question: 'How does Sealos differ from other cloud platforms?',
        answer:
          'Sealos stands out with its unified approach that combines development, deployment, and scaling in one seamless platform. It eliminates the complexity of DevOps with automated orchestration, offers isolated environments that eliminate dependency issues, and provides up to 90% cost savings through optimal cloud resource assignment.',
      },
      {
        question:
          'Is Sealos suitable for small teams or individual developers?',
        answer:
          'Absolutely! Sealos is designed to be accessible for teams of all sizes. Individual developers and small teams can benefit from the streamlined workflows, pre-made templates, and cost-efficient resource management, allowing them to focus on building great applications rather than managing infrastructure.',
      },
      {
        question:
          'What programming languages and frameworks does Sealos support?',
        answer:
          'Sealos supports a comprehensive range of programming languages and frameworks. You can deploy applications built with popular languages like JavaScript, Python, Go, Java, and more. The platform is framework-agnostic, supporting frameworks like React, Vue, Angular, Django, Flask, Spring Boot, and many others.',
      },
      {
        question: 'How does Sealos handle scaling for applications?',
        answer:
          'Sealos provides auto-scaling capabilities that can handle up to 10,000 nodes, ensuring your applications can scale seamlessly as demand grows. The platform automatically manages resource allocation, making scaling effortless without requiring manual intervention or complex configuration.',
      },
    ],
  },
  'zh-cn': {
    title: '常见问题解答',
    subtitle: '查找关于 Sealos 云平台的常见问题答案',
    getStarted: '免费开始使用',
    stillHaveQuestions: '还有其他问题？',
    contactUs: '联系我们',
    faqs: [
      {
        question: 'Sealos 是什么？',
        answer:
          'Sealos 是一个基于 Kubernetes 构建的企业级云操作系统。它为开发者提供了一个统一的平台，可以轻松地开发、部署和扩展应用程序，提供一键部署、云工作空间和高效资源管理等功能。',
      },
      {
        question: 'Sealos 与其他云平台有何不同？',
        answer:
          'Sealos 以其统一的方法脱颖而出，将开发、部署和扩展集成在一个无缝平台中。它通过自动化编排消除了 DevOps 的复杂性，提供了消除依赖性问题的隔离环境，并通过最佳云资源分配提供高达 90% 的成本节约。',
      },
      {
        question: 'Sealos 适合小团队或个人开发者吗？',
        answer:
          '当然！Sealos 设计为适用于各种规模的团队。个人开发者和小团队可以从流线型工作流程、预制模板和成本高效的资源管理中受益，使他们能够专注于构建出色的应用程序，而不是管理基础设施。',
      },
      {
        question: 'Sealos 支持哪些编程语言和框架？',
        answer:
          'Sealos 支持广泛的编程语言和框架。您可以部署使用流行语言如 JavaScript、Python、Go、Java 等构建的应用程序。该平台与框架无关，支持 React、Vue、Angular、Django、Flask、Spring Boot 等众多框架。',
      },
      {
        question: 'Sealos 如何处理应用程序的扩展？',
        answer:
          'Sealos 提供自动扩展功能，最多可处理 10,000 个节点，确保您的应用程序可以随着需求增长而无缝扩展。该平台自动管理资源分配，使扩展变得轻松，无需手动干预或复杂配置。',
      },
    ],
  },
};

export default function FAQ({ lang }: { lang: languagesType }) {
  const t = translations[lang];

  const handleFAQToggle = useCallback(
    (value: string) => {
      if (value) {
        const index = parseInt(value.replace('item-', ''));
        const faq = t.faqs[index];
        if (faq) {
          trackCustomEvent('faq_interaction', 'faq_expand', {
            faq_question: faq.question,
            faq_index: index,
            language: lang,
            component: 'faq',
          });
        }
      }
    },
    [t.faqs, lang],
  );

  return (
    <div>
      <AnimateElement type="slideUp">
        <div className="text-center">
          <h2 className="text-base font-bold text-black sm:text-4xl">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 text-sm text-gray-600 sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="w-full"
            onValueChange={handleFAQToggle}
          >
            {t.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: '-100px' }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="group mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white px-6 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                    <div className="flex w-full items-center justify-between">
                      <span>{faq.question}</span>
                      <div className="ml-2 flex-shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-45">
                        <Plus className="h-5 w-5" />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-base leading-relaxed text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </AnimateElement>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-white/10 p-0">
      <button
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border-none bg-transparent px-3 py-6 text-left text-lg leading-7 font-medium text-white transition-all duration-200 hover:bg-zinc-500/30 hover:text-zinc-200"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="mr-4 flex-1 text-lg leading-7 font-normal text-white">
          {question}
        </span>
        <span
          className={`text-base font-bold text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        >
          {isOpen ? '^' : '>'}
        </span>
      </button>
      {isOpen && (
        <div className="mt-4 pr-8 pb-6 pl-3 text-sm leading-5 font-normal text-zinc-600">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // 默认展开第一个
  const [leftContainerWidth, setLeftContainerWidth] =
    useState<string>('491.924px');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const frequentlyAskedRef = useRef<HTMLSpanElement>(null);
  const questionsRef = useRef<HTMLSpanElement>(null);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  useEffect(() => {
    const updateLeftContainerWidth = () => {
      if (
        frequentlyAskedRef.current &&
        questionsRef.current &&
        titleRef.current
      ) {
        const frequentlyAskedWidth = frequentlyAskedRef.current.offsetWidth;
        const questionsWidth = questionsRef.current.offsetWidth;

        const spaceElement = document.createElement('span');
        spaceElement.textContent = ' ';
        spaceElement.style.fontFamily = 'Geist';
        spaceElement.style.fontSize = '36px';
        spaceElement.style.fontWeight = '500';
        spaceElement.style.visibility = 'hidden';
        spaceElement.style.position = 'absolute';
        document.body.appendChild(spaceElement);
        const spaceWidth = spaceElement.offsetWidth;
        document.body.removeChild(spaceElement);

        const totalWidth = frequentlyAskedWidth + spaceWidth + questionsWidth;
        const titleContainerWidth = titleRef.current.offsetWidth;
        const isMobile = window.innerWidth < 1024;
        const is1024px = window.innerWidth === 1024;

        if (isMobile) {
          setLeftContainerWidth('100%');
        } else if (is1024px) {
          setLeftContainerWidth('356px');
        } else if (totalWidth > titleContainerWidth) {
          setLeftContainerWidth('100%');
        } else {
          setLeftContainerWidth('491.924px');
        }
      }
    };

    updateLeftContainerWidth();
    window.addEventListener('resize', updateLeftContainerWidth);
    return () => {
      window.removeEventListener('resize', updateLeftContainerWidth);
    };
  }, []);

  const faqData = [
    {
      question: 'What exactly is an "Intelligent Cloud OS"?',
      answer:
        "It means we're more than just a hosting platform. Sealos is an integrated system where an AI core (our AI Pilot) understands how development, deployment, and databases should work together. You describe what you want, and the OS intelligently handles the how.",
    },
    {
      question: "Can I use Sealos if I'm not a Kubernetes expert?",
      answer:
        "Absolutely! Sealos is designed to abstract away the complexity of Kubernetes. You don't need to be a Kubernetes expert to use our platform effectively.",
    },
    {
      question: 'What languages and frameworks can I deploy?',
      answer:
        'Sealos supports a wide range of programming languages and frameworks including Node.js, Python, Java, Go, React, Vue, and many more.',
    },
    {
      question: 'How does the free tier work?',
      answer:
        'Our free tier provides generous resources to get you started. You can deploy applications, use databases, and access most features without any cost.',
    },
  ];

  return (
    <div className="container pt-24 pb-16">
      <div className="flex w-full flex-row items-start justify-between gap-20">
        {/* Left Section */}
        <div
          className="flex shrink-0 flex-col items-start gap-5 pt-5"
          style={{ width: leftContainerWidth }}
        >
          <h2
            ref={titleRef}
            className="m-0 mb-6 text-4xl leading-[150%] font-medium text-white"
          >
            <span ref={frequentlyAskedRef}>Frequently Asked</span>{' '}
            <span
              ref={questionsRef}
              className="bg-gradient-to-r from-white to-blue-600 bg-clip-text text-4xl leading-[150%] font-medium text-transparent"
            >
              Questions
            </span>
          </h2>
          <p className="m-0 max-w-full text-base leading-6 font-normal text-zinc-400">
            Got questions? We've got answers. Here's everything you need to know
            to get started with confidence.
          </p>
        </div>

        {/* Right Section */}
        <div className="min-w-0 flex-1">
          <div className="border-t border-white/10">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openItems.includes(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

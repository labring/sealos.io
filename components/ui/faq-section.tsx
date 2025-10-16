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
    <div className="faq-item">
      <button 
        className="faq-question hover:bg-zinc-500/20" 
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="faq-question-text">{question}</span>
        <span className="faq-icon">
          {isOpen ? '^' : '>'}
        </span>
      </button>
      {isOpen && (
        <div className="faq-answer">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // 默认展开第一个
  const [leftContainerWidth, setLeftContainerWidth] = useState<string>('491.924px');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const frequentlyAskedRef = useRef<HTMLSpanElement>(null);
  const questionsRef = useRef<HTMLSpanElement>(null);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  useEffect(() => {
    const updateLeftContainerWidth = () => {
      if (frequentlyAskedRef.current && questionsRef.current && titleRef.current) {
        const frequentlyAskedWidth = frequentlyAskedRef.current.offsetWidth;
        const questionsWidth = questionsRef.current.offsetWidth;
        
        // 获取空格的实际宽度
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
        
        // 检查标题是否换行
        const titleContainerWidth = titleRef.current.offsetWidth;
        const isMobile = window.innerWidth < 1024;
        const is1024px = window.innerWidth === 1024;
        
        if (isMobile) {
          // 移动端始终使用100%宽度
          setLeftContainerWidth('100%');
        } else if (is1024px) {
          // 1024px屏幕使用固定宽度356px
          setLeftContainerWidth('356px');
        } else if (totalWidth > titleContainerWidth) {
          // 其他屏幕 + 标题换行：使用默认宽度
          setLeftContainerWidth('100%');
        } else {
          // 其他屏幕 + 标题不换行：使用固定宽度491.924px
          setLeftContainerWidth('491.924px');
        }
      }
    };

    // 初始设置
    updateLeftContainerWidth();

    // 监听窗口大小变化
    window.addEventListener('resize', updateLeftContainerWidth);

    return () => {
      window.removeEventListener('resize', updateLeftContainerWidth);
    };
  }, []);

  const faqData = [
    {
      question: "What exactly is an \"Intelligent Cloud OS\"?",
      answer: "It means we're more than just a hosting platform. Sealos is an integrated system where an AI core (our AI Pilot) understands how development, deployment, and databases should work together. You describe what you want, and the OS intelligently handles the how."
    },
    {
      question: "Can I use Sealos if I'm not a Kubernetes expert?",
      answer: "Absolutely! Sealos is designed to abstract away the complexity of Kubernetes. You don't need to be a Kubernetes expert to use our platform effectively."
    },
    {
      question: "What languages and frameworks can I deploy?",
      answer: "Sealos supports a wide range of programming languages and frameworks including Node.js, Python, Java, Go, React, Vue, and many more."
    },
    {
      question: "How does the free tier work?",
      answer: "Our free tier provides generous resources to get you started. You can deploy applications, use databases, and access most features without any cost."
    }
  ];

  return (
    <div className="faq-section">
      <div className="faq-container">
        {/* Left Section - Title and Description */}
        <div 
          className="faq-left"
          style={{ width: leftContainerWidth }}
        >
          <h2 ref={titleRef} className="faq-title">
            <span ref={frequentlyAskedRef}>Frequently Asked</span> <span ref={questionsRef} className="faq-title-highlight">Questions</span>
          </h2>
          <p className="faq-description">
            Got questions? We've got answers. Here's everything you need to know to get started with confidence.
          </p>
        </div>

        {/* Right Section - FAQ Accordion */}
        <div className="faq-right">
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
  );
}

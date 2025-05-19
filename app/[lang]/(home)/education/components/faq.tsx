import { AnimateElement } from '@/components/ui/animated-wrapper';
import { ChevronDown } from 'lucide-react';

type FAQItemProps = {
  question: string;
  answer: string | JSX.Element;
  isDefaultOpen?: boolean;
};

const FAQItem = ({ question, answer, isDefaultOpen = false }: FAQItemProps) => {
  return (
    <details className="group border-b border-[#DDE7F7]" open={isDefaultOpen}>
      <summary className="flex w-full cursor-pointer list-none items-center justify-between py-5 text-left text-lg font-medium text-black focus:outline-none">
        <span>{question}</span>
        <ChevronDown className="h-5 w-5 text-blue-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="text-custom-secondary-text pb-5">
        {typeof answer === 'string' ? <p>{answer}</p> : answer}
      </div>
    </details>
  );
};

export default function FAQ() {
  const faqs = [
    {
      question: "Who's eligible for Sealos education credits?",
      answer:
        'Sealos education credits are available to verified faculty, students, and staff at accredited educational institutions. We offer programs for both individual educators and institution-wide deployment.',
      isDefaultOpen: true,
    },
    {
      question: "What's included in the education program?",
      answer:
        'Our program includes free cloud credits, access to all Sealos services, dedicated support for educators, and optional curriculum integration resources.',
    },
    {
      question: 'How can I apply for education credits?',
      answer: `
          You can apply through our dedicated education portal. Complete the
          application form and provide verification of your academic status.
          Applications are typically reviewed within 5 business days.
`,
    },
    {
      question: 'Can I deploy my own applications on Sealos?',
      answer:
        'Yes! Students and educators can deploy any application, from simple web apps to complex microservices architectures. Sealos supports all major programming languages, frameworks, and databases.',
    },
    {
      question: 'Can I use the credits for team or group projects?',
      answer:
        'Absolutely! Sealos education credits can be used for team projects, allowing students to collaborate on real-world applications. We also provide tools for managing access and permissions within teams.',
    },
  ];

  return (
    <div className="mt-52" id="faq">
      <AnimateElement type="slideUp">
        <div className="text-center text-4xl font-bold text-black">
          Frequently Asked Questions
        </div>
      </AnimateElement>

      <AnimateElement type="slideUp" delay={0.2}>
        <div className="mx-auto mt-12 max-w-3xl rounded-lg bg-white p-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isDefaultOpen={index === 0}
            />
          ))}
        </div>
      </AnimateElement>
    </div>
  );
}

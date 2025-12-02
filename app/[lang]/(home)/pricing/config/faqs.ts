export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: 'Is there a free Trial of Sealos?',
    answer:
      "Yes! Sealos offers a free Trial that includes 4GB RAM, 4 vCPU and limited AI usage. It's perfect for getting started and exploring the platform.",
  },
  {
    question: 'Do I need a credit card to get started?',
    answer:
      'No, you can start using Sealos without adding a payment method on the Free Trial. With the Free Trial, you can deploy small apps for free.',
  },
  {
    question: 'Can I change or cancel my plan at any time?',
    answer:
      'Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard settings. If you cancel, your subscription will remain active until the end of your current billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.',
  },
  {
    question: 'Can I upgrade or downgrade at any time?',
    answer:
      'You can upgrade any time, and when you do, you will get to the features of your new plan, as well as access to more powerful resources, immediately. When you downgrade, the changes will take effect at the beginning of your next billing cycle.',
  },
  {
    question: 'Can I deploy with my own domain?',
    answer:
      'Yes! You can use your own domain and we automatically provide SSL.',
  },
];


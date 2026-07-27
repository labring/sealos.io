export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: 'Can my monthly charge exceed the listed plan price?',
    answer:
      'The listed amount is the monthly subscription price for the included resource package. Taxes and separately purchased services can appear as additional line items. Review the Cost Center total before confirming a purchase or upgrade.',
  },
  {
    question: 'What resources are included in each plan?',
    answer:
      'Each plan card lists its included CPU, RAM, disk, traffic, NodePort, and AI credits. Choose a larger plan when your workload needs more capacity.',
  },
  {
    question: 'What does Railway’s $5 price mean in the calculator?',
    answer:
      'Railway Hobby includes a $5 minimum monthly usage commitment. That amount counts toward measured CPU, memory, volume, and egress usage. The final estimate increases when measured usage exceeds $5.',
  },
  {
    question: 'What is included in the Sealos free trial?',
    answer:
      'New users can start with a 7-day trial that includes 4 vCPU, 4GB RAM, 5GB volume storage, 500MB bandwidth, and 100 AI credits. No credit card is required.',
  },
  {
    question: 'Can I change or cancel my plan?',
    answer:
      'You can manage upgrades, downgrades, and cancellation from the Cost Center. Upgrades provide the new resource package immediately. Downgrades and cancellation follow the billing-cycle date shown during confirmation.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Sealos accepts major credit cards, including Visa, Mastercard, and American Express, through Stripe.',
  },
  {
    question: 'Can I deploy with my own domain?',
    answer:
      'Yes. You can connect your own domain and Sealos provisions SSL for it.',
  },
];

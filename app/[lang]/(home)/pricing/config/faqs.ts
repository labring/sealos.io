export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: 'Can my monthly charge exceed the listed plan price?',
    answer:
      'Your plan price covers the resources listed on the plan card. Existing workloads continue within those limits, and allocating more resources requires a manual plan upgrade. Taxes and optional services are shown separately in Cost Center before confirmation.',
  },
  {
    question: 'Who qualifies for new-user pricing?',
    answer:
      'The $7 Starter and $25 Hobby prices apply to accounts making their first paid plan purchase. Cost Center confirms eligibility and the final price before purchase.',
  },
  {
    question: 'What resources are included in each plan?',
    answer:
      'Each plan card lists its included CPU, RAM, disk, traffic, NodePort, and AI credits. Choose a larger plan when your workload needs more capacity.',
  },
  {
    question: 'What does Railway’s $5 price mean in the calculator?',
    answer:
      'Railway Hobby costs $5 per month and includes $5 of resource usage. When measured CPU, memory, volume, and egress total $5 or less, the monthly bill remains $5. When measured usage exceeds $5, the monthly total follows measured usage.',
  },
  {
    question: 'What is included in the Sealos free trial?',
    answer:
      'New users receive 7 days with 4 vCPU, 4GB RAM, 5GB storage, 500MB bandwidth, and 100 AI credits. No credit card is required.',
  },
  {
    question: 'Can I change or cancel my plan?',
    answer:
      'You can manage upgrades, downgrades, and cancellation from the Cost Center. Upgrades provide the new resource package immediately. Downgrades and cancellation follow the billing-cycle date shown during confirmation.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Major credit cards are processed by Stripe. Available payment methods are shown in Cost Center at checkout.',
  },
  {
    question: 'Can I deploy with my own domain?',
    answer:
      'Yes. You can connect your own domain and Sealos provisions SSL for it.',
  },
];

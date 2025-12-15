export type FAQ = {
  question: string;
  answer: string;
};

/**
 * Generate FAQs for the comparison of two platforms.
 * @param firstPlatformName name of the first platform
 * @param secondPlatformName name of the second platform
 * @returns FAQ data
 */
export function generateFaq(
  firstPlatformName: string,
  secondPlatformName: string,
): FAQ[] {
  return [
    {
      question:
        'How much can I actually save by switching from Railway to Sealos?',
      answer: `For always-on production workloads, savings typically range from 60-70%.

Here's an example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):

| Cost Component | Railway | Sealos Standard |
|----------------|---------|-----------------|
| Compute (monthly) | ~$300 | Included |
| 50GB storage | $12.50 | Included |
| 100GB egress | $5.00 | Included |
| **Total** | **~$317/mo** | **~$100/mo** |

The more resources you use, the more you save. Railway's per-second billing is great for sporadic workloads, but for production apps running continuously, fixed plans win.`,
    },
    {
      question: 'Do I need a credit card to get started?',
      answer:
        'No credit card required for Sealos free trial. You can start with 7 days free trial with 4 vCPU + 4GB RAM.',
    },
    {
      question: 'Can I change or cancel my plan at any time?',
      answer:
        'Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept major credit cards, PayPal, and other common payment methods. Enterprise customers can arrange invoicing.',
    },
    {
      question: 'Can I upgrade or downgrade at any time?',
      answer:
        'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.',
    },
    {
      question: 'Can I deploy with my own domain?',
      answer: `Yes, both platforms support custom domains. ${firstPlatformName} offers unlimited custom domains, while ${secondPlatformName} may limit them based on plan.`,
    },
  ];
}

// Copy and form configuration for the abuse report page.

import { languagesType } from '@/lib/i18n';

export const abuseTypeKeys = ['phishing', 'malware', 'spam', 'copyright', 'other'] as const;
export type AbuseTypeKey = typeof abuseTypeKeys[number];

export type AbuseTranslations = {
  title: {
    main: string;
    sub: string;
  };
  description: string;
  introText: string;
  badgeText: string;
  guideTitle: string;
  guideItems: string[];
  slaText: string;
  trustCards: {
    responseTitle: string;
    reviewTitle: string;
    reviewDesc: string;
  };
  statusText: {
    loading: string;
    success: string;
    error: string;
  };
  form: {
    detailTitle: string;
    detailSubtitle: string;
    abuseType: string;
    abuseTypes: Record<AbuseTypeKey, string>;
    email: string;
    emailPlaceholder: string;
    url: string;
    urlPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    evidence: string;
    evidencePlaceholder: string;
    submit: string;
    submitting: string;
    preparing: string;
    required: string;
  };
  alerts: {
    verification: string;
  };
  directEmail: string;
  privacyNote: string;
};

export const translations: Record<'en' | 'zh-cn', AbuseTranslations> = {
  en: {
    title: {
      main: 'Report Abuse',
      sub: 'Abuse Reporting',
    },
    description:
      'Report phishing, malware, spam, or other abuse hosted on Sealos. We take all reports seriously and respond within 24-48 hours.',
    introText:
      'If you have discovered phishing, malware, spam, or other abusive content hosted on our platform, please report it using the form below. We are committed to maintaining a safe and trustworthy cloud environment.',
    badgeText: 'Security Report Center',
    guideTitle: 'Include these details',
    guideItems: [
      'Abusive URL or domain and the time you observed it',
      'Evidence links such as screenshots, logs, or headers',
      'Any context that helps us reproduce or verify the issue',
    ],
    slaText: 'We aim to respond to all abuse reports within 24-48 hours.',
    trustCards: {
      responseTitle: 'Response time',
      reviewTitle: 'Manual review',
      reviewDesc: 'Every report is reviewed by our security team.',
    },
    statusText: {
      loading: 'Preparing your report...',
      success: 'Opening your email client...',
      error: 'Verification failed. Please try again.',
    },
    form: {
      detailTitle: 'Report Details',
      detailSubtitle: 'Please fill in the information below. Fields marked * are required',
      abuseType: 'Type of Abuse',
      abuseTypes: {
        phishing: 'Phishing',
        malware: 'Malware',
        spam: 'Spam',
        copyright: 'Copyright Infringement',
        other: 'Other',
      },
      email: 'Your Email',
      emailPlaceholder: 'your@email.com',
      url: 'Abusive URL or Domain',
      urlPlaceholder: 'https://example.sealos.io or domain name',
      description: 'Description',
      descriptionPlaceholder:
        'Please provide details about the abuse, including any evidence or additional context...',
      evidence: 'Evidence Links (Optional)',
      evidencePlaceholder: 'Links to screenshots, logs, or other evidence',
      submit: 'Submit Report',
      submitting: 'Submitting...',
      preparing: 'Preparing...',
      required: 'Required',
    },
    alerts: {
      verification: 'Please complete the verification',
    },
    directEmail: 'You can also email us directly at',
    privacyNote:
      'Your information will only be used to investigate this report and will be handled in accordance with our Privacy Policy.',
  },
  'zh-cn': {
    title: {
      main: '滥用举报',
      sub: '举报滥用行为',
    },
    description:
      '举报托管在 Sealos 上的钓鱼、恶意软件、垃圾邮件或其他滥用行为。我们认真对待所有举报，并在 24-48 小时内响应。',
    introText:
      '如果您发现我们平台上托管的钓鱼、恶意软件、垃圾邮件或其他滥用内容，请使用以下表单进行举报。我们致力于维护安全可信的云环境。',
    badgeText: '安全举报中心',
    guideTitle: '建议包含以下信息',
    guideItems: [
      '滥用 URL 或域名，以及发现时间',
      '证据链接，如截图、日志或请求头',
      '有助于复现或核验的上下文信息',
    ],
    slaText: '我们的目标是在 24-48 小时内响应所有滥用举报。',
    trustCards: {
      responseTitle: '响应时间',
      reviewTitle: '人工审核',
      reviewDesc: '每条举报都由安全团队人工审核。',
    },
    statusText: {
      loading: '正在准备举报内容...',
      success: '正在打开邮箱客户端...',
      error: '验证失败，请重试。',
    },
    form: {
      detailTitle: '举报详情',
      detailSubtitle: '请填写以下信息，标注 * 为必填项',
      abuseType: '滥用类型',
      abuseTypes: {
        phishing: '钓鱼攻击',
        malware: '恶意软件',
        spam: '垃圾邮件',
        copyright: '侵权内容',
        other: '其他',
      },
      email: '您的邮箱',
      emailPlaceholder: 'your@email.com',
      url: '滥用 URL 或域名',
      urlPlaceholder: 'https://example.sealos.io 或域名',
      description: '详细描述',
      descriptionPlaceholder: '请提供关于滥用行为的详细信息，包括任何证据或额外背景...',
      evidence: '证据链接（可选）',
      evidencePlaceholder: '截图、日志或其他证据的链接',
      submit: '提交举报',
      submitting: '提交中...',
      preparing: '准备发送...',
      required: '必填',
    },
    alerts: {
      verification: '请完成人机验证',
    },
    directEmail: '您也可以直接发送邮件至',
    privacyNote: '您的信息仅用于调查此举报，并将根据我们的隐私政策进行处理。',
  },
};

export function getAbuseTranslations(lang: languagesType): AbuseTranslations {
  return translations[lang] ?? translations.en;
}

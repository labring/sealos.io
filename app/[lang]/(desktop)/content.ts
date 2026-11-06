import type { languagesType } from '@/lib/i18n';

export interface FeatureRowCopy {
  id: 'local' | 'github' | 'project' | 'agent';
  title: string;
  body: string;
}

export interface HomeCopy {
  meta: { title: string; description: string };
  nav: {
    signIn: string;
    search: string;
    language: string;
    theme: { system: string; light: string; dark: string };
    menu: string;
  };
  download: {
    cta: string;
    navCta: string;
    menuLabel: string;
    desktopOnly: string;
    signUp: string;
    forMac: string;
    forWindows: string;
    forLinux: string;
    options: {
      macArm64: string;
      macX64: string;
      windowsX64: string;
      linuxX64: string;
      linuxArm64: string;
    };
    allReleases: string;
  };
  installAgent: {
    cta: string;
    title: string;
    body: string;
    tabs: { claude: string; codex: string; other: string };
    copy: string;
    copied: string;
    learnMore: string;
  };
  hero: { title: string; subtitle: string };
  features: FeatureRowCopy[];
  ship: {
    /** Words alternate: even indexes are strong, odd ones are muted. */
    headline: string[];
    cards: Array<{ title: string; body: string }>;
    replaces: string;
  };
  deployAny: {
    title: string;
    body: string;
    cards: Array<{ title: string; body: string }>;
  };
  duty: {
    title: string;
    body: string;
    items: Array<{ title: string; body: string }>;
  };
  depends: {
    title: string;
    body: string;
    cards: Array<{ title: string; body: string }>;
  };
  faq: { title: string; items: Array<{ q: string; a: string }> };
  cta: { title: string };
}

const en: HomeCopy = {
  meta: {
    title: 'The ops agent for shipping and running full-stack apps',
    description:
      'Sealos is a desktop ops agent that deploys local code, GitHub repos and templates, wires databases and AI models, and keeps them running with logs, metrics and fixes you approve.',
  },
  nav: {
    signIn: 'Sign in',
    search: 'Search docs',
    language: 'English',
    theme: { system: 'System', light: 'Light', dark: 'Dark' },
    menu: 'Menu',
  },
  download: {
    cta: 'Download Sealos',
    navCta: 'Download',
    menuLabel: 'Choose a download',
    desktopOnly: 'Visit on desktop to download',
    signUp: 'Sign up',
    forMac: 'Download for macOS',
    forWindows: 'Download for Windows',
    forLinux: 'Download for Linux',
    options: {
      macArm64: 'macOS · Apple silicon',
      macX64: 'macOS · Intel',
      windowsX64: 'Windows · x64',
      linuxX64: 'Linux · x64',
      linuxArm64: 'Linux · ARM64',
    },
    allReleases: 'All releases',
  },
  installAgent: {
    cta: 'Install with your agent',
    title: 'Give your coding agent Sealos',
    body: 'Paste this into your agent. It installs the Sealos skills, so you can deploy from the same chat you build in.',
    tabs: { claude: 'Claude Code', codex: 'Codex', other: 'Any agent' },
    copy: 'Copy',
    copied: 'Copied',
    learnMore: 'All install paths',
  },
  hero: {
    title: 'Sealos is your ops agent for shipping and running full-stack apps.',
    subtitle: 'Stop stitching Vercel, Supabase, and Railway together by hand.',
  },
  features: [
    {
      id: 'local',
      title: 'Turn local code into a live app',
      body: 'Point Sealos at any folder on your machine, from a full codebase to a single HTML deck. It builds the image and puts it on a public URL.',
    },
    {
      id: 'github',
      title: 'Deploy from a GitHub link',
      body: 'Pick a repository and branch. Sealos detects the port, deploys it, and injects the connection string of any database you need.',
    },
    {
      id: 'project',
      title: 'Everything stays in view',
      body: 'Once it is live, every service sits in one project view with its status, uptime, metrics and logs, so you can open a terminal in any container, roll back a deploy, or catch a memory limit before it is hit.',
    },
    {
      id: 'agent',
      title: 'Agent keeps it running',
      body: 'After the deploy, your Ops Agent reads logs and metrics, names the cause of a 502 or an out-of-memory crash, and ships every fix as a plan you approve first.',
    },
  ],
  ship: {
    headline: [
      'Ship',
      ' your code, ',
      'wire databases',
      ', and ',
      'route AI models',
      ', in one place, with your team and your ',
      'Ops Agent.',
    ],
    cards: [
      {
        title: 'App hosting',
        body: 'Sealos turns local code, HTML decks, GitHub repos and templates into services that run 24/7.',
      },
      {
        title: 'Managed databases',
        body: 'PostgreSQL, MySQL, MongoDB and Redis, standalone or replicated. Backed up daily.',
      },
      {
        title: 'Object storage & AI Gateway',
        body: 'S3-compatible buckets for your files. One endpoint and one key for OpenAI and Anthropic models.',
      },
    ],
    replaces: 'Replaces',
  },
  deployAny: {
    title: 'Deploy any project',
    body: 'A local folder, a GitHub repo or an open-source template. Sealos works out the build and the port, so there is nothing to configure.',
    cards: [
      {
        title: 'Local project',
        body: 'Any project on your machine, from a full codebase to a single HTML page.',
      },
      {
        title: 'GitHub repository',
        body: 'Paste a repo URL. Sealos installs dependencies, builds it and gives you a live link.',
      },
      {
        title: 'Open-source template',
        body: 'Dify, n8n, WordPress, Open WebUI and 240 more. One click, ready to run.',
      },
    ],
  },
  duty: {
    title: 'Agent stays on duty after the deploy',
    body: 'Your Ops Agent reads logs and metrics, proposes fixes, and runs every change as a plan you approve first.',
    items: [
      {
        title: 'Diagnose',
        body: 'It reads the logs and the metrics together and names the cause, like an out-of-memory crash, before proposing a fix you approve.',
      },
      {
        title: 'Hot updates',
        body: 'Point at any element of a live page and describe the change. It ships as a new revision, with a rollback one click away.',
      },
      {
        title: 'Scale & backups',
        body: 'Ask for more space and the volume grows while the database stays online. Backups run daily, and an encrypted tunnel opens on request.',
      },
      {
        title: 'Early warnings',
        body: 'Failed deploys, unhealthy instances, restarts and resources close to their limit surface as hints before your users notice.',
      },
    ],
  },
  depends: {
    title: 'Everything your app depends on',
    body: 'Databases, storage, model access and your team, provisioned next to the app and wired in from day one.',
    cards: [
      {
        title: 'Databases',
        body: 'PostgreSQL, MySQL, MongoDB or Redis in one click. Connection string injected, backups daily.',
      },
      {
        title: 'Object storage',
        body: 'S3-compatible buckets for uploads and assets. Drag files in, share a temporary link.',
      },
      {
        title: 'AI Gateway',
        body: 'One key and one endpoint for GPT-5, Claude, Gemini and DeepSeek. Billed from a single workspace balance.',
      },
      {
        title: 'Team workspaces',
        body: 'Invite your team into a shared workspace. Everyone works on the same projects with their own credentials.',
      },
    ],
  },
  faq: {
    title: 'Common questions',
    items: [
      {
        q: 'What can I deploy?',
        a: 'Full-stack codebases, vibe-coded projects, GitHub repositories, interactive HTML pages and client decks, production databases (PostgreSQL, MySQL, MongoDB, Redis), and open-source stacks like WordPress, n8n, Dify, New API and Open WebUI. Every one gets a public HTTPS link.',
      },
      {
        q: 'What does the Ops Agent do day to day?',
        a: 'It watches status, logs and metrics for every service in a project. When something breaks, like a restart loop, a 502 or a memory limit, it explains the cause and proposes a fix as a plan. Nothing changes until you approve it, and it checks the result afterwards.',
      },
      {
        q: 'Why Sealos instead of Vercel, Railway, Supabase and S3 separately?',
        a: 'Because the app, its database, its storage and its model keys live in one project, they are wired together from the start: no copying connection strings between dashboards, no separate bills, and one agent that can see the whole stack when something goes wrong.',
      },
      {
        q: 'How do I keep production changes and billing predictable?',
        a: 'Every change the agent makes is a plan you review first, and every deploy keeps its history so you can roll back. Usage is billed per resource from one workspace balance, and limits and early warnings show up before a service runs out of room.',
      },
      {
        q: 'Is Sealos free to start?',
        a: 'Yes. Download the desktop app and sign in to start deploying. You pay only for the resources your projects use, from a single workspace balance.',
      },
      {
        q: 'Where does my stack run, and can I move it?',
        a: 'Projects run on Sealos Cloud regions you choose, on open-source Sealos and standard Kubernetes underneath. Your apps are ordinary container images and your databases are standard engines, so you can export and move them whenever you want.',
      },
    ],
  },
  cta: { title: 'Try Sealos now.' },
};

const zhCn: HomeCopy = {
  meta: {
    title: '上线并运维全栈应用的 Ops Agent',
    description:
      'Sealos 是一个桌面端 Ops Agent：把本地代码、GitHub 仓库和模板一键上线，接好数据库与 AI 模型，再用日志、指标和你确认过的修复方案让它们稳定运行。',
  },
  nav: {
    signIn: '登录',
    search: '搜索文档',
    language: '简体中文',
    theme: { system: '跟随系统', light: '浅色', dark: '深色' },
    menu: '菜单',
  },
  download: {
    cta: '下载 Sealos',
    navCta: '下载',
    menuLabel: '选择下载版本',
    desktopOnly: '请在电脑上访问并下载',
    signUp: '注册',
    forMac: '下载 macOS 版',
    forWindows: '下载 Windows 版',
    forLinux: '下载 Linux 版',
    options: {
      macArm64: 'macOS · Apple 芯片',
      macX64: 'macOS · Intel 芯片',
      windowsX64: 'Windows · x64',
      linuxX64: 'Linux · x64',
      linuxArm64: 'Linux · ARM64',
    },
    allReleases: '全部版本',
  },
  installAgent: {
    cta: '用你的 Agent 安装',
    title: '让你的编码 Agent 学会 Sealos',
    body: '把下面的命令粘贴给你的 Agent，它会装好 Sealos Skills，之后在写代码的同一个对话里就能直接上线。',
    tabs: { claude: 'Claude Code', codex: 'Codex', other: '其他 Agent' },
    copy: '复制',
    copied: '已复制',
    learnMore: '查看全部安装方式',
  },
  hero: {
    title: 'Sealos 是你的 Ops Agent，帮你上线并运行全栈应用。',
    subtitle: '不必再手动拼接 Vercel、Supabase 和 Railway。',
  },
  features: [
    {
      id: 'local',
      title: '本地代码，一键变成线上应用',
      body: '选中电脑里的任意文件夹，从完整代码库到一页 HTML 演示稿都可以。Sealos 会构建镜像，并给它一个公网地址。',
    },
    {
      id: 'github',
      title: '贴一个 GitHub 链接就能部署',
      body: '选好仓库和分支，Sealos 自动识别端口并完成部署，需要的数据库连接串也会自动注入。',
    },
    {
      id: 'project',
      title: '所有服务，一目了然',
      body: '上线之后，每个服务都在同一个项目视图里，状态、运行时长、指标和日志都看得到。可以进任意容器开终端、回滚部署，也能在内存触顶之前发现问题。',
    },
    {
      id: 'agent',
      title: 'Agent 帮你守着线上',
      body: '部署完成后，Ops Agent 会读日志和指标，指出 502 或内存溢出的原因，每一次修复都先做成方案，等你确认后再执行。',
    },
  ],
  ship: {
    headline: [
      '上线',
      '代码、',
      '接好数据库',
      '、',
      '调用 AI 模型',
      '，都在一个地方，和你的团队与 ',
      'Ops Agent 一起。',
    ],
    cards: [
      {
        title: '应用托管',
        body: '本地代码、HTML 演示稿、GitHub 仓库和模板，都能变成 7×24 小时运行的服务。',
      },
      {
        title: '托管数据库',
        body: 'PostgreSQL、MySQL、MongoDB 和 Redis，单机或高可用，每天自动备份。',
      },
      {
        title: '对象存储与 AI Gateway',
        body: '兼容 S3 的存储桶放你的文件；一个地址、一把密钥调用 OpenAI 和 Anthropic 模型。',
      },
    ],
    replaces: '替代',
  },
  deployAny: {
    title: '什么项目都能部署',
    body: '本地文件夹、GitHub 仓库或开源模板。构建方式和端口由 Sealos 自己判断，你不需要做任何配置。',
    cards: [
      {
        title: '本地项目',
        body: '电脑里的任何项目，从完整代码库到单个 HTML 页面。',
      },
      {
        title: 'GitHub 仓库',
        body: '粘贴仓库地址，Sealos 安装依赖、完成构建，然后给你一个可访问的链接。',
      },
      {
        title: '开源模板',
        body: 'Dify、n8n、WordPress、Open WebUI 等 240 多个模板，一键即可运行。',
      },
    ],
  },
  duty: {
    title: '部署之后，Agent 继续值守',
    body: 'Ops Agent 读日志和指标、提出修复方案，每一次变更都先给你过目，确认后再执行。',
    items: [
      {
        title: '诊断',
        body: '把日志和指标放在一起看，指出根因，比如内存溢出导致的崩溃，再给出等你确认的修复方案。',
      },
      {
        title: '热更新',
        body: '在线上页面里点选任意元素，说出想改什么。改动作为新版本上线，一键就能回滚。',
      },
      {
        title: '扩容与备份',
        body: '需要更多空间时直接说，数据库在线扩容不停机。每天自动备份，需要时还能打开加密隧道。',
      },
      {
        title: '提前预警',
        body: '部署失败、实例异常、频繁重启、资源接近上限，都会在用户察觉之前提示给你。',
      },
    ],
  },
  depends: {
    title: '应用需要的一切，都在身边',
    body: '数据库、存储、模型调用和团队协作，和应用放在一起开通，从第一天起就接好。',
    cards: [
      {
        title: '数据库',
        body: 'PostgreSQL、MySQL、MongoDB、Redis 一键开通，连接串自动注入，每天备份。',
      },
      {
        title: '对象存储',
        body: '兼容 S3 的存储桶，放上传文件和静态资源。拖进去即可，还能生成临时分享链接。',
      },
      {
        title: 'AI Gateway',
        body: '一把密钥、一个地址，调用 GPT-5、Claude、Gemini 和 DeepSeek，统一从工作空间余额扣费。',
      },
      {
        title: '团队工作空间',
        body: '邀请团队进入共享工作空间，大家在同一批项目上协作，各自使用自己的凭证。',
      },
    ],
  },
  faq: {
    title: '常见问题',
    items: [
      {
        q: '可以部署哪些东西？',
        a: '全栈代码库、Vibe Coding 项目、GitHub 仓库、交互式 HTML 页面和客户演示稿、生产级数据库（PostgreSQL、MySQL、MongoDB、Redis），以及 WordPress、n8n、Dify、New API、Open WebUI 等开源应用。每一个都会得到一个 HTTPS 公网地址。',
      },
      {
        q: 'Ops Agent 平时都做些什么？',
        a: '它持续关注项目里每个服务的状态、日志和指标。出现问题时，比如反复重启、502 或内存触顶，它会说明原因并给出修复方案。你确认之前什么都不会改动，执行之后它还会检查结果。',
      },
      {
        q: '为什么用 Sealos，而不是分别用 Vercel、Railway、Supabase 和 S3？',
        a: '应用、数据库、存储和模型密钥都在同一个项目里，从一开始就连在一起：不用在多个控制台之间复制连接串，不用分别付费，出问题时也有一个能看到整套服务的 Agent。',
      },
      {
        q: '怎样让线上变更和费用都可控？',
        a: 'Agent 的每一次变更都先做成方案给你审阅，每一次部署都保留历史，随时可以回滚。费用按资源用量从同一个工作空间余额扣除，资源接近上限之前会提前预警。',
      },
      {
        q: '怎么领取新人礼？',
        a: '符合条件的国内、非 API 注册用户，首次登录桌面客户端可领取 ¥10 首登礼，奖励自动入账，同一奖励仅发放一次。邀请好友注册并完成实名后，双方还各得 ¥5。',
      },
      {
        q: '我的服务运行在哪里？能迁走吗？',
        a: '项目运行在你选择的 Sealos 云可用区上，底层是开源的 Sealos 和标准 Kubernetes。应用是普通的容器镜像，数据库是标准引擎，随时可以导出迁移。',
      },
    ],
  },
  cta: { title: '现在就试试 Sealos。' },
};

const COPY: Record<languagesType, HomeCopy> = { en, 'zh-cn': zhCn };

export function getHomeCopy(lang: string): HomeCopy {
  return COPY[(lang as languagesType) in COPY ? (lang as languagesType) : 'en'];
}

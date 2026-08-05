export const REPO_URL = 'https://github.com/labring/sealos-skills';
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;

export const CODEX_INSTALL_COMMANDS = [
  'codex plugin marketplace add labring/sealos-skills',
  'codex plugin add sealos@sealos',
] as const;

export const CODEX_INSTALL_COMMAND = CODEX_INSTALL_COMMANDS.join('\n');
export const CODEX_COMPATIBILITY_COMMAND =
  'npx plugins add https://github.com/labring/sealos-skills --target codex';

export const CLAUDE_INSTALL_COMMANDS = [
  'claude plugin marketplace add labring/sealos-skills',
  'claude plugin install sealos@sealos',
] as const;

export const CLAUDE_INSTALL_COMMAND = CLAUDE_INSTALL_COMMANDS.join('\n');
export const CLAUDE_COMPATIBILITY_COMMAND =
  'npx plugins add https://github.com/labring/sealos-skills';
export const SKILLS_SH_INSTALL_COMMAND = 'npx skills add labring/sealos-skills';
export const CODEX_INVOCATION = '$sealos';
export const DEPLOY_PROMPT = '$sealos deploy <project>';

export const PAGE_COPY = {
  hero: {
    eyebrow: 'SEALOS SKILLS',
    title: 'Your agent writes the code. Sealos ships it.',
    description:
      'One open-source skill pack for deploying apps, connecting data, and verifying cloud changes from the agent you already use.',
    commandLabel: 'INSTALL FOR CODEX',
    primaryCta: 'Install in Codex',
    secondaryCta: 'Browse the source',
    invocation: `Then run ${DEPLOY_PROMPT}.`,
  },
  directory: {
    title: 'Bring the same cloud path to your favorite agent.',
    description:
      'Choose a host, copy its install path, and keep Sealos deployment close to your code.',
  },
  support: {
    title: 'One skill pack. Clear host paths.',
    description:
      'Every integration reaches the same eight skills through a host-specific install and invocation surface.',
  },
  capabilities: {
    eyebrow: 'CLOUD CAPABILITIES',
    title: 'What your agent can finish on Sealos Cloud',
    description:
      'The pack covers the handoffs between a repository and a running application.',
  },
  workflow: {
    title: 'From prompt to evidence.',
    description:
      'Each workflow ends with concrete artifacts, live checks, and a result you can review.',
  },
  install: {
    title: 'Install once. Use the same workflow everywhere.',
    description:
      'Start with a native plugin or import the same root skill pack into your preferred agent.',
  },
  setup: {
    eyebrow: 'Before the first run',
    title: 'Bring a project. Sealos Skills guides the cloud setup.',
    description:
      'Preflight identifies the account, workspace, registry, and local tools required by the selected workflow.',
  },
  final: {
    title: 'Install the skill. Ship the runtime.',
    description:
      'Give your coding agent a cloud path it can inspect, repeat, and update.',
    primaryCta: 'Install in Codex',
    secondaryCta: 'Browse install paths',
  },
} as const;

export const CORE_CAPABILITIES = [
  'Deploy',
  'Database',
  'S3',
  'Canvas',
] as const;

export type CoreCapability = (typeof CORE_CAPABILITIES)[number];
export type InstallMode =
  | 'Plugin'
  | 'Package import'
  | 'Extension'
  | 'Bundle'
  | 'Repo import'
  | 'Skill pack';
export type AgentIconKey =
  | 'openai'
  | 'claude'
  | 'qoder'
  | 'gemini'
  | 'qwen'
  | 'codebuddy'
  | 'bot'
  | 'terminal'
  | 'code';

export type AgentTarget = {
  id:
    | 'codex'
    | 'claude'
    | 'qoder'
    | 'gemini'
    | 'qwen'
    | 'openclaw'
    | 'codebuddy'
    | 'amp'
    | 'kimi'
    | 'skills-sh';
  name: string;
  vendor: string;
  mode: InstallMode;
  icon: AgentIconKey;
  install: string;
  installSummary: string;
  installNote: string;
  invocation: string;
  guideHref: string;
  capabilities: readonly CoreCapability[];
  copyTrackingId: string;
  guideTrackingId: string;
  installTrackingId: string;
};

export const AGENT_TARGETS = [
  {
    id: 'codex',
    name: 'Codex',
    vendor: 'OpenAI',
    mode: 'Plugin',
    icon: 'openai',
    install: CODEX_INSTALL_COMMAND,
    installSummary: 'Marketplace + plugin',
    installNote: 'Native marketplace install for Codex CLI and Codex App.',
    invocation: CODEX_INVOCATION,
    guideHref: `${REPO_URL}#recommended-install-in-codex`,
    capabilities: CORE_CAPABILITIES,
    copyTrackingId: 'skills_agent_copy_codex',
    guideTrackingId: 'skills_agent_guide_codex',
    installTrackingId: 'skills_install_copy_codex',
  },
  {
    id: 'claude',
    name: 'Claude Code',
    vendor: 'Anthropic',
    mode: 'Plugin',
    icon: 'claude',
    install: CLAUDE_INSTALL_COMMAND,
    installSummary: 'Marketplace + plugin',
    installNote: 'Managed plugin install with the same eight root skills.',
    invocation: '/sealos',
    guideHref: `${REPO_URL}#install-in-claude-code`,
    capabilities: CORE_CAPABILITIES,
    copyTrackingId: 'skills_agent_copy_claude',
    guideTrackingId: 'skills_agent_guide_claude',
    installTrackingId: 'skills_install_copy_claude',
  },
  {
    id: 'qoder',
    name: 'Qoder',
    vendor: 'Qoder',
    mode: 'Package import',
    icon: 'qoder',
    install: 'python3 scripts/package-qoder-plugin.py',
    installSummary: 'Build + import ZIP',
    installNote: 'Build the package, then import dist/sealos-1.2.0.zip.',
    invocation: '/sealos',
    guideHref: `${REPO_URL}#test-in-qoder`,
    capabilities: CORE_CAPABILITIES,
    copyTrackingId: 'skills_agent_copy_qoder',
    guideTrackingId: 'skills_agent_guide_qoder',
    installTrackingId: 'skills_install_copy_qoder',
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    vendor: 'Google',
    mode: 'Extension',
    icon: 'gemini',
    install:
      'gemini extensions install https://github.com/labring/sealos-skills',
    installSummary: 'GitHub extension',
    installNote: 'Loads repository guidance through the Gemini extension.',
    invocation: 'Ask Gemini to use Sealos Skills',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    capabilities: CORE_CAPABILITIES,
    copyTrackingId: 'skills_agent_copy_gemini',
    guideTrackingId: 'skills_agent_guide_gemini',
    installTrackingId: 'skills_install_copy_gemini',
  },
  {
    id: 'qwen',
    name: 'Qwen Code',
    vendor: 'Qwen',
    mode: 'Extension',
    icon: 'qwen',
    install: 'qwen extensions install https://github.com/labring/sealos-skills',
    installSummary: 'GitHub extension',
    installNote: 'Loads repository guidance through the Qwen extension.',
    invocation: 'Ask Qwen to use Sealos Skills',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    capabilities: CORE_CAPABILITIES,
    copyTrackingId: 'skills_agent_copy_qwen',
    guideTrackingId: 'skills_agent_guide_qwen',
    installTrackingId: 'skills_install_copy_qwen',
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    vendor: 'ClawHub',
    mode: 'Bundle',
    icon: 'bot',
    install: 'clawhub install labring/sealos-skills',
    installSummary: 'ClawHub bundle',
    installNote: 'Installs the complete skill pack through ClawHub.',
    invocation: 'Host command exposure depends on the ClawHub runtime',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    capabilities: CORE_CAPABILITIES,
    copyTrackingId: 'skills_agent_copy_openclaw',
    guideTrackingId: 'skills_agent_guide_openclaw',
    installTrackingId: 'skills_install_copy_openclaw',
  },
  {
    id: 'codebuddy',
    name: 'CodeBuddy',
    vendor: 'CodeBuddy',
    mode: 'Plugin',
    icon: 'codebuddy',
    install: '/plugin marketplace add labring/sealos-skills',
    installSummary: 'Marketplace plugin',
    installNote: 'Registers the repository with the CodeBuddy marketplace.',
    invocation: 'Host command exposure depends on the CodeBuddy runtime',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    capabilities: CORE_CAPABILITIES,
    copyTrackingId: 'skills_agent_copy_codebuddy',
    guideTrackingId: 'skills_agent_guide_codebuddy',
    installTrackingId: 'skills_install_copy_codebuddy',
  },
  {
    id: 'amp',
    name: 'Amp',
    vendor: 'Amp',
    mode: 'Repo import',
    icon: 'code',
    install: `${REPO_URL}.git`,
    installSummary: 'Repository import',
    installNote: 'Import the root skills directory from GitHub.',
    invocation: 'Host-dependent',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    capabilities: CORE_CAPABILITIES,
    copyTrackingId: 'skills_agent_copy_amp',
    guideTrackingId: 'skills_agent_guide_amp',
    installTrackingId: 'skills_install_copy_amp',
  },
  {
    id: 'kimi',
    name: 'Kimi',
    vendor: 'Kimi',
    mode: 'Repo import',
    icon: 'code',
    install: `${REPO_URL}.git`,
    installSummary: 'Repository import',
    installNote: 'Import the root skills directory from GitHub.',
    invocation: 'Host-dependent',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    capabilities: CORE_CAPABILITIES,
    copyTrackingId: 'skills_agent_copy_kimi',
    guideTrackingId: 'skills_agent_guide_kimi',
    installTrackingId: 'skills_install_copy_kimi',
  },
  {
    id: 'skills-sh',
    name: 'skills.sh',
    vendor: 'Skills ecosystem',
    mode: 'Skill pack',
    icon: 'terminal',
    install: SKILLS_SH_INSTALL_COMMAND,
    installSummary: 'Direct skill pack',
    installNote: 'Installs the root skills for compatible coding agents.',
    invocation: '/sealos-deploy',
    guideHref: `${REPO_URL}#alternative-install-as-a-skillssh-skill-pack`,
    capabilities: CORE_CAPABILITIES,
    copyTrackingId: 'skills_agent_copy_skills_sh',
    guideTrackingId: 'skills_agent_guide_skills_sh',
    installTrackingId: 'skills_install_copy_skills_sh',
  },
] as const satisfies readonly AgentTarget[];

export type InstallTargetId = 'codex' | 'claude' | 'skills-sh';

export type InstallTarget = {
  id: InstallTargetId;
  label: string;
  command: string;
  compatibilityCommand?: string;
  invocation: string;
  note: string;
  trackingId: string;
};

export const INSTALL_TARGETS = [
  {
    id: 'codex',
    label: 'Codex',
    command: CODEX_INSTALL_COMMAND,
    compatibilityCommand: CODEX_COMPATIBILITY_COMMAND,
    invocation: CODEX_INVOCATION,
    note: 'Native marketplace install for Codex CLI and Codex App.',
    trackingId: 'skills_install_copy_codex',
  },
  {
    id: 'claude',
    label: 'Claude Code',
    command: CLAUDE_INSTALL_COMMAND,
    compatibilityCommand: CLAUDE_COMPATIBILITY_COMMAND,
    invocation: '/sealos',
    note: 'Managed plugin install with the same eight root skills.',
    trackingId: 'skills_install_copy_claude',
  },
  {
    id: 'skills-sh',
    label: 'skills.sh',
    command: SKILLS_SH_INSTALL_COMMAND,
    invocation: '/sealos-deploy',
    note: 'Direct skill-pack install for compatible coding agents.',
    trackingId: 'skills_install_copy_skills_sh',
  },
] as const satisfies readonly InstallTarget[];

export type SkillIconName =
  | 'rocket'
  | 'database'
  | 'storage'
  | 'canvas'
  | 'blocks'
  | 'readiness'
  | 'container'
  | 'compose';

export type Skill = {
  id: string;
  name: string;
  title: string;
  description: string;
  output: string;
  icon: SkillIconName;
  span: 'full' | 'wide' | 'standard';
  surface: 'accent' | 'panel' | 'code';
};

export const SKILL_CATALOG = [
  {
    id: 'sealos-deploy',
    name: 'sealos-deploy',
    title: 'Deploy a verified app',
    description:
      'Inspect a repo, prepare its runtime, deploy it to Sealos Cloud, and verify the live workload.',
    output: 'Verified application URL and workload status',
    icon: 'rocket',
    span: 'wide',
    surface: 'accent',
  },
  {
    id: 'sealos-database',
    name: 'sealos-database',
    title: 'Connect managed databases',
    description:
      'Create or connect Postgres, MySQL, MongoDB, or Redis and verify the application path.',
    output: 'Connected data service and tested environment key',
    icon: 'database',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'sealos-s3',
    name: 'sealos-s3',
    title: 'Provision private S3 storage',
    description:
      'Create a private bucket, wire the required environment values, and test real object operations.',
    output: 'Working storage path with protected credentials',
    icon: 'storage',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'sealos-canvas',
    name: 'sealos-canvas',
    title: 'Inspect live resources',
    description:
      'Read saved deployment state and open a local, read-only view of Sealos resources.',
    output: 'Local canvas backed by live resource data',
    icon: 'canvas',
    span: 'standard',
    surface: 'code',
  },
  {
    id: 'sealos-app-builder',
    name: 'sealos-app-builder',
    title: 'Build a Sealos Desktop app',
    description:
      'Apply SDK-aware guidance and platform conventions to a Sealos Desktop application.',
    output: 'Desktop app foundation with integration context',
    icon: 'blocks',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'cloud-native-readiness',
    name: 'cloud-native-readiness',
    title: 'Assess cloud readiness',
    description:
      'Review runtime, state, storage, configuration, and operational signals before deployment.',
    output: 'Concrete readiness findings and next actions',
    icon: 'readiness',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'dockerfile-skill',
    name: 'dockerfile-skill',
    title: 'Generate a Dockerfile',
    description:
      'Generate and validate a production-ready Dockerfile for the detected framework and runtime.',
    output: 'Build-tested container definition',
    icon: 'container',
    span: 'standard',
    surface: 'code',
  },
  {
    id: 'docker-to-sealos',
    name: 'docker-to-sealos',
    title: 'Convert Compose to Sealos',
    description:
      'Convert Docker Compose services into reviewable Sealos templates with quality gates.',
    output: 'Validated Sealos deployment template',
    icon: 'compose',
    span: 'full',
    surface: 'panel',
  },
] as const satisfies readonly Skill[];

export const PROOF_ITEMS = [
  { value: String(SKILL_CATALOG.length), label: 'skills included' },
  { value: String(AGENT_TARGETS.length), label: 'documented host paths' },
  { value: '.sealos/', label: 'inspectable run state' },
  { value: 'MIT', label: 'open-source license' },
] as const;

export type WorkflowScenarioId = 'deploy' | 'postgres' | 's3' | 'canvas';

export type WorkflowScenario = {
  id: WorkflowScenarioId;
  label: string;
  prompt: string;
  action: readonly string[];
  evidence: readonly string[];
  result: string;
};

export const WORKFLOW_SCENARIOS = [
  {
    id: 'deploy',
    label: 'Deploy',
    prompt: '$sealos deploy this repo to Sealos Cloud',
    action: [
      'Inspect runtime, ports, dependencies, and cloud readiness',
      'Reuse an image or build one, then generate the Sealos template',
      'Deploy or update the target and run rollout checks',
    ],
    evidence: [
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
      'Live application URL and workload status',
    ],
    result: 'Live app verified',
  },
  {
    id: 'postgres',
    label: 'Postgres',
    prompt:
      '$sealos create a cloud Postgres database for this repo and wire DATABASE_URL',
    action: [
      'Detect ORM, migration, and connection signals in the project',
      'Create or reuse a database in the active Sealos workspace',
      'Write the required local environment key and test the app path',
    ],
    evidence: [
      'Database resource identity',
      'Protected local environment placement',
      'Migration, introspection, or startup check',
      'Credential values retained in local protected files',
    ],
    result: 'Database connected',
  },
  {
    id: 's3',
    label: 'S3',
    prompt:
      '$sealos create private S3 object storage for uploads and wire env vars',
    action: [
      'Detect SDK, upload routes, bucket settings, and expected keys',
      'Create or reuse a private bucket and initialize credentials',
      'Wire the smallest environment surface and run the storage path',
    ],
    evidence: [
      'Bucket and policy inspection',
      'Credential-safe environment integration',
      'Upload and list result',
      'Download, delete, or presigned URL check',
    ],
    result: 'Storage path verified',
  },
  {
    id: 'canvas',
    label: 'Canvas',
    prompt: '$sealos show the resources created by the last deployment',
    action: [
      'Read .sealos/state.json to locate the deployed application',
      'Query the active namespace with read-only kubectl commands',
      'Start a temporary local canvas bound to 127.0.0.1',
    ],
    evidence: [
      '.sealos/state.json target match',
      'Read-only cluster resource snapshot',
      'Local canvas address',
      'Read-only cluster inspection',
    ],
    result: 'Resources ready to inspect',
  },
] as const satisfies readonly WorkflowScenario[];

export const PREREQUISITES = [
  {
    title: 'Sealos Cloud account',
    detail: 'Authentication connects the agent to the target Sealos region.',
  },
  {
    title: 'Container registry access',
    detail: 'Docker Hub or GHCR stores images built during deployment.',
  },
  {
    title: 'Sealos workspace',
    detail:
      'Database and S3 workflows create resources in an active workspace.',
  },
  {
    title: 'Workflow tools',
    detail:
      'Preflight requests Docker or kubectl when the selected path uses them.',
  },
] as const;

export type FaqItem = { question: string; answer: string };

export const FAQ_ITEMS = [
  {
    question: 'What do I need before my first deploy?',
    answer:
      'Bring a compatible coding agent and a project. Deployment uses a Sealos Cloud account and container registry access. Database and S3 workflows also use an active Sealos workspace.',
  },
  {
    question: 'What does the Sealos plugin install?',
    answer:
      'One managed package installs all eight root skills: deploy, database, S3, Canvas, app builder, cloud-native readiness, Dockerfile generation, and Docker Compose conversion.',
  },
  {
    question: 'Which coding agents can use Sealos Skills?',
    answer:
      'Codex and Claude Code use plugins. Qoder imports a package. OpenClaw uses a bundle. Gemini and Qwen use context extensions. Amp and Kimi import the repository.',
  },
  {
    question: 'When are Docker and kubectl used?',
    answer:
      'Docker supports local image builds. kubectl supports deployment discovery, updates, rollout verification, and Canvas inspection. Preflight selects the tools required by each workflow.',
  },
  {
    question: 'How are credentials handled?',
    answer:
      'Sealos authentication, kubeconfig, database credentials, and S3 keys remain in protected local files or project environment files. Reports include resource references and verification evidence.',
  },
  {
    question: 'When can I use Canvas?',
    answer:
      'Canvas works after a deploy run creates .sealos/state.json. It reads the saved target, queries resources with read-only commands, and opens a temporary local view.',
  },
  {
    question: 'Can Sealos Skills update an existing deployment?',
    answer:
      'Yes. A later deploy run reads .sealos/state.json, confirms the target, rebuilds or reuses the image, patches the rollout, and records the result.',
  },
] as const satisfies readonly FaqItem[];

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
      'Give the AI coding agent you already use a verified path from repo to running app on Sealos Cloud. Sealos Skills prepares the runtime, connects databases and S3, deploys, and returns evidence you can review.',
    commandLabel: 'INSTALL FOR CODEX',
    primaryCta: 'Copy Codex install',
    secondaryCta: 'View on GitHub',
    trustBar:
      'Verified Codex plugin · 8 open-source skills · Reviewable .sealos/ evidence · MIT licensed',
    invocation: `Then run ${DEPLOY_PROMPT}.`,
  },
  problem: {
    title: 'Code generation ends where cloud work begins.',
    description:
      'Containers, credentials, databases, storage, rollout checks, and updates still need a reliable path. Sealos Skills gives your agent that path and keeps every important artifact visible.',
  },
  cloudValue: {
    title: 'Sealos Cloud keeps the handoff visible.',
    description:
      'You get a Kubernetes-native runtime, managed data and storage, and reviewable execution evidence in one workspace.',
  },
  directory: {
    title: 'Bring the same cloud path to your favorite agent.',
    description:
      'Start with the verified Codex plugin. Claude Code and Qoder add command support through plugins. Other hosts use bundle, context, direct-skill, or repository paths with host-specific invocation.',
  },
  support: {
    title: 'One skill pack. Clear host paths.',
    description:
      'Support levels, install paths, and command surfaces all come from one typed host catalog.',
  },
  capabilities: {
    eyebrow: 'CLOUD CAPABILITIES',
    title: 'Finish the cloud handoff from your coding agent.',
    description:
      'Eight focused skills cover runtime preparation, managed data, deployment, inspection, and repeatable updates on Sealos Cloud.',
  },
  workflow: {
    title: 'From one prompt to a verified runtime.',
    description:
      'The agent inspects first, prepares only what the project needs, deploys or updates the workload, and returns files and live checks you can review.',
  },
  install: {
    title: 'Choose your host. Keep the Sealos workflow.',
    description:
      'Keep one workflow across Codex, Claude Code, skills.sh, and the rest of the supported hosts.',
  },
  setup: {
    eyebrow: 'Before the first run',
    title: 'Start with a repo. Preflight guides the rest.',
    description:
      'Sealos Skills checks login, workspace, registry, Docker, and kubectl, then guides setup for the path your project needs.',
  },
  final: {
    title: 'Install the skill. Ship with evidence.',
    description:
      'Deploy one repo and review the generated artifacts, live URL, rollout status, logs, and resource footprint before you call it done.',
    primaryCta: 'Copy Codex install',
    secondaryCta: 'Browse install paths',
    trust: 'MIT licensed. Inspect every instruction and generated artifact.',
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
  supportLevel: string;
  commandSupport: string;
  supportNote: string;
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
    supportLevel: 'Verified',
    commandSupport: 'Native commands',
    supportNote: 'Verified native plugin for Codex CLI and Codex App.',
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
    supportLevel: 'Managed plugin',
    commandSupport: 'Plugin commands',
    supportNote: 'Managed plugin with /sealos command support.',
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
    supportLevel: 'Package import',
    commandSupport: 'Plugin commands',
    supportNote:
      'Build the package, import dist/sealos-<version>.zip, then run /sealos.',
    install: 'python3 scripts/package-qoder-plugin.py',
    installSummary: 'Build + import ZIP',
    installNote: 'Build the package, then import dist/sealos-<version>.zip.',
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
    supportLevel: 'Context-only',
    commandSupport: 'Context guidance',
    supportNote: 'Context-only extension. Ask the agent to use Sealos Skills.',
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
    supportLevel: 'Context-only',
    commandSupport: 'Context guidance',
    supportNote: 'Context-only extension. Ask the agent to use Sealos Skills.',
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
    supportLevel: 'Bundle',
    commandSupport: 'Runtime commands',
    supportNote: 'ClawHub bundle. Command behavior follows the active runtime.',
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
    supportLevel: 'Marketplace plugin',
    commandSupport: 'Host commands',
    supportNote: 'Marketplace plugin. Command behavior follows CodeBuddy.',
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
    supportLevel: 'Repository import',
    commandSupport: 'Host commands',
    supportNote: 'Repository import. Invocation follows the host.',
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
    supportLevel: 'Repository import',
    commandSupport: 'Host commands',
    supportNote: 'Repository import. Invocation follows the host.',
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
    supportLevel: 'Skill pack',
    commandSupport: 'Direct deploy/database/S3 commands',
    supportNote:
      'Direct entries for deploy, database, and S3. Canvas uses verified deployment state through a plugin entry point.',
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
    title: 'Deploy and verify a live app',
    description:
      'Inspect the repo, prepare the runtime, deploy to Sealos Cloud, and verify the live URL, rollout, logs, and footprint.',
    output: 'Verified URL, rollout, logs, and footprint',
    icon: 'rocket',
    span: 'wide',
    surface: 'accent',
  },
  {
    id: 'sealos-database',
    name: 'sealos-database',
    title: 'Connect a managed database',
    description:
      'Create or connect Postgres, MySQL, MongoDB, or Redis, wire the required env key, and test the app path.',
    output: 'Connected data service and validated env key',
    icon: 'database',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'sealos-s3',
    name: 'sealos-s3',
    title: 'Connect private S3-compatible storage',
    description:
      'Create a private bucket, wire credentials, and test upload, list, download, and presigned URL behavior.',
    output: 'Working storage path with protected credentials',
    icon: 'storage',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'sealos-canvas',
    name: 'sealos-canvas',
    title: 'Inspect a verified deployment',
    description:
      'Read .sealos/state.json and open a read-only local view of the verified deployment.',
    output: 'Local canvas backed by live resource data',
    icon: 'canvas',
    span: 'standard',
    surface: 'code',
  },
  {
    id: 'sealos-app-builder',
    name: 'sealos-app-builder',
    title: 'Build with the Sealos Desktop SDK',
    description:
      'Apply SDK-aware integration patterns to a Sealos Desktop application.',
    output: 'Desktop app foundation with integration context',
    icon: 'blocks',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'cloud-native-readiness',
    name: 'cloud-native-readiness',
    title: 'Find deployment blockers early',
    description:
      'Score readiness from 0 to 12 and return the next actions before deployment.',
    output: 'Concrete readiness findings and next actions',
    icon: 'readiness',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'dockerfile-skill',
    name: 'dockerfile-skill',
    title: 'Generate and build-test a Dockerfile',
    description:
      'Produce and build-test a production-oriented Dockerfile for the detected stack.',
    output: 'Build-tested container definition',
    icon: 'container',
    span: 'standard',
    surface: 'code',
  },
  {
    id: 'docker-to-sealos',
    name: 'docker-to-sealos',
    title: 'Turn Compose into a validated Sealos template',
    description:
      'Convert Docker Compose services into a validated Sealos template with quality gates.',
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
    question: 'What do I need before the first run?',
    answer:
      'Bring a compatible coding agent and a project. Preflight checks the account, registry, workspace, Docker, and kubectl surface for the selected workflow.',
  },
  {
    question: 'Will Sealos Skills change cloud resources automatically?',
    answer:
      'Sensitive actions keep target confirmation in the loop and ask for confirmation before credential or access changes.',
  },
  {
    question: 'How are credentials handled?',
    answer:
      'Credentials stay in protected local or project environment files. Chat output references them through paths and evidence.',
  },
  {
    question: 'How does it verify a deployment?',
    answer:
      'Verification covers rollout, URL, logs, setup flow, and resource footprint.',
  },
  {
    question: 'Can it update an existing deployment?',
    answer:
      'Yes. The agent reads verified state, confirms the target, patches the rollout, and records the result.',
  },
  {
    question: 'When can I use Canvas?',
    answer:
      'Canvas works after a deploy run creates .sealos/state.json. It reads the saved target, queries resources with read-only commands, and opens a temporary local view.',
  },
  {
    question: 'What does it cost?',
    answer:
      'The skill pack is MIT licensed. Cloud usage follows workspace resources and region pricing.',
  },
] as const satisfies readonly FaqItem[];

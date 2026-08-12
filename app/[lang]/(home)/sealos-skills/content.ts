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
    title: 'Deploy from your coding agent. See the proof.',
    description:
      'Point Sealos Skills at a repo. Your agent prepares the runtime, deploys it to Sealos Cloud, and returns a live URL with rollout, log, and resource checks.',
    commandLabel: 'INSTALL FOR CODEX',
    primaryCta: 'Install in Codex',
    secondaryCta: 'View source on GitHub',
    invocation: 'Then run $sealos deploy this repo to Sealos Cloud.',
  },
  capabilities: {
    eyebrow: 'CLOUD CAPABILITIES',
    title: 'The cloud work between your repo and a live app.',
    description:
      'Prepare the runtime, connect the services your app needs, deploy, update, and inspect the result from the same agent.',
  },
  workflow: {
    title: 'From prompt to evidence.',
    description:
      'Every workflow shows what Sealos Skills did, what it checked, and what you can review before you call it done.',
  },
  install: {
    eyebrow: 'INSTALL SEALOS SKILLS',
    title: 'Choose your agent. Copy one install path.',
    description:
      'Start with the managed Codex or Claude Code plugin. Eight more documented paths bring the same Sealos skill source to other supported tools.',
    proof: 'One skill source. 10 documented install paths.',
    moreTitle: 'More install paths',
    moreDescription: 'Open one path to see its command, invocation, and guide.',
    moreCount: '8 documented paths',
  },
  setup: {
    eyebrow: 'Before the first run',
    title: 'Start with a project. Set up the rest as you go.',
    description:
      'Sealos Skills checks the tools and access each workflow needs, then guides login, registry, and workspace setup.',
  },
  final: {
    title: 'Deploy your repo. Keep the evidence.',
    description:
      'Install Sealos Skills in Codex, run $sealos, and review the live result before you call it shipped.',
    primaryCta: 'Install in Codex',
    secondaryCta: 'View all install paths',
  },
} as const;

export type AgentIntegration =
  | 'Managed plugin'
  | 'Packaged plugin'
  | 'Context extension'
  | 'ClawHub bundle'
  | 'Marketplace plugin'
  | 'Repository import'
  | 'Direct skill pack';
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
  integration: AgentIntegration;
  icon: AgentIconKey;
  install: string;
  installSummary: string;
  installNote: string;
  invocation: string;
  guideHref: string;
  compatibilityCommand?: string;
  guideTrackingId: string;
  installTrackingId: string;
};

export const AGENT_TARGETS = [
  {
    id: 'codex',
    name: 'Codex',
    vendor: 'OpenAI',
    integration: 'Managed plugin',
    icon: 'openai',
    install: CODEX_INSTALL_COMMAND,
    installSummary: 'Marketplace + plugin',
    installNote: 'Native plugin for Codex CLI and Codex App.',
    invocation: CODEX_INVOCATION,
    guideHref: `${REPO_URL}#recommended-install-in-codex`,
    compatibilityCommand: CODEX_COMPATIBILITY_COMMAND,
    guideTrackingId: 'skills_install_guide_codex',
    installTrackingId: 'skills_install_copy_codex',
  },
  {
    id: 'claude',
    name: 'Claude Code',
    vendor: 'Anthropic',
    integration: 'Managed plugin',
    icon: 'claude',
    install: CLAUDE_INSTALL_COMMAND,
    installSummary: 'Marketplace + plugin',
    installNote: 'Managed plugin install with the same eight root skills.',
    invocation: '/sealos',
    guideHref: `${REPO_URL}#install-in-claude-code`,
    compatibilityCommand: CLAUDE_COMPATIBILITY_COMMAND,
    guideTrackingId: 'skills_install_guide_claude',
    installTrackingId: 'skills_install_copy_claude',
  },
  {
    id: 'qoder',
    name: 'Qoder',
    vendor: 'Qoder',
    integration: 'Packaged plugin',
    icon: 'qoder',
    install: 'python3 scripts/package-qoder-plugin.py',
    installSummary: 'Build + import ZIP',
    installNote:
      'Build the package, import dist/sealos-1.2.5.zip, then run /sealos.',
    invocation: '/sealos',
    guideHref: `${REPO_URL}#test-in-qoder`,
    guideTrackingId: 'skills_install_guide_qoder',
    installTrackingId: 'skills_install_copy_qoder',
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    vendor: 'Google',
    integration: 'Context extension',
    icon: 'gemini',
    install:
      'gemini extensions install https://github.com/labring/sealos-skills',
    installSummary: 'GitHub extension',
    installNote: 'Context extension. Ask Gemini to use Sealos Skills.',
    invocation: 'Ask Gemini to use Sealos Skills',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    guideTrackingId: 'skills_install_guide_gemini',
    installTrackingId: 'skills_install_copy_gemini',
  },
  {
    id: 'qwen',
    name: 'Qwen Code',
    vendor: 'Qwen',
    integration: 'Context extension',
    icon: 'qwen',
    install: 'qwen extensions install https://github.com/labring/sealos-skills',
    installSummary: 'GitHub extension',
    installNote: 'Context extension. Ask Qwen to use Sealos Skills.',
    invocation: 'Ask Qwen to use Sealos Skills',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    guideTrackingId: 'skills_install_guide_qwen',
    installTrackingId: 'skills_install_copy_qwen',
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    vendor: 'ClawHub',
    integration: 'ClawHub bundle',
    icon: 'bot',
    install: 'clawhub install labring/sealos-skills',
    installSummary: 'ClawHub bundle',
    installNote:
      'Install from ClawHub. Command exposure follows the host runtime.',
    invocation: 'Host runtime',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    guideTrackingId: 'skills_install_guide_openclaw',
    installTrackingId: 'skills_install_copy_openclaw',
  },
  {
    id: 'codebuddy',
    name: 'CodeBuddy',
    vendor: 'CodeBuddy',
    integration: 'Marketplace plugin',
    icon: 'codebuddy',
    install: '/plugin marketplace add labring/sealos-skills',
    installSummary: 'Marketplace plugin',
    installNote:
      'Register the Sealos marketplace. Command exposure follows the host runtime.',
    invocation: 'Host runtime',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    guideTrackingId: 'skills_install_guide_codebuddy',
    installTrackingId: 'skills_install_copy_codebuddy',
  },
  {
    id: 'amp',
    name: 'Amp',
    vendor: 'Amp',
    integration: 'Repository import',
    icon: 'code',
    install: `${REPO_URL}.git`,
    installSummary: 'Repository import',
    installNote:
      'Import the root skills repository. Invocation follows the host.',
    invocation: 'Host workflow',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    guideTrackingId: 'skills_install_guide_amp',
    installTrackingId: 'skills_install_copy_amp',
  },
  {
    id: 'kimi',
    name: 'Kimi',
    vendor: 'Kimi',
    integration: 'Repository import',
    icon: 'code',
    install: `${REPO_URL}.git`,
    installSummary: 'Repository import',
    installNote:
      'Import the root skills repository. Invocation follows the host.',
    invocation: 'Host workflow',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    guideTrackingId: 'skills_install_guide_kimi',
    installTrackingId: 'skills_install_copy_kimi',
  },
  {
    id: 'skills-sh',
    name: 'skills.sh',
    vendor: 'Skills ecosystem',
    integration: 'Direct skill pack',
    icon: 'terminal',
    install: SKILLS_SH_INSTALL_COMMAND,
    installSummary: 'Direct skill pack',
    installNote:
      'Install the root skill pack and invoke each Sealos skill directly.',
    invocation: '/sealos-deploy',
    guideHref: `${REPO_URL}#alternative-install-as-a-skillssh-skill-pack`,
    guideTrackingId: 'skills_install_guide_skills_sh',
    installTrackingId: 'skills_install_copy_skills_sh',
  },
] as const satisfies readonly AgentTarget[];

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
    title: 'Deploy and verify your app',
    description:
      'Inspect the repo, prepare its runtime, deploy to Sealos Cloud, and check the live result.',
    output: 'Live URL, healthy rollout, and saved run state',
    icon: 'rocket',
    span: 'wide',
    surface: 'accent',
  },
  {
    id: 'sealos-database',
    name: 'sealos-database',
    title: 'Connect a managed database',
    description:
      'Create or reuse Postgres, MySQL, MongoDB, or Redis and wire only the environment values the app needs.',
    output: 'Connected service and tested app path',
    icon: 'database',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'sealos-s3',
    name: 'sealos-s3',
    title: 'Add private object storage',
    description:
      "Create a private bucket, place credentials safely, and verify the app's real object-storage path.",
    output: 'Working S3 path with protected credentials',
    icon: 'storage',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'sealos-canvas',
    name: 'sealos-canvas',
    title: 'Inspect live resources',
    description:
      'Read saved deployment state and open a temporary, read-only view of current Sealos resources.',
    output: 'Local canvas backed by live resource data',
    icon: 'canvas',
    span: 'standard',
    surface: 'code',
  },
  {
    id: 'sealos-app-builder',
    name: 'sealos-app-builder',
    title: 'Build for Sealos Desktop',
    description:
      'Apply Sealos SDK and platform conventions while the agent builds the app.',
    output: 'Desktop app foundation ready for Sealos',
    icon: 'blocks',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'cloud-native-readiness',
    name: 'cloud-native-readiness',
    title: 'Find deployment blockers',
    description:
      'Check runtime, state, storage, configuration, and operations before deployment.',
    output: 'Prioritized blockers and next steps',
    icon: 'readiness',
    span: 'standard',
    surface: 'panel',
  },
  {
    id: 'dockerfile-skill',
    name: 'dockerfile-skill',
    title: 'Create a production Dockerfile',
    description:
      'Generate and build-check a Dockerfile for the detected framework and runtime.',
    output: 'Build-tested container definition',
    icon: 'container',
    span: 'standard',
    surface: 'code',
  },
  {
    id: 'docker-to-sealos',
    name: 'docker-to-sealos',
    title: 'Convert Compose into Sealos',
    description:
      'Turn Docker Compose services into a reviewable Sealos template and run quality checks.',
    output: 'Validated Sealos template',
    icon: 'compose',
    span: 'full',
    surface: 'panel',
  },
] as const satisfies readonly Skill[];

export const PROOF_ITEMS = [
  { value: String(SKILL_CATALOG.length), label: 'skills from one source' },
  { value: String(AGENT_TARGETS.length), label: 'documented install paths' },
  { value: 'URL + rollout', label: 'checked before handoff' },
  { value: '.sealos/', label: 'inspectable run evidence' },
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
    result: 'Deployment verified',
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
    result: 'Postgres connected',
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
    result: 'S3 path verified',
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
    result: 'Live resources ready',
  },
] as const satisfies readonly WorkflowScenario[];

export const PREREQUISITES = [
  {
    title: 'A project and a supported agent',
    detail:
      'Start with a local repo or GitHub URL in a documented coding agent.',
  },
  {
    title: 'Sealos Cloud access',
    detail:
      'Sign in when a workflow needs to create or inspect resources in your Sealos workspace.',
  },
  {
    title: 'A container registry for deploys',
    detail:
      'Use Docker Hub, GHCR, or an existing image path when deployment needs an image.',
  },
  {
    title: 'Tools checked on demand',
    detail:
      'Preflight asks for Docker or kubectl when the selected workflow uses them.',
  },
] as const;

export type FaqItem = { question: string; answer: string };

export const FAQ_ITEMS = [
  {
    question: 'What do I need to start?',
    answer:
      'Bring a supported coding agent and a local repo or GitHub URL. Sealos Skills checks the selected workflow and requests the required Sealos, registry, workspace, Docker, or kubectl access.',
  },
  {
    question: 'Do I need a Sealos account before installation?',
    answer:
      'Install the skill pack first. Deployment, database, and S3 workflows guide Sealos login when they need cloud access.',
  },
  {
    question: 'How does Sealos Skills verify a deployment?',
    answer:
      'It checks the real application URL, rollout status, logs, web setup or login flow, and resource footprint before reporting the app usable.',
  },
  {
    question: 'How are credentials handled?',
    answer:
      'Sealos authentication, kubeconfig, database credentials, and S3 keys stay in protected local or project environment files. Reports contain resource references and test results.',
  },
  {
    question: 'When are Docker and kubectl used?',
    answer:
      'Docker builds images when the project needs one. kubectl discovers targets, updates workloads, checks rollouts, and powers read-only Canvas inspection.',
  },
  {
    question: 'When can I use Canvas?',
    answer:
      'Canvas opens after a verified deploy writes .sealos/state.json. It reads the saved target, queries current resources with read-only commands, and starts a temporary local view.',
  },
  {
    question: 'Can Sealos Skills update an existing deployment?',
    answer:
      'A later deploy reads .sealos/state.json, confirms the target, rebuilds or reuses the image, updates the workload, verifies rollout, and saves the new result.',
  },
  {
    question: 'What comes with the plugin?',
    answer:
      'The managed plugin loads eight skills from one source: deploy, database, S3, Canvas, app builder, cloud-native readiness, Dockerfile generation, and Compose conversion.',
  },
] as const satisfies readonly FaqItem[];

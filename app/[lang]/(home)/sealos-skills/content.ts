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
    eyebrow: 'AGENT GUIDES',
    title: 'Connect Sealos Skills to your coding agent.',
    description:
      'Choose your agent for the exact install path, invocation, example prompts, update guidance, and deployment evidence.',
    proof: '9 Agent guides. One shared skill source.',
    distributionTitle: 'Install through skills.sh',
    distributionDescription:
      'Use the direct skill-pack path when your coding agent already supports the skills.sh ecosystem.',
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
  | 'openclaw'
  | 'amp'
  | 'kimi'
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
    icon: 'openclaw',
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
    vendor: 'Sourcegraph',
    integration: 'Repository import',
    icon: 'amp',
    install: 'amp skill add https://github.com/labring/sealos-skills.git',
    installSummary: 'Amp skill import',
    installNote:
      'Import the shared repository through the native Amp skill command.',
    invocation: 'Ask Amp to use the installed Sealos skill',
    guideHref: `${REPO_URL}#other-supported-ai-tools`,
    guideTrackingId: 'skills_install_guide_amp',
    installTrackingId: 'skills_install_copy_amp',
  },
  {
    id: 'kimi',
    name: 'Kimi Code',
    vendor: 'Moonshot AI',
    integration: 'Repository import',
    icon: 'kimi',
    install:
      'git clone --depth 1 https://github.com/labring/sealos-skills.git .sealos-skills\nmkdir -p .agents/skills\ncp -R .sealos-skills/skills/. .agents/skills/',
    installSummary: 'Project Skills directory',
    installNote:
      'Copy the root skills into the project .agents/skills directory.',
    invocation: '/skill:sealos-deploy',
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

export const AGENT_IDS = [
  'codex',
  'claude',
  'gemini',
  'openclaw',
  'qwen',
  'kimi',
  'amp',
  'qoder',
  'codebuddy',
] as const;

export type AgentId = (typeof AGENT_IDS)[number];
export type AgentQuickStartStep = {
  title: string;
  description: string;
  command?: string;
};
export type AgentPrompt = {
  id: 'deploy' | 'database' | 'host-workflow' | 'inspect';
  label: string;
  prompt: string;
};
export type AgentGuideFaq = { question: string; answer: string };

export type AgentGuide = AgentTarget & {
  id: AgentId;
  path: `/sealos-skills/${AgentId}`;
  productDescription: string;
  integrationDescription: string;
  availabilityNote?: string;
  officialDocsUrl: string;
  manifestUrl: string;
  iconSourceUrl: string;
  quickStart: readonly AgentQuickStartStep[];
  prompts: readonly AgentPrompt[];
  faq: readonly AgentGuideFaq[];
  related: readonly AgentId[];
};

type AgentGuideDetails = Pick<
  AgentGuide,
  | 'productDescription'
  | 'integrationDescription'
  | 'availabilityNote'
  | 'officialDocsUrl'
  | 'manifestUrl'
  | 'iconSourceUrl'
  | 'quickStart'
  | 'prompts'
  | 'faq'
  | 'related'
>;

const VERIFIED_RESULT_STEP = {
  title: 'Review the verified result',
  description:
    'Check the live URL, rollout, logs, relevant page checks, resource footprint, and saved .sealos/state.json.',
} as const;

function createQuickStart(
  installTitle: string,
  installDescription: string,
  installCommand: string,
  startTitle: string,
  startDescription: string,
  startCommand: string,
): readonly AgentQuickStartStep[] {
  return [
    {
      title: installTitle,
      description: installDescription,
      command: installCommand,
    },
    {
      title: startTitle,
      description: startDescription,
      command: startCommand,
    },
    VERIFIED_RESULT_STEP,
  ];
}

function createPrompts(
  deploy: string,
  database: string,
  hostWorkflow: string,
  inspect: string,
): readonly AgentPrompt[] {
  return [
    { id: 'deploy', label: 'Deploy this repo', prompt: deploy },
    { id: 'database', label: 'Connect Postgres', prompt: database },
    {
      id: 'host-workflow',
      label: 'Prepare the runtime',
      prompt: hostWorkflow,
    },
    { id: 'inspect', label: 'Inspect the result', prompt: inspect },
  ];
}

function createAgentFaq(
  name: string,
  installAnswer: string,
  invokeAnswer: string,
  updateAnswer: string,
): readonly AgentGuideFaq[] {
  return [
    {
      question: `Where does ${name} install Sealos Skills?`,
      answer: installAnswer,
    },
    {
      question: `How do I start Sealos Skills in ${name}?`,
      answer: invokeAnswer,
    },
    {
      question: `How do I update Sealos Skills in ${name}?`,
      answer: updateAnswer,
    },
  ];
}

export const DEPLOYMENT_EVIDENCE = [
  {
    title: 'Live application URL',
    description: 'Open the deployed application and test the relevant path.',
  },
  {
    title: 'Rollout and workload health',
    description: 'Confirm the workload reaches its expected ready state.',
  },
  {
    title: 'Runtime logs',
    description: 'Review startup and request logs for actionable failures.',
  },
  {
    title: 'Relevant page checks',
    description:
      'Exercise setup, login, upload, or data paths used by the app.',
  },
  {
    title: 'Resource footprint',
    description: 'Report the Sealos resources created or updated by the run.',
  },
  {
    title: 'Saved run state',
    description: 'Persist the verified target in .sealos/state.json.',
  },
] as const;

const AGENT_GUIDE_DETAILS = {
  codex: {
    productDescription:
      "Codex is OpenAI's coding agent for working across repositories from the terminal and Codex App. The managed Sealos plugin keeps its commands, skills, prompts, and metadata together.",
    integrationDescription:
      'Add the Labring marketplace, install the Sealos plugin, then open it with $sealos in Codex CLI or the plugin picker in Codex App.',
    officialDocsUrl: 'https://developers.openai.com/codex/',
    manifestUrl: `${REPO_URL}/blob/main/.codex-plugin/plugin.json`,
    iconSourceUrl: 'https://openai.com/codex/',
    quickStart: createQuickStart(
      'Install the managed plugin',
      'Register the Sealos Skills marketplace and install the Sealos plugin.',
      CODEX_INSTALL_COMMAND,
      'Start with $sealos',
      'Type $sealos in Codex CLI, or choose Sealos from the Codex App plugin picker.',
      '$sealos deploy this repo to Sealos Cloud',
    ),
    prompts: createPrompts(
      '$sealos deploy this repo to Sealos Cloud',
      '$sealos create a cloud Postgres database for this repo and wire DATABASE_URL',
      '$sealos assess this repo for cloud deployment blockers and fix the highest-priority issue',
      '$sealos show the live resources created by the last deployment',
    ),
    faq: createAgentFaq(
      'Codex',
      'Codex installs Sealos as a managed plugin from the Labring marketplace. The plugin references the eight skills in the repository root.',
      'Type $sealos in Codex CLI. In Codex App, open the plugin picker from the chat composer and choose Sealos.',
      'Refresh the Labring marketplace, then update or reinstall the Sealos plugin through the Codex plugin manager.',
    ),
    related: ['claude', 'qoder', 'amp'],
  },
  claude: {
    productDescription:
      "Claude Code is Anthropic's agentic coding tool for terminal-based repository work. Sealos Skills installs through Claude Code's managed plugin marketplace.",
    integrationDescription:
      'Register the Labring marketplace, install the Sealos plugin, and use /sealos to route deployment and cloud-service requests.',
    officialDocsUrl: 'https://docs.anthropic.com/en/docs/claude-code/overview',
    manifestUrl: `${REPO_URL}/blob/main/.claude-plugin/plugin.json`,
    iconSourceUrl: 'https://www.anthropic.com/claude-code',
    quickStart: createQuickStart(
      'Install the managed plugin',
      'Register the Sealos marketplace and install the plugin in Claude Code.',
      CLAUDE_INSTALL_COMMAND,
      'Start with /sealos',
      'Run the plugin command from a project and describe the cloud outcome you want.',
      '/sealos deploy this repo to Sealos Cloud',
    ),
    prompts: createPrompts(
      '/sealos deploy this repo to Sealos Cloud',
      '/sealos create a cloud Postgres database for this repo and wire DATABASE_URL',
      '/sealos add private S3 storage for uploads and verify the application path',
      '/sealos update the last deployment and verify the new rollout',
    ),
    faq: createAgentFaq(
      'Claude Code',
      "Claude Code installs Sealos from the Labring plugin marketplace and loads the repository's commands and eight root skills.",
      'Run /sealos in a project, followed by a deployment, database, S3, Canvas, or readiness request.',
      "Update the Labring marketplace and reinstall or update sealos@sealos through Claude Code's plugin manager.",
    ),
    related: ['codex', 'codebuddy', 'qoder'],
  },
  gemini: {
    productDescription:
      "Gemini CLI is Google's open-source AI agent for terminal workflows. The Sealos extension supplies repository context that Gemini can use while planning and running cloud work.",
    integrationDescription:
      'Install the GitHub extension, open a project, and ask Gemini to use Sealos Skills for the requested deployment or service workflow.',
    availabilityNote:
      'Gemini CLI supports Google sign-in, Gemini API keys, and Vertex AI. Authentication requirements vary by account type and organization policy.',
    officialDocsUrl: 'https://geminicli.com/docs/',
    manifestUrl: `${REPO_URL}/blob/main/gemini-extension.json`,
    iconSourceUrl: 'https://github.com/google-gemini/gemini-cli',
    quickStart: createQuickStart(
      'Install the context extension',
      'Install Sealos Skills directly from the public GitHub repository.',
      'gemini extensions install https://github.com/labring/sealos-skills',
      'Name Sealos Skills in your prompt',
      'Gemini loads the repository context; state the skill source and the outcome you need.',
      'Use Sealos Skills to deploy this repo to Sealos Cloud and verify the result.',
    ),
    prompts: createPrompts(
      'Use Sealos Skills to deploy this repo to Sealos Cloud and verify the result.',
      'Use Sealos Skills to create a cloud Postgres database and wire DATABASE_URL.',
      'Use Sealos Skills to create and build-check the missing Dockerfile for this repo.',
      'Use Sealos Skills to read the last deployment state and inspect the live resources.',
    ),
    faq: createAgentFaq(
      'Gemini CLI',
      'Gemini CLI stores Sealos Skills as a GitHub-backed context extension that points at the shared root skill source.',
      'Ask Gemini to use Sealos Skills and describe the deployment, database, S3, Canvas, or readiness outcome.',
      'Run the Gemini CLI extension update flow for the installed Sealos extension to pull the current repository version.',
    ),
    related: ['qwen', 'amp', 'kimi'],
  },
  openclaw: {
    productDescription:
      'OpenClaw is an open-source personal AI assistant that connects tools and messaging surfaces. Sealos Skills is published as a ClawHub-compatible bundle pointer.',
    integrationDescription:
      'Install the repository bundle through ClawHub, reload the OpenClaw runtime when required, and ask the active agent to use Sealos Skills.',
    officialDocsUrl: 'https://docs.openclaw.ai/',
    manifestUrl: `${REPO_URL}/blob/main/openclaw.plugin.json`,
    iconSourceUrl: 'https://openclaw.ai/favicon.svg',
    quickStart: createQuickStart(
      'Install the ClawHub bundle',
      'Add the Sealos Skills bundle to the OpenClaw environment.',
      'clawhub install labring/sealos-skills',
      'Ask for a Sealos workflow',
      'Reload the host when required, then name Sealos Skills in the task.',
      'Use Sealos Skills to deploy this repo to Sealos Cloud and verify the result.',
    ),
    prompts: createPrompts(
      'Use the Sealos Skills bundle to deploy this repo to Sealos Cloud and verify the result.',
      'Use the Sealos Skills bundle to create Postgres and connect this application.',
      'Use the Sealos Skills bundle to prepare this service for a persistent OpenClaw workload.',
      'Use the Sealos Skills bundle to report the last deployment resource footprint.',
    ),
    faq: createAgentFaq(
      'OpenClaw',
      'ClawHub installs the Sealos Skills bundle into the OpenClaw environment. The repository keeps the bundle pointer in openclaw.plugin.json.',
      'Ask the active OpenClaw agent to use the Sealos Skills bundle and state the cloud outcome.',
      "Use ClawHub's update flow for the installed labring/sealos-skills bundle, then reload the OpenClaw runtime when required.",
    ),
    related: ['kimi', 'amp', 'qwen'],
  },
  qwen: {
    productDescription:
      'Qwen Code is an open-source agentic coding tool for terminal workflows. Its Sealos context extension points at the same root skill source used by the managed plugins.',
    integrationDescription:
      'Install the GitHub extension and name Sealos Skills in the prompt when you want Qwen Code to prepare, deploy, or inspect a project.',
    officialDocsUrl: 'https://qwenlm.github.io/qwen-code-docs/en/',
    manifestUrl: `${REPO_URL}/blob/main/qwen-extension.json`,
    iconSourceUrl: 'https://github.com/QwenLM/qwen-code',
    quickStart: createQuickStart(
      'Install the context extension',
      'Install Sealos Skills directly from the public GitHub repository.',
      'qwen extensions install https://github.com/labring/sealos-skills',
      'Name Sealos Skills in your prompt',
      'Open the target project and ask Qwen Code for a concrete Sealos outcome.',
      'Use Sealos Skills to deploy this repo to Sealos Cloud and verify the result.',
    ),
    prompts: createPrompts(
      'Use Sealos Skills to deploy this repo to Sealos Cloud and verify the result.',
      'Use Sealos Skills to create a cloud Postgres database and wire DATABASE_URL.',
      'Use Sealos Skills to convert this Docker Compose project into a validated Sealos template.',
      'Use Sealos Skills to update the saved deployment and report the rollout and logs.',
    ),
    faq: createAgentFaq(
      'Qwen Code',
      'Qwen Code installs Sealos Skills as a GitHub-backed context extension and reads its guidance from the shared repository source.',
      'Ask Qwen Code to use Sealos Skills and describe the deployment or cloud-service task.',
      "Use Qwen Code's extension update command for the installed Sealos extension to pull the current repository version.",
    ),
    related: ['gemini', 'kimi', 'amp'],
  },
  kimi: {
    productDescription:
      "Kimi Code is Moonshot AI's open-source agentic coding tool. It discovers project skills from .agents/skills and supports explicit named-skill invocation.",
    integrationDescription:
      'Clone the shared Sealos repository into the project, copy its root skills into .agents/skills, and invoke the workflow with /skill:<name>.',
    officialDocsUrl:
      'https://moonshotai.github.io/kimi-code/en/customization/skills.html',
    manifestUrl: `${REPO_URL}/tree/main/skills`,
    iconSourceUrl:
      'https://raw.githubusercontent.com/MoonshotAI/kimi-cli/main/web/public/logo.png',
    quickStart: createQuickStart(
      'Add the project skills',
      "Clone the source and copy all eight skills into Kimi Code's project Skills directory.",
      'git clone --depth 1 https://github.com/labring/sealos-skills.git .sealos-skills\nmkdir -p .agents/skills\ncp -R .sealos-skills/skills/. .agents/skills/',
      'Invoke a named skill',
      "Use Kimi Code's explicit skill command or let the agent select a relevant skill.",
      '/skill:sealos-deploy deploy this repo to Sealos Cloud and verify the result',
    ),
    prompts: createPrompts(
      '/skill:sealos-deploy deploy this repo to Sealos Cloud and verify the result',
      '/skill:sealos-database create Postgres and wire DATABASE_URL for this repo',
      '/skill:dockerfile-skill create and build-check a production Dockerfile for this repo',
      '/skill:sealos-canvas show the live resources created by the last deployment',
    ),
    faq: createAgentFaq(
      'Kimi Code',
      'Kimi Code discovers the copied Sealos skill folders from the project .agents/skills directory.',
      'Run /skill:sealos-deploy for deployment, or invoke another named Sealos skill such as /skill:sealos-database.',
      'Pull the latest .sealos-skills repository and copy its skills directory into .agents/skills again.',
    ),
    related: ['amp', 'qwen', 'openclaw'],
  },
  amp: {
    productDescription:
      'Amp is an agentic coding tool for repository work in the terminal and editor. Its native skill command can register a GitHub-backed skill source.',
    integrationDescription:
      'Add the Sealos repository through amp skill add, open the target project, and ask Amp to use the installed Sealos skill.',
    officialDocsUrl: 'https://ampcode.com/manual',
    manifestUrl: `${REPO_URL}/tree/main/skills`,
    iconSourceUrl: 'https://ampcode.com/app-icon.png?v=3',
    quickStart: createQuickStart(
      'Add the skill source',
      "Register the public repository through Amp's native skill command.",
      'amp skill add https://github.com/labring/sealos-skills.git',
      'Ask Amp for a Sealos outcome',
      'Open the project and name the installed Sealos skill in your request.',
      'Use the installed Sealos skill to deploy this repo to Sealos Cloud and verify the result.',
    ),
    prompts: createPrompts(
      'Use the installed Sealos skill to deploy this repo to Sealos Cloud and verify the result.',
      'Use the installed Sealos skill to create Postgres and connect this application.',
      'Use the installed Sealos skill to assess this repo for cloud readiness and fix the first blocker.',
      'Use the installed Sealos skill to summarize the last rollout, logs, and resources.',
    ),
    faq: createAgentFaq(
      'Amp',
      'Amp registers the GitHub-backed source through its native skill system and makes the Sealos guidance available to the agent.',
      'Ask Amp to use the installed Sealos skill and describe the deployment or cloud-service outcome.',
      'Run the Amp skill add flow again for the Sealos repository when you need the current source.',
    ),
    related: ['kimi', 'codex', 'gemini'],
  },
  qoder: {
    productDescription:
      'Qoder is an agentic coding environment with packaged plugin support. Sealos Skills includes a dedicated Qoder manifest and build script.',
    integrationDescription:
      'Build the official ZIP from the repository, import dist/sealos-1.2.5.zip into Qoder, and start a workflow with /sealos.',
    officialDocsUrl: 'https://docs.qoder.com/',
    manifestUrl: `${REPO_URL}/blob/main/.qoder-plugin/plugin.json`,
    iconSourceUrl: 'https://qoder.com/',
    quickStart: createQuickStart(
      'Build the Qoder package',
      'Clone the repository and run its official packaging script.',
      'git clone https://github.com/labring/sealos-skills.git\ncd sealos-skills\npython3 scripts/package-qoder-plugin.py',
      'Import and run /sealos',
      'Import dist/sealos-1.2.5.zip in Qoder, open the project, and run the plugin command.',
      '/sealos deploy this repo to Sealos Cloud',
    ),
    prompts: createPrompts(
      '/sealos deploy this repo to Sealos Cloud',
      '/sealos create a cloud Postgres database for this repo and wire DATABASE_URL',
      '/sealos package this repo for deployment and report every generated artifact',
      '/sealos show the resources created by the last deployment',
    ),
    faq: createAgentFaq(
      'Qoder',
      'Qoder imports Sealos Skills from the generated dist/sealos-1.2.5.zip package. The package exposes the same eight root skills.',
      'Run /sealos in the target project, followed by the deployment or cloud-service request.',
      'Pull the current repository, rebuild the ZIP, and import the newly generated package into Qoder.',
    ),
    related: ['codebuddy', 'claude', 'codex'],
  },
  codebuddy: {
    productDescription:
      'CodeBuddy is an AI coding assistant with a plugin marketplace workflow. The Sealos repository includes a CodeBuddy marketplace entry for the shared plugin source.',
    integrationDescription:
      "Register the Labring marketplace, choose Sealos through CodeBuddy's plugin flow, and ask for a deployment or cloud-service workflow.",
    officialDocsUrl: 'https://www.codebuddy.ai/docs/cli/plugin-marketplaces',
    manifestUrl: `${REPO_URL}/blob/main/.codebuddy-plugin/marketplace.json`,
    iconSourceUrl: 'https://www.codebuddy.ai/',
    quickStart: createQuickStart(
      'Register the marketplace',
      "Add the public repository to CodeBuddy's plugin marketplaces.",
      '/plugin marketplace add labring/sealos-skills',
      'Open the Sealos plugin',
      'Choose Sealos from the registered marketplace and describe the cloud result you need.',
      'Use Sealos Skills to deploy this repo to Sealos Cloud and verify the result.',
    ),
    prompts: createPrompts(
      'Use Sealos Skills to deploy this repo to Sealos Cloud and verify the result.',
      'Use Sealos Skills to create Postgres and wire DATABASE_URL for this project.',
      'Use Sealos Skills to prepare this CodeBuddy project and explain each generated artifact.',
      'Use Sealos Skills to report the last deployment URL, rollout, and logs.',
    ),
    faq: createAgentFaq(
      'CodeBuddy',
      "CodeBuddy registers the Labring repository as a plugin marketplace. The repository's CodeBuddy marketplace file exposes the Sealos plugin entry.",
      "Choose Sealos through CodeBuddy's plugin flow and describe the deployment or cloud-service task.",
      'Refresh the Labring marketplace in CodeBuddy, then update or reinstall the Sealos plugin entry.',
    ),
    related: ['qoder', 'claude', 'codex'],
  },
} as const satisfies Record<AgentId, AgentGuideDetails>;

export function getAgentPath(id: AgentId): `/sealos-skills/${AgentId}` {
  return `/sealos-skills/${id}`;
}

export const AGENT_GUIDES: readonly AgentGuide[] = AGENT_IDS.map((id) => {
  const target = AGENT_TARGETS.find((candidate) => candidate.id === id);

  if (!target) {
    throw new Error(`Missing Sealos Skills target for ${id}`);
  }

  return {
    ...target,
    id,
    path: getAgentPath(id),
    ...AGENT_GUIDE_DETAILS[id],
  };
});

export function getAgentGuide(id: string): AgentGuide | undefined {
  return AGENT_GUIDES.find((agent) => agent.id === id);
}

export const SKILLS_SH_TARGET = AGENT_TARGETS[9];

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
  { value: String(AGENT_GUIDES.length), label: 'Agent-specific guides' },
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

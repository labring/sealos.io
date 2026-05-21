export const INSTALL_COMMAND =
  'npx plugins add https://github.com/labring/sealos-skills --target codex';
export const FALLBACK_INSTALL_COMMAND = 'npx skills add labring/sealos-skills';
export const DEPLOY_COMMAND = '$sealos deploy ~/project';
export const DIRECT_DEPLOY_COMMAND = '/sealos-deploy ~/project';
export const REPO_URL = 'https://github.com/labring/sealos-skills';

export const COMPATIBILITY = [
  {
    name: 'Codex CLI / App',
    note: '$sealos in CLI, or choose Sealos from Plugins in the app.',
    vendor: 'OpenAI agent host',
    icon: 'github',
    logos: ['openai'],
  },
  {
    name: 'Claude Code',
    note: 'Use /sealos after installing the Claude-compatible plugin.',
    vendor: 'Anthropic agent host',
    icon: 'agent',
    logos: ['claudeCode'],
  },
  {
    name: 'skills.sh hosts',
    note: 'Run /sealos-deploy directly from the installed skill pack.',
    vendor: 'Direct skill',
    icon: 'terminal',
    logos: [],
  },
  {
    name: 'Gemini / Qwen',
    note: 'Context extension mode: ask the agent to use Sealos Skills.',
    vendor: 'Context extension',
    icon: 'reader',
    logos: ['gemini', 'qwen'],
  },
] as const;

export const DEPLOY_PATH = [
  'Preflight',
  'Assess',
  'Detect Image',
  'Dockerfile',
  'Template',
  'Deploy + Verify',
] as const;

export const UPDATE_PATH = [
  'Find State',
  'Confirm Target',
  'Build Image',
  'Patch Rollout',
  'Readiness Check',
] as const;

export const PIPELINE_NOTES = [
  {
    title: 'Capability scan first',
    detail:
      'Checks Sealos auth, workspace, git, Docker, gh, kubectl, curl, and jq before touching the project.',
  },
  {
    title: 'Scored assessment',
    detail:
      'Scores deploy readiness from 0–12, detects framework, package manager, ports, databases, and environment variables.',
  },
  {
    title: 'Artifacts stay inspectable',
    detail:
      'Writes .sealos/analysis.json, build-result.json, template/index.yaml, and state.json so a run can be resumed or updated.',
  },
] as const;

export const RUN_STATES = [
  {
    kind: 'loading',
    title: 'Scanning project',
    detail:
      'The agent is checking runtime, entry points, Docker readiness, and Sealos auth.',
    status: 'Loading',
  },
  {
    kind: 'empty',
    title: 'No project selected',
    detail: 'Pass a local folder or GitHub URL to start the deploy analysis.',
    status: 'Empty',
  },
  {
    kind: 'error',
    title: 'Docker daemon offline',
    detail:
      'The run can still detect reusable images, but local builds wait until Docker is running.',
    status: 'Error',
  },
] as const;

export const SETUP_ITEMS = [
  {
    title: 'Sealos Cloud',
    detail:
      'Required account, auth token, workspace, and kubeconfig for every deploy.',
    command: 'node sealos-auth.mjs login',
    status: 'Required',
    icon: 'cloud',
    logo: 'sealos',
  },
  {
    title: 'Docker',
    detail:
      'Needed only when no reusable amd64 image exists and the agent must build locally.',
    command: 'docker info',
    status: 'Build path',
    icon: 'container',
    logo: 'docker',
  },
  {
    title: 'GitHub CLI',
    detail: 'Preferred for GHCR pushes and private image pull secrets.',
    command: 'gh auth status',
    status: 'Preferred',
    icon: 'github',
    logo: 'github',
  },
  {
    title: 'kubectl',
    detail:
      'Required for in-place updates, rollout checks, and cluster discovery.',
    command: 'kubectl version --client',
    status: 'Update path',
    icon: 'terminal',
    logo: 'kubernetes',
  },
] as const;

export const REPOSITORY_ROWS = [
  { name: 'README.md', icon: 'file', active: false },
  { name: '.codex-plugin / plugin.json', icon: 'file', active: false },
  { name: 'commands / sealos.md', icon: 'file', active: false },
  { name: 'skills / sealos-deploy / SKILL.md', icon: 'folder', active: true },
  { name: 'modules / preflight.md', icon: 'folder', active: false },
  { name: 'modules / pipeline.md', icon: 'folder', active: false },
  { name: 'scripts / deploy-template.mjs', icon: 'file', active: false },
  {
    name: 'dockerfile-skill + docker-to-sealos',
    icon: 'folder',
    active: false,
  },
] as const;

export const USE_CASES = [
  {
    title: 'Deploy a local repo',
    environment: 'Current workspace',
    result: 'Assess, build or reuse image, generate template, then deploy.',
    time: 'first run',
    icon: 'box',
  },
  {
    title: 'Deploy a GitHub URL',
    environment: 'Remote source',
    result: 'Clone with git, inspect the project, and create Sealos artifacts.',
    time: 'remote',
    icon: 'globe',
  },
  {
    title: 'Update an existing app',
    environment: 'Previous .sealos/state.json or cluster match',
    result:
      'Rebuild image, patch rollout, then verify pods, endpoints, and URL.',
    time: 'repeat run',
    icon: 'loop',
  },
] as const;

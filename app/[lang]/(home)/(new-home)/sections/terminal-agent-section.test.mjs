import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sectionDir = dirname(fileURLToPath(import.meta.url));
const sectionSource = readFileSync(
  join(sectionDir, 'terminal-agent-section.tsx'),
  'utf8',
);
const stackSource = readFileSync(
  join(sectionDir, 'terminal-agent-card-stack.tsx'),
  'utf8',
);

test('Terminal automation renders two cards that swap on scroll', () => {
  assert.match(sectionSource, /TerminalCardStack/);
  assert.match(stackSource, /'use client'/);
  assert.match(stackSource, /addEventListener\('scroll'/);
  assert.match(stackSource, /Repository State: \.sealos\//);
  assert.match(stackSource, /terminal — sealos-skills/);
  assert.match(stackSource, /frontCard/);
  assert.match(stackSource, /frontCardRef = useRef<CardId>\('terminal'\)/);
  assert.match(stackSource, /runSwap/);
  assert.match(stackSource, /skewedBackPose/);
  assert.match(stackSource, /opacity: 0\.45/);
  assert.match(stackSource, /translate3d\(20px, -48px, 0\) rotate\(-7deg\)/);
  assert.match(stackSource, /transform: 'translate3d/);
  assert.match(stackSource, /transformOrigin: 'top right'/);
  assert.match(stackSource, /transition-\[transform,opacity\]/);
  assert.doesNotMatch(stackSource, /setTimeout/);
  assert.doesNotMatch(stackSource, /hiddenBackPose/);
  assert.doesNotMatch(stackSource, /straightBackPose/);
  assert.doesNotMatch(stackSource, /useTransform/);
  assert.doesNotMatch(stackSource, /@keyframes/);
});

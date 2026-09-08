'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './railway-alternative.module.css';

const GitHubImportDemo = dynamic(
  () =>
    import('../(new-home)/components/deploy-demos/github-import-demo').then(
      (module) => module.GitHubImportDemo,
    ),
  {
    loading: () => <RailwayHeroPoster />,
    ssr: false,
  },
);

export function RailwayHeroDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState(false);
  const [entered, setEntered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 48rem)');
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const syncPreferences = () => {
      setDesktop(desktopQuery.matches);
      setReducedMotion(reducedMotionQuery.matches);
    };

    syncPreferences();
    desktopQuery.addEventListener('change', syncPreferences);
    reducedMotionQuery.addEventListener('change', syncPreferences);

    return () => {
      desktopQuery.removeEventListener('change', syncPreferences);
      reducedMotionQuery.removeEventListener('change', syncPreferences);
    };
  }, []);

  useEffect(() => {
    if (!desktop || entered || reducedMotion) return;

    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) {
      setEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setEntered(true);
        observer.disconnect();
      },
      { rootMargin: '120px 0px', threshold: 0.15 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [desktop, entered, reducedMotion]);

  const handleComplete = useCallback(() => {
    setFinished(true);
    setPaused(true);
  }, []);

  const replay = () => {
    setFinished(false);
    setPaused(false);
    setRunId((current) => current + 1);
  };

  const showAnimation = desktop && entered && !reducedMotion;

  return (
    <div
      ref={rootRef}
      className={styles.heroDemo}
      data-railway-hero-demo
      data-railway-hero-demo-mode={showAnimation ? 'animated' : 'static'}
    >
      <p className="sr-only">
        GitHub repository deployment progresses from import to a live public
        address.
      </p>

      {showAnimation ? (
        <GitHubImportDemo
          key={runId}
          active
          loop={false}
          onComplete={handleComplete}
          paused={paused}
          variant="compact"
        />
      ) : (
        <RailwayHeroPoster />
      )}

      {showAnimation ? (
        <div className={styles.demoControls}>
          <button
            type="button"
            className={styles.demoControl}
            disabled={finished}
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? 'Play' : 'Pause'}
          </button>
          <button type="button" className={styles.demoControl} onClick={replay}>
            Replay
          </button>
        </div>
      ) : null}

      <ol
        className={styles.mobileDemoSteps}
        aria-label="GitHub deployment steps"
      >
        {['Import', 'Deploy', 'Live'].map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

function RailwayHeroPoster() {
  return (
    <div className={styles.demoPoster} data-railway-hero-poster aria-hidden>
      <div className={styles.demoPosterBar}>
        <span>GitHub deployment</span>
        <span className={styles.demoPosterStatus}>Live</span>
      </div>
      <div className={styles.demoPosterBody}>
        <span className={styles.demoPosterMark}>GH</span>
        <span>
          <strong>sealos/demo-api</strong>
          <small>Deployment ready</small>
        </span>
        <span className={styles.demoPosterUrl}>demo-api.sealos.run</span>
      </div>
    </div>
  );
}

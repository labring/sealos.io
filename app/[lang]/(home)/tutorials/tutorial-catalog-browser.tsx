'use client';

import { useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { TutorialRequestGuideLink } from './TutorialRequestGuideLink';
import {
  filterTutorials,
  getTutorialGroups,
  hasMultipleTutorialRuntimes,
  getTutorialTask,
  TUTORIAL_TASKS,
  type CatalogTutorial,
  type TutorialTask,
} from './tutorial-catalog';

export function TutorialCatalogBrowser({
  tutorials,
}: {
  tutorials: CatalogTutorial[];
}) {
  const [task, setTask] = useState<TutorialTask | 'all'>('all');
  const [runtime, setRuntime] = useState('all');
  const showRuntimeFilter = hasMultipleTutorialRuntimes(tutorials);
  const runtimes = getTutorialGroups(tutorials, 'all');
  const groups = getTutorialGroups(tutorials, task, runtime);
  const plannedCount = groups.reduce(
    (count, group) =>
      count +
      group.frameworks.filter((framework) => framework.guides.length === 0)
        .length,
    0,
  );
  const visibleCount = groups.reduce(
    (total, group) =>
      total +
      group.frameworks.reduce(
        (sum, framework) => sum + framework.guides.length,
        0,
      ),
    0,
  );
  const tasks = [
    { id: 'all' as const, label: 'All tasks' },
    ...TUTORIAL_TASKS,
  ].map((item) => ({
    ...item,
    count: filterTutorials(tutorials, item.id, runtime).length,
  }));

  return (
    <div id="published-tutorials" className="scroll-mt-28">
      <header className="py-3 lg:py-6">
        <h1 className="text-5xl leading-[1.05] font-medium tracking-[-0.035em]">
          Tutorials
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-[22px] text-balance text-zinc-400">
          Deploy apps, connect services, run in production, troubleshoot, and
          migrate apps and data.
        </p>
      </header>

      {showRuntimeFilter && (
        <section
          className="border-t border-white/15 py-3 lg:py-4"
          aria-label="Tutorial filters"
        >
          <label className="grid max-w-sm min-w-0 gap-2 text-xs text-zinc-300">
            Runtime
            <select
              value={runtime}
              onChange={(event) => {
                setRuntime(event.target.value);
                setTask('all');
              }}
              className="min-h-11 min-w-0 rounded-sm border border-white/20 bg-[#141414] px-3 text-xs text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#83adff]"
            >
              <option value="all">All runtimes</option>
              {runtimes.map((group) => (
                <option key={group.name} value={group.name}>
                  {group.name} (
                  {group.frameworks.reduce(
                    (count, framework) => count + framework.guides.length,
                    0,
                  )}
                  ) ·{' '}
                  {group.frameworks
                    .map((framework) => framework.name)
                    .join(', ')}
                </option>
              ))}
            </select>
          </label>
        </section>
      )}

      <section
        id="catalog-results"
        className="relative scroll-mt-28 border-t border-white/15 pt-4"
        aria-label="Tutorials by runtime"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h2 className="text-sm font-medium text-zinc-300">
            Tutorial catalog
          </h2>
          <p className="text-xs text-zinc-400">
            {visibleCount} {visibleCount === 1 ? 'guide' : 'guides'}
            {plannedCount > 0 && (
              <>
                {' '}
                · {plannedCount}{' '}
                {plannedCount === 1 ? 'framework' : 'frameworks'} planned
              </>
            )}
          </p>
        </div>
        <label className="mt-3 mb-5 flex max-w-sm items-center gap-4 text-xs text-zinc-300 xl:hidden">
          Task
          <select
            value={task}
            onChange={(event) =>
              setTask(event.target.value as TutorialTask | 'all')
            }
            className="min-h-11 min-w-0 flex-1 rounded-sm border border-white/20 bg-[#141414] px-3 text-sm text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#83adff]"
          >
            {tasks.map((item) => (
              <option
                key={item.id}
                value={item.id}
                disabled={item.id !== 'all' && item.count === 0}
              >
                {item.label} · {item.count}{' '}
                {item.count === 1 ? 'guide' : 'guides'}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="mt-3 mb-5 hidden xl:block">
          <legend className="mb-2 text-xs text-zinc-300">Task</legend>
          <div className="flex items-center justify-between gap-2">
            {tasks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTask(item.id)}
                disabled={item.id !== 'all' && item.count === 0}
                aria-pressed={task === item.id}
                aria-controls="catalog-runtime-results"
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm px-2 text-left text-[13px] leading-[18px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#83adff] ${task === item.id ? 'bg-[#24333f] font-medium text-zinc-100' : item.count > 0 ? 'text-zinc-200 hover:bg-white/5' : 'text-zinc-400'}`}
              >
                <span>{item.label}</span>
                <span className="text-zinc-400 tabular-nums">{item.count}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div
          id="catalog-runtime-results"
          className="divide-y divide-white/10 border-t border-white/15"
          aria-live="polite"
        >
          {visibleCount === 0 && (
            <p className="col-span-full py-4 text-sm text-zinc-400">
              No published tutorials for this selection.
            </p>
          )}
          {groups.map((group) => {
            const guideCount = group.frameworks.reduce(
              (count, framework) => count + framework.guides.length,
              0,
            );
            const RuntimeGroup = guideCount > 0 ? 'details' : 'section';
            const RuntimeHeading = guideCount > 0 ? 'summary' : 'div';
            return (
              <RuntimeGroup
                key={group.name}
                open={guideCount > 0 ? true : undefined}
                className="group/runtime relative"
              >
                <RuntimeHeading
                  className={`grid list-none grid-cols-[72px_minmax(0,1fr)_auto_14px] items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#83adff] lg:grid-cols-[120px_minmax(0,1fr)_auto_16px] lg:gap-6 [&::-webkit-details-marker]:hidden ${guideCount > 0 ? 'min-h-11 cursor-pointer' : 'min-h-8'}`}
                >
                  <h3
                    className={
                      guideCount > 0
                        ? 'text-base font-medium text-zinc-100'
                        : 'text-sm font-medium text-zinc-300'
                    }
                  >
                    {group.name}
                  </h3>
                  <span className="text-sm text-zinc-400">
                    {group.frameworks
                      .map((framework) => framework.name)
                      .join(' · ')}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {guideCount > 0
                      ? `${guideCount} ${guideCount === 1 ? 'guide' : 'guides'}`
                      : 'Planned'}
                  </span>
                  {guideCount > 0 && (
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className="text-zinc-400 group-open/runtime:rotate-180"
                      aria-hidden="true"
                    />
                  )}
                </RuntimeHeading>
                {guideCount > 0 && (
                  <div className="mt-3 space-y-3 pb-3 lg:pl-36">
                    {group.frameworks.map((framework) =>
                      framework.guides.length === 0 ? (
                        <div
                          key={framework.name}
                          className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                        >
                          <h4 className="text-sm font-medium text-zinc-200">
                            {framework.name}
                          </h4>
                          <p className="text-xs text-zinc-400">Planned</p>
                        </div>
                      ) : (
                        <section key={framework.name} className="relative">
                          <div className="flex items-baseline gap-2">
                            <h4 className="text-sm font-medium text-zinc-200">
                              {framework.name}
                            </h4>
                          </div>
                          <div className="mt-2 max-w-3xl divide-y divide-black/15 rounded-sm bg-[#e8edeb] px-5 py-4 text-[#18272c]">
                            {framework.guides.map((tutorial) => (
                              <article
                                key={tutorial.url}
                                className="py-4 first:pt-0 last:pb-0"
                              >
                                <Link
                                  href={tutorial.url}
                                  className="group grid gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#83adff] md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-6"
                                >
                                  <div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                      <p className="text-xs font-medium text-[#42616a]">
                                        {
                                          TUTORIAL_TASKS.find(
                                            (item) =>
                                              item.id ===
                                              getTutorialTask(tutorial.url),
                                          )?.label
                                        }
                                      </p>
                                      <dl className="flex gap-4 text-xs leading-4 text-[#46575d]">
                                        <div>
                                          <dt className="sr-only">Level</dt>
                                          <dd>{tutorial.stageLabel}</dd>
                                        </div>
                                        {tutorial.estimatedReadingTime && (
                                          <div>
                                            <dt className="sr-only">
                                              Reading time
                                            </dt>
                                            <dd>
                                              {tutorial.estimatedReadingTime}
                                            </dd>
                                          </div>
                                        )}
                                      </dl>
                                    </div>
                                    <h5 className="mt-2 text-2xl leading-tight font-medium tracking-[-0.02em] group-hover:text-[#285974]">
                                      {tutorial.displayTitle ?? tutorial.title}
                                    </h5>
                                    <p className="mt-2 max-w-[76ch] text-sm leading-[22px] text-balance text-[#46575d]">
                                      {tutorial.description}
                                    </p>
                                  </div>
                                  <span className="inline-flex min-h-11 items-center justify-center gap-3 justify-self-start rounded-sm bg-[#1b303d] px-3 text-sm font-medium text-white group-hover:bg-[#285974] md:mt-6">
                                    Read tutorial{' '}
                                    <ArrowRight
                                      size={16}
                                      strokeWidth={1.5}
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Link>
                              </article>
                            ))}
                          </div>
                        </section>
                      ),
                    )}
                  </div>
                )}
              </RuntimeGroup>
            );
          })}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5 pb-12">
        <p className="text-sm text-zinc-400">Help shape the next tutorial.</p>
        <TutorialRequestGuideLink className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-zinc-200 hover:text-[#a9c9ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#83adff]">
          Request a tutorial{' '}
          <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </TutorialRequestGuideLink>
      </div>
    </div>
  );
}

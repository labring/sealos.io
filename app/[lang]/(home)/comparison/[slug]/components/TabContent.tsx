'use client';

import React from 'react';
import { ComparisonConfig, DIMENSIONS } from '../../config/platforms';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CircleX, TriangleAlert } from './ComparisonIcons';
import { TabId } from './TabNavigation';
import { CostComparisonSection } from '../sections/CostComparisonSection';
import { PlatformOverviewSection } from '../sections/PlatformOverviewSection';
import { KeyDifferencesSection } from '../sections/KeyDifferencesSection';
import { StrengthsSection } from '../sections/StrengthsSection';
import { GradientCircleCheck } from '@/components/ui/icons';

interface TabContentProps {
  activeTab: TabId;
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function TabContent({
  activeTab,
  firstPlatform,
  secondPlatform,
}: TabContentProps) {
  const dimensionId = activeTab;
  const dimension = DIMENSIONS[dimensionId];
  const firstData = firstPlatform.content.dimensions[dimensionId];
  const secondData = secondPlatform.content.dimensions[dimensionId];

  const renderCell = (value: (typeof firstData.features)[0]) => {
    if (value.type === 'check') {
      return value.value ? (
        <GradientCircleCheck className="h-5 w-5" />
      ) : (
        <CircleX className="h-5 w-5" />
      );
    }
    if (value.type === 'text') {
      return <span className="text-sm">{value.value}</span>;
    }
    if (value.type === 'text-with-check') {
      return (
        <div className="flex items-center gap-2">
          <GradientCircleCheck className="h-5 w-5 shrink-0" />
          <span className="text-sm">{value.value}</span>
        </div>
      );
    }
    if (value.type === 'text-multi-check') {
      return (
        <div className="flex flex-col gap-1">
          {value.value.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <GradientCircleCheck className="h-5 w-5 shrink-0" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      );
    }
    if (value.type === 'warning') {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 leading-none">
              <TriangleAlert className="h-5 w-5 shrink-0" />
              <span className="text-sm leading-normal">{value.value}</span>
            </div>
          </TooltipTrigger>
          {value.note && (
            <TooltipContent>
              <p>{value.note}</p>
            </TooltipContent>
          )}
        </Tooltip>
      );
    }
    return <span className="text-sm">{value.value}</span>;
  };

  // Special handling for overview dimension header
  const renderHeader = () => {
    if (dimensionId === 'overview') {
      return (
        <div className="mb-12">
          <h2 className="text-center text-2xl font-medium">
            {firstPlatform.name} vs. {secondPlatform.name} at a Glance
          </h2>
        </div>
      );
    }

    return (
      <div className="mb-12">
        <h2 className="mb-6 text-center text-2xl font-medium">
          {dimension.subtitle}
        </h2>
        <p className="text-muted-foreground">{dimension.description}</p>
      </div>
    );
  };

  const featureGroups = dimension.features; // Now Array<FeatureGroup>
  // Check if we have groups with names/icons (not overview)
  const hasGroups = featureGroups.length > 0 && featureGroups[0].name !== '';

  // Calculate total feature count for index tracking
  let globalFeatureIndex = 0;

  // Collect all warning notes from both platforms
  const warningNotes = new Set<string>();
  firstData.features.forEach((value) => {
    if (value.type === 'warning' && value.note) {
      warningNotes.add(value.note);
    }
  });
  secondData.features.forEach((value) => {
    if (value.type === 'warning' && value.note) {
      warningNotes.add(value.note);
    }
  });

  return (
    <>
      <section className="container mx-auto px-4 pb-24">
        {/* Dimension Header */}
        {renderHeader()}

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[35%]" />
              <col className="w-[35%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-4 text-left text-sm font-semibold text-zinc-400">
                  Feature
                </th>
                <th className="px-4 py-4 text-center text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="size-6">{firstPlatform.icon}</div>
                    <span>{firstPlatform.name}</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="size-6">{secondPlatform.icon}</div>
                    <span>{secondPlatform.name}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {hasGroups
                ? // Render with groups
                  featureGroups.map((group, groupIndex) => {
                    return (
                      <React.Fragment key={`group-${groupIndex}`}>
                        {/* Group header row */}
                        {group.name && (
                          <tr>
                            <td className="border-b border-zinc-800 px-4 py-3 text-sm font-medium text-zinc-200">
                              <div className="flex items-center gap-2">
                                {group.icon}
                                {group.name}
                              </div>
                            </td>
                            <td
                              className={cn(
                                'relative border-b border-zinc-800 px-4 py-3',
                                'bg-white/5 before:pointer-events-none before:absolute before:inset-0 before:border-x before:border-zinc-800',
                              )}
                            />
                            <td className="border-b border-zinc-800 px-4 py-3" />
                          </tr>
                        )}
                        {/* Group features */}
                        {group.items.map((feature, featureIndexInGroup) => {
                          const currentFeatureIndex = globalFeatureIndex++;
                          return (
                            <tr
                              key={`feature-${currentFeatureIndex}`}
                              className={cn(
                                'border-b border-zinc-800',
                                currentFeatureIndex % 2 === 0 &&
                                  'bg-zinc-900/30',
                              )}
                            >
                              <td className="px-4 py-4 text-sm font-medium text-zinc-300">
                                {feature}
                              </td>
                              <td
                                className={cn(
                                  'relative px-4 py-4',
                                  'bg-white/5 before:pointer-events-none before:absolute before:inset-0 before:border-x before:border-zinc-800',
                                )}
                              >
                                {renderCell(
                                  firstData.features[currentFeatureIndex],
                                )}
                              </td>
                              <td className="px-4 py-4">
                                {renderCell(
                                  secondData.features[currentFeatureIndex],
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })
                : // Render without groups (fallback for overview - flatten the array)
                  featureGroups
                    .flatMap((group) => group.items)
                    .map((feature, index) => (
                      <tr
                        key={feature}
                        className={cn(
                          'border-b border-zinc-800',
                          index % 2 === 0 && 'bg-zinc-900/30',
                        )}
                      >
                        <td className="px-4 py-4 text-sm font-medium text-zinc-300">
                          {feature}
                        </td>
                        <td
                          className={cn(
                            'relative px-4 py-4',
                            'bg-white/5 before:pointer-events-none before:absolute before:inset-0 before:border-x before:border-zinc-800',
                          )}
                        >
                          {renderCell(firstData.features[index])}
                        </td>
                        <td className="px-4 py-4">
                          {renderCell(secondData.features[index])}
                        </td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </div>

        {/* Warning Notes Section */}
        {warningNotes.size > 0 && (
          <div className="text-muted-foreground space-y-1 text-xs">
            {Array.from(warningNotes).map((note, index) => (
              <div key={index} className="flex items-center gap-2">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  <span className="font-medium">{index + 1}.</span> {note}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Overview-specific sections */}
      {dimensionId === 'overview' && (
        <>
          <CostComparisonSection
            firstPlatform={firstPlatform}
            secondPlatform={secondPlatform}
          />
          <PlatformOverviewSection
            firstPlatform={firstPlatform}
            secondPlatform={secondPlatform}
          />
        </>
      )}

      {/* Strengths Section */}
      <StrengthsSection
        dimensionId={dimensionId}
        firstPlatform={firstPlatform}
        secondPlatform={secondPlatform}
      />

      {/* Key Differences Section */}
      <KeyDifferencesSection
        dimensionId={dimensionId}
        firstPlatform={firstPlatform}
        secondPlatform={secondPlatform}
      />
    </>
  );
}

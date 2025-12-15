'use client';

import { useState } from 'react';
import { TabNavigation, TabId } from '../components/TabNavigation';
import { TabContent } from '../components/TabContent';
import { ComparisonConfig } from '../../config/platforms';

interface TableSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function TableSection({
  firstPlatform,
  secondPlatform,
}: TableSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="container mx-auto mt-16 px-4">
        <TabContent
          activeTab={activeTab}
          firstPlatform={firstPlatform}
          secondPlatform={secondPlatform}
        />
      </div>
    </>
  );
}

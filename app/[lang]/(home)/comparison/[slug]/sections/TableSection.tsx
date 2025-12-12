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
    <section className="container mx-auto px-4 pb-24">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="pt-24">
        <TabContent
          activeTab={activeTab}
          firstPlatform={firstPlatform}
          secondPlatform={secondPlatform}
        />
      </div>
    </section>
  );
}

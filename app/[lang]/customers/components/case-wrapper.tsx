import React, { ReactNode } from 'react';
import { languagesType } from '@/lib/i18n';

// This is a wrapper component to handle translation errors
export default function CaseWrapper({ 
  children,
  lang 
}: { 
  children: ReactNode;
  lang: languagesType;
}) {
  return (
    <div className="case-wrapper">
      {children}
    </div>
  );
}

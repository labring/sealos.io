import React, { ReactNode, memo } from 'react';
import { languagesType } from '@/lib/i18n';

interface CaseWrapperProps {
  children: ReactNode;
  lang: languagesType;
}

// This is a wrapper component to handle translation errors
const CaseWrapper = memo<CaseWrapperProps>(({
  children,
  lang
}) => {
  return (
    <div className="case-wrapper">
      {children}
    </div>
  );
});

CaseWrapper.displayName = 'CaseWrapper';

export default CaseWrapper;

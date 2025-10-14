import React from 'react';

export function GradientText({ children }: { children?: React.ReactNode }) {
  return (
    <span className="bg-linear-to-r from-white to-blue-600 bg-clip-text text-transparent">
      {children}
    </span>
  );
}

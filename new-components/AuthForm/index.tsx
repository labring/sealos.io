'use client';

import dynamic from 'next/dynamic';
import { useAuthForm } from './AuthFormContext';

const LazyAuthFormInner = dynamic(
  () => import('./AuthFormInner').then((mod) => mod.AuthFormInner),
  {
    ssr: false,
    loading: () => null,
  },
);

export function AuthForm() {
  const { open } = useAuthForm();

  if (!open) {
    return null;
  }

  return <LazyAuthFormInner />;
}

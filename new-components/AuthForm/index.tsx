'use client';

import { useRouter } from 'next/navigation';
import { AuthFormProvider } from './AuthFormContext';
import { AuthFormInner } from './AuthFormInner';
import { EmailVerifyResponse } from './types';

export interface AuthFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthForm({ open, onOpenChange }: AuthFormProps) {
  const router = useRouter();

  const handleVerifySuccess = (data: EmailVerifyResponse['data']) => {
    onOpenChange(false);

    if (data.needInit) {
      // router.push('/workspace');
    } else {
      // router.push('/');
    }
  };

  return (
    <AuthFormProvider onVerifySuccess={handleVerifySuccess}>
      <AuthFormInner open={open} onOpenChange={onOpenChange} />
    </AuthFormProvider>
  );
}

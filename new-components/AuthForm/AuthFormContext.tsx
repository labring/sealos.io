'use client';

import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { TurnstileInstance } from '@marsidev/react-turnstile';
import { siteConfig } from '@/config/site';
import { z } from 'zod';
import {
  EmailSmsRequest,
  EmailSmsResponse,
  EmailVerifyRequest,
  EmailVerifyResponse,
} from './types';

type AuthStep = 'select-method' | 'verify-code';

interface AuthFormData {
  email: string;
  captchaToken: string | null;
  startTime: number;
}

interface AuthFormContextType {
  formData: AuthFormData;
  step: AuthStep;
  error: string | null;
  isSendingCode: boolean;
  turnstileRef: React.RefObject<TurnstileInstance>;

  setEmail: (email: string) => void;
  setCaptchaToken: (token: string | null) => void;
  clearCaptchaToken: () => void;
  updateStartTime: () => void;
  clearStartTime: () => void;
  clearFormData: () => void;

  setStep: (step: AuthStep) => void;
  setError: (error: string | null) => void;

  sendCode: () => Promise<boolean>;
  onVerifySuccess?: (data: EmailVerifyResponse['data']) => void;
}

const AuthFormContext = createContext<AuthFormContextType | undefined>(
  undefined,
);

export function AuthFormProvider({
  children,
  onVerifySuccess,
}: {
  children: ReactNode;
  onVerifySuccess?: (data: EmailVerifyResponse['data']) => void;
}) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    captchaToken: null,
    startTime: 0,
  });
  const [step, setStep] = useState<AuthStep>('select-method');
  const [error, setError] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const setEmail = (email: string) => {
    setFormData((prev) => ({ ...prev, email }));
  };

  const setCaptchaToken = (token: string | null) => {
    setFormData((prev) => ({ ...prev, captchaToken: token }));
  };

  const clearCaptchaToken = () => {
    setFormData((prev) => ({ ...prev, captchaToken: null }));
  };

  const updateStartTime = () => {
    setFormData((prev) => ({ ...prev, startTime: new Date().getTime() }));
  };

  const clearStartTime = () => {
    setFormData((prev) => ({ ...prev, startTime: 0 }));
  };

  const clearFormData = () => {
    setFormData({
      email: '',
      captchaToken: null,
      startTime: 0,
    });
  };


  const sendCode = async () => {
    const schema = z.string().email();
    if (!schema.safeParse(formData.email).success) {
      setError('Please enter a valid email address');
      return false;
    }

    setIsSendingCode(true);
    setError(null);

    try {
      const requestBody: EmailSmsRequest = {
        id: formData.email,
        ...(siteConfig.turnstileEnabled && formData.captchaToken
          ? { cfToken: formData.captchaToken }
          : {}),
      };

      const response = await fetch(siteConfig.emailRequestEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result: EmailSmsResponse = await response.json();

      if (result.code !== 200) {
        throw new Error(result.message || 'Failed to send verification code');
      }

      updateStartTime();
      return true;
    } catch (error) {
      console.error('Failed to send verification code:', error);
      setError((error as Error)?.message || 'Failed to send verification code, please try again');
      return false;
    } finally {
      setIsSendingCode(false);
    }
  };

  return (
    <AuthFormContext.Provider
      value={{
        formData,
        step,
        error,
        isSendingCode,
        turnstileRef,
        setEmail,
        setCaptchaToken,
        clearCaptchaToken,
        updateStartTime,
        clearStartTime,
        clearFormData,
        setStep,
        setError,
        sendCode,
        onVerifySuccess,
      }}
    >
      {children}
    </AuthFormContext.Provider>
  );
}

export function useAuthForm() {
  const context = useContext(AuthFormContext);
  if (context === undefined) {
    throw new Error('useAuthForm must be used within an AuthFormProvider');
  }
  return context;
}


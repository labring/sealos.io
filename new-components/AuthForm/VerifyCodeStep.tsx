'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { ArrowLeft, MailCheckIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthForm } from './AuthFormContext';
import { useCountdown } from './hooks';
import { siteConfig } from '@/config/site';
import {
  EmailVerifyRequest,
  EmailVerifyResponse,
} from './types';

export function VerifyCodeStep() {
  const {
    formData,
    error,
    isSendingCode,
    turnstileRef,
    setStep,
    setError,
    sendCode,
    clearStartTime,
    onVerifySuccess,
  } = useAuthForm();

  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const remainingTime = useCountdown(formData.startTime);

  const verifyCode = async (verificationCode: string) => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const requestBody: EmailVerifyRequest = {
        code: verificationCode,
        id: formData.email,
      };

      const response = await fetch(siteConfig.emailVerifyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result: EmailVerifyResponse = await response.json();

      if (result.code !== 200) {
        throw new Error(result.message || 'Invalid verification code');
      }

      if (onVerifySuccess && result.data) {
        onVerifySuccess(result.data);
      }
    } catch (error) {
      console.error('Failed to verify code:', error);
      setError((error as Error)?.message || 'Invalid verification code, please try again');
      setCode('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (remainingTime > 0) return;
    const success = await sendCode();
    if (!success) {
      setStep('select-method');
    }
  };

  const handleBack = () => {
    setStep('select-method');
    setCode('');
    setError(null);
    clearStartTime();
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    setError(null);
    if (value.length === 6) {
      verifyCode(value);
    }
  };
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="mt-6 flex items-center justify-center">
        <div className="border-gradient flex size-14 items-center justify-center rounded-xl bg-gradient-to-b from-[#2e2e2e] to-[#1a1a1a] [--border-gradient-from:var(--color-neutral-500)] [--border-gradient-position:to_bottom_in_oklab] [--border-gradient-to:transparent]">
          <MailCheckIcon className="text-muted-foreground size-8" />
        </div>
      </div>

      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl leading-none font-semibold">
            Check your email
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            {remainingTime > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground font-normal text-nowrap">
                    A
                  </span>
                  <span className="text-muted-foreground font-semibold text-nowrap">
                    verification code
                  </span>
                  <span className="text-muted-foreground font-normal text-nowrap">
                    was sent to
                  </span>
                  <span className="text-foreground font-semibold text-nowrap">
                    {formData.email}
                  </span>
                  <span className="text-muted-foreground font-normal text-nowrap">
                    .
                  </span>
                </div>
                <p className="text-muted-foreground text-sm text-nowrap">
                  Enter it below to continue.
                </p>
              </div>
            )}

            <div className="flex flex-col items-center gap-2">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={handleCodeChange}
                containerClassName="justify-center"
                disabled={isVerifying}
              >
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={cn(
                        'bg-foreground/5 aspect-square h-11 w-11 rounded-xl border text-center text-lg font-medium first:rounded-l-xl last:rounded-r-xl',
                        code[index] ? 'border-foreground' : 'border-border',
                        error && 'border-red-500',
                      )}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <div className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="size-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {isVerifying ? (
                <p className="text-muted-foreground text-sm">Verifying...</p>
              ) : (
                <p className="text-sm">
                  {remainingTime > 0 ? (
                    <>
                      You can try again in{' '}
                      <span className="font-semibold">
                        {Math.floor(remainingTime / 1000)}s
                      </span>
                    </>
                  ) : (
                    <button
                      onClick={handleResendCode}
                      className="font-semibold text-blue-400 no-underline hover:underline"
                    >
                      Resend it
                    </button>
                  )}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isVerifying}
            className="text-foreground bg-foreground/5 h-10 w-full rounded-full hover:cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}


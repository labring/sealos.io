'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { siteConfig } from '@/config/site';
import { z } from 'zod';
import { useAuthForm } from './AuthFormContext';
import { useCountdown } from './hooks';
import { SealosLogo, GoogleIcon, GithubIcon } from './components';

export function SelectMethodStep() {
  const {
    formData,
    error,
    isSendingCode,
    turnstileRef,
    setEmail,
    setCaptchaToken,
    clearCaptchaToken,
    sendCode,
    setStep,
    setError,
    additionalParams,
    setOpen,
  } = useAuthForm();

  const [captchaSolved, setCaptchaSolved] = useState(false);

  const remainingTime = useCountdown(formData.startTime);

  const emailValid = useMemo(() => {
    const schema = z.string().email();
    return schema.safeParse(formData.email).success;
  }, [formData.email]);

  const handleCaptchaSuccess = (token: string) => {
    setCaptchaSolved(true);
    setCaptchaToken(token);
    setError(null);
  };

  const handleCaptchaError = () => {
    setCaptchaSolved(false);
    clearCaptchaToken();
  };

  const handleEmailContinue = async () => {
    if (!emailValid) {
      return;
    }

    const success = await sendCode();
    if (success) {
      setStep('verify-code');
    } else {
      handleCaptchaError();
    }
  };

  const handleOAuthClick = (url: string) => {
    const targetUrl = new URL(url);
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        targetUrl.searchParams.append(key, value);
      });
    }
    setOpen(false);
    window.open(targetUrl.toString(), '_blank')?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="mt-6 flex items-center justify-center">
        <SealosLogo />
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <h2 className="text-2xl leading-none font-semibold">
          Welcome to Sealos
        </h2>
      </div>

      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            placeholder="Work Email"
            value={formData.email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-foreground/5 h-10"
          />
          {error && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="size-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {siteConfig.turnstileEnabled && (
          <div className="w-full">
            <div className="w-full px-1">
              <Turnstile
                ref={turnstileRef}
                siteKey={siteConfig.turnstileSitekey}
                options={{
                  size: 'flexible',
                  refreshExpired: 'manual',
                  refreshTimeout: 'manual',
                }}
                onSuccess={handleCaptchaSuccess}
                onExpire={handleCaptchaError}
                onTimeout={handleCaptchaError}
                onError={handleCaptchaError}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <Button
            onClick={handleEmailContinue}
            disabled={
              !emailValid ||
              (siteConfig.turnstileEnabled && !captchaSolved) ||
              remainingTime > 0 ||
              isSendingCode
            }
            variant="landing-primary"
            className="h-10 w-full disabled:cursor-not-allowed"
          >
            {remainingTime > 0
              ? `Please wait ${Math.floor(remainingTime / 1000)}s`
              : isSendingCode
                ? 'Sending...'
                : 'Continue with Email'}
            {remainingTime <= 0 && !isSendingCode && (
              <ArrowRight className="ml-2 size-4" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              OR CONTINUE WITH
            </span>
            <div className="bg-border h-px flex-1" />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="text-foreground bg-foreground/5 h-10 w-full rounded-full hover:cursor-pointer"
              onClick={() => handleOAuthClick(siteConfig.oauth2GithubUrl)}
            >
              <div>
                <GithubIcon />
              </div>

              <span className="ml-2">Github</span>
            </Button>
            <Button
              variant="outline"
              className="text-foreground bg-foreground/5 h-10 w-full rounded-full hover:cursor-pointer"
              onClick={() => handleOAuthClick(siteConfig.oauth2GoogleUrl)}
            >
              <GoogleIcon />
              <span className="ml-2">Google</span>
            </Button>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground cursor-pointer text-center text-xs leading-4">
            By proceeding you acknowledge that you have read, understood and
            agree to our{' '}
            <a
              href="/docs/msa/terms-of-service"
              className="text-white underline"
            >
              Terms and Conditions
            </a>
            ,{' '}
            <a href="/docs/msa/privacy-policy" className="text-white underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

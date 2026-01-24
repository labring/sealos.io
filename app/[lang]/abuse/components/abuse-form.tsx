'use client';
// Abuse report form component.

import { useState, useCallback, useRef } from 'react';
import { siteConfig } from '@/config/site';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { cn } from '@/lib/utils';
import { abuseTypeKeys, AbuseTranslations, AbuseTypeKey } from '../content';
import { CheckIcon, InfoIcon, LoadingSpinner } from './icons';

type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

type FormState = {
  abuseType: AbuseTypeKey;
  email: string;
  url: string;
  description: string;
  evidence: string;
};

type AbuseFormProps = {
  content: AbuseTranslations;
};

export default function AbuseForm({ content }: AbuseFormProps) {
  const [formData, setFormData] = useState<FormState>({
    abuseType: 'phishing',
    email: '',
    url: '',
    description: '',
    evidence: '',
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const turnstileRef = useRef<TurnstileInstance>(null);
  const statusMessage =
    submissionState === 'loading'
      ? content.statusText.loading
      : submissionState === 'success'
      ? content.statusText.success
      : submissionState === 'error'
      ? content.statusText.error
      : '';

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const field = name as keyof FormState;
      setFormData((prev) => ({ ...prev, [field]: value as FormState[typeof field] }));
    },
    []
  );

  const verifyTurnstileToken = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/abuse/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        return false;
      }

      const result = (await response.json()) as { success?: boolean };
      return Boolean(result?.success);
    } catch (error) {
      return false;
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (siteConfig.turnstileEnabled && !turnstileToken) {
        alert(content.alerts.verification);
        return;
      }

      setSubmissionState('loading');

      if (siteConfig.turnstileEnabled && turnstileToken) {
        const verified = await verifyTurnstileToken(turnstileToken);
        if (!verified) {
          setSubmissionState('error');
          setTurnstileToken(null);
          turnstileRef.current?.reset();
          return;
        }
      }

      // Simulate processing time for better UX
      setTimeout(() => {
        const subject = encodeURIComponent(
          `[Abuse Report] ${content.form.abuseTypes[formData.abuseType]} - ${formData.url}`
        );
        const body = encodeURIComponent(
          `Abuse Type: ${content.form.abuseTypes[formData.abuseType]}\n` +
            `Reporter Email: ${formData.email}\n` +
            `Abusive URL/Domain: ${formData.url}\n` +
            `Evidence: ${formData.evidence || 'N/A'}\n\n` +
            `Description:\n${formData.description}`
        );

        setSubmissionState('success');
        setTimeout(() => {
          window.location.href = `mailto:abuse@sealos.io?subject=${subject}&body=${body}`;
        }, 1500);
      }, 800);
    },
    [content, formData, turnstileToken, verifyTurnstileToken]
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-b from-blue-500/40 via-transparent to-transparent opacity-60 blur"></div>
      <form
        onSubmit={handleSubmit}
        className="relative rounded-3xl border border-white/10 bg-card/90 p-8 shadow-xl backdrop-blur-sm sm:p-10"
      >
        <div className="mb-8 border-b border-border/60 pb-6">
          <h2 className="text-xl font-semibold text-foreground">{content.form.detailTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{content.form.detailSubtitle}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="abuseType" className="mb-2 block text-sm font-semibold text-foreground">
              {content.form.abuseType} <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.abuseType}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, abuseType: value as AbuseTypeKey }));
              }}
            >
              <SelectTrigger id="abuseType" className="w-full">
                <SelectValue placeholder={content.form.abuseType} />
              </SelectTrigger>
              <SelectContent>
                {abuseTypeKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {content.form.abuseTypes[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">
              {content.form.email} <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={content.form.emailPlaceholder}
              required
            />
          </div>

          <div>
            <label htmlFor="url" className="mb-2 block text-sm font-semibold text-foreground">
              {content.form.url} <span className="text-red-500">*</span>
            </label>
            <Input
              id="url"
              type="text"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder={content.form.urlPlaceholder}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-foreground">
              {content.form.description} <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={content.form.descriptionPlaceholder}
              required
            />
          </div>

          <div>
            <label htmlFor="evidence" className="mb-2 block text-sm font-semibold text-muted-foreground">
              {content.form.evidence}
            </label>
            <Input
              id="evidence"
              type="text"
              name="evidence"
              value={formData.evidence}
              onChange={handleInputChange}
              placeholder={content.form.evidencePlaceholder}
            />
          </div>

          {siteConfig.turnstileEnabled && (
            <div className="flex justify-center pt-2">
              <Turnstile
                ref={turnstileRef}
                siteKey={siteConfig.turnstileSitekey}
                options={{
                  action: siteConfig.turnstileAction,
                  cData: siteConfig.turnstileCdata,
                }}
                onSuccess={setTurnstileToken}
              />
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={submissionState === 'loading' || submissionState === 'success'}
              className={cn(
                'group relative w-full rounded-xl px-6 py-4 text-base font-semibold',
                'shadow-lg transition-all duration-200',
                'focus:outline-none focus:ring-4 focus:ring-ring/50',
                'disabled:cursor-not-allowed disabled:opacity-70',
                submissionState === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {submissionState === 'loading' && <LoadingSpinner className="h-5 w-5 animate-spin" />}
                {submissionState === 'success' && <CheckIcon className="h-5 w-5" />}
                {submissionState === 'loading'
                  ? content.form.submitting
                  : submissionState === 'success'
                  ? content.form.preparing
                  : content.form.submit}
              </span>
            </button>
            {statusMessage && (
              <p className="mt-3 text-center text-sm text-muted-foreground" role="status" aria-live="polite">
                {statusMessage}
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-white/5 px-4 py-3 text-sm">
            <InfoIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-muted-foreground">{content.privacyNote}</p>
          </div>
        </div>
      </form>
    </div>
  );
}

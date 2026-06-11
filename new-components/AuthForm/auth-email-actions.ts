import { siteConfig } from '@/config/site';
import { z } from 'zod';
import { EmailSmsRequest, EmailSmsResponse } from './types';

export function validateEmailAddress(email: string) {
  const schema = z.string().email();
  if (!schema.safeParse(email).success) {
    throw new Error('Please enter a valid email address');
  }
}

export async function requestEmailCode(
  email: string,
  captchaToken: string | null,
) {
  validateEmailAddress(email);

  const requestBody: EmailSmsRequest = {
    id: email,
    ...(siteConfig.turnstileEnabled && captchaToken
      ? { cfToken: captchaToken }
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

  return result;
}

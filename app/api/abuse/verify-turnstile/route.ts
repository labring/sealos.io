// Turnstile token verification and basic rate limiting.
import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type TurnstileVerifyResponse = {
  success: boolean;
  'error-codes'?: string[];
  hostname?: string;
  action?: string;
  cdata?: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitState = new Map<string, RateLimitEntry>();
const allowedHostnames = new Set(
  siteConfig.turnstileAllowedHostnames.map((host) => host.toLowerCase())
);

const getClientIp = (request: Request) => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfIp = request.headers.get('cf-connecting-ip');
  return (cfIp ?? realIp ?? forwarded?.split(',')[0]?.trim() ?? 'unknown').toLowerCase();
};

const isRateLimited = (ip: string) => {
  const { maxRequests, windowMs } = siteConfig.turnstileVerifyRateLimit;
  if (maxRequests <= 0 || windowMs <= 0) {
    return false;
  }

  const now = Date.now();
  if (rateLimitState.size > 1000) {
    for (const [key, entry] of rateLimitState) {
      if (entry.resetAt <= now) {
        rateLimitState.delete(key);
      }
    }
  }

  const entry = rateLimitState.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitState.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > maxRequests;
};

const isValidHostname = (hostname?: string) => {
  if (!hostname) {
    return false;
  }
  return allowedHostnames.has(hostname.toLowerCase());
};

export async function POST(request: Request) {
  try {
    const { token } = (await request.json()) as { token?: string };
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'missing-token' },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'rate-limited' },
        { status: 429 }
      );
    }

    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'missing-secret' },
        { status: 500 }
      );
    }

    const formData = new URLSearchParams({
      secret,
      response: token,
    });
    if (clientIp !== 'unknown') {
      formData.set('remoteip', clientIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'verify-failed' },
        { status: 502 }
      );
    }

    const result = (await response.json()) as TurnstileVerifyResponse;
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result['error-codes'] ?? [] },
        { status: 400 }
      );
    }

    if (!isValidHostname(result.hostname)) {
      return NextResponse.json(
        { success: false, error: 'invalid-hostname' },
        { status: 400 }
      );
    }

    if (siteConfig.turnstileAction && result.action !== siteConfig.turnstileAction) {
      return NextResponse.json(
        { success: false, error: 'invalid-action' },
        { status: 400 }
      );
    }

    if (siteConfig.turnstileCdata && result.cdata !== siteConfig.turnstileCdata) {
      return NextResponse.json(
        { success: false, error: 'invalid-cdata' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'unexpected' },
      { status: 500 }
    );
  }
}

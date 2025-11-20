// API 请求和响应类型定义

// 发送验证码请求
export interface EmailSmsRequest {
  cfToken?: string; // present when turnstile enabled
  id: string; // email
}

// 发送验证码响应
export interface EmailSmsResponse {
  code: number;
  message: string;
  data: null;
}

// 验证验证码请求
export interface EmailVerifyRequest {
  code: string; // verification code
  id: string; // email
}

// 验证验证码响应
export interface EmailVerifyResponse {
  code: number;
  message: string;
  data: {
    token: string; // RETURN THIS
    user: {
      name: string;
      avatar: string;
      userUid: string;
    };
    needInit: boolean;
  };
}

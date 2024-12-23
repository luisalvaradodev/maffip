// types/instance.ts
export interface APIInstance {
  instance: {
    instanceName: string;
    instanceId: string;
    status: "open" | "close";
    profilePictureUrl?: string;
    profileName?: string;
    serverUrl: string;
    apikey: string;
    integration: any;
    [key: string]: any;
  }
}

export interface InstanceCreateParams {
  instanceName: string;
  phoneNumber: string;
  token?: string;
  qrcode?: boolean;
  integration?: string;
  reject_call?: boolean;
  alwaysOnline?: boolean;
}

export interface ConnectionState {
  state: string;
  details: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  status?: number;
}

// types/instance.ts
export interface Instance {
  instanceName: string;
  token?: string;
  number: string;
  status?: string;
  qrcode?: boolean;
  qrcodeUrl?: string;
}

export interface InstanceCreateParams {
  instanceName: string;
  phoneNumber: string;
  token?: string;
  qrcode?: boolean;
  integration?: string;
  reject_call?: boolean;
  alwaysOnline?: boolean;
}

export interface ConnectionState {
  instance: {
    state: string;
    status: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface CountryCode {
  value: string;
  label: string;
  code: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { value: '+1', label: 'USA', code: 'US' },
  { value: '+44', label: 'UK', code: 'GB' },
  { value: '+34', label: 'Spain', code: 'ES' },
  { value: '+55', label: 'Brazil', code: 'BR' },
  { value: '+91', label: 'India', code: 'IN' },
  { value: '+86', label: 'China', code: 'CN' },
  { value: '+52', label: 'Mexico', code: 'MX' },
];
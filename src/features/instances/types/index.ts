// types/instance.ts
export interface Instance {
  name: string;
  status: "open" | "close";
  profilePictureUrl?: string;
}

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
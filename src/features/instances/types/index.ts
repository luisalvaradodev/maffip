// types/instance.ts
export interface Instance {
    name: string;
    status: "open" | "close";
    profilePictureUrl?: string;
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
  }
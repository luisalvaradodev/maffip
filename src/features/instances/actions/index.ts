// app/_actions/instance.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Instance, InstanceCreateParams, ConnectionState, ApiResponse } from '@/features/instances/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const API_KEY = process.env.API_KEY || 'mude-me'
console.log(process.env.NEXT_PUBLIC_API_URL);
console.log(process.env.API_KEY);


const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const defaultOptions: RequestInit = {
    headers: {
      'apikey': API_KEY,
      'Content-Type': 'application/json',
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, defaultOptions)
    console.log(response);
    
    const data = await response.json()
    console.log(data);
    

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return { success: true, data }
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      data: {} as T,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function createInstance(params: InstanceCreateParams) {
  const payload = {
    instanceName: params.instanceName,
    token: params.token || '',
    number: params.phoneNumber,
    qrcode: params.qrcode ?? true,
    integration: params.integration || 'WHATSAPP-BAILEYS',
    reject_call: params.reject_call ?? false,
    alwaysOnline: params.alwaysOnline ?? true,
  }

  const result = await fetchApi<Instance>('/instance/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  revalidatePath('/instances')
  return result
}

export async function fetchInstances() {
  return await fetchApi<Instance[]>('/instance/fetchInstances')
}

export async function connectInstance(name: string) {
  return await fetchApi<{ qrcode_url: string }>(`/instance/connect/${name}`, {
    method: 'POST'
  })
}

export async function getConnectionState(name: string) {
  return await fetchApi<ConnectionState>(`/instance/connectionState/${name}`)
}

export async function logoutInstance(name: string) {
  const result = await fetchApi(`/instance/logout/${name}`, {
    method: 'DELETE'
  })
  
  revalidatePath('/instances')
  return result
}

export async function deleteInstance(name: string) {
  const result = await fetchApi(`/instance/delete/${name}`, {
    method: 'DELETE'
  })
  
  revalidatePath('/instances')
  return result
}
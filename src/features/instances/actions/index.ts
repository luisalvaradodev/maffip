// app/_actions/instance.ts
'use server'

import { revalidatePath } from 'next/cache'
import { ApiResponse, Instance } from '@/features/instances/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const API_KEY = process.env.API_KEY || 'mude-me'

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
    const data = await response.json()
    

    if (!response.ok) {
      const errorMessage = data?.response?.message?.[0] || data?.message || 'API request failed'
      throw new Error(errorMessage)
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

export async function createInstance(instanceName: string) {
  const payload = {
    instanceName,
    token: "",
    qrcode: true,
    integration: "WHATSAPP-BAILEYS",
    reject_call: false,
    alwaysOnline: true,
  }

  const result = await fetchApi<Instance>('/instance/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  revalidatePath('/instances')
  return result
}

// Rest of your existing server actions remain unchanged
export async function connectInstance(instanceName: string) {
  return await fetchApi<{ qrcode_url: string }>(`/instance/connect/${instanceName}`, {
    method: 'GET'  // Changed from POST to GET as per the API requirements
  })
}

export async function getConnectionState(instanceName: string) {
  return await fetchApi<{ instance: { state: string; status: string } }>(
    `/instance/connectionState/${instanceName}`
  )
}

export async function fetchInstances() {
  const result = await fetchApi<Instance[]>('/instance/fetchInstances')
  if (result.success) {
    const formattedData = result.data.map((item: any) => ({
      name: item.instance.instanceName,
      status: item.instance.status,
      profilePictureUrl: item.instance.profilePictureUrl,
    }))
    return { success: true, data: formattedData }
  }
  return result
}

export async function logoutInstance(instanceName: string) {
  const result = await fetchApi(`/instance/logout/${instanceName}`, {
    method: 'DELETE'
  })
  
  revalidatePath('/instances')
  return result
}

export async function deleteInstance(instanceName: string) {
  const result = await fetchApi(`/instance/delete/${instanceName}`, {
    method: 'DELETE'
  })
  
  revalidatePath('/instances')
  return result
}
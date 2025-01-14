import axios from 'axios'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080'
const API_KEY = 'mude-me'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': API_KEY
  }
})

class InstanceController {
  static async createInstance(instanceName: string, phoneNumber: string) {
    try {
      const payload = {
        instanceName,
        token: '',
        number: phoneNumber,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
        reject_call: false,
        alwaysOnline: true
      }

      const response = await axiosInstance.post(`/instance/create`, payload)
      console.log('Instancia creada:', response.data)
      return response.data
    } catch (error) {
      console.error('Error al crear instancia:', error)
      throw error
    }
  }

  static async fetchInstances(instanceName: string) {
    try {
      const response = await axiosInstance.get(`/instance/fetchInstances?instanceName=${instanceName}`)
      console.log('Instancias disponibles:', response.data)
      return response.data
    } catch (error) {
      console.error('Error al obtener instancias:', error)
      throw error
    }
  }

  static async connectInstance(instanceName: string, phoneNumber: string) {
    try {
      const response = await axiosInstance.get(`/instance/connect/${instanceName}?number=${phoneNumber}`)
      console.log(`Instancia ${instanceName} conectada:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error al conectar instancia ${instanceName}:`, error)
      throw error
    }
  }

  static async connectionState(instanceName: string) {
    try {
      const response = await axiosInstance.get(`/instance/connectionState/${instanceName}`)
      console.log(`Estado de conexión para ${instanceName}:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error al consultar estado de ${instanceName}:`, error)
      throw error
    }
  }

  static async logoutInstance(instanceName: string) {
    try {
      const response = await axiosInstance.delete(`/instance/logout/${instanceName}`)
      console.log(`Instancia ${instanceName} cerró sesión:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error al cerrar sesión de ${instanceName}:`, error)
      throw error
    }
  }

  static async deleteInstance(instanceName: string) {
    try {
      const response = await axiosInstance.delete(`/instance/delete/${instanceName}`)
      console.log(`Instancia ${instanceName} eliminada:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar instancia ${instanceName}:`, error)
      throw error
    }
  }
}

export default InstanceController


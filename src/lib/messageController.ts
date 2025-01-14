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

interface SendTextOptions {
  delay?: number
  presence?: string
  [key: string]: any
}

class MessageController {
  static async sendText(instanceName: string, to: string, text: string, options: SendTextOptions = {}) {
    try {
      const payload = {
        number: to,
        options: {
          delay: 6000,
          presence: 'composing',
          ...options,
        },
        textMessage: { text },
      }

      const response = await axiosInstance.post(`/message/sendText/${instanceName}`, payload)
      console.log('Mensaje enviado:', response.data)
      return response.data
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      throw error
    }
  }

  static async handleMessageEvent(instanceName: string, eventType: string, data: any) {
    if (eventType === 'MESSAGES_UPSERT') {
      const messages = data?.messages || []
      for (const message of messages) {
        const remoteJid = message?.key?.remoteJid
        const text = message?.message?.conversation

        if (remoteJid && text) {
          console.log(`Mensaje recibido de ${remoteJid}: ${text}`)
          const responseText = `¡Hola! Recibí tu mensaje: "${text}"`
          await this.sendText(instanceName, remoteJid, responseText)
          console.log('Respuesta automática enviada.')
        }
      }
    } else {
      console.log(`Evento no manejado: ${eventType}`)
    }
  }
}

export default MessageController


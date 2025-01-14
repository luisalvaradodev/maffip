import io from 'socket.io-client'

class WebSocketClient {
  private socket: any
  private eventHandlers: { [key: string]: (data: any) => void }

  constructor(url: string) {
    this.socket = io(url, { transports: ['websocket'] })
    this.eventHandlers = {}

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error)
    })
  }

  on(event: string, handler: (data: any) => void) {
    this.eventHandlers[event] = handler
    this.socket.on(event, handler)
  }

  off(event: string) {
    if (this.eventHandlers[event]) {
      this.socket.off(event, this.eventHandlers[event])
      delete this.eventHandlers[event]
    }
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data)
  }

  disconnect() {
    this.socket.disconnect()
  }
}

export default WebSocketClient


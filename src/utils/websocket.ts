class Socket {
  
  websocket: any;
  lockReconnect: boolean;
  socketUrl: string;
  callback: (data: any) => void;
  timeout: number;

  constructor (option) {
    this.websocket = null
    this.lockReconnect = false
    this.socketUrl = option.socketUrl
    this.callback = option.socketCallback
    this.timeout = 5000
    this.createWebSocket()
  }

  createWebSocket () {
    try {
      this.websocket = new WebSocket(this.socketUrl)
      this.initEventHandle()
    } catch (e) {
      this.reconnect(this.socketUrl, this.timeout)
    }
  }

  initEventHandle () {
    this.websocket.onopen = () => {
      this.websocket.send('socket已经打开...')
    }
    this.websocket.onmessage = (evt) => {
      const socketData = evt.data
      const data = JSON.parse(socketData)
      switch (data.type) {
        case 1000:// token验证失败
          this.lockReconnect = true
          break
        case 1001: // 主动断开
          this.lockReconnect = true
          break
        default:
          if (typeof this.callback === 'function') {
            this.callback(data)
            this.lockReconnect = true
            this.websocket.close()
          }
      }
    }
    this.websocket.onclose = () => {
      this.reconnect(this.socketUrl, this.timeout)
    }
    this.websocket.onerror = (error) => {
      console.log(error)
      this.reconnect(this.socketUrl, this.timeout)
      console.log(`socket连接错误${  error}`)
    }
  }

  reconnect (url, timeout) {
    if (this.lockReconnect) return
    this.lockReconnect = true
    // 没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.createWebSocket()
      this.lockReconnect = false
    }, timeout)
  }
}

export default Socket



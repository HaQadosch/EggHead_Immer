import { Server as WebSocketServer } from 'ws'
import { IncomingMessage } from 'http'

const wss = new WebSocketServer({ port: 5001 })
console.log('WebSocket server on port 5001')

const connections: WebSocket[] = []

let history: IncomingMessage[] = []

wss.on('connection', (ws: any) => {
  connections.push(ws)
  console.log('New Disturbance in the Force!')

  ws.on('message', (message: string) => {
    console.log('Yo', { message })

    // Append it to the rest of the patches
    history.push(...JSON.parse(message))

    // Broadcast the patch on all the connections, except the source.
    connections
      .filter(client => client !== ws)
      .forEach(client => {
        client.send(message)
      });

  })

  ws.on('close', () => {
    const idx = connections.indexOf(ws)
    if (idx !== -1) {
      connections.splice(idx, 1)
    }
  })

  // Sends all the patches we received so far.
  ws.send(JSON.stringify(history))
})
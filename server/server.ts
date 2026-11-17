import http from 'node:http';
import { WebSocketServer } from 'ws';
//@ts-expect-error
import { setupWSConnection } from '@y/websocket-server/utils'

const PORT = Number(process.env.PORT) || 1234;

const server = http.createServer((req, res) => {
  console.log(req.method, req.url)
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

res.writeHead(404)
res.end('Not found')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
  const rawRoom = (req.url || '').slice(1).split('?')[0]
  const docName = decodeURIComponent(rawRoom || 'default-room')
  console.log(`client joined room : ${docName}`)
  setupWSConnection(ws, req, { docName })
ws.on('close', () => {
  console.log(`client left room : ${docName}`);
  })
})
server.listen(PORT, '0.0.0.0', () => {
  console.log(`listening on ${PORT}`)
} )

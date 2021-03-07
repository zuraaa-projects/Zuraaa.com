import app from '../app'
import debugModule from 'debug'
import http from 'http'
const debug = debugModule('botsparadiscord:server')

/**
 * Get port from environment and store in Express.
 */

const port = app.config.server.port
app.app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app.app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error: any): void {
  if (error.syscall !== 'listen') {
    throw error
  }

  const type = typeof port === 'string' ? 'Pipe' : 'Port'
  const bind = `${type} ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening (): void {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr?.port ?? 'nulo'}`
  debug('Listening on ' + bind)
  console.log('ouvindo em: ' + bind)
}

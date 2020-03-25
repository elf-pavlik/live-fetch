'use strict'

import Hapi from '@hapi/hapi'
import Readable from 'readable-stream'
import { promises as fs } from 'fs'

class ResponseStream extends Readable {
    _read() {}
}

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: { cors: { credentials: true } },
        state: { isSameSite: false } // required for CORS
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            const index = await fs.readFile('index.html', 'utf-8')
            return index
        }
    })

    server.route({
        method: 'GET',
        path: '/stream',
        handler: (request, h) => {
            const stream = new ResponseStream();
            setInterval(() => {
              let now = (new Date()).toISOString()
              console.log(now)
              stream.push(now)
            }, 1000);
            return stream
        }
    })

    await server.start()
    console.log('Server running on %s', server.info.uri)
};

process.on('unhandledRejection', (err) => {

    console.log(err)
    process.exit(1)
});

init()
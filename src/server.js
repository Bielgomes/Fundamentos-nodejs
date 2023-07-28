// Importação CommonJS
// const http = require('http')

// Import e export só funciona colocando o type="module" no script do package.json
// Importação ESmodule
import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// Query Parameters: Filtros, paginação.
//  http://localhost:3333/users?name=Diego
//  URL Stateful

// Route Parameters: Identificação de recurso
//  http://localhost:3333/users/1
//  URL Stateless

// Request Body: Envio de informações de um formulário
// O conteudo do body é criptografado pelo protocolo HTTPS
//  http://localhost:3333/users
//  {
//    "name": "Diego",
//    "email": "diego@rocketseat.com"
//  }

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((route => {
    return route.method === method && route.path.test(url)
  }))

  if (route) {
    const routeParams = req.url.match(route.path)
    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)
// localhost:3333
import fastify from 'fastify'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastifyRouter } from '@dataqoi/fastify-router'

const app = fastify()

app.register(fastifySwagger)
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyRouter, {
  version: 'v2',
  onRouteLoaded: ({ routePath, method }) => {
    const pad = ' '.repeat(8 - (method.length + 2))

    console.log(`[ ${method} ]${pad} -> ${routePath}`)
  },
})

app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Test server listening at ${address}`)
})

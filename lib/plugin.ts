import type { FastifyPluginAsync, HTTPMethods } from 'fastify'
import { loadRoutes } from 'lib/loadRoutes'

export interface FastifyRouterPluginOptions {
  version?: string
  routesBasePath?: string
  onRouteLoaded?: (data: { routePath: string; method: HTTPMethods }) => void
}

export const plugin: FastifyPluginAsync<FastifyRouterPluginOptions> = async (
  fastify,
  options,
) => {
  await loadRoutes(fastify, options)
}

import { fastifyPlugin } from 'fastify-plugin'
import { plugin, type FastifyRouterPluginOptions } from 'lib/plugin'
import { type FastifyRouterOptions } from 'lib/loadRoutes'

export { type FastifyRouterPluginOptions, type FastifyRouterOptions }
export const fastifyRouter = fastifyPlugin(plugin)

export default fastifyRouter

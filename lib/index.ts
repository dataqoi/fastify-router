import { fastifyPlugin } from 'fastify-plugin'
import { plugin, type FastifyRouterPluginOptions } from 'lib/plugin'

export { type FastifyRouterPluginOptions }
export const fastifyRouter = fastifyPlugin(plugin)

export default fastifyRouter

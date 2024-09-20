import { fastifyPlugin } from 'fastify-plugin'
import { plugin } from 'lib/plugin'

export const fastifyRouter = fastifyPlugin(plugin)

export default fastifyRouter

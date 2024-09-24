import { RouteHandler } from 'fastify'

export const GET: RouteHandler<{ Params: { type: string } }> = async (
  request,
  reply,
) => {
  return reply.status(200).send()
}

import { RouteHandler } from 'fastify'
import { users } from 'lib/user.repository'

export const GET: RouteHandler = async (request, reply) =>
  reply.status(200).send([...users.values()])

export const POST: RouteHandler<{ Body: { username?: string } }> = async (
  request,
  reply,
) => {
  const body = request.body

  const id = Math.random().toString(36).slice(2)
  const user = users.set(id, { id, username: body.username! })

  return reply.status(201).send(user)
}

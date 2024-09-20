import { RouteHandler } from 'fastify'
import { users } from 'lib/user.repository'

export const GET: RouteHandler<{ Params: { id: string } }> = async (
  request,
  reply,
) => {
  const user = users.get(request.params.id)

  if (!user) {
    return reply.status(404).send({ status: 404, message: 'User not found' })
  }

  return reply.status(200).send(user)
}

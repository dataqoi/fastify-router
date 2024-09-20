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

export const PATCH: RouteHandler<{
  Params: { id: string }
  Body: { username: string }
}> = async (request, reply) => {
  const body = request.body
  const user = users.get(request.params.id)

  if (!user) {
    return reply.status(404).send({ status: 404, message: 'User not found' })
  }

  if (user.username === body.username) {
    return reply.status(200).send(user)
  }

  if (!body.username) {
    return reply
      .status(400)
      .send({ status: 400, message: 'Username is required' })
  }

  const existingUsername = [...users.values()].find(
    (u) => u.username === body.username,
  )
  if (existingUsername) {
    return reply.status(409).send({
      status: 409,
      message: 'Username already exists',
    })
  }

  user.username = body.username

  users.set(user.id, user)

  return reply.status(200).send(user)
}

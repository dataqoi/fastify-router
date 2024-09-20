const user1Id = Math.random().toString(36).slice(2)
const user2Id = Math.random().toString(36).slice(2)

global.users = new Map([
  [user1Id, { id: user1Id, username: 'user1' }],
  [user2Id, { id: user2Id, username: 'user2' }],
])

export const users = global.users

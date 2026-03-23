import { db } from '../../db'
import { followsTable, messagesTable } from '../../model/schema'
import { and, eq, or } from 'drizzle-orm'

export const areMutualFollowers = async (userAId: number, userBId: number) => {
  const relationship1 = await db
    .select()
    .from(followsTable)
    .where(and(eq(followsTable.followerId, userAId), eq(followsTable.followedId, userBId)))
    .limit(1)

  const relationship2 = await db
    .select()
    .from(followsTable)
    .where(and(eq(followsTable.followerId, userBId), eq(followsTable.followedId, userAId)))
    .limit(1)

  return relationship1.length > 0 && relationship2.length > 0
}

export const saveMessage = async (senderId: number, receiverId: number, content: string) => {
  const [message] = await db
    .insert(messagesTable)
    .values({ senderId, receiverId, content })
    .returning()

  return message
}

export const getConversation = async (userId: number, friendId: number) => {
  const messages = await db
    .select()
    .from(messagesTable)
    .where(
      or(
        and(eq(messagesTable.senderId, userId), eq(messagesTable.receiverId, friendId)),
        and(eq(messagesTable.senderId, friendId), eq(messagesTable.receiverId, userId))
      )
    )
    .orderBy(messagesTable.createdAt)

  return messages
}

export const getConversationHandler = async (req, res) => {
  try {
    const userId = Number(req.params.userId)
    const friendId = Number(req.params.friendId)

    if (Number.isNaN(userId) || Number.isNaN(friendId)) {
      return res.status(400).json({ message: 'Invalid IDs' })
    }

    const mutual = await areMutualFollowers(userId, friendId)
    if (!mutual) {
      return res.status(403).json({ message: 'Users must follow each other to chat' })
    }

    const conversation = await getConversation(userId, friendId)

    res.json(conversation)
  } catch (error) {
    console.error('Error getting conversation:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

import { db } from '../../db'
import { followsTable, usersTable } from '../../model/schema'
import { eq, and, or, ilike } from 'drizzle-orm';
import { Request, Response } from 'express';

export const followUser = async (req: Request, res: Response) => {
  try {
    const { followerId, followedId } = req.body;

    // Check if already following
    const existingFollow = await db
      .select()
      .from(followsTable)
      .where(and(eq(followsTable.followerId, followerId), eq(followsTable.followedId, followedId)))
      .limit(1);

    if (existingFollow.length > 0) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Prevent self-follow
    if (followerId === followedId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const result = await db
      .insert(followsTable)
      .values({ followerId, followedId })
      .returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { followerId, followedId } = req.params;

    const result = await db
      .delete(followsTable)
      .where(and(eq(followsTable.followerId, parseInt(followerId)), eq(followsTable.followedId, parseInt(followedId))))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Follow relationship not found' });
    }

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const following = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        biographie: usersTable.biographie,
        avatar_url: usersTable.avatar_url,
        createdAt: usersTable.createdAt,
      })
      .from(followsTable)
      .innerJoin(usersTable, eq(followsTable.followedId, usersTable.id))
      .where(eq(followsTable.followerId, parseInt(userId)));

    res.json(following);
  } catch (error) {
    console.error('Error getting following:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const followers = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        biographie: usersTable.biographie,
        avatar_url: usersTable.avatar_url,
        createdAt: usersTable.createdAt,
      })
      .from(followsTable)
      .innerJoin(usersTable, eq(followsTable.followerId, usersTable.id))
      .where(eq(followsTable.followedId, parseInt(userId)));

    res.json(followers);
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const rawQuery = String(req.query.query || '').trim();

    if (!rawQuery) {
      return res.json([]);
    }

    const users = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        biographie: usersTable.biographie,
        avatar_url: usersTable.avatar_url,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(
        or(
          ilike(usersTable.username, `%${rawQuery}%`),
          ilike(usersTable.email, `%${rawQuery}%`)
        )
      )
      .limit(20);

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkFollowStatus = async (req: Request, res: Response) => {
  try {
    const { followerId, followedId } = req.params;

    const follow = await db
      .select()
      .from(followsTable)
      .where(and(eq(followsTable.followerId, parseInt(followerId)), eq(followsTable.followedId, parseInt(followedId))))
      .limit(1);

    res.json({ isFollowing: follow.length > 0 });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
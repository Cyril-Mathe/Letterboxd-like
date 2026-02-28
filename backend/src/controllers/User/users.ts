import { db } from "../../db"
import { usersTable } from "../../model/schema"
import { eq } from "drizzle-orm"
import { User } from "../../model/schema"

export async function getUsers() {
    try {
        const users = await db.select().from(usersTable);
        return users;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get users"};
    }
}

export async function getUserById(id: number) {
    try {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
        return user[0] || null;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get user"};
    }
}

export async function createUser(user: Omit<User, 'id' | 'createdAt'>) {
    try {
        await db.insert(usersTable).values(user);
    } catch (error) {
        console.error(error);
        return { error: "Failed to create user"};
    }
}

export async function updateUser(user: Omit<User, 'createdAt'>) {
    try {
        await db.update(usersTable).set(user).where(eq(usersTable.id, user.id));
    } catch (error) {
        console.error(error);
        return { error: "Failed to update user"};
    }
}

export async function deleteUser(id: number) {
    try {
        await db.delete(usersTable).where(eq(usersTable.id, id));
        return { message: "User deleted successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete user"};
    }
}
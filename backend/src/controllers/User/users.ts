import { db } from "../../db"
import { usersTable } from "../../model/schema"
import { eq } from "drizzle-orm"
import { Request, Response } from "express"

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await db.select().from(usersTable);
        res.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get users" });
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid user id" });
        }
        const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
        res.json({ success: true, data: user[0] || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get user" });
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        await db.insert(usersTable).values(req.body);
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await db.update(usersTable).set({ ...req.body, id }).where(eq(usersTable.id, id));
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update user" });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await db.delete(usersTable).where(eq(usersTable.id, id));
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete user" });
    }
}
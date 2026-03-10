import { db } from "../../db"
import { usersTable } from "../../model/schema"
import { eq } from "drizzle-orm"
import { Request, Response } from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(req: Request, res: Response) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [user] = await db.insert(usersTable).values({ username, email, password: hashedPassword }).returning();
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "1d" });
        res.status(201).json({ user, token, refreshToken });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ error: "Identifier and password are required" });
        }
        let user;
        if (identifier.includes('@')) {
            [user] = await db.select().from(usersTable).where(eq(usersTable.email, identifier));
        } else {
            [user] = await db.select().from(usersTable).where(eq(usersTable.username, identifier));
        }
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "1d" });
        res.json({ token, refreshToken });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
}

export async function me(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, decoded.id));
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
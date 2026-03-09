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
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
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
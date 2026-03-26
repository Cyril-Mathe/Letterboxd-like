import { db } from "../../db"
import { usersTable } from "../../model/schema"
import { eq } from "drizzle-orm"
import { Request, Response } from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../Mail/mailControllers";

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

export async function resetpassword(req: Request, res: Response) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        try {
            await sendEmail(user.email, 
                            "Demande de réinitialisation de mot de passe",
                                `
                                <div style="max-width:600px;margin:auto;font-family:Arial,Helvetica,sans-serif;background:#fdf6f0;padding:30px;border-radius:10px;color:#333;">
                        
                                <h2 style="text-align:center;font-size:20px;margin-bottom:20px;border-bottom:1px solid #e0d6ce;padding-bottom:10px;">
                                Souhaitez vous vraiment changer de mot de passe ?
                                </h2>
                
                                <p style="font-size:14px;line-height:1.6;">
                                Si vous êtes bien à l'origine de cette demande, vous pouvez changer votre mot de passe en toute tranquillité.<br>
                                Si ce n’est pas le cas, il est possible que quelqu’un d’autre ait essayé d’accéder à votre compte.<br>
                                Quoi qu’il en soit, pensez à mettre à jour votre mot de passe de temps en temps : c’est un bon réflexe pour protéger vos informations.
                                </p>
                
                                <p style="margin: 90px 0;text-align: center">
                                <a href="http://localhost:5173/resetpassword/${user.id}"
                                    style="background:#d93025; color:#fff; padding:12px 20px; text-decoration:none; border-radius:12px; font-weight:bold;">
                                    Réinitialisez votre mot de passe
                                </a>
                                </p>
                
                                <table width="100%" style="margin-top:30px;">
                                <tr>
                                    <td style="font-size:20px; color:#444;">
                                    Merci de votre confiance,<br>
                                    L’équipe <b>Front Row.</b>
                                    </td>
                                </tr>
                                </table>
                
                                </div>
                                `,
                                );
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ error: "Error sending password reset email" });
        }
        res.json({ message: "Password reset link sent" });
    } catch (error) {
        res.status(500).json({ error: "Error processing password reset" });
    }
}

export async function updatePassword(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { mot_de_passe } = req.body;

        if (!id || !mot_de_passe) {
            return res.status(400).json({ error: "ID and password are required" });
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        await db.update(usersTable).set({ password: hashedPassword }).where(eq(usersTable.id, id));

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Error updating password" });
    }
}
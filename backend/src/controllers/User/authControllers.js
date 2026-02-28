import pool from "../../database/dbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import { sendEmail } from "../Mail/mailControllers.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET


export async function register(req, res) {
    const { username, email, password } = req.body;
    try {
        // Vérification de l'email
        const user = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [email]
        );
        if (user[0].length > 0) {
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Génération du secret 2FA
        const secret = speakeasy.generateSecret({
            name: `Plateforme Auth (${email})`
        });

        const deuxfa_secret = secret.base32;
        const token6chiffres = speakeasy.totp({
            secret: deuxfa_secret,
            encoding: 'base32'
        });
        const deuxfa_enabled = 1;

        // Ajout dans la table
        {
            await pool.query(
                `INSERT INTO users (username, email, password, deuxfa_secret, deuxfa_enabled)
                 VALUES ($1, $2, $3, $4, $5)`,
                [username, email, hashedPassword, deuxfa_secret, deuxfa_enabled]
            );
        }

        // Envoi d'email
        try {
            return res.status(201).json({
                message: "Compte créé avec 2FA activé.",
                
            });
        } catch (err) {
            
            
            return res.status(500).json({ message: "Erreur lors de la création du compte" });
        }

    } catch (err) {
        console.error(err);
        
        res.status(500).json({ message: "Erreur lors de la création du compte" });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        
        const user = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [email]
        );

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        // Générer un code 2FA
        if (user.deuxfa_enabled) {
            const token6chiffres = speakeasy.totp({
                secret: user.deuxfa_secret,
                encoding: 'base32'
            });

        // Envoi d'email
        try {
            await sendEmail(
                user.email,
                "Votre code d'authentification à double facteur",
                `
                <div style="max-width:600px;margin:auto;font-family:Arial,Helvetica,sans-serif;background:#fdf6f0;padding:30px;border-radius:10px;color:#333;">
        
                <div style="text-align:center">
                <img src="cid:logo" alt="Logo">
                </div>
                <h2 style="text-align:center;font-size:20px;margin-bottom:20px;border-bottom:1px solid #e0d6ce;padding-bottom:10px;">
                Votre code d’authentification à double facteur
                </h2>

                <p style="font-size:14px;line-height:1.6;">
                Bonjour <b>${user.username}</b>,<br><br>
                Afin de protéger votre compte, voici votre code d’authentification à double facteur :
                </p>

                <div style="text-align:center;margin:30px 0;">
                <div style="font-size:28px;font-weight:bold;background:#fff;border:1px solid #ddd;display:inline-block;padding:15px 40px;border-radius:8px;">
                    ${token6chiffres}
                </div>
                </div>

                <p style="font-size:13px;line-height:1.6;color:#555;">
                Ce code est valable pendant <b>90 secondes</b>.<br>
                Ne le partagez avec personne, même si vous êtes contacté par notre support.<br>
                Si vous n’êtes pas à l’origine de cette tentative de connexion, veuillez réinitialiser votre mot de passe immédiatement depuis votre espace client et contacter notre équipe de sécurité.
                </p>

                <table width="100%" style="margin-top:30px;">
                <tr>
                    <td style="font-size:20px; color:#444;">
                    Merci de votre confiance,<br>
                    L’équipe <b>.</b>
                    </td>
                    <td align="right" width="200">
                    <img src="cid:logo3" alt="Logo3" width="200" height="200">
                    </td>
                </tr>
                </table>

                </div>
                `,
                [
                    {
                        filename: "Logo3.png",
                        path: path.join(__dirname, "..", "..", "img", "Logo3.png"),
                        cid: "logo3"
                    },
                    {
                        filename: "Logo2.png",
                        path: path.join(__dirname, "..", "..", "img", "Logo2.png"),
                        cid: "logo2"
                    }
                ]
                );

            return res.status(200).json({
                message: "Code 2FA requis. Un email vous a été envoyé.",
                requires2FA: true,
                userId: user.id,
            });
            } catch (err) {
                return res.status(500).json({ message: "Erreur lors de l'envoi d'email 2FA"});
            }
        }

        // p-e ajoouuter des choses dans le paylod
        const payload = { id: user.id };
        // changer la date d'expiration ?
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: "Connexion réussie", user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la connexion" });
    }
}

export async function verify2FA(req, res) {
    const { userId, token2fa } = req.body;

    try {
        // Sélectionne dans la table
        const [rows] = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        const user = rows[0];

        if (!user || !user.deuxfa_secret) {
            return res.status(400).json({ message: "Utilisateur ou secret 2FA introuvable" });
        }

        // Vérification du token TOTP avec le secret
        const verified = speakeasy.totp.verify({
            secret: user.deuxfa_secret,
            encoding: 'base32',
            token: token2fa,
            window: 1
        });

        if (!verified) {
            return res.status(400).json({ message: "Code 2FA invalide" });
        }

        // Génération du token JWT
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: "2FA validé", user, token });

    } catch (err) {
        console.error("Erreur 2FA :", err);
        res.status(500).json({ message: "Erreur lors de la vérification du code 2FA" });
    }
}

export async function resend2FACodeHandler(req, res) {
    const { userId, email } = req.body;

    if (!userId || !email) {
        return res.status(400).json({ message: "Données manquantes pour le renvoi du code 2FA" });
    }

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE id = $1 AND email = $2", [userId, email]);
        const user = rows[0];

        if (!user || !user.deuxfa_secret) {
            return res.status(404).json({ message: "Utilisateur ou secret 2FA introuvable" });
        }

        // nouveau code 2FA
        const token6chiffres = speakeasy.totp({
            secret: user.deuxfa_secret,
            encoding: 'base32'
        });

        await sendEmail(
            user.email,
            "Nouveau code d'authentification à double facteur",
            `
                <div style="max-width:600px;margin:auto;font-family:Arial,Helvetica,sans-serif;background:#fdf6f0;padding:30px;border-radius:10px;color:#333;">
        
                <div style="text-align:center">
                <img src="cid:logo2" alt="Logo 2">
                </div>
                <h2 style="text-align:center;font-size:20px;margin-bottom:20px;border-bottom:1px solid #e0d6ce;padding-bottom:10px;">
                Votre nouveau code d’authentification à double facteur
                </h2>

                <p style="font-size:14px;line-height:1.6;">
                Voici votre nouveau code d’authentification à double facteur :
                </p>

                <div style="text-align:center;margin:30px 0;">
                <div style="font-size:28px;font-weight:bold;background:#fff;border:1px solid #ddd;display:inline-block;padding:15px 40px;border-radius:8px;">
                    ${token6chiffres}
                </div>
                </div>

                <p style="font-size:13px;line-height:1.6;color:#555;">
                Ce nouveau code est valable pendant <b>90 secondes</b>.<br>
                Ne le partagez avec personne, même si vous êtes contacté par notre support.<br>
                Si vous n’êtes pas à l’origine de cette tentative de connexion, veuillez réinitialiser votre mot de passe immédiatement depuis votre espace client et contacter notre équipe de sécurité.
                </p>

                <table width="100%" style="margin-top:30px;">
                <tr>
                    <td style="font-size:20px; color:#444;">
                    Merci de votre confiance,<br>
                    L’équipe <b>.</b>
                    </td>
                    <td align="right" width="200">
                    <img src="cid:logo2" alt="Logo 2" width="200" height="200">
                    </td>
                </tr>
                </table>

                </div>
                `,
                [
                    {
                        filename: "Logo3.png",
                        path: path.join(__dirname, "..", "..", "img", "Logo3.png"),
                        cid: "logo3"
                    },
                    {
                        filename: "Logo2.png",
                        path: path.join(__dirname, "..", "..", "img", "Logo2.png"),
                        cid: "logo2"
                    }
                ]
        );

        return res.status(200).json({ message: "Nouveau code 2FA envoyé par email." });
    } catch (err) {
        console.error("Erreur lors du renvoi du code 2FA :", err);
        return res.status(500).json({ message: "Erreur serveur lors du renvoi du code 2FA" });
    }
}

export async function resetpassword(req, res) {
    const { email } = req.body;

    if (!email) {
    return res.status(400).json({ message: "Email requis" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];

    if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user) {
        // Envoi d'email
        try {
            await sendEmail(
                user.email,
                "Demande de réinitialisation de mot de passe",
                `
                <div style="max-width:600px;margin:auto;font-family:Arial,Helvetica,sans-serif;background:#fdf6f0;padding:30px;border-radius:10px;color:#333;">
        
                <div style="text-align:center">
                <img src="cid:logo2" alt="Logo 2">
                </div>
                <h2 style="text-align:center;font-size:20px;margin-bottom:20px;border-bottom:1px solid #e0d6ce;padding-bottom:10px;">
                Souhaitez vous vraiment changer de mot de passe ?
                </h2>

                <p style="font-size:14px;line-height:1.6;">
                Si vous êtes bien à l'origine de cette demande, vous pouvez changer votre mot de passe en toute tranquillité.<br>
                Si ce n’est pas le cas, il est possible que quelqu’un d’autre ait essayé d’accéder à votre compte.<br>
                Quoi qu’il en soit, pensez à mettre à jour votre mot de passe de temps en temps : c’est un bon réflexe pour protéger vos informations.
                </p>

                <p style="margin: 90px 0;text-align: center">
                <a href="http://localhost:5173/reset-password/${user.id}"
                    style="background:#d93025; color:#fff; padding:12px 20px; text-decoration:none; border-radius:12px; font-weight:bold;">
                    Réinitialisez votre mot de passe
                </a>
                </p>

                <table width="100%" style="margin-top:30px;">
                <tr>
                    <td style="font-size:20px; color:#444;">
                    Merci de votre confiance,<br>
                    L’équipe <b>.</b>
                    </td>
                    <td align="right" width="200">
                    <img src="cid:logo2" alt="Logo 2" width="200" height="200">
                    </td>
                </tr>
                </table>

                </div>
                `,
                [
                    {
                        filename: "Logo3.png",
                        path: path.join(__dirname, "..", "..", "img", "Logo3.png"),
                        cid: "logo3"
                    },
                    {
                        filename: "Logo2.png",
                        path: path.join(__dirname, "..", "..", "img", "Logo2.png"),
                        cid: "logo2"
                    }
                ]
                );

            return res.status(200).json({ message : `Un email pour changer de mot de passe vous a été envoyé a l'adresse mail suivante : ${user.email}`});
            } catch (err) {
                return res.status(500).json({ message: "Erreur lors de l'envoi d'email pour changer de mot de passe"});
            }
        }
}
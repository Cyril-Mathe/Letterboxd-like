// controllers
import pool from "../../../database/createDb.js";
import bcrypt from "bcrypt";

export async function getAllUsers(req, res) {
    try {
        const contents = await pool.query(`SELECT * FROM users`);
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}

export async function getUsersById(req, res) {
    try {
        const id = req.params.id
        const contents = await pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [id]
        );
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}

export async function createUsers(req, res) {
    try {
        const {
        username,
        email,
        password,
        } = req.body
        const contents = await pool.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`, [username, email, password]);
        res.status(200).json(contents[0]);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}

export async function modifyUsers(req, res) {
    try {
        const id = req.params.id
        const {
            username,
            email,
            password,
        } = req.body
        const contents = await pool.query(`UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`, [username, email, password, id]);
        res.status(200).json(contents[0]);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}

export async function deleteUsers(req, res) {
    try {
        const id = req.params.id
        const contents = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
        res.status(200).json(contents[0]);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}

export async function modifyUsersPassword(req, res) {
    try {
        const value = req.params.id
        const {
            password
        } = req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const contents = await pool.query(`UPDATE users SET password = $1 WHERE id = $2 RETURNING *`, [hashedPassword, value]);
        res.status(200).json(contents[0]);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}
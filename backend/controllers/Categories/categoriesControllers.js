// categories controllers
import pool from "../../database/dbConnect.js";

export async function getCategories(req, res) {
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function getCategoriesById(req, res) {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        const category = result.rows[0];
        if (category.image && typeof category.image === "string") {
            try {
                category.image = JSON.parse(category.image);
            } catch (e) {
                category.image = [];
            }
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message : error.message});
    }
} 

export async function createCategories(req, res) {
    try {
        const { name } = req.body;
        const result = await pool.query(
            `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
            [name]
        );
        res.status(201).json({
            message: 'Catégorie créée avec succès',
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function modifyCategories(req, res) {
    try {
        const id = req.params.id;
        const { name } = req.body
        const result = await pool.query(`UPDATE categories SET name = $1 WHERE id = $2 RETURNING *`, [name, id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function deleteCategories(req, res) {
    try {
        const id = req.params.id
        const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        res.status(200).json({ message: 'Catégorie supprimée', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}
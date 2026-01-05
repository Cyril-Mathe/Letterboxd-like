// directors controllers
import pool from "../../database/dbConnect.js";

export async function getDirectors(req, res) {
    try {
        const result = await pool.query('SELECT * FROM directors');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function getDirectorsById(req, res) {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM directors WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Réalisateur non trouvé" });
        }
        const actor = result.rows[0];
        if (actor.image && typeof actor.image === "string") {
            try {
                actor.image = JSON.parse(actor.image);
            } catch (e) {
                actor.image = [];
            }
        }
        res.status(200).json(actor);
    } catch (error) {
        res.status(500).json({ message : error.message});
    }
} 

export async function createDirectors(req, res) {
    try {
        const {
            name,
            birth_date,
            death_date,
            place_of_birth,
            nationality,
            img_url
        } = req.body;

        // Plusieurs images
         let imagesPaths = [];
        if (req.files && req.files.length > 0) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            imagesPaths = req.files.map(file => {
                // Remplacer les backslashes par des slashes et s'assurer du bon format d'URL
                const cleanPath = file.path.replace(/\\/g, '/');
                return `${baseUrl}/${cleanPath}`;
            });
            
            // Debug : afficher les URLs générées
            console.log('URLs générées:', imagesPaths);
        }

        // les URLs sont sous jSON
        const result = await pool.query(
            `INSERT INTO directors (name, birth_date, death_date, place_of_birth, nationnality, img_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, birth_date, death_date, place_of_birth, nationality, JSON.stringify(imagesPaths)]
        );
        res.status(201).json({
            message: 'Réalisateur créé avec succès',
            data: result.rows[0],
            images: imagesPaths 
        });

    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function modifyDirectors(req, res) {
    try {
        const id = req.params.id;
        const {
            name,
            birth_date,
            death_date,
            place_of_birth,
            nationality,
            img_url
        } = req.body
        const result = await pool.query(`UPDATE directors SET name = $1, birth_date = $2, death_date = $3, place_of_birth = $4, nationnality = $5, img_url = $6 WHERE id = $7 RETURNING *`, [name, birth_date, death_date, place_of_birth, nationality, img_url, id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function deleteDirectors(req, res) {
    try {
        const id = req.params.id
        const result = await pool.query('DELETE FROM directors WHERE id = $1 RETURNING *', [id]);
        res.status(200).json({ message: 'Réalisateur supprimé', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}
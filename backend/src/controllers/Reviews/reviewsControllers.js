// reviews controllers
import pool from "../../../database/dbConnect.js";

export async function getReviews(req, res) {
    try {
        const result = await pool.query('SELECT * FROM reviews');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function getReviewsById(req, res) {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Review non trouvé" });
        }
        const review = result.rows[0];
        if (review.image && typeof review.image === "string") {
            try {
                review.image = JSON.parse(review.image);
            } catch (e) {
                review.image = [];
            }
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message : error.message});
    }
} 

export async function createReviews(req, res) {
    try {
        const { 
            user_id,
            movie_id,
            rating,
            review_text
         } = req.body;
        const result = await pool.query(
            `INSERT INTO reviews (user_id, movie_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, movie_id, rating, review_text]
        );
        res.status(201).json({
            message: 'Review créé avec succès',
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function modifyReviews(req, res) {
    try {
        const id = req.params.id;
        const { 
            user_id,
            movie_id,
            rating,
            review_text
         } = req.body
        const result = await pool.query(`UPDATE reviews SET user_id = $1, movie_id = $2, rating = $3, review_text = $4 WHERE id = $5 RETURNING *`, [user_id, movie_id, rating, review_text, id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function deleteReviews(req, res) {
    try {
        const id = req.params.id
        const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
        res.status(200).json({ message: 'Review supprimé', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}
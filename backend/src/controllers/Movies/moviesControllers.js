// movies controllers
import pool from "../../../database/dbConnect.js";

export async function getMovies(req, res) {
    try {
        const result = await pool.query('SELECT * FROM movies');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function getMoviesById(req, res) {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Film non trouvé" });
        }
        const movie = result.rows[0];
        if (movie.image && typeof movie.image === "string") {
            try {
                movie.image = JSON.parse(movie.image);
            } catch (e) {
                movie.image = [];
            }
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message : error.message});
    }
} 

export async function createMovies(req, res) {
    try {
        const { 
            title,
            year,
            director_id,
            actor_id,
            category_id,
            synopsis,
            poster_url
         } = req.body;
        const result = await pool.query(
            `INSERT INTO movies (title, year, director_id, actor_id, category_id, synopsis, poster_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, year, director_id, actor_id, category_id, synopsis, poster_url]
        );
        res.status(201).json({
            message: 'Film créé avec succès',
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function modifyMovies(req, res) {
    try {
        const id = req.params.id;
        const { 
            title,
            year,
            director_id,
            actor_id,
            category_id,
            synopsis,
            poster_url
         } = req.body
        const result = await pool.query(`UPDATE movies SET title = $1, year = $2, director_id = $3, actor_id = $4, category_id = $5, synopsis = $6, poster_url = $7 WHERE id = $8 RETURNING *`, [title, year, director_id, actor_id, category_id, synopsis, poster_url, id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
} 

export async function deleteMovies(req, res) {
    try {
        const id = req.params.id
        const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);
        res.status(200).json({ message: 'Film supprimé', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}
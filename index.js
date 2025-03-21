const express = require('express');
const app = express();
const { Pool } = require("pg");

const cors = require("cors");
app.use(cors());

const pool = new Pool({
	host: 'localhost',
	database: 'users',
	user: 'admin', // postgres
	password: 'admin', // install garda rakheko password
	port: 5432
});

pool.query(`
	CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL
	)
`, (err) => {
	if (err) console.error("Error creating table:", err);
});

app.get("/users", (req, res) => {
	pool.query("SELECT * FROM users")
		.then(result => res.status(201).json(result.rows))
		.catch((err) => res.send(404, "Error", err));
});

app.post("/users", (req, res) => {
	pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [req.body.name, req.body.email])
		.then(result => res.status(201).json(result.rows))
		.catch((err) => res.send(404, err));
});

app.delete("/users/:id", (req, res) => {
	pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [req.params.id])
		.then(result => {
			if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });
			res.json({ message: "User deleted" });
		})
		.catch((err) => res.send(404, "Error", err));
});

app.listen(3000, () => console.log(`Server running on 3000`));

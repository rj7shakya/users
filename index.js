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
		.then(result => res.json(result.rows))
		.catch((err) => res.send(404, "Error", err));
});

app.listen(3000, () => console.log(`Server running on 3000`));

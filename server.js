const express = require('express');
const mysql = require('mysql');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection details
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');

  // Create the table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE
    )
  `;

  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Table created or already exists');
  });
});

// Set up Express routes for CRUD operations
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' folder

// GET route to retrieve all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// POST route to create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  connection.query(query, [name, email], (err, result) => {
    if (err) throw err;
    res.send(`User created with ID: ${result.insertId}`);
  });
});

// PUT route to update an existing user
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  connection.query(query, [name, email, userId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send(`User with ID ${userId} not found`);
    } else {
      res.send(`User created with ID: ${userId}`);
    }
  });
});

// DELETE route to delete a user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';
  connection.query(query, [userId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send(`User with ID ${userId} not found`);
    } else {
      res.send(`User with ID ${userId} deleted`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

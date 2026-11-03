const express = require('express');
const { rateLimit } = require('express-rate-limit');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(':memory:');

const dishes = [
  ['Omelette', 'Canvas 101', 1, 12],
  ['Fried Chicken', 'Copilot SDK', 0, 16],
  ['Soup', 'Agentic Workflows', 1, 9],
  ['Dip', 'PR review', 1, 7],
  ['Croque Monsieur', null, 0, 14],
  ['Ratatouille', null, 1, 13],
  ['Crème Brûlée', null, 1, 8]
];

db.serialize(() => {
  db.run(`CREATE TABLE dishes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    lab TEXT,
    vegetarian INTEGER NOT NULL,
    price INTEGER NOT NULL
  )`);
  const insert = db.prepare('INSERT INTO dishes (name, lab, vegetarian, price) VALUES (?, ?, ?, ?)');
  for (const dish of dishes) insert.run(dish);
  insert.finalize();
});

const app = express();

app.use(rateLimit({ windowMs: 60 * 1000, limit: 100 }));

app.get('/dishes', (req, res) => {
  db.all('SELECT * FROM dishes ORDER BY id', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Could not load the menu' });
    res.json(rows);
  });
});

app.get('/dishes/:id', (req, res) => {
  db.get('SELECT * FROM dishes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Could not load the dish' });
    if (!row) return res.status(404).json({ error: 'Dish not found' });
    res.json(row);
  });
});

app.get('/dishes/search', (req, res) => {
  db.all(`SELECT * FROM dishes WHERE name LIKE '%${req.query.q}%'`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = { app, db };

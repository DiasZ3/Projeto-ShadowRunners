const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "..", "..", "data", "corridas.db");
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erro ao abrir DB:", err.message);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS corridas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    apelido TEXT,
    horario TEXT,
    premiacao REAL,
    inicio TEXT,
    chegada TEXT,
    quantidade INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;

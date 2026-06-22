const express = require("express");
const router = express.Router();
const db = require("../db/database");

router.post("/", (req, res) => {
  const { nome, apelido, horario, premiacao, inicio, chegada, quantidade } =
    req.body;
  const stmt = db.prepare(
    "INSERT INTO corridas (nome, apelido, horario, premiacao, inicio, chegada, quantidade) VALUES (?,?,?,?,?,?,?)",
  );
  stmt.run(
    nome,
    apelido,
    horario,
    premiacao || 0,
    inicio,
    chegada,
    quantidade || null,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(
        "SELECT * FROM corridas WHERE id = ?",
        [this.lastID],
        (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json(row);
        },
      );
    },
  );
});

router.get("/", (req, res) => {
  db.all("SELECT * FROM corridas ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;

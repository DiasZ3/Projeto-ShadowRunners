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

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, apelido, horario, premiacao, inicio, chegada, quantidade } = req.body;
  const stmt = db.prepare(
    "UPDATE corridas SET nome = ?, apelido = ?, horario = ?, premiacao = ?, inicio = ?, chegada = ?, quantidade = ? WHERE id = ?",
  );

  stmt.run(
    nome,
    apelido,
    horario,
    premiacao || 0,
    inicio,
    chegada,
    quantidade || null,
    id,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Corrida não encontrada" });
      db.get("SELECT * FROM corridas WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    },
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM corridas WHERE id = ?");
  stmt.run(id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Corrida não encontrada" });
    res.json({ success: true });
  });
});

module.exports = router;

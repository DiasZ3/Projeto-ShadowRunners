const express = require("express");
const cors = require("cors");
const path = require("path");
const corridaRoutes = require("./src/routes/corridaRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/corridas", corridaRoutes);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Rotas auxiliares para facilitar navegação
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "html", "index.html"));
});

app.get("/criar", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "frontend", "html", "criar-corrida.html"),
  );
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

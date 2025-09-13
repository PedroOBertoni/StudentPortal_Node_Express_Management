require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// === Banco ===
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("✅ Conectado ao banco com sucesso!"))
  .catch(err => console.error("❌ Erro de conexão:", err));

// Criar tabela se não existir
async function criarTabela() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alunos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        ra VARCHAR(20) UNIQUE NOT NULL,
        idade INTEGER NOT NULL,
        sexo CHAR(1) NOT NULL,
        media DECIMAL(3,1) NOT NULL
      )
    `);
    console.log("✅ Tabela alunos criada/verificada");
  } catch (err) {
    console.error("❌ Erro ao criar tabela:", err);
  }
}
criarTabela();

// === Servir arquivos estáticos (HTML/CSS/JS) ===
// Supondo que seu index.html está na pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rota raiz -> envia index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// === Rotas API ===
app.post("/alunos", async (req, res) => {
  const { nome, ra, idade, sexo, media } = req.body;
  try {
    await pool.query(
      "INSERT INTO alunos (nome, ra, idade, sexo, media) VALUES ($1, $2, $3, $4, $5)",
      [nome, ra, idade, sexo, media]
    );
    res.json({ message: "✅ Aluno adicionado com sucesso!" });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ message: "❌ Já existe um aluno com este RA!" });
    } else {
      res.status(500).json({ message: "❌ Erro interno do servidor" });
    }
  }
});

app.get("/alunos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alunos ORDER BY nome");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "❌ Erro ao buscar alunos" });
  }
});

app.delete("/alunos/:ra", async (req, res) => {
  const { ra } = req.params;
  try {
    await pool.query("DELETE FROM alunos WHERE ra = $1", [ra]);
    res.json({ message: "Aluno removido!" });
  } catch (err) {
    res.status(500).json({ message: "❌ Erro ao remover aluno" });
  }
});

app.post("/buscar", async (req, res) => {
  const { campo, valor } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM alunos WHERE ${campo} = $1`,
      [valor]
    );
    if (result.rows[0]) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Aluno não encontrado!" });
    }
  } catch (err) {
    res.status(500).json({ message: "❌ Erro na busca" });
  }
});

app.post("/buscar-todos", async (req, res) => {
  const { campo, valor } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM alunos WHERE ${campo} ILIKE $1 ORDER BY nome`,
      [`%${valor}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "❌ Erro na busca" });
  }
});

app.put("/alunos/:ra", async (req, res) => {
  const { ra } = req.params;
  const { nome, idade, sexo, media } = req.body;
  try {
    await pool.query(
      "UPDATE alunos SET nome = $1, idade = $2, sexo = $3, media = $4 WHERE ra = $5",
      [nome, idade, sexo, media, ra]
    );
    res.json({ message: "✅ Aluno atualizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "❌ Erro ao atualizar" });
  }
});

// === Start server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Criar tabela se não existir
async function criarTabela() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL não configurada!");
    return;
  }
  
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

// Busca no banco de dados
async function buscarAluno(campo, valor) {
  try {
    const result = await pool.query(
      `SELECT * FROM alunos WHERE ${campo} = $1`,
      [valor]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Erro na busca:", err);
    return null;
  }
}

// Rotas
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
      res.status(400).json({
        message: "❌ Já existe um aluno com este RA!",
      });
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
  const resultado = await buscarAluno(campo, valor);
  if (resultado) {
    res.json(resultado);
  } else {
    res.status(404).json({ message: "Aluno não encontrado!" });
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

app.listen(3000, () =>
  console.log("🚀 Servidor rodando na porta 3000")
);

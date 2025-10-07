import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
const PORT = 3000;
const API_KEY = "f5d8d3ee6ff84a7a8f8924fe6abeeec6";

// Configuração para __dirname funcionar em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "../public")));

// Permitir que o front acesse a API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoint de notícias
app.get("/news", async (req, res) => {
  const country = req.query.country || "us";
  const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching news" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

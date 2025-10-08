import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public")); // Serves index.html, CSS, JS, etc.

// 📰 News API route
app.get("/news", async (req, res) => {
  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=f5d8d3ee6ff84a7a8f8924fe6abeeec6`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Error fetching news" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

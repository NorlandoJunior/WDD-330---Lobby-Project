import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

// --- News API route ---
app.get("/news", async (req, res) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Error fetching news" });
  }
});

// --- Weather API route (3-hour forecast) ---
app.get("/weather", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${process.env.OPENWEATHER_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching weather:", err);
    res.status(500).json({ error: "Error fetching weather" });
  }
});

// --- Calendarific API route ---
app.get("/calendar", async (req, res) => {
  try {
    const COUNTRY = "BR";
    const YEAR = new Date().getFullYear();
    const url = `https://calendarific.com/api/v2/holidays?api_key=${process.env.CALENDARIFIC_KEY}&country=${COUNTRY}&year=${YEAR}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data.response.holidays);
  } catch (err) {
    console.error("Error fetching calendar:", err);
    res.status(500).json({ error: "Error fetching calendar" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

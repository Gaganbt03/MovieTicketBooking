import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./data.json";

// Read JSON database
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Write JSON database
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// 🎬 Get all movies
app.get("/movies", (req, res) => {
  const db = readDB();
  res.json(db.movies);
});

// ⏰ Get showtimes for any movie (simple static)
app.get("/showtimes/:movie", (req, res) => {
  res.json(["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"]);
});

// 💺 Get booked seats for a movie & show
app.get("/seats/:movie/:time", (req, res) => {
  const { movie, time } = req.params;
  const db = readDB();
  const key = `${movie}-${time}`;
  res.json(db.bookings[key] || []);
});

// ✔ Book seats
app.post("/book", (req, res) => {
  const { movie, time, seats } = req.body;

  if (!movie || !time || !seats || seats.length === 0) {
    return res.status(400).json({ message: "Missing data" });
  }

  const db = readDB();
  const key = `${movie}-${time}`;

  // Append seats, avoid duplicates
  const current = db.bookings[key] || [];
  const booked = [...new Set([...current, ...seats])];

  db.bookings[key] = booked;
  writeDB(db);

  res.json({ message: "Booking confirmed", booked });
});

// ⚙ Server start
app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});

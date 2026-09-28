import "./loadEnvironment.mjs";
import express from "express";
import cors from "cors";
import posts from "./routes/posts.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "ok" }));
app.use("/posts", posts);

// Unknown routes
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Uncaught errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

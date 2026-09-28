import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI;

if (!connectionString) {
  console.error("ATLAS_URI is missing. Add it to server/.env");
  process.exit(1);
}

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log("Connected to MongoDB Atlas");
} catch (err) {
  console.error("Could not connect to MongoDB:", err.message);
  process.exit(1);
}

const db = conn.db(process.env.DB_NAME || "blog");

export default db;

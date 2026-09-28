import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/conn.mjs";

const router = express.Router();
const collection = db.collection("posts");

// Pulls and validates the fields a post can have
function readPostBody(body, { partial = false } = {}) {
  const fields = {};
  const errors = [];

  for (const key of ["title", "author", "body"]) {
    if (body[key] === undefined) {
      if (!partial) errors.push(`${key} is required`);
      continue;
    }
    const value = String(body[key]).trim();
    if (!value) errors.push(`${key} cannot be empty`);
    else fields[key] = value;
  }

  if (fields.title && fields.title.length > 120) {
    errors.push("title must be 120 characters or fewer");
  }

  if (body.tags !== undefined) {
    const tags = Array.isArray(body.tags) ? body.tags : String(body.tags).split(",");
    fields.tags = [...new Set(tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))];
  } else if (!partial) {
    fields.tags = [];
  }

  return { fields, errors };
}

function badId(res) {
  return res.status(400).json({ error: "Invalid post id" });
}

// GET /posts - all posts, newest first
router.get("/", async (req, res, next) => {
  try {
    const results = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /posts/:id - one post
router.get("/:id", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) return badId(res);
    const post = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// POST /posts - create
router.post("/", async (req, res, next) => {
  try {
    const { fields, errors } = readPostBody(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join(", ") });

    const now = new Date();
    const doc = { ...fields, createdAt: now, updatedAt: now };
    const result = await collection.insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    next(err);
  }
});

// PATCH /posts/:id - update
router.patch("/:id", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) return badId(res);

    const { fields, errors } = readPostBody(req.body, { partial: true });
    if (errors.length) return res.status(400).json({ error: errors.join(", ") });
    if (!Object.keys(fields).length) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const updated = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...fields, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!updated) return res.status(404).json({ error: "Post not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /posts/:id - remove
router.delete("/:id", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) return badId(res);
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;

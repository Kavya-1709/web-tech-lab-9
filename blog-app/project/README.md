# Inkwell - Blog/Post Management App

React → fetch() → Express REST API → MongoDB Atlas

## Setup

### 1. Server
```bash
cd server
npm install
```
Edit `server/.env` and set `ATLAS_URI` to your MongoDB Atlas connection string
(Atlas → Database → Connect → Drivers). Also add your IP under Network Access.
```bash
npm start        # http://localhost:5050
```

### 2. React app (new terminal)
```bash
cd app
npm install
npm run dev      # http://localhost:5173
```

## REST API

| Method | Route         | Purpose            |
|--------|---------------|--------------------|
| GET    | /posts        | List all posts     |
| GET    | /posts/:id    | Get one post       |
| POST   | /posts        | Create a post      |
| PATCH  | /posts/:id    | Update a post      |
| DELETE | /posts/:id    | Delete a post      |

Post shape: `{ title, author, body, tags[], createdAt, updatedAt }`

Quick test:
```bash
curl -X POST http://localhost:5050/posts -H "Content-Type: application/json" \
  -d '{"title":"Hello","author":"Kavya","body":"First post","tags":"intro"}'
```

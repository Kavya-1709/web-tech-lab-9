import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, request } from "../api.js";

export default function Archive() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    request("/posts")
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    try {
      await request(`/posts/${id}`, { method: "DELETE" });
      setPosts((current) => current.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Filter by search text, then group by month
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = posts.filter(
      (p) =>
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.includes(q))
    );
    const byMonth = new Map();
    for (const post of matches) {
      const label = new Date(post.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
      if (!byMonth.has(label)) byMonth.set(label, []);
      byMonth.get(label).push(post);
    }
    return [...byMonth.entries()];
  }, [posts, query]);

  return (
    <>
      <h1>Archive</h1>
      <input
        className="search"
        type="search"
        placeholder="Search by title, author or tag"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search posts"
      />

      {loading && <p className="state">Loading posts…</p>}
      {error && <p className="state error">{error}</p>}
      {!loading && !error && groups.length === 0 && (
        <p className="state">{query ? `No posts match "${query}".` : "No posts yet."}</p>
      )}

      {groups.map(([month, items]) => (
        <section key={month} className="month">
          <h2>{month}</h2>
          <ul>
            {items.map((post) => (
              <li key={post._id}>
                <div>
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                  <span className="meta">{post.author} · {formatDate(post.createdAt)}</span>
                </div>
                <div className="row-actions">
                  <Link to={`/edit/${post._id}`}>Edit</Link>
                  <button onClick={() => handleDelete(post._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

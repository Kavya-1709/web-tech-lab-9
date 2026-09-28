import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostSummary from "../components/PostSummary.jsx";
import { request } from "../api.js";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    request("/posts")
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Say it loud. Post it here.</h1>
        <p>Write a post, edit it whenever you change your mind, delete it when you're done.</p>
        <Link to="/create" className="btn">Write a post</Link>
      </section>

      <h2 className="section-title">Latest posts</h2>

      {loading && <p className="state">Loading posts…</p>}
      {error && <p className="state error">Couldn't load posts: {error}. Is the server running?</p>}
      {!loading && !error && posts.length === 0 && (
        <div className="state">
          <h3>No posts yet</h3>
          <p>Your first post takes about a minute.</p>
          <Link to="/create" className="btn">Write the first post</Link>
        </div>
      )}

      <div className="grid">
        {posts.slice(0, 6).map((post, i) => (
          <PostSummary key={post._id} post={post} index={i} />
        ))}
      </div>

      {posts.length > 6 && (
        <p className="more">
          <Link to="/archive" className="btn btn-ghost">See all {posts.length} posts</Link>
        </p>
      )}
    </>
  );
}

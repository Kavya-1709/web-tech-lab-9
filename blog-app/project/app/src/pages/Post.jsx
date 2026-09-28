import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDate, request } from "../api.js";

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    request(`/posts/${id}`)
      .then(setPost)
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    setDeleting(true);
    try {
      await request(`/posts/${id}`, { method: "DELETE" });
      navigate("/archive");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (error && !post) {
    return (
      <div className="state error">
        <h2>{error}</h2>
        <Link to="/" className="btn">Back to home</Link>
      </div>
    );
  }
  if (!post) return <p className="state">Loading post…</p>;

  const edited = post.updatedAt !== post.createdAt;

  return (
    <article className="full-post">
      <div className="card-tags">
        {post.tags?.map((tag) => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
      </div>
      <h1>{post.title}</h1>
      <p className="byline">
        By {post.author} on {formatDate(post.createdAt)}
        {edited && ` (edited ${formatDate(post.updatedAt)})`}
      </p>

      <div className="body">
        {post.body.split(/\n+/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {error && <p className="state error">{error}</p>}

      <div className="actions">
        <Link to={`/edit/${post._id}`} className="btn">Edit post</Link>
        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting…" : "Delete post"}
        </button>
        <Link to="/archive" className="btn btn-ghost">All posts</Link>
      </div>
    </article>
  );
}

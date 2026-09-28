import { Link } from "react-router-dom";
import { formatDate } from "../api.js";

const COLORS = ["var(--pink)", "var(--yellow)", "var(--mint)", "var(--sky)"];

export default function PostSummary({ post, index = 0 }) {
  const excerpt = post.body.length > 140 ? post.body.slice(0, 140).trim() + "…" : post.body;

  return (
    <article className="card" style={{ "--tint": COLORS[index % COLORS.length] }}>
      <div className="card-tags">
        {post.tags?.slice(0, 3).map((tag) => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
      </div>
      <h3>
        <Link to={`/posts/${post._id}`}>{post.title}</Link>
      </h3>
      <p>{excerpt}</p>
      <footer>
        <span>{post.author}</span>
        <time>{formatDate(post.createdAt)}</time>
      </footer>
    </article>
  );
}

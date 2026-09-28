import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { request } from "../api.js";

const EMPTY = { title: "", author: "", tags: "", body: "" };

// Used for both creating (/create) and editing (/edit/:id)
export default function Create() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    request(`/posts/${id}`)
      .then((post) =>
        setForm({
          title: post.title,
          author: post.author,
          tags: (post.tags || []).join(", "),
          body: post.body,
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const saved = await request(isEdit ? `/posts/${id}` : "/posts", {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(form),
      });
      navigate(`/posts/${saved._id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) return <p className="state">Loading post…</p>;

  return (
    <form className="editor" onSubmit={handleSubmit}>
      <h1>{isEdit ? "Edit post" : "Write a post"}</h1>

      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} maxLength={120} required />
      </label>

      <label>
        Author
        <input name="author" value={form.author} onChange={handleChange} required />
      </label>

      <label>
        Tags <small>separate with commas</small>
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="react, mongodb" />
      </label>

      <label>
        Post
        <textarea name="body" value={form.body} onChange={handleChange} rows={12} required />
      </label>

      {error && <p className="state error">{error}</p>}

      <div className="actions">
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
        </button>
        <Link to={isEdit ? `/posts/${id}` : "/"} className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}

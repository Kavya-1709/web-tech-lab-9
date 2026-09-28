import { NavLink, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import Post from "./pages/Post.jsx";
import Archive from "./pages/Archive.jsx";

export default function App() {
  return (
    <>
      <header className="nav">
        <Link to="/" className="brand">Inkwell</Link>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/archive">Archive</NavLink>
          <NavLink to="/create" className="btn btn-small">Write a post</NavLink>
        </nav>
      </header>

      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Create />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/archive" element={<Archive />} />
          <Route
            path="*"
            element={
              <div className="state">
                <h2>That page doesn't exist</h2>
                <Link to="/" className="btn">Back to home</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
}

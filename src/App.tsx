import { Routes, Route, Navigate, Link } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import CreatePage from "./pages/CreatePage";

export default function App() {
  return (
    <>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: 16 }}>
        <nav style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Link to="/">피드</Link>
          <Link to="/create">작성하기</Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

import { Link, Routes, Route, Navigate } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import CreatePage from "./pages/CreatePage";

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">피트</Link>
        <Link to="/create">작성</Link>
      </nav>

      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

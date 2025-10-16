import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import type { Post } from "../types";
import { formatRelativeTime } from "../utils/time";

const PAGE_SIZE = 10;

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 페이지 로딩
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getPosts({ page: 1, limit: PAGE_SIZE });
        if (!alive) return;
        setPosts(list);
        setPage(2);
        setHasMore(list.length === PAGE_SIZE);
      } catch (e: unknown) {
        console.error(e);
        setError("목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const list = await getPosts({ page, limit: PAGE_SIZE });
      setPosts((prev) => [...prev, ...list]);
      setPage((prev) => prev + 1);
      setHasMore(list.length === PAGE_SIZE);
    } catch (e: unknown) {
      console.error(e);
      setError("목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontSize: 18, fontWeight: 600 }}>피드</h1>

      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {posts.map((p) => (
        <article
          key={p.id}
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 12,
            background: "#fff",
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <img
              src={p.author.profileImage}
              alt="프로필 사진"
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
              }}
            >
              <strong>{p.author.name}</strong>
              <span>{p.author.nickname}</span>
              {p.author.verified && <span aria-label="verified">✔</span>}
              <span>{formatRelativeTime(p.createdAt)}</span>
              <span>{p.categoryName}</span>
            </div>
          </header>

          <p style={{ whiteSpace: "pre-wrap", marginBottom: 8 }}>{p.content}</p>

          {!!p.images.length && (
            <div
              style={{
                display: "grid",
                gap: 8,
                gridTemplateColumns: p.images.length > 1 ? "1fr 1fr" : "1fr",
              }}
            >
              {/* 이미지 첨부 기능 (미리보기 포함, 최대 4장) 이미지 수 과다 시 레이아웃 붕괴 방지 */}
              {p.images.slice(0, 4).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="이미지"
                  style={{ width: "100%", borderRadius: 8, objectFit: "cover" }}
                />
              ))}
            </div>
          )}

          <footer
            style={{
              display: "flex",
              gap: 12,
              marginTop: 8,
            }}
          >
            <span>{p.likes}</span>
            <span>{p.retweets}</span>
            <span>{p.comments}</span>
          </footer>
        </article>
      ))}

      {loading && !loading && (
        <button
          onClick={loadMore}
          style={{
            padding: "10px 14px",
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          더 보기
        </button>
      )}

      {!hasMore && posts.length > 0 && (
        <div style={{ textAlign: "center" }}>모든 게시물을 불러왔습니다.</div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import type { Post } from "../types";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";

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
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: 16,
        display: "grid",
        gap: 12,
      }}
    >
      <h1 style={{ fontSize: 18, fontWeight: 700 }}>피드</h1>

      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {/* 초기 로딩: 스켈레톤 5개 */}
      {posts.length === 0 && loading && (
        <>
          {Array.from({ length: 5 }, (_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </>
      )}

      {/* 데이터 */}
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}

      {/* 하단 추가 로딩 표시 */}
      {posts.length > 0 && loading && <PostCardSkeleton />}

      {/* 더 보기 */}
      {hasMore && !loading && (
        <button
          onClick={loadMore}
          style={{
            padding: "10px 14px",
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fff",
            cursor: "pointer",
            width: "100%",
          }}
        >
          더 보기
        </button>
      )}

      {!hasMore && posts.length > 0 && (
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          모든 게시물을 불러왔습니다.
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { getPosts } from "../api/posts";
import { toggleLike, toggleRetweet } from "../api/interactions";
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

  // API 대기 중 더블클릭/중복 호출 방지
  const [pending, setPending] = useState<Set<number>>(new Set());

  // 무한 스크롤용 센티널
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 초기 페이지 로드
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

  // 추가 페이지 로드
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

  // IntersectionObserver로 무한 스크롤
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasMore) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // rootMargin으로 미리 당겨 로드, loading 중복 방지
        if (entry.isIntersecting && !loading) {
          loadMore();
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0 }
    );

    io.observe(sentinelRef.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore]);

  function updatePost(id: number, updater: (p: Post) => Post) {
    setPosts((prev) => prev.map((p) => (p.id === id ? updater(p) : p)));
  }

  // 좋아요 토글
  const handleToggleLike = async (id: number) => {
    if (pending.has(id)) return;
    setPending((prev) => new Set(prev).add(id));

    updatePost(id, (p) => ({
      ...p,
      isLiked: !p.isLiked,
      likes: Math.max(0, p.likes + (p.isLiked ? -1 : 1)),
    }));

    try {
      const res = await toggleLike(id);
      if (!res.success) throw new Error("toggleLike failed");
    } catch {
      // 롤백
      updatePost(id, (p) => ({
        ...p,
        isLiked: !p.isLiked,
        likes: Math.max(0, p.likes + (p.isLiked ? -1 : 1)),
      }));
      setError("좋아요 처리에 실패했습니다.");
    } finally {
      setPending((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  // 리트윗 토글
  const handleToggleRetweet = async (id: number) => {
    if (pending.has(id)) return;
    setPending((prev) => new Set(prev).add(id));

    let rolledBack = false;
    updatePost(id, (p) => ({
      ...p,
      isRetweeted: !p.isRetweeted,
      retweets: Math.max(0, p.retweets + (p.isRetweeted ? -1 : 1)),
    }));

    try {
      const res = await toggleRetweet(id);
      if (!res.success) throw new Error("toggleRetweet failed");
    } catch {
      rolledBack = true;
      updatePost(id, (p) => ({
        ...p,
        isRetweeted: !p.isRetweeted,
        retweets: Math.max(0, p.retweets + (p.isRetweeted ? -1 : 1)),
      }));
      setError("리트윗 처리에 실패했습니다.");
    } finally {
      setPending((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      if (!rolledBack) setError(null);
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
        <PostCard
          key={p.id}
          post={p}
          onToggleLike={handleToggleLike}
          onToggleRetweet={handleToggleRetweet}
          disabled={pending.has(p.id)}
        />
      ))}

      {/* 하단 추가 로딩 표시 */}
      {posts.length > 0 && loading && <PostCardSkeleton />}

      {/* 무한 스크롤 센티널 */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {/* 더 이상 데이터 없을 때 */}
      {!hasMore && posts.length > 0 && (
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          모든 게시물을 불러왔습니다.
        </div>
      )}
    </div>
  );
}

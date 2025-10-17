import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockCategories } from "../mock/mockCategories";
import { currentUser } from "../mock/currentUser";
import type { Post } from "../types";

const MAX_LEN = 280;
const MAX_IMAGES = 4;

type Preview = { url: string; file: File };

export default function CreatePage() {
  const nav = useNavigate();

  const [text, setText] = useState("");
  const [categoryId, setCategoryId] = useState<number>(
    mockCategories[0]?.id ?? 1
  );
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 텍스트 길이 & 남은 글자 수
  const len = text.length;
  const remain = MAX_LEN - len;
  const overLimit = remain < 0;

  // 이미지 선택
  const onPickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const room = MAX_IMAGES - previews.length;
    if (room <= 0) {
      setError(`이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있어요.`);
      e.target.value = "";
      return;
    }

    const picked = files.slice(0, room).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews((prev) => [...prev, ...picked]);
    setError(null);
    e.target.value = "";
  };

  // 이미지 제거
  const removePreview = (idx: number) => {
    setPreviews((prev) => {
      const copy = [...prev];
      const [target] = copy.splice(idx, 1);
      if (target) URL.revokeObjectURL(target.url);
      return copy;
    });
  };

  // blob URL 정리 -> 메모리 누수 방지
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  // 유효성 체크(텍스트 또는 이미지 중 하나는 있는지 확인)
  const isValid = useMemo(() => {
    const hasContent = text.trim().length > 0 || previews.length > 0;
    return hasContent && !overLimit;
  }, [text, previews, overLimit]);

  // 제출
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError("내용을 입력해 주세요.");
      return;
    }
    try {
      setSubmitting(true);
      const selected = mockCategories.find((c) => c.id === categoryId)!;
      const newPost: Post = {
        id: Date.now(),
        author: {
          name: currentUser.name,
          nickname: currentUser.nickname,
          profileImage: currentUser.profileImage,
          verified: currentUser.verified,
        },
        content: text.trim(),
        images: previews.map((p) => p.url),
        category: selected.id,
        categoryName: selected.name,
        createdAt: new Date().toISOString(),
        likes: 0,
        retweets: 0,
        comments: 0,
        isLiked: false,
        isRetweeted: false,
        hasMoreComments: false,
        commentList: [],
      };

      // 피드로 돌아감
      nav("/", { replace: true, state: { newPost } });
    } catch {
      setError("게시물 작성에 실패했습니다.");
    } finally {
      setSubmitting(false);
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
      <h1 style={{ fontSize: 18, fontWeight: 700 }}>게시물 작성</h1>

      {error && <div style={{ color: "crimson" }}>{error}</div>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="post-text" style={{ fontWeight: 600 }}>
            내용 (최대 {MAX_LEN}자)
          </label>
          <textarea
            id="post-text"
            placeholder="무슨 일이 일어나고 있나요?"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
            rows={5}
            style={{
              padding: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
            }}
          >
            <span style={{ color: overLimit ? "crimson" : "#6b7280" }}>
              {len} / {MAX_LEN}
            </span>
          </div>
        </div>

        {/* 카테고리 */}
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="post-category" style={{ fontWeight: 600 }}>
            카테고리
          </label>
          <select
            id="post-category"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            style={{
              padding: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
            }}
          >
            {mockCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 이미지 첨부 */}
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 600 }}>
            이미지 첨부 (최대 {MAX_IMAGES}장)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onPickImages}
          />
          {previews.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: previews.length >= 2 ? "1fr 1fr" : "1fr",
                gap: 8,
              }}
            >
              {previews.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={p.url}
                    alt=""
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      objectFit: "cover",
                      aspectRatio: "4 / 3",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(i)}
                    aria-label="이미지 제거"
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                    }}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 액션 */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => nav(-1)}
            style={{
              padding: "10px 14px",
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fff",
            }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isValid || submitting}
            style={{
              padding: "10px 14px",
              border: "1px solid #2563eb",
              borderRadius: 8,
              background: !isValid || submitting ? "#93c5fd" : "#3b82f6",
              color: "#fff",
              cursor: !isValid || submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "작성 중…" : "작성하기"}
          </button>
        </div>
      </form>
    </div>
  );
}

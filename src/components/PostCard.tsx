import type { Post } from "../types";
import { useRef, useState } from "react";
import ImageModal from "./ImageModal";
import { highlightText } from "../utils/highlight";
import { formatRelativeTime } from "../utils/time";
import styles from "./PostCard.module.css";

type Props = {
  post: Post;
  onToggleLike?: (id: number) => void;
  onToggleRetweet?: (id: number) => void;
  disabled?: boolean;
};

export default function PostCard({
  post,
  onToggleLike,
  onToggleRetweet,
  disabled,
}: Props) {
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  const likeLockRef = useRef(false);
  const rtLockRef = useRef(false);

  const openModal = (idx: number) => setModalIdx(idx);
  const closeModal = () => setModalIdx(null);
  const hasModal = modalIdx !== null;

  const next = () => {
    if (modalIdx === null) return;
    setModalIdx((modalIdx + 1) % post.images.length);
  };
  const prev = () => {
    if (modalIdx === null) return;
    setModalIdx((modalIdx - 1 + post.images.length) % post.images.length);
  };

  const { author } = post;
  const gridClass =
    post.images.length >= 2 ? styles.imagesGridTwo : styles.imagesGridOne;

  const handleLikeClick = () => {
    if (disabled || likeLockRef.current) return;
    likeLockRef.current = true;
    onToggleLike?.(post.id);
    // 한 틱 뒤 가드 해제 (연타 방지용)
    setTimeout(() => {
      likeLockRef.current = false;
    }, 150);
  };

  const handleRetweetClick = () => {
    if (disabled || rtLockRef.current) return;
    rtLockRef.current = true;
    onToggleRetweet?.(post.id);
    setTimeout(() => {
      rtLockRef.current = false;
    }, 150);
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <img
          className={styles.avatar}
          src={author.profileImage}
          alt={`${author.name} 프로필 이미지`}
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.meta}>
          <div className={styles.nameRow}>
            <strong className={styles.name}>{author.name}</strong>
            <span className={styles.nick}>@{author.nickname}</span>
            {author.verified && (
              <span className={styles.verified} aria-label="verified">
                ✔
              </span>
            )}
          </div>
          <div className={styles.subMeta}>
            <span>{formatRelativeTime(post.createdAt)}</span>
            <span className={styles.dot}>·</span>
            <span>{post.categoryName}</span>
          </div>
        </div>
      </header>

      <p className={styles.content}>{highlightText(post.content)}</p>

      {post.images.length > 0 && (
        <div
          className={`${styles.imagesGrid} ${gridClass}`}
          aria-label="첨부 이미지"
        >
          {post.images.slice(0, 4).map((src, i) => (
            <button
              key={i}
              type="button"
              className={styles.imageBtn}
              onClick={() => openModal(i)}
              aria-label="이미지 크게 보기"
            >
              <img src={src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}

          {/* 모달 */}
          {hasModal && (
            <ImageModal
              images={post.images}
              index={modalIdx!}
              onClose={closeModal}
              onPrev={prev}
              onNext={next}
            />
          )}
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.stats}>
          <span className={styles.stat} aria-label="좋아요">
            ♥ {post.likes}
          </span>
          <span className={styles.stat} aria-label="리트윗">
            ⤴ {post.retweets}
          </span>
          <span className={styles.stat} aria-label="댓글">
            💬 {post.comments}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtn}
            aria-label="좋아요 토글"
            aria-pressed={post.isLiked}
            data-active={post.isLiked ? "true" : "false"}
            onClick={handleLikeClick}
            disabled={disabled}
            title={post.isLiked ? "좋아요 취소" : "좋아요"}
          >
            {post.isLiked ? "♥ 좋아요" : "♡ 좋아요"}
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            aria-label="리트윗 토글"
            aria-pressed={post.isRetweeted}
            data-active={post.isRetweeted ? "true" : "false"}
            onClick={handleRetweetClick}
            disabled={disabled}
            title={post.isRetweeted ? "리트윗 취소" : "리트윗"}
          >
            {post.isRetweeted ? "⤴ 리트윗됨" : "⤴ 리트윗"}
          </button>
        </div>
      </footer>
    </article>
  );
}

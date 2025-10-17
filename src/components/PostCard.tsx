import type { Post } from "../types";
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
  const { author } = post;
  const gridClass =
    post.images.length >= 2 ? styles.imagesGridTwo : styles.imagesGridOne;

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

      <p className={styles.content}>{post.content}</p>

      {post.images.length > 0 && (
        <div
          className={`${styles.imagesGrid} ${gridClass}`}
          aria-label="첨부 이미지"
        >
          {post.images.slice(0, 4).map((src, i) => (
            <img
              key={i}
              className={styles.image}
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ))}
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
            onClick={() => onToggleLike?.(post.id)}
            disabled={disabled}
          >
            ♥ 좋아요
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            aria-label="리트윗 토글"
            onClick={() => onToggleRetweet?.(post.id)}
            disabled={disabled}
          >
            ⤴ 리트윗
          </button>
        </div>
      </footer>
    </article>
  );
}

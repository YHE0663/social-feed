import s from "./Skeleton.module.css";

export default function PostCardSkeleton() {
  return (
    <article className={s.card} aria-hidden="true">
      <div className={s.header}>
        <div className={`${s.skeleton} ${s.circle}`} />
        <div className={s.headerText}>
          <div className={`${s.skeleton} ${s.line} ${s.lineSm}`} />
          <div className={`${s.skeleton} ${s.line} ${s.lineXs}`} />
        </div>
      </div>

      <div className={`${s.skeleton} ${s.block}`} />
      <div className={`${s.skeleton} ${s.blockSmall}`} />

      <div className={s.footer}>
        <div className={`${s.skeleton} ${s.pill}`} />
        <div className={`${s.skeleton} ${s.pill}`} />
        <div className={`${s.skeleton} ${s.pill}`} />
      </div>
    </article>
  );
}

import { memo } from "react";
import styles from "./FilterBar.module.css";
import { mockCategories } from "../mock/mockCategories";

export type CategoryValue = number | "all";

type Props = {
  categoryId: CategoryValue;
  onChangeCategory: (v: CategoryValue) => void;
  sortOrder: "desc" | "asc";
  onChangeSortOrder: (v: "desc" | "asc") => void;
};

function FilterBar({
  categoryId,
  onChangeCategory,
  sortOrder,
  onChangeSortOrder,
}: Props) {
  return (
    <div className={styles.wrap} role="group" aria-label="피드 필터">
      {/* 카테고리 필터 */}
      <label className={styles.label}>
        카테고리
        <select
          className={styles.select}
          value={String(categoryId)}
          onChange={(e) => {
            const v = e.target.value;
            onChangeCategory(v === "all" ? "all" : Number(v));
          }}
        >
          <option value="all">전체</option>
          {mockCategories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      {/* 등록시간 정렬 */}
      <label className={styles.label}>
        정렬(등록시간)
        <select
          className={styles.select}
          value={sortOrder}
          onChange={(e) => onChangeSortOrder(e.target.value as "desc" | "asc")}
        >
          <option value="desc">최신순</option>
          <option value="asc">오래된순</option>
        </select>
      </label>
    </div>
  );
}

export default memo(FilterBar);

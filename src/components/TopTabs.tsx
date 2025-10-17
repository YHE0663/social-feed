import { NavLink } from "react-router-dom";
import styles from "./TopTabs.module.css";

export default function TopTabs() {
  return (
    <nav className={styles.wrap} aria-label="메인 탭">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${styles.tab} ${isActive ? styles.active : ""}`
        }
      >
        피드
      </NavLink>

      <NavLink
        to="/create"
        className={({ isActive }) =>
          `${styles.tab} ${isActive ? styles.active : ""}`
        }
      >
        작성하기
      </NavLink>
    </nav>
  );
}

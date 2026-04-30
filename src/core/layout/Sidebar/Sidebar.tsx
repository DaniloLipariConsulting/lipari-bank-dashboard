import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          
          <li className={styles.navItem}>
            <a href="#" className={`${styles.navLink} ${styles.active}`}>
              Dashboard
            </a>
          </li>

          <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>
              Conti
            </a>
          </li>

          <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>
              Investimenti
            </a>
          </li>

          <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>
              Polizze
            </a>
          </li>

          <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>
              Admin
            </a>
          </li>

        </ul>
      </nav>
    </aside>
  );
}
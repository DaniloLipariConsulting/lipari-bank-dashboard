import styles from "./Header.module.css";
import NotificationBell from "../NotificationBell";

export default function Header() {
  return (
    <header className={styles.header}>
      
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🏦</span>
        <span className={styles.logoText}>LipariBank</span>
      </div>

      <div className={styles.actions}>
        
        <button className={styles.bellButton}>
          <NotificationBell
            userId={"1"}
          />
        </button>

        <div className={styles.userInfo}>
          <span className={styles.greeting}>Ciao,</span>
          <span className={styles.userName}>Mario</span>
        </div>

      </div>

    </header>
  );
}
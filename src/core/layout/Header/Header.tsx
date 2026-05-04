import styles from "./Header.module.css";
import NotificationBell from "../NotificationBell";
import { useTheme } from "../../../store/auth/theme/ThemeContext";
import { useAuth } from "../../../store/auth/AuthContext";

export default function Header() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className={styles.header}>
      {/* 🔹 THEME */}
      <div className={styles.themeSwitcher}>
        <span className={styles.themeLabel}>{isDark ? "🌙" : "☀️"}</span>

        <button onClick={toggleTheme} className={styles.themeButton}>
          {isDark ? "Light" : "Dark"}
        </button>
      </div>

      {/* 🔹 LOGO */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🏦</span>
        <span className={styles.logoText}>LipariBank</span>
      </div>

      {/* 🔹 AZIONI */}
      <div className={styles.actions}>
        {/* NOTIFICHE */}
        <div className={styles.bellButton}>
          <NotificationBell userId={"1"} />
        </div>

        {/* UTENTE */}
        <div className={styles.userInfo}>
          {isAuthenticated ? (
            <>
              <span className={styles.greeting}>Ciao,</span>
              <span className={styles.userName}>{user?.name}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <span className={styles.greeting}>Accedi</span>
          )}
        </div>
      </div>
    </header>
  );
}

import { useRef } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleResetAndFocus = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div className={styles.searchBar}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Cerca movimenti..."
        className={styles.input}
      />
      <button
        onClick={handleResetAndFocus}
        className={styles.button}
      >
        🔍
      </button>
    </div>
  );
}
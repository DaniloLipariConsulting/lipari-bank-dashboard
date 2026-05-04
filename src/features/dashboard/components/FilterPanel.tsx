import type { Dispatch, ReactNode } from 'react';
import type { FiltersState, FiltersAction } from "../../../types/models";
import styles from "./FilterPanel.module.css";
import { memo } from "react";

type Props = {
  filters: FiltersState;
  dispatch: Dispatch<FiltersAction>;
  searchBar: ReactNode;
};

export default memo(function FilterPanel({ filters, dispatch, searchBar }: Props) {
  return (
    <div className={styles.panel}>
      
      {/* 🔹 FILTRI */}
      <div className={styles.left}>
        <div className={styles.filterGroup}>
          <span className={styles.label}>Tipo</span>
          <select
            className={styles.select}
            value={filters.type}
            onChange={(e) =>
              dispatch({
                type: 'SET_TYPE',
                payload: e.target.value as FiltersState['type'],
              })
            }
          >
            <option value="all">Tutti</option>
            <option value="credit">Entrate</option>
            <option value="debit">Uscite</option>
          </select>
        </div>
      </div>

      {/* 🔹 SEARCH BAR */}
      <div className={styles.right}>
        {searchBar}
      </div>
    </div>
  );
})
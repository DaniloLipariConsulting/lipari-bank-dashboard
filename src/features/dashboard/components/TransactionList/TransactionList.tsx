import { useEffect, useMemo, useReducer, useRef } from 'react';
import type { Movement } from '../../../../types/models';
import FilterPanel from '../FilterPanel';
import TransactionItem from '../TransactionItem';
import styles from './TransactionList.module.css';
import type { FiltersState, FiltersAction } from '../../../../types/models';
import SearchBar from '../SearchBar';


type Props = {
  movements: Movement[];
};

// 3. Definisci lo stato INIZIALE
const initialFilters: FiltersState = {
  searchText: '',
  type: 'all',
  minAmount: null,
  maxAmount: null,
  sortBy: 'date',
  sortOrder: 'desc',
};

// 4. Scrivi il REDUCER — funzione PURA
const filtersReducer = (state: FiltersState, action: FiltersAction): FiltersState => {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchText: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_AMOUNT_RANGE':
      return { ...state, minAmount: action.payload.min, maxAmount: action.payload.max };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder };
    case 'RESET_FILTERS':
      return initialFilters;
    default:
      return state;
  }
};
export default function TransactionList({ movements }: Props) {
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);

  // dispatch è STABILE (garantito da React) — non serve useCallback per passarlo ai figli

  const filteredMovements = useMemo(() => {
    return movements
      .filter((m) => {
        if (filters.type === 'credit') return m.amount > 0;
        if (filters.type === 'debit') return m.amount < 0;
        return true;
      })
      .filter((m) => {
        if (filters.minAmount !== null && Math.abs(m.amount) < filters.minAmount) return false;
        if (filters.maxAmount !== null && Math.abs(m.amount) > filters.maxAmount) return false;
        return true;
      })
      .filter((m) => m.description.toLowerCase().includes(filters.searchText.toLowerCase()))
      .sort((a, b) => {
        if (filters.sortBy === 'date') {
          const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
          return filters.sortOrder === 'asc' ? diff : -diff;
        }

        const diff = a.amount - b.amount;
        return filters.sortOrder === 'asc' ? diff : -diff;
      });
  }, [movements, filters]);

  const totals = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const m of filteredMovements) {
      if (m.amount > 0) totalIncome += m.amount;
      else totalExpense += m.amount;
    }

    return {
      totalIncome,
      totalExpense,
      count: filteredMovements.length,
    };
  }, [filteredMovements]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

   return (
    
    <div className={styles.container}>
      
      {/* 🔹 FILTRI */}
      <FilterPanel
        filters={filters}
        dispatch={dispatch}
        searchBar={<SearchBar />}
      />

      {/* 🔹 LISTA MOVIMENTI */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Movimenti recenti</div>

        <div className={styles.list}>
          {filteredMovements.length === 0 ? (
            <div className={styles.empty}>
              Nessun movimento trovato
            </div>
          ) : (
            filteredMovements.map((movement) => (
              <TransactionItem key={movement.id} movement={movement} />
            ))
          )}
        </div>

        {/* 🔹 TOTALS */}
        <div className={styles.totals}>
          <div className={styles.totalItem}>
            <span>Entrate</span>
            <span className={`${styles.totalValue} ${styles.income}`}>
              € {totals.totalIncome.toFixed(2)}
            </span>
          </div>

          <div className={styles.totalItem}>
            <span>Uscite</span>
            <span className={`${styles.totalValue} ${styles.expense}`}>
              € {totals.totalExpense.toFixed(2)}
            </span>
          </div>

          <div className={styles.totalItem}>
            <span>Movimenti</span>
            <span className={styles.totalValue}>
              {totals.count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

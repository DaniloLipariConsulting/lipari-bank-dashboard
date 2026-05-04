import { useEffect, useMemo, useReducer, useRef } from 'react';
import type { Movement } from '../../../../types/models';

type Props = {
  movements: Movement[];
};

// 1. Definisci lo STATE
interface FiltersState {
  searchText: string;
  type: 'all' | 'credit' | 'debit' | 'pending';
  minAmount: number | null;
  maxAmount: number | null;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

// 2. Definisci le AZIONI come union type discriminata
type FiltersAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_TYPE'; payload: FiltersState['type'] }
  | { type: 'SET_AMOUNT_RANGE'; payload: { min: number | null; max: number | null } }
  | {
      type: 'SET_SORT';
      payload: { sortBy: FiltersState['sortBy']; sortOrder: FiltersState['sortOrder'] };
    }
  | { type: 'RESET_FILTERS' };

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
    movements
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
    let count = movements.length;

    for (const m of movements) {
      if (m.amount > 0) {
        totalIncome += m.amount;
      } else {
        totalExpense += m.amount;
      }
    }

    return {
      totalIncome,
      totalExpense,
      count,
    };
  }, [filteredMovements]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <>
      <FilterPanel filters={filters} dispatch={dispatch} />

      <div>
        <input type="text" ref={inputRef} />
      </div>
      <div>
        {filteredMovements.map((m) => (
          <div key={m.id}>{m.description}</div>
        ))}

        <div>
          <p>Entrate: {totals.totalIncome}</p>
          <p>Uscite: {totals.totalExpense}</p>
          <p>Movimenti: {totals.count}</p>
        </div>
      </div>
    </>
  );
}

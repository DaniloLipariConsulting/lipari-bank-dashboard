// === Entità principali della LipariBank Dashboard ===

export interface Account {
  id: string;
  name: string;
  type: 'PRIVATE' | 'BUSINESS';
  balance: number;
  iban: string;
}

export interface Movement {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  category: string;
}

export interface Investment {
  id: string;
  accountId: string;
  name: string;
  type: 'BOND' | 'ETF' | 'STOCK' | 'FUND';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface FiltersState {
  searchText: string;
  type: 'all' | 'credit' | 'debit' | 'pending';
  minAmount: number | null;
  maxAmount: number | null;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

export type FiltersAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_TYPE'; payload: FiltersState['type'] }
  | { type: 'SET_AMOUNT_RANGE'; payload: { min: number | null; max: number | null } }
  | {
      type: 'SET_SORT';
      payload: { sortBy: FiltersState['sortBy']; sortOrder: FiltersState['sortOrder'] };
    }
  | { type: 'RESET_FILTERS' };

  
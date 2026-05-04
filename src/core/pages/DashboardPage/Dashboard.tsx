import AccountBalanceCard from "../../../features/dashboard/components/AccountBalanceCard";
import styles from "./Dashboard.module.css";
import TransactionList from "../../../features/dashboard/components/TransactionList/TransactionList";
import useApi from "../../api/useApi";
import type { Movement } from "../../../types/models";

type Account = {
  id: string;
  name: string;
  balance: number;
  iban: string;
  type: string;
};

export default function Dashboard() {
  // 🔹 ACCOUNTS
  const {
    data: accounts,
    isLoading: accountsLoading,
    error: accountsError,
    refetch: refetchAccounts,
  } = useApi<Account[]>("/api/accounts");

  // 🔹 MOVEMENTS
  const {
    data: movements,
    isLoading: movementsLoading,
    error: movementsError,
    refetch: refetchMovements,
  } = useApi<Movement[]>("/api/movements");

  return (
    <div className={styles.container}>
      
      {/* ===================== CONTI ===================== */}
      <div className={styles.accountsSection}>
        
        {/* LOADING */}
        {accountsLoading && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i}>Loading...</div>
            ))}
          </>
        )}

        {/* ERROR */}
        {accountsError && (
          <div>
            <p>Errore conti: {accountsError.message}</p>
            <button onClick={refetchAccounts}>Riprova</button>
          </div>
        )}

        {/* EMPTY */}
        {!accountsLoading && !accountsError && accounts && accounts.length === 0 && (
          <p>Nessun conto</p>
        )}

        {/* SUCCESS */}
        {!accountsLoading &&
          !accountsError &&
          accounts &&
          accounts.length > 0 &&
          accounts.map((a) => (
            <AccountBalanceCard key={a.id} account={a} />
          ))}
      </div>

      {/* ===================== MOVIMENTI ===================== */}
      <div>
        
        {/* LOADING */}
        {movementsLoading && <p>Loading movimenti...</p>}

        {/* ERROR */}
        {movementsError && (
          <div>
            <p>Errore movimenti: {movementsError.message}</p>
            <button onClick={refetchMovements}>Riprova</button>
          </div>
        )}

        {/* EMPTY */}
        {!movementsLoading &&
          !movementsError &&
          movements &&
          movements.length === 0 && <p>Nessun movimento</p>}

        {/* SUCCESS */}
        {!movementsLoading &&
          !movementsError &&
          movements &&
          movements.length > 0 && (
            <TransactionList movements={movements} />
          )}
      </div>
    </div>
  );
}
import AccountBalanceCard from "../../../features/dashboard/components/AccountBalanceCard";
import { accounts, movements } from "../../data";
import styles from "./Dashboard.module.css";
import TransactionList from "../../../features/dashboard/components/TransactionList/TransactionList";

export default function Dashboard() {

  return (
    <div className={styles.container}>
      {/* CONTI */}
      <div className={styles.accountsSection}>
        {accounts.map((a) => {
          return <AccountBalanceCard key={a.id} account={a} />;
        })}
      </div>

     

      <div>
        <TransactionList
          movements={movements}
        />
      </div>
    </div>
  );
}

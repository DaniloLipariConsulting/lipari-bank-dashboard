import MovementRow from "../../../features/dashboard/components/MovementRow";
import AccountBalanceCard from "../../../features/dashboard/components/AccountBalanceCard";
import { accounts, movements } from "../../data";
import styles from "./Dashboard.module.css";

export default function Dashboard() {

  return (
    <div className={styles.container}>
      {/* CONTI */}
      <div className={styles.accountsSection}>
        {accounts.map((a) => {
          return <AccountBalanceCard key={a.id} account={a} />;
        })}
      </div>

      {/* MOVIMENTI */}
      <div className={styles.movementsSection}>
        <div className={styles.sectionHeader}>Movimenti recenti</div>

        <div className={styles.movementsList}>
          {movements.map((movement) => (
            <MovementRow key={movement.id} movement={movement} />
          ))}
        </div>
      </div>
    </div>
  );
}

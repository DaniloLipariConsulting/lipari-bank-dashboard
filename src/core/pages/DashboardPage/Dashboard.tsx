import MovementRow from "../../../features/dashboard/components/MovementRow";
import AccountSummaryCard from "../../../features/dashboard/components/AccountSummaryCard";
import { accounts, movements } from "../../data";

export default function Dashboard() {
  return (
    <>
      {accounts.map((account) => (
        <AccountSummaryCard key={account.id} account={account} />
      ))}

      {movements.map((movement) => (
        <MovementRow key={movement.id} movement={movement} />
      ))}
    </>
  );
}

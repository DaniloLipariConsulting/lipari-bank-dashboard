import { useEffect, useState } from 'react';
import type { Account } from '../../../types/models';
import styles from './AccountBalanceCard.module.css';

type Props = {
  account: Account;
};

export default function AccountBalanceCard({ account }: Props) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hiddenIban = account.iban.slice(0, 4) + ' ****** ' + account.iban.slice(-4);

  const [currentBalance, setCurrentBalance] = useState(account.balance);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 21) - 10;
      setCurrentBalance((prev) => prev + randomNumber);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formattedAmount = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(currentBalance);

  function handleRefreshing() {
    setTimeout(() => {
      setIsRefreshing(true);

      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }, 1000);
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.topRow}>
          <span className={styles.accountName}>{account.name}</span>
          <span className={styles.accountType}>{account.type}</span>
        </div>

        <span className={styles.iban}>{hiddenIban}</span>

        <span className={styles.balance}>{formattedAmount}</span>
      </div>
      <div>
        <button className={styles.refreshButton} disabled={isRefreshing} onClick={handleRefreshing}>
          🔄 Aggiorna
        </button>{' '}
      </div>
    </>
  );
}

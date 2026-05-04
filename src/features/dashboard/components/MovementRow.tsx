import { useCallback } from 'react';
import type { Movement } from '../../../types/models';
import styles from './MovementRow.module.css';

type Props = {
  movement: Movement;
};

export default function MovementRow({ movement }: Props) {
  const formattedDate = new Intl.DateTimeFormat('it-IT').format(new Date(movement.date));

  const formattedAmount = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(Math.abs(movement.amount));

  const isPositive = movement.amount > 0;

  const handleRowClick = useCallback((id: string) => {
  console.log(`Movimento selezionato: ${id}`);
}, []);

  return (
    <div onClick={() => handleRowClick(movement.id)} className={styles.row}>
      <div className={styles.left}>
        <span className={styles.description}>{movement.description}</span>
        <span className={styles.category}>{movement.category}</span>
      </div>

      <div className={styles.right}>
        <span className={`${styles.amount} ${isPositive ? styles.positive : styles.negative}`}>
          {isPositive ? `↑ ${formattedAmount}` : `↓ ${formattedAmount}`}
        </span>
        <span className={styles.date}>{formattedDate}</span>
      </div>
    </div>
  );
}

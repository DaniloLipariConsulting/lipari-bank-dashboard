import { useEffect, useState } from "react";
import styles from "./Header/NotificationBell.module.css"

type Notification = {
  id: string;
  message: string;
  read: boolean;
};

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      if (controller.signal.aborted) return;

      setNotifications([
        {
          id: "1",
          message: "Pagamento ricevuto di €250,00",
          read: false,
        },
        {
          id: "2",
          message: "Bonifico inviato con successo",
          read: true,
        },
        {
          id: "3",
          message: "Nuovo accesso da dispositivo sconosciuto",
          read: false,
        },
      ]);
    }, 1000);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [userId]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div className={styles.bellButton}>
        <button
          className={styles.button}
          onClick={(e) => (setIsOpen((prev) => !prev), e.stopPropagation())}
        >
          <span className={styles.bellIcon}>🔔</span>

          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`${styles.notificationItem} ${
                  !n.read ? styles.unread : ""
                }`}
              >
                {n.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./AppShell.module.css";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AppShell = ({ children }: Props) => {
  return (
    <div className={styles.shell}>
      <Header />

      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};

export default AppShell;

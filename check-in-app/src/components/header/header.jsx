import React, { useState } from "react";
import styles from "./header.module.scss";
import namelessLogo from "../../assets/nameless-logo-dark.png";
import { WalletConnector as MuiWalletSelector } from "@aptos-labs/wallet-adapter-mui-design";

const routes = [
  {
    id: "New CheckIn",
    url: "/",
  },
  {
    id: "My CheckIns",
    url: "/my-checkins",
  },
];

const Header = ({ setPage }) => {
  return (
    <div className={styles.parentContainer}>
      <img src={namelessLogo} className={styles.logo} alt="Nameless Logo" />
      <div className={styles.routeContainer}>
        {routes.map((route) => (
          <button
            className={styles.linkButton}
            key={route.id}
            onClick={() => setPage(route.url)}
          >
            {route.id}
          </button>
        ))}
      </div>
      <div className={styles.walletConnectContainer}>
        <MuiWalletSelector />
      </div>
    </div>
  );
};

export default Header;

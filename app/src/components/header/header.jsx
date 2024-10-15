import React, { useState } from "react";
import styles from "./header.module.scss";
import namelessLogo from "../../assets/nameless-logo-dark.png";
import { WalletConnector as MuiWalletSelector } from "@aptos-labs/wallet-adapter-mui-design";

const routes = [
  {
    id: "Create",
    url: "/",
  },
  {
    id: "My Geos",
    url: "/my-geos",
  },
];

const Header = ({ setPage }) => {
  return (
    <div className={styles.parentContainer}>
      <img src={namelessLogo} className={styles.logo} alt="Nameless Logo" />
      <h1>GeoFencing</h1>
      <div className={styles.routeContainer}>
        {routes.map((route) => (
          <button
            className={styles.linkButton}
            onClick={() => setPage(route.url)}
            key={route.id}
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

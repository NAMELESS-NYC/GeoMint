// App.jsx
import React, { useState, useEffect } from "react";
import GeoCard from "../../components/geoCard/geoCard";
import styles from "./myGeos.module.scss";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos } from "../../configs/aptos";
import { getGeoFences } from "../../utils/aptos/geoUtils";

const MyGeos = () => {
  const { wallet, account } = useWallet();
  const [ownedGeos, setOwnedGeos] = useState([]);

  useEffect(() => {
    const getOwnedGeos = async () => {
      /**
       * TODO: Fetch owned geos from Aptos
       */
      if (account) {
        const geoFences = await getGeoFences(account.address);
        console.log(geoFences);
        setOwnedGeos(geoFences);
      } else {
        setOwnedGeos([]);
      }
    };

    getOwnedGeos();
  }, [account]);

  return (
    <div className={styles.parentContainer}>
      <div className={styles.headerContainer}>
        <h1>My Geos</h1>
      </div>
      {ownedGeos && ownedGeos.length > 0 ? (
        <div className={styles.geosContainer}>
          {ownedGeos.map((geo, index) => (
            <GeoCard key={index} geo={geo} className={styles.geoCard} />
          ))}
        </div>
      ) : (
        <div className={styles.noGeosContainer}>
          <h2>No Geos Found</h2>
        </div>
      )}
    </div>
  );
};

export default MyGeos;

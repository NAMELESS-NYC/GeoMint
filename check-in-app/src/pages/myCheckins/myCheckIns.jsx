import React, { useEffect, useState } from "react";
import styles from "./myCheckIns.module.scss";
import { getOwnedCheckins } from "../../utils/aptos/geoUtils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import CheckInCard from "../../components/checkInCard/checkInCard";

const MyCheckIns = () => {
  const [checkIns, setCheckIns] = useState([]);
  const { wallet, account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    // fetch check ins
    const getCheckIns = async () => {
      const checkIns = await getOwnedCheckins(account.address);
      setCheckIns(checkIns);
    };
    getCheckIns();
  }, [account]);
  return (
    <div className={styles.parentContainer}>
      <div className={styles.headerContainer}>
        <h1>My Check Ins</h1>
      </div>
      <div className={styles.checkInsContainer}>
        {checkIns.length === 0 ? (
          <p>No check ins found</p>
        ) : (
          checkIns.map((checkIn) => {
            return (
              <>
                <CheckInCard tokenData={checkIn} />
              </>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyCheckIns;

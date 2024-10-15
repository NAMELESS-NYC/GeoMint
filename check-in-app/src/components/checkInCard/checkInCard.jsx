import React, { useEffect, useState } from "react";
import styles from "./checkInCard.module.scss";
import namelessLogo from "../../assets/nameless-logo-dark.png";

const CheckInCard = ({ tokenData }) => {
  const [metadata, setMetadata] = useState(null);
  const [geoData, setGeoData] = useState(null);
  console.log(tokenData);

  useEffect(() => {
    const getMetadata = async () => {
      // fetch metadata
      try {
        if (tokenData.current_token_data?.token_uri) {
          const metadata = await fetch(tokenData.current_token_data?.token_uri).then((response) => response.json());
          setMetadata(metadata);
        }
      }
      catch (err) {
        console.log(err);
      }
    };
    getMetadata();
  }, []);

  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  return (
    <>
      {tokenData && (
        <div className={styles.parentContainer}>
          <div className={styles.checkInContainer}>
            <div className={styles.imageContainer}>
              <img src={metadata?.image ? metadata.image : namelessLogo} alt="checkin-image" />
            </div>
            <div className={styles.checkinInfoContainer}>
              <h3>{tokenData.current_token_data?.current_collection?.collection_name}</h3>
              <p>{tokenData.current_token_data?.current_collection?.collection_description}</p>
              <p>Received: {formatDate(tokenData.last_transaction_timestamp)}</p>
            </div>
          </div>
        </div>)}
    </>
  );
};

export default CheckInCard;

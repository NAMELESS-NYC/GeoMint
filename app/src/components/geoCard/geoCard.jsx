import React, { useEffect, useState } from "react";
import styles from "./geoCard.module.scss";
import MapPicker from "../mapPicker/mapPicker";
import { getGeoCheckins } from "../../utils/aptos/geoUtils";

const GeoCard = ({ geo }) => {
  const [checkIns, setCheckIns] = useState(0);

  useEffect(() => {
    const fetchCheckins = async () => {
      const mints = await getGeoCheckins(geo.address);
      setCheckIns(mints);
    };
    fetchCheckins();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(geo.address)
      .then(() => {
        alert("Address copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <>
      {geo && (
        <div className={styles.parentContainer}>
          <div className={styles.geoContainer}>
            <div className={styles.geoInfoContainer}>
              <h3>{geo.name}</h3>
              <div className={styles.addressContainer}>
                <input type="text" value={geo.address} readOnly />
                <button onClick={copyToClipboard}>Copy</button>{" "}
              </div>
              {geo.startDate && (
                <p>
                  {geo.startDate.toLocaleDateString()} -
                  {geo.endDate.toLocaleDateString()}
                </p>
              )}
              <p>Radius: {geo.radius} Miles</p>
              <p>
                Coordinates: ({geo.latitude}, {geo.longitude})
              </p>
            </div>
            <div className={styles.checkinsContainer}>
              <h4>Check Ins</h4>
              <p>{checkIns}</p>
            </div>
          </div>
          <div className={styles.mapContainer}>
            <div className={styles.mapPicker}>
              <MapPicker
                coordinates={{
                  lat: geo.latitude,
                  lng: geo.longitude,
                }}
                radius={geo.radius}
                viewOnly={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeoCard;

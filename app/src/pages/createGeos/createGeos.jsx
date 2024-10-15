import React, { useState } from "react";
import MapPicker from "../../components/mapPicker/mapPicker";
import GeoSelectorForm from "../../components/geoSelectorForm/geoSelectorForm";
import styles from "./createGeos.module.scss";

const CreateGeos = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState(null);

  const handleCoordinateSelect = (coordinates) => {
    setSelectedCoordinates(coordinates);
  };

  const handleRadiusSelect = (radius) => {
    setSelectedRadius(radius);
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.headerContainer}>
        <h1>Create Geos</h1>
        <p>
          Select a point on the map, a radius and a start and end date to allow
          users to check in!
        </p>
      </div>
      <div className={styles.mapContainer}>
        <div className={styles.mapPicker}>
          <MapPicker
            onCoordinateSelect={handleCoordinateSelect}
            radius={selectedRadius}
            coordinates={selectedCoordinates}
          />
        </div>
      </div>
      <div className={styles.formContainer}>
        <GeoSelectorForm
          coordinates={selectedCoordinates}
          setSelectedRadius={handleRadiusSelect}
          editMode={false}
        />
      </div>
    </div>
  );
};

export default CreateGeos;

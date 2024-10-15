import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
  Circle,
} from "@react-google-maps/api";
import styles from "./mapPicker.module.scss";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 51.505,
  lng: -0.09,
};

const MapPicker = ({ onCoordinateSelect, coordinates, radius, viewOnly }) => {
  const [selectedPosition, setSelectedPosition] = useState(coordinates || null);
  const [center, setCenter] = useState(coordinates || defaultCenter);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"], // Add the places library
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        console.log("Fetching location...");
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setCenter({ lat: data.latitude, lng: data.longitude });
        setSelectedPosition({ lat: data.latitude, lng: data.longitude });
        onCoordinateSelect({ lat: data.latitude, lng: data.longitude });
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };
    if (!coordinates) {
      fetchLocation();
    } else {
      console.log("Coordinates already set:", coordinates);
      setCenter(coordinates);
      setSelectedPosition(coordinates);
      if (onCoordinateSelect) {
        onCoordinateSelect(coordinates);
      }
    }
  }, []);

  const handleMapClick = useCallback((event) => {
    if (viewOnly) {
      return;
    }
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedPosition({ lat, lng });
    if (onCoordinateSelect) {
      onCoordinateSelect({ lat, lng });
    }
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCenter({ lat, lng });
      setSelectedPosition({ lat, lng });
      if (onCoordinateSelect) {
        onCoordinateSelect({ lat, lng });
      }
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Convert radius from miles to meters
  const radiusInMeters = radius * 1609.34;

  return (
    <div className={styles.parentContainer}>
      {!viewOnly && (
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for a place"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              margin: "10px",
            }}
          />
        </Autocomplete>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        {selectedPosition && (
          <>
            <Marker position={selectedPosition} />
            <Circle
              center={selectedPosition}
              radius={radiusInMeters}
              options={{
                fillColor: "rgba(173, 216, 230, 0.75)",
                strokeColor: "rgba(0, 0, 255, 0.5)",
                strokeWeight: 2,
              }}
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapPicker;

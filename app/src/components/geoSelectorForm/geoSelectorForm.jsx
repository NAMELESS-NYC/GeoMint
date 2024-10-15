import React, { useState } from "react";
import styles from "./geoSelectorForm.module.scss";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos } from "../../configs/aptos";
import { toast } from "react-toastify";

const GeoSelectorForm = ({
  coordinates,
  prefillData,
  setSelectedRadius,
  editMode,
}) => {
  const [startDate, setStartDate] = useState(prefillData?.startDate || null);
  const [endDate, setEndDate] = useState(prefillData?.endDate || null);
  const [radius, setRadius] = useState(prefillData?.radius || null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [name, setName] = useState(prefillData?.name || null);
  const [tokenURI, setTokenURI] = useState(prefillData?.tokenUri || null);

  const [unit, setUnit] = useState("miles");

  const [error, setError] = useState("");

  const { account, wallet, signAndSubmitTransaction } = useWallet();

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Submitting form...");
    const radiusInMiles = unit === "yards" ? radius / 1760 : radius;
    console.log({
      startDate,
      endDate,
      radiusInMiles,
      latitude,
      longitude,
    });
    if (editMode) {
      console.log("Edit Mode");
    } else {
      console.log("Create Mode");
      const success = await createGeo();
      if (success) {
        toast.success("Geo created successfully!");
      } else {
        toast.error("Failed to create Geo.");
      }
    }
  };

  const createGeo = async () => {
    //format data properly
    const startDateFormatted = Math.floor(new Date(startDate).getTime() / 1000); // Convert to u64 seconds
    const endDateFormatted = Math.floor(new Date(endDate).getTime() / 1000); // Convert to u64 seconds

    //radius in miles
    const selectedRadius = unit === "yards" ? radius / 1760 : radius;
    const radiusFormatted = Math.round(selectedRadius * 10 ** 8); //set radius decimals

    //Lat and Long will always be rounded to 6 decimals and added to contract. When handling, use 6 decimals
    const latFormatted = Math.abs(Math.round(coordinates.lat * 10 ** 6)); //set radius decimals
    const longFormatted = Math.abs(Math.round(coordinates.lng * 10 ** 6));
    const latNegative = coordinates.lat < 0;
    const longNegative = coordinates.lng < 0;

    if (latFormatted < 0) {
    }

    console.log({ latFormatted, longFormatted });
    console.log(process.env.REACT_APP_GEO_CONTRACT_ADDRESS);
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${process.env.REACT_APP_GEO_CONTRACT_ADDRESS}::on_chain_geo_v1::create_geofence`,
        functionArguments: [
          name,
          startDateFormatted,
          endDateFormatted,
          longFormatted,
          longNegative,
          latFormatted,
          latNegative,
          radiusFormatted,
          tokenURI,
        ],
      },
    });
    try {
      await aptos.waitForTransaction({ transactionHash: response.hash });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (newStartDate >= endDate) {
      setError("End date must be greater than start date.");
    } else {
      setError("");
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (newEndDate <= startDate) {
      setError("End date must be greater than start date.");
    } else {
      setError("");
    }
  };

  const handleRadiusChange = (value) => {
    const radiusInMiles = unit === "yards" ? value / 1760 : value;
    setRadius(value);
    setSelectedRadius(radiusInMiles);
  };

  const handleUnitChange = (value) => {
    const radiusInMiles = value === "yards" ? radius / 1760 : radius;
    setUnit(value);
    setSelectedRadius(radiusInMiles);
  };

  const convertToDateTimeLocalString = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.parentContainer}>
        {coordinates && (
          <div className={styles.coordinatesContainer}>
            <label>
              Latitude:
              <input
                value={coordinates.lat.toFixed(6)}
                contentEditable="false"
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </label>
            <label>
              Longitude:
              <input
                value={coordinates.lng.toFixed(6)}
                contentEditable="false"
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </label>
          </div>
        )}
        <label>
          Start Date:
          <input
            type="datetime-local"
            value={convertToDateTimeLocalString(startDate)}
            onChange={handleStartDateChange}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="datetime-local"
            value={convertToDateTimeLocalString(endDate)}
            onChange={handleEndDateChange}
            required
          />
        </label>
        <label>
          Radius:
          <input
            type="number"
            value={radius}
            onChange={(e) => handleRadiusChange(e.target.value)}
            required
          />
          <select
            value={unit}
            onChange={(e) => handleUnitChange(e.target.value)}
            required
          >
            <option value="miles">Miles</option>
            <option value="yards">Yards</option>
          </select>
        </label>
        <label>
          Name:
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Token URI:
          <input
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={!!error}>
          Submit
        </button>
        <p className={styles.errorText}>{error}</p>
      </div>
    </form>
  );
};

export default GeoSelectorForm;

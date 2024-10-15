import React, { useEffect, useState } from "react";
import styles from "./checkIn.module.scss";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from "@react-google-maps/api";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getGeoFence } from "../../utils/aptos/geoUtils";
import { getDistance } from "geolib"; // Import the getDistance function from geolib
import { toast } from "react-toastify";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Define custom marker icons
const customIcon1 = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
const customIcon2 = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";

const CheckIn = () => {
  const { wallet, account, signAndSubmitTransaction } = useWallet();

  // location of user
  const [myLocation, setMyLocation] = useState(null);

  // location of geo fence
  const [geoLocation, setGeoLocation] = useState(null);

  //radius of geo fence
  const [radius, setRadius] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkInAddress, setCheckInAddress] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const sendCheckInTransaction = async (
    geo_address,
    lat,
    lng,
    user_address
  ) => {
    try {
      const req_data = {
        geo_address: geo_address,
        lat: Math.abs(Math.round(lat * 10 ** 6)),
        lat_is_neg: lat < 0,
        lng: Math.abs(Math.round(lng * 10 ** 6)),
        lng_is_neg: lng < 0,
        user_address: user_address,
      };
      console.log(req_data);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/verify-location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req_data),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCheckLocation = async (e) => {
    e.preventDefault();
    //Get user's current location
    console.log("account", account);
    if (!account) {
      toast.error("Please connect your wallet to check in");
      return;
    }

    if (navigator.geolocation) {
      setLoading(true);
      try {
        const my_coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              resolve(coords);
            },
            (error) => {
              reject(new Error("Unable to retrieve your location"));
            }
          );
        });

        console.log("coordinates", my_coords);
        setMyLocation(my_coords);
        setError("");

        //Get geo fence location
        const geo = await getGeoFence(checkInAddress);
        console.log("geo", geo);
        console.log("my_coords", my_coords);

        if (geo && my_coords) {
          const geo_coords = { lat: geo.latitude, lng: geo.longitude };
          console.log("geo_coords", geo_coords);
          setGeoLocation(geo_coords);
          const geo_radius = geo.radius * 1609.34;
          console.log("geo_radius", geo_radius);
          setRadius(geo_radius); // Convert miles to meters
          const distance = getDistance(my_coords, geo_coords);
          console.log("distance", distance);
          if (distance <= geo_radius) {
            toast.success("Check In Successful");
            await sendCheckInTransaction(
              checkInAddress,
              my_coords.lng,
              my_coords.lat,
              account.address
            );
          } else {
            toast.error("You are not within the check in radius");
          }
        } else {
          toast.error("Invalid Check In Address");
        }
      } catch (error) {
        toast.error("Error checking in");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Geolocation is not supported by this browser");
      toast.error("Geolocation is not supported by this browser");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.parentContainer}>
      <div className={styles.headerContainer}>
        <p className={styles.instructionsText}>
          Enter the unique Check In address and Click on Check In below to see a
          list of available check in rewards for your current location!
        </p>
      </div>
      <form onSubmit={handleCheckLocation} className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter Check In Address"
            value={checkInAddress}
            onChange={(e) => setCheckInAddress(e.target.value)}
            style={{
              width:
                "100%" /* Make the input take the full width of its container */,
              height: "50px" /* Increase the height */,
              padding: "10px" /* Add padding for better spacing */,
              fontSize: "16px" /* Increase the font size */,
              boxSizing:
                "border-box" /* Ensure padding and border are included in the width and height */,
            }}
            required
          />
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.checkInButton} type="submit">
            CHECK IN
          </button>
        </div>
      </form>
      {loading && <p>Loading...</p>}
      {myLocation && (
        <div className={styles.myLocationContainer}>
          <h3>Your Location</h3>
          <div className={styles.mapContainer}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={myLocation}
              zoom={10}
            >
              {myLocation && (
                <>
                  <Marker position={myLocation} icon={customIcon1} />
                </>
              )}
              {geoLocation && (
                <>
                  <Marker position={geoLocation} icon={customIcon2} />
                  <Circle
                    center={{
                      lat: geoLocation.lat,
                      lng: geoLocation.lng,
                    }}
                    radius={radius} // Radius in meters
                    options={{
                      fillColor: "rgba(0, 0, 255, 0.8)",
                      strokeColor: "rgba(0, 0, 255, 0.5)",
                      strokeWeight: 2,
                    }}
                  />
                </>
              )}
            </GoogleMap>
          </div>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default CheckIn;

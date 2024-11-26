import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../css/Location.css";
import axios from "../../utils/endpoints";
import { useAuth } from "../../context/auth";

// Custom Marker Icon
const icon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path fill="red" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 10 12.5 28.5 12.5 28.5s12.5-18.5 12.5-28.5C25 5.6 19.4 0 12.5 0zm0 19.7a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4z"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function Location({ currentEmployee }) {
  const mapRef = useRef();
  const [position, setPosition] = useState([18.516726, 73.856255]);
  const [locations, setLocations] = useState([]);
  const [addresses, setAddresses] = useState({});
  const { token } = useAuth();

  const OPEN_CAGE_API_KEY = "0b09688065144a5eafb37acd5081acfa";

  // Fetch current geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
          }
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch employee location data
  const getCurrentLocation = async () => {
    try {
      const response = await axios.get(
        `/userlocation/location/${currentEmployee.employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Locations fetched successfully:", response.data);
      setLocations(response.data.data);

      // Fetch addresses for each location
      response.data.data.forEach((location) =>
        fetchAddress(location._id, location.latitude, location.longitude)
      );
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // Fetch address for latitude and longitude using OpenCage
  const fetchAddress = async (id, lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPEN_CAGE_API_KEY}`
      );
      const address = response.data.results[0]?.formatted || "Address not found";
      setAddresses((prev) => ({ ...prev, [id]: address }));
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getCurrentLocation();
    } else {
      console.log("No token found in state");
    }
  }, [token]);

  return (
    <div className="map-container">
      <MapContainer
        center={position}
        zoom={13}
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location._id}
            position={[location.latitude, location.longitude]}
            icon={icon}
          >
            <Popup>
              <div>
                <p>
                  <strong>Address:</strong>{" "}
                  {addresses[location._id] || "Fetching address..."}
                </p>
                <p>
                  <strong>Coordinates:</strong> {location.latitude},{" "}
                  {location.longitude}
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {new Date(location.updatedAt).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Location;

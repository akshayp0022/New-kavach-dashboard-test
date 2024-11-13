import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../css/Location.css";
import axios from "../../src/utils/endpoints";
import { useAuth } from "../../src/context/auth";

// Define a custom icon for markers
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

function AllUserLocation() {
  const mapRef = useRef();
  const [locations, setLocations] = useState([]);  
  const { token } = useAuth();  

  const getAllUserLocations = async () => {
    try {
      const response = await axios.get("/userlocation/locations", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      console.log(response.data.data);  
      setLocations(response.data.data);  
    } catch (error) {
      console.error("Error fetching locations:", error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getAllUserLocations();  
    }
  }, [token]);

  return (
    <div className="map-container" style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[18.516726, 73.856255]} 
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
        {/* markers for all users' locations */}
        {locations.map((location) => (
          <Marker
            key={location._id}
            position={[location.latitude, location.longitude]}
            icon={icon}
          >
            <Popup>
              <div>
                <strong>Location at:</strong> {location.latitude}, {location.longitude}
                <br />
                <strong>Timestamp:</strong> {new Date(location.createdAt).toLocaleString()}
                <br />
                <strong>Employee:</strong> {location.employeeId?.name || "N/A"}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default AllUserLocation;

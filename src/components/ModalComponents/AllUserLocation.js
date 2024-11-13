import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from '../../utils/endpoints';
import L from 'leaflet';
import { useAuth } from '../../context/auth';

// Define a custom icon for the markers
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const AllUserLocations = () => {
  const [userLocations, setUserLocations] = useState([]);
  const { token } = useAuth();
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/userlocation/locations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserLocations(response.data.data);
      } catch (error) {
        console.error("Error fetching user locations:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <MapContainer center={[18.5204, 73.8567]} zoom={13} style={{ height: '90vh', width: '80%', margin: '0 auto' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {userLocations.map((location) => (
        <Marker
          key={location._id}
          position={[location.latitude, location.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div>
              <h4>{location.employeeId.name}</h4>
              <p>{location.employeeId.email}</p>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
              <p>Updated at: {new Date(location.updatedAt).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AllUserLocations;

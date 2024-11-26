import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from '../utils/endpoints';
import L from 'leaflet';
import { useAuth } from '../context/auth';
import { toast } from 'react-toastify';

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
  const [addresses, setAddresses] = useState({});
  const { token } = useAuth();

  // OpenCage API Key
  const OPEN_CAGE_API_KEY = '0b09688065144a5eafb37acd5081acfa';

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/userlocation/locations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserLocations(response.data.data);

        // Fetch addresses for each location
        response.data.data.forEach((location) => fetchAddress(location._id, location.latitude, location.longitude));
        toast.success("User Locations fetched successfully");
      } catch (error) {
        console.error("Error fetching user locations:", error);
        toast.error("Error fetching user locations");
      }
    };

    const fetchAddress = async (id, lat, lng) => {
      try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPEN_CAGE_API_KEY}`);
        const address = response.data.results[0]?.formatted || 'Address not found';
        setAddresses((prevAddresses) => ({ ...prevAddresses, [id]: address }));
        
      } catch (error) {
        console.error("Error fetching address:", error);
        toast.error("Error fetching address");
      }
    };

    fetchLocations();
  }, []);

  return (
    <MapContainer center={[18.5204, 73.8567]} zoom={13} style={{ height: '85vh', width: '90%', margin: '0 auto', marginTop: '75px' }}>
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
              <p>Address: {addresses[location._id] || 'Fetching address...'}</p>
              <p>Updated at: {new Date(location.updatedAt).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AllUserLocations;

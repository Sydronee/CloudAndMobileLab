import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Geolocation } from '@capacitor/geolocation';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Fix for default Leaflet markers in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function UpdateMapCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

function App() {
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('My Location');
  const [position, setPosition] = useState([51.505, -0.09]); // Default London
  const [loading, setLoading] = useState(false);

  // Address -> Lat/Lng
  const geocodeAddress = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat: gLat, lon: gLng } = data[0];
        setLat(gLat);
        setLng(gLng);
        setPosition([parseFloat(gLat), parseFloat(gLng)]);
        setName(address);
      } else {
        alert('Address not found. Please try another.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      alert('Network error. See console.');
    }
    setLoading(false);
  };

  // Lat/Lng -> Address
  const reverseGeocode = async () => {
    if (!lat || !lng) return;
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
        setPosition([parseFloat(lat), parseFloat(lng)]);
        setName('Reverse Geocoded Location');
      } else {
        alert('Location not found.');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
    setLoading(false);
  };

  // Get User's Current Location via Capacitor
  const findMyLocation = async () => {
    setLoading(true);
    try {
      // Prompt for permissions
      await Geolocation.requestPermissions();
      
      const coordinates = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = coordinates.coords;
      
      setLat(latitude);
      setLng(longitude);
      setPosition([latitude, longitude]);
      setName('My Current Location');
      
      // Auto-reverse geocode current location
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('Address could not be determined');
      }
      
    } catch (error) {
      console.error('Error fetching current location', error);
      alert('Could not fetch location. Permissions may be denied. Please check device settings.');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Address & Location Finder</h1>
      
      <div className="controls">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Enter Address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
          />
          <button onClick={geocodeAddress} disabled={loading}>Find Address</button>
        </div>

        <div className="input-group">
          <input 
            type="number" 
            placeholder="Latitude" 
            value={lat} 
            onChange={(e) => setLat(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="Longitude" 
            value={lng} 
            onChange={(e) => setLng(e.target.value)} 
          />
          <button onClick={reverseGeocode} disabled={loading}>Find Coordinates</button>
        </div>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Your Name (for pin)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <button className="btn-location" onClick={findMyLocation} disabled={loading}>
            📍 Mark My Current Location
          </button>
        </div>
      </div>

      <div className="map-container">
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <UpdateMapCenter position={position} />
          {position && (
            <Marker position={position}>
              <Popup>{name || 'Selected Location'}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;

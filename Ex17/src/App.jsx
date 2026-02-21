import { useState, useEffect } from 'react'
import { Geolocation } from '@capacitor/geolocation'
import DistanceMap from './components/DistanceMap'
import { calculateAllMetrics } from './utils/distanceCalculator'
import './App.css'

function App() {
  const [markers, setMarkers] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [error, setError] = useState(null)

  // Handle map clicks to add markers
  const handleMapClick = (latlng) => {
    if (markers.length < 2) {
      const newMarker = { lat: latlng.lat, lon: latlng.lng }
      const newMarkers = [...markers, newMarker]
      setMarkers(newMarkers)

      // Calculate metrics if we have 2 markers
      if (newMarkers.length === 2) {
        const calculatedMetrics = calculateAllMetrics(newMarkers[0], newMarkers[1])
        setMetrics(calculatedMetrics)
      }
    }
  }

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setError(null)
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      })
      const location = {
        lat: coordinates.coords.latitude,
        lon: coordinates.coords.longitude,
      }
      setCurrentLocation(location)
      
      // If we have less than 2 markers, add current location as a marker
      if (markers.length < 2) {
        const newMarkers = [...markers, location]
        setMarkers(newMarkers)
        
        if (newMarkers.length === 2) {
          const calculatedMetrics = calculateAllMetrics(newMarkers[0], newMarkers[1])
          setMetrics(calculatedMetrics)
        }
      }
    } catch (err) {
      setError(`Unable to get location: ${err.message}`)
      console.error('Error getting location:', err)
    }
  }

  // Clear all markers
  const clearMarkers = () => {
    setMarkers([])
    setMetrics(null)
    setError(null)
  }

  // Request location permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      try {
        await Geolocation.requestPermissions()
      } catch (err) {
        console.error('Error requesting permissions:', err)
      }
    }
    requestPermission()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>📍 Distance Calculator</h1>
        <p className="subtitle">Calculate distances between two locations</p>
      </header>

      <main className="app-main">
        <div className="instructions">
          <h3>How to use:</h3>
          <ol>
            <li>Click on the map to mark your first location (green marker)</li>
            <li>Click again to mark your second location (red marker)</li>
            <li>View the calculated distances and travel time below</li>
            <li>Use "My Location" button to use your current GPS location</li>
          </ol>
        </div>

        <div className="map-container">
          <DistanceMap markers={markers} onMapClick={handleMapClick} />
        </div>

        <div className="controls">
          <button 
            className="btn btn-primary" 
            onClick={getCurrentLocation}
            disabled={markers.length >= 2}
          >
            📱 Use My Location
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={clearMarkers}
            disabled={markers.length === 0}
          >
            🗑️ Clear Markers
          </button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {markers.length > 0 && (
          <div className="markers-info">
            <h3>Marked Locations:</h3>
            <div className="marker-list">
              {markers.map((marker, index) => (
                <div key={index} className="marker-item">
                  <span className={`marker-badge ${index === 0 ? 'start' : 'end'}`}>
                    {index === 0 ? 'Start' : 'End'}
                  </span>
                  <span className="coordinates">
                    {marker.lat.toFixed(6)}, {marker.lon.toFixed(6)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {metrics && (
          <div className="results">
            <h3>📊 Distance Metrics:</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">📏</div>
                <div className="metric-label">Straight Line Distance</div>
                <div className="metric-value">{metrics.formattedStraightDistance}</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🚴</div>
                <div className="metric-label">Bike Travel Distance</div>
                <div className="metric-value">{metrics.formattedBikeDistance}</div>
                <div className="metric-note">
                  (Estimated with road factor)
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⏱️</div>
                <div className="metric-label">Estimated Bike Time</div>
                <div className="metric-value">{metrics.formattedBikeTime}</div>
                <div className="metric-note">
                  (Average speed: 15 km/h)
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

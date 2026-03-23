import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [currentPos, setCurrentPos] = useState(null)
  const [targetPos, setTargetPos] = useState(null)
  const [distance, setDistance] = useState(0)
  const [error, setError] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simPos, setSimPos] = useState({ x: 0, y: 0 }) // Offset from center in pixels
  
  // Audio context ref
  const audioContextRef = useRef(null);
  const alarmIntervalRef = useRef(null);
  const simContainerRef = useRef(null);

  // Constants for simulation
  // 1px = 0.2 meters. 10m = 50px radius.
  const PX_TO_METERS = 0.2;
  const BOX_SIZE = 300;
  const CENTER = BOX_SIZE / 2;

  useEffect(() => {
    // Only run real GPS if NOT simulating
    if (isSimulating) {
        return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPos({ lat: latitude, lng: longitude });
        setError(null);
      },
      (err) => {
        setError(`Error: ${err.message}`);
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isSimulating]);

  useEffect(() => {
    if (isSimulating) {
        // Calculate distance based on simulation offset
        const pxDistance = Math.sqrt(simPos.x**2 + simPos.y**2);
        const meters = pxDistance * PX_TO_METERS;
        setDistance(meters);
        
        // Check alarm for simulation immediately
        if (meters > 10) {
            startAlarm();
        } else {
            stopAlarm();
        }
    } else {
        if (targetPos && currentPos) {
          const d = calculateDistance(
            targetPos.lat, targetPos.lng,
            currentPos.lat, currentPos.lng
          );
          setDistance(d);
          
          if (d > 10) {
              startAlarm();
          } else {
              stopAlarm();
          }
        }
    }
  }, [currentPos, targetPos, isSimulating, simPos]);


  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  const setTarget = () => {
    if (currentPos) {
      setTargetPos(currentPos);
      initAudio();
    }
  }
  
  const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
  }
  
  const clearTarget = () => {
      setTargetPos(null);
      setDistance(0);
      stopAlarm();
  }

  const startAlarm = () => {
      // Ensure specific alarm logic runs
      if (alarmIntervalRef.current) return;
      
      const beep = () => {
          if (!audioContextRef.current) return;
          const oscillator = audioContextRef.current.createOscillator();
          const gainNode = audioContextRef.current.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
          
          oscillator.type = 'square';
          oscillator.frequency.value = 880; 
          gainNode.gain.value = 0.1;
          
          oscillator.start();
          setTimeout(() => oscillator.stop(), 200);
      };

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
      }

      beep();
      alarmIntervalRef.current = setInterval(beep, 1000);
  }

  const stopAlarm = () => {
      if (alarmIntervalRef.current) {
          clearInterval(alarmIntervalRef.current);
          alarmIntervalRef.current = null;
      }
  }

  const handleSimClick = (e) => {
      if (!simContainerRef.current) return;
      const rect = simContainerRef.current.getBoundingClientRect();
      // Calculate x,y relative to center
      const x = e.clientX - rect.left - CENTER;
      const y = e.clientY - rect.top - CENTER;
      setSimPos({ x, y });
      initAudio();
  }

  // Determine alarming state specifically for UI styling
  const isAlarming = (isSimulating || targetPos) && distance > 10;

  return (
    <div className={`App ${isAlarming ? 'alarm-active' : ''}`}>
      <h1>Proximity Alerter</h1>
      
      {error && !isSimulating && <div className="error">{error}</div>}

      <div className="card">
        <div className="mode-toggle">
            <label>
                <input 
                    type="checkbox" 
                    checked={isSimulating} 
                    onChange={(e) => {
                        setIsSimulating(e.target.checked);
                        stopAlarm();
                        setDistance(0);
                        setSimPos({x:0, y:0});
                    }} 
                />
                Enable Simulation Mode
            </label>
        </div>

        {isSimulating ? (
            <div className="simulation-ui">
                <p>Click inside the box to move the red dot.</p>
                <div 
                    className="sim-container" 
                    ref={simContainerRef} 
                    onClick={handleSimClick}
                >
                    <div 
                        className="sim-zone" 
                        style={{ 
                            width: `${(10/PX_TO_METERS) * 2}px`, 
                            height: `${(10/PX_TO_METERS) * 2}px` 
                        }}
                    ></div>
                    
                    <div className="sim-target-point"></div>

                    <div 
                        className="sim-user-point"
                        style={{
                            left: `${CENTER + simPos.x}px`,
                            top: `${CENTER + simPos.y}px`
                        }}
                    ></div>
                </div>
            </div>
        ) : (
            <>
                <div className="info-grid">
                    <div className="info-item">
                        <h3>Current Location</h3>
                        {currentPos ? (
                            <p>{currentPos.lat.toFixed(6)}, {currentPos.lng.toFixed(6)}</p>
                        ) : (
                            <p>Locating...</p>
                        )}
                    </div>
                    <div className="info-item">
                        <h3>Target Location</h3>
                        {targetPos ? (
                            <p>{targetPos.lat.toFixed(6)}, {targetPos.lng.toFixed(6)}</p>
                        ) : (
                            <p>Not set</p>
                        )}
                    </div>
                </div>

                <div className="controls">
                    <button onClick={setTarget} disabled={!currentPos}>
                        Set Target
                    </button>
                    <button onClick={clearTarget} style={{marginLeft: '10px', backgroundColor: '#888'}}>
                        Clear Target
                    </button>
                </div>
            </>
        )}

        {(targetPos || isSimulating) && (
            <div className="distance-display">
                Distance: {distance.toFixed(2)} m
            </div>
        )}
        
        {isAlarming && (
            <div className="alarm-message">
                WARNING: TARGET OUT OF RANGE!
            </div>
        )}
      </div>
    </div>
  )
}

export default App

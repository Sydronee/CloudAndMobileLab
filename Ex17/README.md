# 📍 Distance Calculator App

A mobile-friendly web application built with React, Capacitor, and Leaflet that calculates distances between two geographic locations.

## Features

- 🗺️ **Interactive Map**: Click on the map to mark two locations
- 📏 **Distance Calculations**: 
  - Straight-line distance (as the crow flies)
  - Estimated bike travel distance (accounting for roads)
  - Estimated bike travel time
- 📱 **GPS Integration**: Use your device's current location as a marker
- 🎨 **Modern UI**: Clean, responsive design with gradient themes
- 🚴 **Bike-Specific Metrics**: Travel time based on average cycling speed (15 km/h)

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool
- **Capacitor** - Native functionality bridge
- **Leaflet** - Interactive maps
- **Geolocation API** - GPS location services

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Building for Mobile

### Android

1. Build the web assets:
```bash
npm run build
```

2. Sync with Capacitor:
```bash
npx cap sync android
```

3. Open in Android Studio:
```bash
npx cap open android
```

4. Run on device or emulator from Android Studio

### iOS (macOS only)

1. Build the web assets:
```bash
npm run build
```

2. Sync with Capacitor:
```bash
npx cap sync ios
```

3. Open in Xcode:
```bash
npx cap open ios
```

4. Run on device or simulator from Xcode

## How to Use

1. **Mark Locations**: Click on the map to place markers (green for start, red for end)
2. **Use GPS**: Click "Use My Location" button to use your current position
3. **View Results**: See distance calculations appear automatically after placing two markers
4. **Clear and Restart**: Use "Clear Markers" to start over

## Permissions

The app requires location permissions to access your device's GPS. You'll be prompted to grant permission when you first use the "My Location" feature.

## Distance Calculations

- **Straight Line Distance**: Calculated using the Haversine formula
- **Bike Distance**: Estimated as straight-line distance × 1.3 (typical road factor)
- **Bike Time**: Based on 15 km/h average cycling speed

## Project Structure

```
Ex17/
├── src/
│   ├── components/
│   │   └── DistanceMap.jsx    # Map component with marker functionality
│   ├── utils/
│   │   └── distanceCalculator.js  # Distance calculation utilities
│   ├── App.jsx                # Main app component
│   ├── App.css               # App styles
│   └── main.jsx              # Entry point
├── capacitor.config.json     # Capacitor configuration
└── package.json              # Dependencies
```

## License

MIT


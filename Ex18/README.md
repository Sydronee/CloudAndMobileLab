# Ex18 - Proximity Alerter

A React application that alerts users when they move more than 10 meters away from a fixed target location.

## Features

- **Set Target Location**: Fix your current GPS coordinates as the target.
- **Monitoring**: Continuously tracks your current location using the Geolocation API.
- **Distance Calculation**: Calculates the distance between your current location and the target using the Haversine formula.
- **Proximity Alarm**: Triggers a visual and audio alarm if the distance exceeds 10 meters.

## Running the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the app in a browser (preferably on a mobile device or a laptop with GPS).
4. Allow location permissions when prompted.

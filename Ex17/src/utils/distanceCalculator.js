/**
 * Calculate the straight-line distance between two geographic coordinates
 * using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateStraightLineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Estimate bike travel distance (accounts for roads not being straight)
 * @param {number} straightLineDistance - Distance in kilometers
 * @returns {number} Estimated bike distance in kilometers
 */
export function estimateBikeDistance(straightLineDistance) {
  // Road factor: roads are typically 1.2-1.4 times longer than straight line
  const roadFactor = 1.3;
  return straightLineDistance * roadFactor;
}

/**
 * Calculate time to travel by bike
 * @param {number} bikeDistance - Distance in kilometers
 * @param {number} averageSpeed - Average cycling speed in km/h (default: 15)
 * @returns {number} Time in minutes
 */
export function calculateBikeTime(bikeDistance, averageSpeed = 15) {
  const timeInHours = bikeDistance / averageSpeed;
  return timeInHours * 60; // Convert to minutes
}

/**
 * Format distance to display with appropriate units
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export function formatDistance(distance) {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(2)} km`;
}

/**
 * Format time to display in hours and minutes
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
export function formatTime(minutes) {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}min`;
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate all distance metrics
 * @param {Object} point1 - First point {lat, lon}
 * @param {Object} point2 - Second point {lat, lon}
 * @returns {Object} Object containing all distance metrics
 */
export function calculateAllMetrics(point1, point2) {
  const straightDistance = calculateStraightLineDistance(
    point1.lat,
    point1.lon,
    point2.lat,
    point2.lon
  );

  const bikeDistance = estimateBikeDistance(straightDistance);
  const bikeTime = calculateBikeTime(bikeDistance);

  return {
    straightDistance,
    bikeDistance,
    bikeTime,
    formattedStraightDistance: formatDistance(straightDistance),
    formattedBikeDistance: formatDistance(bikeDistance),
    formattedBikeTime: formatTime(bikeTime),
  };
}

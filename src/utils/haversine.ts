import { Coordinates } from '../types/location';

/**
 * Menghitung jarak lurus (Haversine Formula) antara dua koordinat GPS
 * @returns Jarak dalam satuan Meter
 */
export function calculateHaversineDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const EARTH_RADIUS_METERS = 6371000;

  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const lat1Rad = toRadians(coord1.latitude);
  const lat2Rad = toRadians(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_METERS * c);
}

/**
 * Format jarak meter ke string yang mudah dibaca (m atau km)
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${distanceInMeters} m`;
  }
  return `${(distanceInMeters / 1000).toFixed(2)} km`;
}
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface EmergencyUnit {
  id: string;
  name: string;
  type: 'AMBULANCE' | 'HOSPITAL' | 'FIRST_RESPONDER';
  coordinates: Coordinates;
  distanceInMeters?: number;
  isAvailable: boolean;
}
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Coordinates } from '../types/location';

interface UseLocationTrackingOptions {
  distanceInterval?: number;
  timeInterval?: number;
}

export function useLocationTracking(options: UseLocationTrackingOptions = {}) {
  const { distanceInterval = 5, timeInterval = 3000 } = options;
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null;
    let isMounted = true;

    async function startWatching() {
      try {
        setIsLoading(true);

        // 1. Izin Runtime Just-In-Time
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setErrorMsg('Izin akses lokasi ditolak oleh pengguna.');
            setIsLoading(false);
          }
          return;
        }

        // 2. Ambil lokasi awal
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isMounted) {
          setCurrentLocation({
            latitude: initialLocation.coords.latitude,
            longitude: initialLocation.coords.longitude,
          });
          setIsLoading(false);
        }

        // 3. Listener Berkelanjutan dengan distanceInterval adaptif
        subscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval,
            timeInterval,
          },
          (location) => {
            if (isMounted) {
              setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }
          }
        );
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err.message || 'Gagal memuat GPS');
          setIsLoading(false);
        }
      }
    }

    startWatching();

    // 4. Cleanup saat unmount (Mencegah Memory Leak)
    return () => {
      isMounted = false;
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, [distanceInterval, timeInterval]);

  return { currentLocation, errorMsg, isLoading };
}
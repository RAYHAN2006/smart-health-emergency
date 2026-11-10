import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { calculateHaversineDistance, formatDistance } from '../utils/haversine';
import { Coordinates } from '../types/location';

// Titik Koordinat RSUD Dr. Saiful Anwar Malang
const SAIFUL_ANWAR_COORDS: Coordinates = {
  latitude: -7.9726,
  longitude: 112.6319,
};

export default function MapScreen() {
  const { currentLocation, errorMsg, isLoading } = useLocationTracking({
    distanceInterval: 5,
    timeInterval: 3000,
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Mendapatkan Lokasi GPS...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  // Hitung jarak dari posisi HP user ke RSUD Saiful Anwar Malang
  const distanceInMeters = currentLocation
    ? calculateHaversineDistance(currentLocation, SAIFUL_ANWAR_COORDS)
    : 0;

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {/* Marker RSUD Dr. Saiful Anwar */}
          <Marker
            coordinate={SAIFUL_ANWAR_COORDS}
            title="RSUD Dr. Saiful Anwar"
            description="Rumah Sakit Rujukan Darurat"
            pinColor="red"
          >
            <Callout>
              <View style={styles.calloutView}>
                <Text style={styles.calloutTitle}>RSUD Dr. Saiful Anwar</Text>
                <Text style={styles.calloutSub}>Jarak: {formatDistance(distanceInMeters)}</Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
      )}

      {/* Floating Emergency Info Card (UI Overlay) */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>RS Terdekat: RSUD Dr. Saiful Anwar</Text>
        <Text style={styles.cardDistance}>
          Jarak dari Anda: <Text style={styles.highlightText}>{formatDistance(distanceInMeters)}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  cardDistance: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  highlightText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  calloutView: {
    padding: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
  },
  calloutSub: {
    color: '#E53935',
  },
});
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocationTracking } from './src/hooks/useLocationTracking';
import { calculateHaversineDistance, formatDistance } from './src/utils/haversine';
import { Coordinates } from './src/types/location';

// Load MapView hanya jika BUKAN di browser web
let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
  const MapsModule = require('react-native-maps');
  MapView = MapsModule.default;
  Marker = MapsModule.Marker;
}

const DUMMY_HOSPITAL: { name: string; coordinates: Coordinates } = {
  name: 'RSUD Dr. Saiful Anwar (RSSA Malang)',
  coordinates: {
    latitude: -7.9726,
    longitude: 112.6319,
  },
};

export default function App() {
  const { currentLocation, errorMsg, isLoading } = useLocationTracking({
    distanceInterval: 5,
  });

  const distanceToHospital = currentLocation
    ? calculateHaversineDistance(currentLocation, DUMMY_HOSPITAL.coordinates)
    : null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚑 Smart Health & Emergency</Text>
        <Text style={styles.headerSubtitle}>Sistem Tanggap Darurat & Lokasi Terdekat</Text>
      </View>

      {/* Kotak Status / Peta */}
      <View style={styles.contentContainer}>
        {isLoading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#E53935" />
            <Text style={styles.statusText}>Mencari sinyal GPS...</Text>
          </View>
        )}

        {errorMsg && (
          <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
        )}

        {currentLocation && (
          <View style={styles.mainWrapper}>
            {/* Tampilan Peta khusus Android / iOS */}
            {Platform.OS !== 'web' && MapView ? (
              <View style={styles.mapWrapper}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                  }}
                  showsUserLocation={true}
                >
                  <Marker
                    coordinate={DUMMY_HOSPITAL.coordinates}
                    title={DUMMY_HOSPITAL.name}
                    description={`Jarak: ${distanceToHospital !== null ? formatDistance(distanceToHospital) : '-'}`}
                    pinColor="red"
                  />
                </MapView>
              </View>
            ) : (
              /* Fallback tampilan di Browser Web */
              <View style={styles.webFallbackCard}>
                <Text style={styles.webWarning}>
                  🌐 Mode Web: Visualisasi MapView dinonaktifkan di Browser. Buka via aplikasi Expo Go di HP untuk melihat Peta Interaktif.
                </Text>
              </View>
            )}

            {/* Floating Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.coordinateLabel}>
                Posisi Anda: <Text style={styles.coordinateValue}>{currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}</Text>
              </Text>
              <View style={styles.divider} />
              <Text style={styles.hospitalTitle}>🏥 {DUMMY_HOSPITAL.name}</Text>
              <Text style={styles.hospitalSub}>Jl. Jaksa Agung Suprapto No.2, Malang</Text>
              <Text style={styles.distanceText}>
                Jarak Lurus (Haversine):{' '}
                <Text style={styles.distanceValue}>
                  {distanceToHospital !== null ? formatDistance(distanceToHospital) : '-'}
                </Text>
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9E9E9E',
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#B0BEC5',
    marginTop: 10,
    fontSize: 14,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  mainWrapper: {
    flex: 1,
    position: 'relative',
  },
  mapWrapper: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webFallbackCard: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    margin: 20,
    borderRadius: 12,
  },
  webWarning: {
    color: '#FFB74D',
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    elevation: 5,
  },
  coordinateLabel: {
    color: '#9E9E9E',
    fontSize: 13,
  },
  coordinateValue: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2C',
    marginVertical: 10,
  },
  hospitalTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  hospitalSub: {
    color: '#757575',
    fontSize: 12,
    marginVertical: 4,
  },
  distanceText: {
    color: '#B0BEC5',
    fontSize: 13,
  },
  distanceValue: {
    color: '#FF9800',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
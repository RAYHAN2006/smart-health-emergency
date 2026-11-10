import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocationTracking } from './src/hooks/useLocationTracking';
import { calculateHaversineDistance, formatDistance } from './src/utils/haversine';
import { Coordinates } from './src/types/location';

// 🏥 Rumah Sakit Rujukan: RSUD Dr. Saiful Anwar (RSSA) Malang
const DUMMY_HOSPITAL: { name: string; coordinates: Coordinates } = {
  name: 'RSUD Dr. Saiful Anwar (RSSA Malang)',
  coordinates: {
    latitude: -7.9726,
    longitude: 112.6319,
  },
};

export default function App() {
  // Custom Hook pelacak GPS buatan Anda
  const { currentLocation, errorMsg, isLoading } = useLocationTracking({
    distanceInterval: 5, // update otomatis jika berpindah 5 meter
  });

  // Hitung jarak garis lurus menggunakan rumus Haversine
  const distanceToHospital = currentLocation
    ? calculateHaversineDistance(currentLocation, DUMMY_HOSPITAL.coordinates)
    : null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header Aplikasi */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚑 Smart Health & Emergency</Text>
        <Text style={styles.headerSubtitle}>Sistem Tanggap Darurat & Lokasi Terdekat</Text>
      </View>

      {/* Kotak Status GPS Pengguna */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status GPS Anda</Text>

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
          <View style={styles.infoBox}>
            <Text style={styles.coordinateLabel}>
              Latitude Anda: <Text style={styles.coordinateValue}>{currentLocation.latitude.toFixed(6)}</Text>
            </Text>
            <Text style={styles.coordinateLabel}>
              Longitude Anda: <Text style={styles.coordinateValue}>{currentLocation.longitude.toFixed(6)}</Text>
            </Text>

            <View style={styles.divider} />

            {/* Target Rumah Sakit: RSUD Dr. Saiful Anwar */}
            <Text style={styles.hospitalTitle}>🏥 {DUMMY_HOSPITAL.name}</Text>
            <Text style={styles.hospitalSub}>Jl. Jaksa Agung Suprapto No.2, Klojen, Kota Malang</Text>
            <Text style={styles.distanceText}>
              Jarak Lurus (Haversine):{' '}
              <Text style={styles.distanceValue}>
                {distanceToHospital !== null ? formatDistance(distanceToHospital) : '-'}
              </Text>
            </Text>
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
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C2C2C',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 16,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 20,
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
    marginVertical: 10,
  },
  infoBox: {
    marginTop: 6,
  },
  coordinateLabel: {
    color: '#9E9E9E',
    fontSize: 14,
    marginBottom: 6,
  },
  coordinateValue: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2C',
    marginVertical: 16,
  },
  hospitalTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  hospitalSub: {
    color: '#757575',
    fontSize: 12,
    marginBottom: 8,
  },
  distanceText: {
    color: '#B0BEC5',
    fontSize: 14,
  },
  distanceValue: {
    color: '#FF9800',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
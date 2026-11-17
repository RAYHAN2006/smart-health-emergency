import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import EmergencyVaultScreen from './src/screens/EmergencyVaultScreen';
// Layar lama atau komponen GPS Anda
import MapScreen from './src/screens/MapScreen'; 

export default function App() {
  // State untuk memilih tab mana yang aktif (1 = GPS/Peta, 2 = Vault Enkripsi)
  const [activeTab, setActiveTab] = useState<'gps' | 'vault'>('vault');

  return (
    <View style={styles.container}>
      {/* Tampilkan Layar Sesuai Tab yang Dipilih */}
      <View style={styles.screenContainer}>
        {activeTab === 'gps' ? <MapScreen /> : <EmergencyVaultScreen />}
      </View>

      {/* Menu Tombol Navigasi di Bagian Bawah */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'gps' && styles.activeNavButton]}
          onPress={() => setActiveTab('gps')}
        >
          <Text style={styles.navText}>📍 Modul GPS (M9)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === 'vault' && styles.activeNavButton]}
          onPress={() => setActiveTab('vault')}
        >
          <Text style={styles.navText}>🔐 Vault Medis (M10)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  screenContainer: { flex: 1 },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 12,
  },
  navButton: { flex: 1, alignItems: 'center', padding: 8 },
  activeNavButton: { borderBottomWidth: 2, borderBottomColor: '#2196F3' },
  navText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
});
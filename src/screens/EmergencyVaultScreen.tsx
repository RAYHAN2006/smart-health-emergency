import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { saveMedicalProfile, getMedicalProfile, EmergencyMedicalProfile } from '../utils/secureStorage';
import { useEmergencyPhoto } from '../hooks/useEmergencyPhoto';

export default function EmergencyVaultScreen() {
  // State data rekam medis terenkripsi (Anggota 1)
  const [nik, setNik] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Hook kamera & Scoped Storage (Anggota 3)
  const { photoUri, loading, errorMessage, capturePhoto, removePhoto } = useEmergencyPhoto();

  // Ambil profil saat pertama kali dibuka (Offline-First)
  useEffect(() => {
    async function loadData() {
      const data = await getMedicalProfile();
      if (data) {
        setNik(data.nik);
        setBloodType(data.bloodType);
        setAllergies(data.allergies);
        setEmergencyContact(data.emergencyContact);
        setIsSaved(true);
      }
    }
    loadData();
  }, []);

  // Simpan data teks ke SecureStore
  const handleSaveProfile = async () => {
    const profile: EmergencyMedicalProfile = { nik, bloodType, allergies, emergencyContact };
    const success = await saveMedicalProfile(profile);
    if (success) {
      setIsSaved(true);
      Alert.alert('Sukses', 'Data rekam medis berhasil dienkripsi ke Keystore HP!');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔐 Emergency Vault (Offline-First)</Text>
      <Text style={styles.subtitle}>Penyimpanan Terenkripsi & Media Sandbox</Text>

      {/* Bagian 1: SecureStore (Tugas Anggota 1) */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Data Rekam Medis (SecureStore Terenkripsi)</Text>
        <TextInput style={styles.input} placeholder="NIK Pasien" placeholderTextColor="#888" value={nik} onChangeText={setNik} />
        <TextInput style={styles.input} placeholder="Golongan Darah (Contoh: O+)" placeholderTextColor="#888" value={bloodType} onChangeText={setBloodType} />
        <TextInput style={styles.input} placeholder="Riwayat Alergi Obat" placeholderTextColor="#888" value={allergies} onChangeText={setAllergies} />
        <TextInput style={styles.input} placeholder="Nomor Kontak Darurat" placeholderTextColor="#888" value={emergencyContact} onChangeText={setEmergencyContact} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>{isSaved ? 'Perbarui Data Enkripsi' : 'Simpan Data Terenkripsi'}</Text>
        </TouchableOpacity>
      </View>

      {/* Bagian 2: Scoped Storage & Kamera (Tugas Anggota 3) */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Foto Bukti Darurat (Scoped Storage Sandbox)</Text>
        <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={capturePhoto}>
          <Text style={styles.buttonText}>{loading ? 'Memproses Kamera...' : '📷 Ambil Foto Kondisi Darurat'}</Text>
        </TouchableOpacity>

        {errorMessage && <Text style={styles.errorText}>⚠️ {errorMessage}</Text>}

        {photoUri && (
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Foto Tersimpan di documentDirectory:</Text>
            <Image source={{ uri: photoUri }} style={styles.imagePreview} />

            {/* Tombol Hapus / Ambil Ulang Foto */}
            <TouchableOpacity style={styles.deleteButton} onPress={removePhoto}>
              <Text style={styles.deleteButtonText}>Hapus & Ambil Ulang Foto</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginTop: 20 },
  subtitle: { fontSize: 13, color: '#AAA', marginBottom: 20, marginTop: 4 },
  card: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  cardHeader: { fontSize: 15, fontWeight: 'bold', color: '#4CAF50', marginBottom: 12 },
  input: { backgroundColor: '#2C2C2C', color: '#FFF', borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center' },
  cameraButton: { backgroundColor: '#E53935' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  errorText: { color: '#FF5252', marginTop: 8, fontSize: 13 },
  previewBox: { marginTop: 15, alignItems: 'center' },
  previewLabel: { color: '#AAA', fontSize: 12, marginBottom: 8 },
  imagePreview: { width: '100%', height: 200, borderRadius: 8 },
  deleteButton: {
    marginTop: 12,
    backgroundColor: '#2A1818',
    borderColor: '#E53935',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  deleteButtonText: {
    color: '#FF5252',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { saveToScopedStorage, deleteEmergencyFile } from '../utils/fileVault';

export function useEmergencyPhoto() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Mengambil foto dengan alur izin Just-In-Time
   */
  const capturePhoto = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // 1. Just-In-Time Permission: Izin kamera baru diminta saat tombol ditekan
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setErrorMessage('Izin kamera ditolak. Tidak dapat mengambil foto darurat.');
        setLoading(false);
        return;
      }

      // 2. Buka kamera perangkat HP
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.6,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const tempUri = result.assets[0].uri;
        const fileName = `emergency_${Date.now()}.jpg`;

        // 3. Simpan foto ke Scoped Storage lokal privat
        const permanentUri = await saveToScopedStorage(tempUri, fileName);
        setPhotoUri(permanentUri);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengambil foto darurat');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Menghapus foto dari memori HP jika salah ambil
   */
  const removePhoto = async () => {
    if (photoUri) {
      await deleteEmergencyFile(photoUri);
      setPhotoUri(null); // Menghilangkan foto dari tampilan layar
    }
  };

  return { photoUri, loading, errorMessage, capturePhoto, removePhoto };
}
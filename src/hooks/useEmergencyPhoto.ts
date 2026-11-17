import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { saveToScopedStorage } from '../utils/fileVault';

export function useEmergencyPhoto() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Mengambil foto kondisi darurat dengan alur izin Just-In-Time
   */
  const capturePhoto = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // 1. Just-In-Time Permission: Izin kamera hanya diminta saat tombol ini ditekan
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setErrorMessage('Izin kamera ditolak. Tidak dapat mendokumentasikan kondisi darurat.');
        setLoading(false);
        return;
      }

      // 2. Buka kamera perangkat HP
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.6, // Kompresi agar hemat storage
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const tempUri = result.assets[0].uri;
        const fileName = `emergency_${Date.now()}.jpg`;

        // 3. Simpan foto ke Scoped Storage privat perangkat
        const permanentUri = await saveToScopedStorage(tempUri, fileName);
        setPhotoUri(permanentUri);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengambil foto darurat');
    } finally {
      setLoading(false);
    }
  };

  return { photoUri, loading, errorMessage, capturePhoto };
}
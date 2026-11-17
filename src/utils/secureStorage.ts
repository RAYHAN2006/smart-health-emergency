import * as SecureStore from 'expo-secure-store';

// Struktur data rekam medis sensitif
export interface EmergencyMedicalProfile {
  nik: string;
  bloodType: string;
  allergies: string;
  emergencyContact: string;
}

const STORAGE_KEY = 'EMERGENCY_MEDICAL_PROFILE';

/**
 * Menyimpan data medis ke Keystore Hardware terenkripsi
 */
export async function saveMedicalProfile(data: EmergencyMedicalProfile): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(data);
    await SecureStore.setItemAsync(STORAGE_KEY, jsonValue, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return true;
  } catch (error) {
    console.error('Gagal mengenkripsi data medis:', error);
    return false;
  }
}

/**
 * Membaca data medis terenkripsi dari Keystore
 */
export async function getMedicalProfile(): Promise<EmergencyMedicalProfile | null> {
  try {
    const jsonValue = await SecureStore.getItemAsync(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Gagal mendekripsi data medis:', error);
    return null;
  }
}

/**
 * Menghapus data sensitif dari penyimpanan aman
 */
export async function deleteMedicalProfile(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}
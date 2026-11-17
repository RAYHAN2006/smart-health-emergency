import * as FileSystem from 'expo-file-system/legacy';

// Folder privat khusus di dalam sandbox memori aplikasi (Scoped Storage)
const EMERGENCY_VAULT_DIR = `${FileSystem.documentDirectory}emergency_vault/`;

/**
 * Memastikan direktori sandbox sudah tersedia
 */
async function ensureDirectoryExists(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(EMERGENCY_VAULT_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(EMERGENCY_VAULT_DIR, { intermediates: true });
  }
}

/**
 * Menyimpan berkas/foto darurat ke Scoped Storage lokal perangkat
 */
export async function saveToScopedStorage(sourceUri: string, fileName: string): Promise<string> {
  await ensureDirectoryExists();
  const destinationUri = `${EMERGENCY_VAULT_DIR}${fileName}`;

  // Salin file dari cache sementara ke storage permanen aplikasi
  await FileSystem.copyAsync({
    from: sourceUri,
    to: destinationUri,
  });

  return destinationUri;
}

/**
 * Membaca daftar semua file darurat yang tersimpan secara offline
 */
export async function getStoredEmergencyFiles(): Promise<string[]> {
  await ensureDirectoryExists();
  return await FileSystem.readDirectoryAsync(EMERGENCY_VAULT_DIR);
}

/**
 * Menghapus file foto jika salah ambil foto
 */
export async function deleteEmergencyFile(fileUri: string): Promise<void> {
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
  }
}
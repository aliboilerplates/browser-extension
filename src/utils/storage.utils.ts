import { logger } from "@/lib/logger";
import { StorageData } from "@/shared/interfaces/storage.interface";

export async function saveDataToStorage(
  data: Partial<StorageData>,
): Promise<void> {
  try {
    logger.info("Saving data to storage: ", data);
    await browser.storage.local.set(data);
  } catch (error: unknown) {
    logger.error("Failed to store data to local storage: ", error);
    throw error;
  }
}
export async function getDataFromStorage<K extends Array<keyof StorageData>>(
  keys: K,
): Promise<Pick<StorageData, K[number]>> {
  try {
    return await browser.storage.local.get(keys);
  } catch (error: unknown) {
    logger.error("Failed to get data from storage: ", error);
    throw error;
  }
}

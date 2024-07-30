import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export class KeyValueRepository {
  static getItem<T>(key: string): T {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  }

  static setItem(key: string, value: string) {
    storage.set(key, value);
  }

  static removeItem(key: string) {
    storage.delete(key);
  }

  static clearAll() {
    storage.clearAll();
  }
}
